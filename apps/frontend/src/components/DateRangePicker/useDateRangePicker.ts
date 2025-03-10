import { useFormContext } from "../../context/FormProvider";


export function useDateRangePicker() {
    const {
        currentDate,
        selectedStartDate,
        selectedEndDate,
        setCurrentDate,
        setSelectedStartDate,
        setSelectedEndDate } = useFormContext();

    const handlePrevMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );
    };

    const handleNextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        );
    };

    const handleDayClick = (dayDate: Date) => {
        // If no start is set, or both are already set, restart the selection
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            setSelectedStartDate(dayDate);
            setSelectedEndDate(null);
        } else {
            // If the clicked day is before the start, swap the dates
            if (dayDate < selectedStartDate) {
                setSelectedEndDate(selectedStartDate);
                setSelectedStartDate(dayDate);
            } else {
                setSelectedEndDate(dayDate);
            }
        }
    };

    return {
        handlePrevMonth,
        handleNextMonth,
        handleDayClick
    }

}