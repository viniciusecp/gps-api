import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../src/theme/colors";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      />
    </SafeAreaView>
  );
}
