import DateTimePickerCommunity from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";

interface Props {
  onConfirm: (date: Date) => void;
  hoursAgo?: number;
}

export function DateTimePicker({ onConfirm, hoursAgo = 0 }: Props) {
  const [date, setDate] = useState(dayjs().subtract(hoursAgo, "hour").toDate());
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [showPicker, setShowPicker] = useState(false);

  function onOpen() {
    setPickerMode("date");
    setShowPicker(true);
  }

  function onPickerChange(event: any, selectedDate: any) {
    if (event.type === "dismissed") {
      return;
    }

    if (pickerMode === "date") {
      setPickerMode("time");
    } else if (pickerMode === "time") {
      setShowPicker(false);
    }

    setDate(selectedDate);
    onConfirm(selectedDate);
  }

  return (
    <>
      <TouchableOpacity
        onPress={onOpen}
        style={{
          backgroundColor: "#1447e6",
          paddingVertical: 8,
          paddingHorizontal: 18,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", fontSize: 20 }}>
          {dayjs(date).format("DD/MM/YYYY - HH:mm")}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePickerCommunity
          value={date}
          mode={pickerMode}
          onChange={onPickerChange}
          is24Hour
        />
      )}
    </>
  );
}
