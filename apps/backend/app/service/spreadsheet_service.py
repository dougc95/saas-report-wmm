from io import BytesIO
from models.wmm_model import WMMModel
from excel_generator import ExcelGenerator

def generate_excel_report(payload: dict) -> BytesIO:
    """
    Generates an Excel report based on the given payload.
    
    Expects the payload to contain:
      - lat: float
      - lon: float
      - alt: float
      - altitude_unit: str ("Meters" or "Feet")
      - start_date: str (yyyy-mm-dd)
      - end_date: str (yyyy-mm-dd)
      - step_days: int
      - data: list of dict, where each dict contains:
            - "model": dict (suitable for initializing a WMMModel)
            - "variation": dict with keys like "ti", "bh", etc.
    """
    lat = float(payload.get("lat"))
    lon = float(payload.get("lon"))
    original_alt = float(payload.get("alt"))
    altitude_unit = payload.get("altitude_unit", "Meters")
    start_date = payload.get("start_date")
    end_date = payload.get("end_date")
    step_days = int(payload.get("step_days", 1))

    # Initialize the Excel generator.
    excel_gen = ExcelGenerator()
    excel_gen.add_inputs_sheet(lat, lon, original_alt, altitude_unit, start_date, end_date, step_days)
    excel_gen.generate_header()

    # Process each record in the payload
    records = payload.get("data", [])
    for record in records:
        model_data = record.get("model")
        variation = record.get("variation")
        model = WMMModel(**model_data)
        excel_gen.add_data(model, variation)

    return excel_gen.get_buffer()
