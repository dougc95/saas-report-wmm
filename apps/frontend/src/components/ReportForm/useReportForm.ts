import { useFormContext } from "../../context/FormProvider";
import { ChangeEvent } from "react";

export function useReportForm() {
    const {
        setAltitude,
        setLatitude,
        setLongitude,
        setUnit,
    } = useFormContext();

    const handleLatitude = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setLatitude(parseInt(e.target.value));
    };

    const handleLongitude = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setLongitude(parseInt(e.target.value));
    };

    const handleAltitude = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setAltitude(parseInt(e.target.value));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUnits = (e: any) => {
        e.preventDefault();
        console.log(e.target.value);
        setUnit(e.target.value);
    };

    return {
        handleLatitude,
        handleLongitude,
        handleAltitude,
        handleUnits
    }
}