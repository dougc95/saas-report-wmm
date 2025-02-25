import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";

export const FieldContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: "1.5rem",
    width: "80%",
    justifyContent: "space-around",
    alignSelf: "center",
}));

export const CoordinateField = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    minWidth: "30%",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
}));

export const CoordinateInput = styled(Input)(({ theme }) => ({
    width: "50%",
}));

export const AltitudeFieldContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(2),
}));

export const LeftAltitudeBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing(1), // Optional spacing between label and input
}));
