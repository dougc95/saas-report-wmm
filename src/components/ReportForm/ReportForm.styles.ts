import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import { Paper } from "@mui/material";

export const FieldContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    alignItems: "center"
}));

export const CoordinateField = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    minWidth: "30%",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
}));

export const CoordinateInput = styled(Input)(({ theme }) => ({
    alignSelf: "flex-start",
}));

export const AltitudeFieldContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: theme.spacing(2),
    gap: "0 2rem"

}));

export const CoordinateFieldContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    gap: "0 2rem"
}));

export const LeftAltitudeBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(1), // Optional spacing between label and input
}));

export const FormContainer = styled(Paper)(({ theme }) => ({
    width: "30vw",
    height: "75vh",
    backgroundColor: "#EEEEEE",
    padding: "1rem",
    borderRadius: "1rem"
}));
