import React, { useState } from "react";
import {
  TextField,
  Popover,
  Box,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { ArrowLeft, ArrowRight, CalendarToday } from "@mui/icons-material";

export default function DatePicker() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);

  const handleTextFieldClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
    const dayString = dayDate.toLocaleDateString();
    // If no start is set or both are already set, restart the selection.
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(dayString);
      setSelectedEndDate(null);
    } else {
      // If the clicked day is before the start, swap the dates.
      if (new Date(dayDate) < new Date(selectedStartDate)) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(dayString);
      } else {
        setSelectedEndDate(dayString);
      }
    }
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = [];

    // Fill in empty cells for days before the first day of the month.
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(<Box key={`empty-${i}`} />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const dayString = dayDate.toLocaleDateString();
      let bgColor = "transparent";
      let textColor = "inherit";

      if (selectedStartDate && dayString === selectedStartDate) {
        bgColor = "primary.main";
        textColor = "primary.contrastText";
      }
      if (selectedEndDate && dayString === selectedEndDate) {
        bgColor = "primary.main";
        textColor = "primary.contrastText";
      }
      if (
        selectedStartDate &&
        selectedEndDate &&
        dayDate > new Date(selectedStartDate) &&
        dayDate < new Date(selectedEndDate)
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

  // Display the chosen date range or single date.
  const displayValue =
    selectedStartDate && selectedEndDate
      ? `${selectedStartDate} - ${selectedEndDate}`
      : selectedStartDate || "";

  return (
    <Box sx={{ m: 2 }}>
      <TextField
        label="Pick a date"
        value={displayValue}
        onClick={handleTextFieldClick}
        InputProps={{
          endAdornment: <CalendarToday />,
        }}
        fullWidth
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
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
