from pywmm import WMMv2, date_utils
from datetime import datetime, timedelta
from fastapi import HTTPException

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


def calculate_wmm(latitude: float, longitude: float, altitude: float, date_str: str):
    """Calculate the magnetic field values for a given date and location."""
    dt = datetime.strptime(date_str, "%Y-%m-%d")
    # Get the decimal year from the date (pywmm.date_utils.decimal_year expects a datetime)
    decimal_year = date_utils.decimal_year(dt)
    dec = WMMv2.get_declination(latitude, longitude, decimal_year, altitude)
    dip = WMMv2.get_dip_angle(latitude, longitude, decimal_year, altitude)
    ti = WMMv2.get_intensity(latitude, longitude, decimal_year, altitude)
    bh = WMMv2.get_horizontal_intensity(latitude, longitude, decimal_year, altitude)
    bx = WMMv2.get_north_intensity(latitude, longitude, decimal_year, altitude)
    by = WMMv2.get_east_intensity(latitude, longitude, decimal_year, altitude)
    bz = WMMv2.get_vertical_intensity(latitude, longitude, decimal_year, altitude)
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


def calculate_wmm_service(payload: dict):
    """
    Expects a JSON payload with the following fields:
      - lat: float (latitude value)
      - lat_direction: str ("N" for north, "S" for south; default is "N")
      - lon: float (longitude value)
      - lon_direction: str ("E" for east, "W" for west; default is "E")
      - alt: float (altitude value)
      - alt_unit: str ("Meters" or "Feet"; default is "Meters")
      - start_date: str (format: yyyy-mm-dd)
      - end_date: str (format: yyyy-mm-dd)
      - step_days: int (the step interval in days; default is 1)
    """
    try:
        lat = float(payload.get("lat"))
        lon = float(payload.get("lon"))
        original_alt = float(payload.get("alt"))
        alt_unit = payload.get("alt_unit", "Meters").lower()
        start_date = payload.get("start_date")
        end_date = payload.get("end_date")
        step_days = int(payload.get("step_days", 1))

        if alt_unit == "feet":
            altitude_km = original_alt * 0.3048780487804878 / 1000
        else:  
            altitude_km = original_alt / 1000

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
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))