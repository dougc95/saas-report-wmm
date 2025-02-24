import { useFormContext } from "../../context/FormProvider";

export function useReportForm() {
    const {
        setAltitude,
        setLatitude,
        setLongitude,
        setUnit,
    } = useFormContext();

    const handleLatitude = (e) => {
        e.preventDefault();
        setLatitude(e.target.value);
    };

    const handleLongitude = (e) => {
        e.preventDefault();
        setLongitude(e.target.value);
    };

    const handleAltitude = (e) => {
        e.preventDefault();
        setAltitude(e.target.value);
    };

    const handleUnits = (e) => {
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