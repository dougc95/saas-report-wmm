from pywmm import WMMv2, date_utils
from datetime import datetime, timedelta
from models.wmm_model import WMMModel

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