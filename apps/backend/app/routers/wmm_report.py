from fastapi import APIRouter, HTTPException, status, Response
from app.models.wmm_report import WmmReport
from app.models.wmm_analysis import WmmAnalysis
from app.service.wmm_service import report_wmm_service, single_wmm_service
from app.service.spreadsheet_service import generate_excel_report
from datetime import datetime

router = APIRouter(prefix="/api/wmm", tags=["WMM"])

@router.post("/report", summary="Create a WMM report for a range of dates")
def create_wmm_report(report: WmmReport):
    """
    Receive a WmmReport payload, perform WMM calculations for a date range,
    and return the results along with an Excel report.
    """
    wmm_results = report_wmm_service(report)
    
    # Generate Excel report
    excel_payload = {
        "latitude": report.latitude,
        "longitude": report.longitude,
        "altitude": report.altitude,
        "altitude_unit": report.altitude_unit,
        "start_date": report.start_date,
        "end_date": report.end_date,
        "step_days": report.step,
        "data": [{"model": result, "variation": result["variation"]} for result in wmm_results["data"]]
    }
    
    excel_buffer = generate_excel_report(excel_payload)
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
    wmm_result = single_wmm_service(analysis)
    
    return {
        "message": "WMM Analysis completed successfully",
        "data": wmm_result
    }