from fastapi import APIRouter, HTTPException, status
from app.models.wmm_report import WmmReport
from app.models.wmm_analysis import WmmAnalysis

router = APIRouter(prefix="/wmm", tags=["WMM"])

@router.post("/report", summary="Create a WMM report for a range of dates")
def create_wmm_report(report: WmmReport):
    """
    Receive a WmmReport payload, perform any necessary processing,
    and return a response.
    """
    if report.start_date > report.end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_date must be earlier than end_date"
        )

    return {
        "message": "WMM Report received successfully",
        "data": {
            "latitude": report.latitude,
            "longitude": report.longitude,
            "altitude": report.altitude,
            "altitude_unit": report.altitude_unit,
            "start_date": report.start_date,
            "end_date": report.end_date,
            "step": report.step
        }
    }

@router.post("/single", summary="Create a WMM analysis for a single date")
def create_wmm_report(report: WmmAnalysis):
    """
    Receive a WmmReport payload, perform any necessary processing,
    and return a response.
    """
    return {
        "message": "WMM Report received successfully",
        "data": {
            "latitude": report.latitude,
            "longitude": report.longitude,
            "altitude": report.altitude,
            "altitude_unit": report.altitude_unit,
            "start_date": report.record_date,
        }
    }