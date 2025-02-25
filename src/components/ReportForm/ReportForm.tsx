import {
  Button,
  FormControlLabel,
  Grid2,
  Radio,
  RadioGroup,
} from "@mui/material";
import { InputLabel } from "@mui/material";
import DatePicker from "../DateRangePicker/DateRangePicker";
import MapDisplay from "../MapDisplay/MapDisplay";
import { useFormContext } from "../../context/FormProvider";
import { useReportForm } from "./useReportForm";

import {
  FieldContainer,
  CoordinateField,
  CoordinateInput,
  AltitudeFieldContainer,
  LeftAltitudeBox,
} from "./ReportForm.styles";

export default function ReportForm() {
  const { latitude, longitude, altitude } = useFormContext();
  const { handleLatitude, handleLongitude, handleAltitude, handleUnits } =
    useReportForm();

  return (
    <>
      <h1>WMM Report Generator</h1>
      <MapDisplay />
      <Grid2 container flexDirection="column">
        <h2>Coordinates</h2>
        <FieldContainer>
          <CoordinateField>
            <InputLabel htmlFor="latitude">Latitude</InputLabel>
            <CoordinateInput
              value={latitude}
              type="number"
              id="latitude"
              name="latitude"
              onChange={handleLatitude}
            />
          </CoordinateField>
          <CoordinateField>
            <InputLabel htmlFor="longitude">Longitude</InputLabel>
            <CoordinateInput
              value={longitude}
              type="number"
              id="longitude"
              name="longitude"
              onChange={handleLongitude}
            />
          </CoordinateField>
          <AltitudeFieldContainer>
            <LeftAltitudeBox>
              <InputLabel htmlFor="altitude">Altitude</InputLabel>
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
              <FormControlLabel value="ft" control={<Radio />} label="ft" />
              <FormControlLabel
                value="meters"
                control={<Radio />}
                label="meters"
              />
            </RadioGroup>
          </AltitudeFieldContainer>
        </FieldContainer>
      </Grid2>
      <DatePicker />
      <Button variant="contained">Generate</Button>
    </>
  );
}
