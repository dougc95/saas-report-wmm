from enum import Enum
from datetime import date, datetime
from pydantic import BaseModel, Field, field_validator, model_validator

class AltitudeUnit(str, Enum):
    meters = "meters"
    feet = "feet"

class WmmReport(BaseModel):
    """
    WMM Report data class.

    This class represents the input parameters required for computing or requesting
    a World Magnetic Model report.

    Attributes:
        latitude (float): Latitude in decimal degrees.
        longitude (float): Longitude in decimal degrees.
        altitude (float): Altitude value (interpreted based on `altitude_unit`).
        altitude_unit (AltitudeUnit): Unit of altitude, either 'meters' or 'feet'.
        start_date (date): Start date in YYYY-MM-DD format.
        end_date (date): End date in YYYY-MM-DD format.
        step (int): Step size for WMM computations, must be ≥ 1. Defaults to 1 if not provided.
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
    start_date: str = Field(
        ...,
        description="Start date (YYYY-MM-DD format)."
    )
    end_date: str = Field(
        ...,
        description="End date (YYYY-MM-DD format)."
    )
    step: int = Field(
        ge=1,
        description="Step size for WMM computations. Must be ≥ 1. Defaults to 1."
    )

    @field_validator('start_date', 'end_date')
    @classmethod
    def validate_date_format(cls, date_str: str) -> str:
        """
        Validate that date strings are in the correct format.
        
        Args:
            date_str (str): The date string to validate
            
        Returns:
            str: The validated date string
            
        Raises:
            ValueError: If date is not in YYYY-MM-DD format
        """
        try:
            datetime.strptime(date_str, '%Y-%m-%d')
        except ValueError:
            raise ValueError("Date must be in YYYY-MM-DD format")
        
        return date_str

    @model_validator(mode='after')
    def validate_dates_order(self) -> 'WmmReport':
        """
        Validate that end_date is later than start_date.
        
        Returns:
            WmmReport: The validated model instance
            
        Raises:
            ValueError: If end_date is not after start_date
        """
        if hasattr(self, 'start_date') and hasattr(self, 'end_date'):
            try:
                start_date_obj = datetime.strptime(self.start_date, '%Y-%m-%d').date()
                end_date_obj = datetime.strptime(self.end_date, '%Y-%m-%d').date()
                
                if end_date_obj <= start_date_obj:
                    raise ValueError("end_date must be later than start_date")
            except ValueError as e:
                # Only raise our custom error if it's about the date comparison
                if "end_date must be" in str(e):
                    raise
                # Otherwise, it's likely an issue with the format which will be caught by the field validator
                pass
                
        return self

    def __str__(self):
        return (
            f"WmmReport("
            f"latitude={self.latitude}, "
            f"longitude={self.longitude}, "
            f"altitude={self.altitude}, "
            f"altitude_unit={self.altitude_unit}, "
            f"start_date={self.start_date}, "
            f"end_date={self.end_date}, "
            f"step={self.step}"
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
            "start_date": self.start_date,
            "end_date": self.end_date,
            "step": self.step,
        }

    def set_results(self, step: int) -> None:
        """
        Set or modify any fields needed after computations (placeholder).

        Args:
            step (int): Step size to update, if your application recalculates or changes it.
        """
        self.step = step

# # Example usage
# if __name__ == "__main__":
#     try:
#         # Valid example
#         report = WmmReport(
#             latitude=40.7128,
#             longitude=-74.0060,
#             altitude=100,
#             altitude_unit=AltitudeUnit.meters,
#             start_date="2023-01-01",
#             end_date="2023-12-31",
#             step=1
#         )
#         print(f"Valid report: {report}")
        
#         # Invalid example - end_date before start_date
#         invalid_report = WmmReport(
#             latitude=40.7128,
#             longitude=-74.0060,
#             altitude=100,
#             altitude_unit=AltitudeUnit.meters,
#             start_date="2023-12-31",
#             end_date="2023-01-01",
#             step=1
#         )
#     except ValueError as e:
#         print(f"Validation error: {e}")