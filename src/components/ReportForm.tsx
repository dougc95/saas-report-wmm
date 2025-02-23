import { useState } from "react";
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
import DatePicker from "./DatePicker";

export default function ReportForm() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [altitude, setAltitude] = useState(0);

  return (
    <>
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
            />
          </div>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="meters"
            name="radio-buttons-group"
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
