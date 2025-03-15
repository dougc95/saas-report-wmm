from io import BytesIO
from app.models.wmm_model import WMMModel
from app.service.excel_generator import ExcelGenerator

def generate_excel_report(payload: dict) -> BytesIO:
    """
    Generates an Excel report based on the given payload.
    """
    latitude = payload["latitude"]
    longitude = payload["longitude"]
    altitude = payload["altitude"]
    altitude_unit = payload["altitude_unit"]
    start_date = payload["start_date"]
    end_date = payload["end_date"]
    step_days = payload["step_days"]

    excel_gen = ExcelGenerator()
    excel_gen.add_inputs_sheet(  
        latitude,
        longitude,
        altitude,
        altitude_unit,
        start_date,
        end_date,
        step_days)
    
    excel_gen.generate_header()

    records = payload["data"]
    for record in records:
        model_data = record["model"]
        
        # Add the required fields to model_data
        model_data["latitude"] = latitude
        model_data["longitude"] = longitude
        model_data["altitude"] = altitude
        
        variation = record["variation"]
        model = WMMModel.model_validate(model_data)
        excel_gen.add_data(model, variation)

    return excel_gen.get_buffer()
