from enum import Enum
from datetime import date
from pydantic import BaseModel, Field, conint

class AltitudeUnit(str, Enum):
    meters = "meters"
    feet = "feet"

class WmmAnalysis(BaseModel):
    """
    WMM Report data class.

    This class represents the input parameters required for computing or requesting
    a World Magnetic Model report.

    Attributes:
        latitude (float): Latitude in decimal degrees.
        longitude (float): Longitude in decimal degrees.
        altitude (float): Altitude value (interpreted based on `altitude_unit`).
        altitude_unit (AltitudeUnit): Unit of altitude, either 'meters' or 'feet'.
        record_date (date): Start date in YYYY-MM-DD format.
    """

    latitude: float = Field(..., description="Latitude in decimal degrees.")
    longitude: float = Field(..., description="Longitude in decimal degrees.")
    altitude: float = Field(
        ...,
        description="Altitude value, interpreted according to 'altitude_unit'."
    )
    altitude_unit: AltitudeUnit = Field(
        ...,
        description="Unit of altitude: either 'meters' or 'feet'."
    )
    record_date: str = Field(
        ...,
        description="Start date (YYYY-MM-DD format)."
    )

    def __str__(self):
        return (
            f"WmmReport("
            f"latitude={self.latitude}, "
            f"longitude={self.longitude}, "
            f"altitude={self.altitude}, "
            f"altitude_unit={self.altitude_unit}, "
            f"record_date={self.start_date}, "
            f")"
        )

    def __repr__(self):
        return self.__str__()

    def get_results(self) -> dict:
        """
        Get the current WMM report fields as a dictionary (placeholder for computed results).

        Returns:
            dict: A dictionary of the existing WmmReport fields, which can be
                  adapted or extended to include computed values.
        """
        return {
            "latitude": self.latitude,
            "longitude": self.longitude,
            "altitude": self.altitude,
            "altitude_unit": self.altitude_unit,
            "record_date": self.start_date,
        }