import { createContext, useContext, useState } from "react";

type AltitudeUnits = "meters" | "ft";

interface FormContextProps {
  latitude: number;
  longitude: number;
  altitude: number;
  unit: AltitudeUnits;
  setLatitude: (lat: number) => void;
  setLongitude: (lon: number) => void;
  setAltitude: (alt: number) => void;
  setUnit: (unit: AltitudeUnits) => void;
}

const FormContext = createContext<FormContextProps | undefined>(undefined);

export const FormProvider = ({ children }) => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [unit, setUnit] = useState<AltitudeUnits>("meters");

  return (
    <FormContext.Provider
      value={{
        latitude,
        longitude,
        altitude,
        unit,
        setLatitude,
        setLongitude,
        setAltitude,
        setUnit,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export function useFormContext(): FormContextProps {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
