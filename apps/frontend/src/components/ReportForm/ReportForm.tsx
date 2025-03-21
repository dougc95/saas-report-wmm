import {
  Box,
  Button,
  FormControlLabel,
  Grid2,
  Input,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { InputLabel } from "@mui/material";
import DatePicker from "../DateRangePicker/DateRangePicker";
import MapDisplay from "../MapDisplay/MapDisplay";
import { useFormContext } from "../../context/FormProvider";
import { useReportForm } from "./useReportForm";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import {
  FieldContainer,
  CoordinateField,
  CoordinateInput,
  AltitudeFieldContainer,
  LeftAltitudeBox,
  FormContainer,
  CoordinateFieldContainer,
} from "./ReportForm.styles";

export default function ReportForm() {
  const {
    latitude,
    longitude,
    altitude,
    unit,
    selectedStartDate,
    selectedEndDate,
  } = useFormContext();
  const { handleLatitude, handleLongitude, handleAltitude, handleUnits } =
    useReportForm();

  const handleInputSubmission = async () => {
    const url = "/api/wmm/report";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude,
          longitude,
          altitude,
          altitude_unit: unit,
          start_date: selectedStartDate?.toISOString().split("T")[0],
          end_date: selectedEndDate?.toISOString().split("T")[0],
          step: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "wmm_report.xlsx";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]*)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Create a temporary link element
      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = filename;

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      URL.revokeObjectURL(blobUrl);
    } catch (error: unknown) {
      console.error((error as Error).message);
    }
  };

  return (
    <FormContainer elevation={5}>
      <Typography variant="h5" component="h1">
        WMM Report Generator
      </Typography>
      <MapDisplay />
      <Grid2 container flexDirection="column" sx={{ padding: "1rem 0 0" }}>
        <FieldContainer>
          <AltitudeFieldContainer>
            <LeftAltitudeBox>
              <InputLabel htmlFor="altitude" sx={{ alignSelf: "flex-start" }}>
                Altitude
              </InputLabel>
              <CoordinateInput
                value={altitude}
                type="number"
                id="altitude"
                name="altitude"
                onChange={handleAltitude}
              />
            </LeftAltitudeBox>
            <RadioGroup
              defaultValue="meters"
              name="units-group"
              onChange={handleUnits}
              row
            >
              <FormControlLabel value="feet" control={<Radio />} label="feet" />
              <FormControlLabel
                value="meters"
                control={<Radio />}
                label="meters"
              />
            </RadioGroup>
          </AltitudeFieldContainer>
          <CoordinateFieldContainer>
            <CoordinateField>
              <InputLabel htmlFor="latitude" sx={{ alignSelf: "flex-start" }}>
                Latitude
              </InputLabel>
              <CoordinateInput
                value={latitude}
                type="number"
                id="latitude"
                name="latitude"
                onChange={handleLatitude}
              />
            </CoordinateField>
            <CoordinateField>
              <InputLabel htmlFor="longitude" sx={{ alignSelf: "flex-start" }}>
                Longitude
              </InputLabel>
              <CoordinateInput
                value={longitude}
                type="number"
                id="longitude"
                name="longitude"
                onChange={handleLongitude}
              />
            </CoordinateField>
          </CoordinateFieldContainer>
        </FieldContainer>
      </Grid2>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          margin: "0.5rem",
        }}
      >
        <DatePicker />
        <Input
          sx={{ display: "none" }}
          id="file-upload"
          type="file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            console.log(e.target.files);
          }}
        />
        <label
          htmlFor="file-upload"
          style={{
            cursor: "pointer",
            alignSelf: "center",
            display: "inline-flex",
            margin: "0 1rem",
          }}
          title="Override WMM.COF"
        >
          <UploadFileIcon fontSize="medium" color="primary" />
        </label>
      </Box>

      <Button
        variant="contained"
        sx={{ width: "100%" }}
        onClick={handleInputSubmission}
      >
        Generate
      </Button>
    </FormContainer>
  );
}
