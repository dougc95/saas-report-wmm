import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { FormProvider } from "./context/FormProvider.tsx";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF5722",
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FormProvider>
        <App />
      </FormProvider>
    </ThemeProvider>
  </StrictMode>
);
