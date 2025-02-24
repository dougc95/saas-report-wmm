import {
  Button,
  FormControlLabel,
  Grid2,
  Input,
  Radio,
  RadioGroup,
} from "@mui/material";
import { InputLabel } from "@mui/material";

import "./ReportForm.css";
import DatePicker from "../DatePicker";
import MapDisplay from "../MapDisplay";
import { useFormContext } from "../../context/FormProvider";
import { useReportForm } from "./useReportForm";

export default function ReportForm() {
  const { latitude, longitude, altitude } = useFormContext();
  const { handleLatitude, handleLongitude, handleAltitude, handleUnits } =
    useReportForm();

  return (
    <>
      <h1>WMM Report Generator</h1>
      <MapDisplay />
      <Grid2 container flexDirection={"column"}>
        <h2>Coordinates</h2>
        <div className="field">
          <div className="coordinate_field">
            <InputLabel htmlFor="latitude">Latitude</InputLabel>
            <Input
              sx={{ width: "50%" }}
              value={latitude}
              type="number"
              id="latitude"
              name="latitude"
              onChange={handleLatitude}
            />
          </div>
          <div className="coordinate_field">
            <InputLabel htmlFor="longitude">Longitude</InputLabel>
            <Input
              sx={{ width: "50%" }}
              value={longitude}
              type="number"
              id="longitude"
              name="longitude"
              onChange={handleLongitude}
            />
          </div>
          <div className="coordinate_field">
            <InputLabel htmlFor="altitude">Altitude</InputLabel>
            <Input
              sx={{ width: "50%" }}
              value={altitude}
              type="number"
              id="altitude"
              name="altitude"
              onChange={handleAltitude}
            />
          </div>
          <RadioGroup
            defaultValue="meters"
            name="units-group"
            onChange={handleUnits}
          >
            <FormControlLabel value="ft" control={<Radio />} label="ft" />
            <FormControlLabel
              value="meters"
              control={<Radio />}
              label="meters"
            />
          </RadioGroup>
        </div>
      </Grid2>
      <DatePicker />
      <Button variant="contained">Generate</Button>
    </>
  );
}
