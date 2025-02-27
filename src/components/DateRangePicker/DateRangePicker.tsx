import { useState, MouseEvent, JSX } from "react";
import {
  TextField,
  Popover,
  Box,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { ArrowLeft, ArrowRight, CalendarToday } from "@mui/icons-material";
import { useDateRangePicker } from "./useDateRangePicker";
import { useFormContext } from "../../context/FormProvider";

export default function DatePicker() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const {
    currentDate,
    selectedStartDate,
    selectedEndDate,
    setSelectedStartDate,
    setSelectedEndDate,
  } = useFormContext();
  const { handleDayClick, handleNextMonth, handlePrevMonth } =
    useDateRangePicker();

  const handleTextFieldClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    // Sunday-based index of first day
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const daysArray: JSX.Element[] = [];

    // Empty boxes before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(<Box key={`empty-${i}`} />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      let bgColor = "transparent";
      let textColor = "inherit";

      // Helper to compare exact day (ignoring time)
      const isSameDay = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

      // Check if day is the start date
      if (selectedStartDate && isSameDay(dayDate, selectedStartDate)) {
        bgColor = "primary.main";
        textColor = "primary.contrastText";
      }

      // Check if day is the end date
      if (selectedEndDate && isSameDay(dayDate, selectedEndDate)) {
        bgColor = "primary.main";
        textColor = "primary.contrastText";
      }

      // Check if day is in between
      if (
        selectedStartDate &&
        selectedEndDate &&
        dayDate > selectedStartDate &&
        dayDate < selectedEndDate
      ) {
        bgColor = "grey.300";
      }

      daysArray.push(
        <Box
          key={i}
          onClick={() => handleDayClick(dayDate)}
          sx={{
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            cursor: "pointer",
            bgcolor: bgColor,
            color: textColor,
            "&:hover": {
              bgcolor: "grey.200",
            },
          }}
        >
          {i}
        </Box>
      );
    }
    return daysArray;
  };

  const displayValue = (() => {
    if (selectedStartDate && selectedEndDate) {
      return `${selectedStartDate.toLocaleDateString()} - ${selectedEndDate.toLocaleDateString()}`;
    }
    if (selectedStartDate) {
      return selectedStartDate.toLocaleDateString();
    }
    return "";
  })();

  return (
    <Box sx={{ m: 7, margin: "0" }}>
      <TextField
        label="Pick date range"
        value={displayValue}
        onClick={handleTextFieldClick}
        InputProps={{
          endAdornment: <CalendarToday />,
        }}
        fullWidth
        // You might want readOnly if you don't want manual text entry
        // InputProps={{ readOnly: true, endAdornment: <CalendarToday /> }}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2, minWidth: 300 }}>
          {/* Calendar Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton onClick={handlePrevMonth}>
              <ArrowLeft />
            </IconButton>
            <Typography variant="h6">
              {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </Typography>
            <IconButton onClick={handleNextMonth}>
              <ArrowRight />
            </IconButton>
          </Box>

          {/* Days of the week header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              textAlign: "center",
              mt: 2,
            }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Typography key={day} variant="subtitle2">
                {day}
              </Typography>
            ))}
          </Box>

          {/* Calendar days */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1,
              mt: 1,
            }}
          >
            {renderCalendarDays()}
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedStartDate(null);
                setSelectedEndDate(null);
                handleClose();
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
