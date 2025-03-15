from fastapi import APIRouter, HTTPException, status, Response
from app.models.wmm_report import WmmReport
from app.models.wmm_analysis import WmmAnalysis
from app.service.wmm_service import calculate_wmm_service
from app.service.spreadsheet_service import generate_excel_report
from datetime import datetime

router = APIRouter(prefix="/wmm", tags=["WMM"])

@router.post("/report", summary="Create a WMM report for a range of dates")
def create_wmm_report(report: WmmReport):
    """
    Receive a WmmReport payload, perform WMM calculations for a date range,
    and return the results along with an Excel report.
    """
    if report.start_date > report.end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_date must be earlier than end_date"
        )

    # Prepare payload for WMM service
    payload = {
        "lat": report.latitude,
        "lon": report.longitude,
        "alt": report.altitude,
        "alt_unit": report.altitude_unit,
        "start_date": report.start_date,
        "end_date": report.end_date,
        "step_days": report.step
    }

    # Calculate WMM values for the date range
    wmm_results = calculate_wmm_service(payload)
    
    # Generate Excel report
    excel_payload = {
        "lat": report.latitude,
        "lon": report.longitude,
        "alt": report.altitude,
        "altitude_unit": report.altitude_unit,
        "start_date": report.start_date,
        "end_date": report.end_date,
        "step_days": report.step,
        "data": [{"model": result, "variation": result["variation"]} for result in wmm_results["data"]]
    }
    
    excel_buffer = generate_excel_report(excel_payload)
    
    # Return the Excel file directly as a downloadable attachment
    filename = f"wmm_report_{datetime.now().strftime('%Y%m%d%H%M%S')}.xlsx"
    return Response(
        content=excel_buffer.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.post("/single", summary="Create a WMM analysis for a single date")
def create_wmm(analysis: WmmAnalysis):
    """
    Receive a WmmAnalysis payload, perform WMM calculation for a single date,
    and return the results without next year analysis.
    """
    # Prepare payload for WMM service - using only a single date
    payload = {
        "lat": analysis.latitude,
        "lon": analysis.longitude,
        "alt": analysis.altitude,
        "alt_unit": analysis.altitude_unit,
        "start_date": analysis.record_date,
        "end_date": analysis.record_date,  # Same as start_date for single date analysis
        "step_days": 1
    }
    
    # Calculate WMM values for the single date
    # We'll modify the data to exclude the variation data
    wmm_results = calculate_wmm_service(payload)
    single_result = wmm_results["data"][0]
    del single_result["variation"]  # Remove variation since it's not needed for single date
    
    return {
        "message": "WMM Analysis completed successfully",
        "data": single_result
    }