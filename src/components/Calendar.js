import React, { useState } from "react";
import { TextInput, TouchableOpacity, Platform, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "../utils/dateUtils";

export default function Calendar({ date, onChangeDate }) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event, selectedDate) => {
    if (selectedDate) {
      onChangeDate(selectedDate);
    }
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <TextInput
          value={formatDate(date)}
          editable={false}
          style={{
            height: 40,
            width: 300,
            borderColor: "#aaa",
            borderWidth: 1,
            borderRadius: 6,
            paddingHorizontal: 10,
            backgroundColor: "#fff",
            marginTop: 5,
          }}
        />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}
