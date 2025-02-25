import { createContext, useContext, useState } from "react";

type AltitudeUnits = "meters" | "ft";

interface FormContextProps {
  latitude: number;
  longitude: number;
  altitude: number;
  unit: AltitudeUnits;
  currentDate: Date;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  setLatitude: (lat: number) => void;
  setLongitude: (lon: number) => void;
  setAltitude: (alt: number) => void;
  setUnit: (unit: AltitudeUnits) => void;
  setCurrentDate: (currentDate: Date) => void;
  setSelectedStartDate: (selectedStartDate: Date | null) => void;
  setSelectedEndDate: (selectedEndDate: Date | null) => void;
}

const FormContext = createContext<FormContextProps | undefined>(undefined);

export const FormProvider = ({ children }) => {
  //Coordinates
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [unit, setUnit] = useState<AltitudeUnits>("meters");

  //Dates
  // Store Date objects, not strings
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  return (
    <FormContext.Provider
      value={{
        latitude,
        longitude,
        altitude,
        unit,
        currentDate,
        selectedStartDate,
        selectedEndDate,
        setLatitude,
        setLongitude,
        setAltitude,
        setUnit,
        setCurrentDate,
        setSelectedStartDate,
        setSelectedEndDate,
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
