from pywmm import WMMv2, date_utils
from datetime import datetime, timedelta
from fastapi import HTTPException
from app.models.wmm_analysis import WmmAnalysis
from app.models.wmm_report import WmmReport

from logging import Logger

def date_range(start_date: str, end_date: str, step: int):
    """Generate a list of dates (as yyyy-mm-dd strings) between start and end dates using the given step."""
    start_dt = datetime.strptime(start_date, "%Y-%m-%d")
    end_dt = datetime.strptime(end_date, "%Y-%m-%d")
    dates = []
    current = start_dt
    while current <= end_dt:
        dates.append(current.strftime("%Y-%m-%d"))
        current += timedelta(days=step)
    return dates

def toggle_unit(distance:float,unit:str):
    if unit == "feet":
        altitude_km = distance * 0.3048780487804878 / 1000
    else:  
        altitude_km = distance / 1000
    return altitude_km


def calculate_wmm(latitude: float,
                  longitude: float,
                  altitude: float,
                  date_str: str):
    """Calculate the magnetic field values for a given date and location."""
    decimal_year = date_utils.decimal_year(date_str)
    wmm = WMMv2()
    
    # Call methods on the instance
    dec = wmm.get_declination(latitude, longitude, decimal_year, altitude)
    dip = wmm.get_dip_angle(latitude, longitude, decimal_year, altitude)
    ti = wmm.get_intensity(latitude, longitude, decimal_year, altitude)
    bh = wmm.get_horizontal_intensity(latitude, longitude, decimal_year, altitude)
    bx = wmm.get_north_intensity(latitude, longitude, decimal_year, altitude)
    by = wmm.get_east_intensity(latitude, longitude, decimal_year, altitude)
    bz = wmm.get_vertical_intensity(latitude, longitude, decimal_year, altitude)
    
    return {
        "date": date_str,
        "dec": dec,
        "dip": dip,
        "ti": ti,
        "bh": bh,
        "bx": bx,
        "by": by,
        "bz": bz,
    }


def calculate_next_year(latitude: float, longitude: float, altitude: float, date_str: str):
    """Calculate the magnetic field values for the same location on the next year (approximate)."""
    current_date = datetime.strptime(date_str, '%Y-%m-%d')
    next_date = current_date + timedelta(days=365)  # Note: does not account for leap years.
    next_date_str = next_date.strftime('%Y-%m-%d')
    return calculate_wmm(latitude, longitude, altitude, next_date_str)


def calculate_variation(current_result: dict, next_result: dict):
    """Calculate the variation between the current and next year's magnetic field values."""
    return {
        "dec": next_result["dec"] - current_result["dec"],
        "dip": next_result["dip"] - current_result["dip"],
        "ti": next_result["ti"] - current_result["ti"],
        "bh": next_result["bh"] - current_result["bh"],
        "bx": next_result["bx"] - current_result["bx"],
        "by": next_result["by"] - current_result["by"],
        "bz": next_result["bz"] - current_result["bz"],
    }


def report_wmm_service(payload: WmmReport):
    lat = payload.latitude
    lon = payload.longitude
    original_alt = payload.altitude
    alt_unit = payload.altitude_unit
    start_date = payload.start_date
    end_date = payload.end_date
    step_days = payload.step
    altitude_km = toggle_unit(distance=original_alt,unit=alt_unit)

    # Generate the list of dates.
    dates = date_range(start_date, end_date, step_days)
    results = []
    for d in dates:
        current_result = calculate_wmm(lat, lon, altitude_km, d)
        next_year_result = calculate_next_year(lat, lon, altitude_km, d)
        variation = calculate_variation(current_result, next_year_result)
        current_result["variation"] = variation
        results.append(current_result)
        
    return {"success": True, "data": results}


def single_wmm_service(payload: WmmAnalysis):
    lat = payload.latitude
    lon = payload.longitude
    original_alt = payload.altitude
    alt_unit = payload.altitude_unit
    record_date = payload.record_date
    altitude_km = toggle_unit(distance=original_alt,unit=alt_unit)
    
    result = calculate_wmm(altitude=altitude_km,
                            date_str=record_date,
                            latitude=lat,
                            longitude=lon)

    return {"success": True, "data": result}
