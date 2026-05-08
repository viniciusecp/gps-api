import { User } from "@/common/model";
import BackButton from "@/components/back-button";
import CoordinateItem, {
  Coordinate,
} from "@/components/coordinates/coordinate-item";
import { DateTimePicker } from "@/components/date-time-picker";
import { SubmitButton } from "@/components/submit-button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";

const HOURS_AGO = 1;
const now = dayjs();

export default function History() {
  const { imei } = useLocalSearchParams();

  const startDateRef = useRef<Date>(now.subtract(HOURS_AGO, "hour").toDate());
  const endDateRef = useRef<Date>(now.toDate());

  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleFetchHistory() {
    setIsLoading(true);
    setCoordinates([]);

    try {
      const storageUsers = await AsyncStorage.getItem("users");

      if (!storageUsers) {
        throw new Error("Users not found");
      }

      const { email, password } = JSON.parse(storageUsers).find((user: User) =>
        user.vehicles.find((vehicle) => vehicle.imei === imei)
      )!;

      const payload = {
        email,
        senha: password,
        dataInicio: dayjs(startDateRef.current).format("DD/MM/YYYY"),
        horaInicio: dayjs(startDateRef.current).format("HH:mm"),
        dataFinal: dayjs(endDateRef.current).format("DD/MM/YYYY"),
        horaFinal: dayjs(endDateRef.current).format("HH:mm"),
      };

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/gethistory/${imei}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { coordinates } = await response.json();

      setCoordinates(
        coordinates.map((coordinate: any) => ({
          latitude: coordinate.latitudeDecimalDegrees,
          longitude: coordinate.longitudeDecimalDegrees,
          date: dayjs(coordinate.date).format("DD/MM/YYYY"),
          time: dayjs(coordinate.date)
            .tz("America/Sao_Paulo")
            .format("HH:mm:ss"),
          speed: Math.round(coordinate.speed),
        }))
      );
    } catch (error) {
      Alert.alert("Error:", String(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <BackButton />

      <View style={styles.card}>
        <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>
          Histórico
        </Text>

        <View style={{ ...styles.hr, marginBottom: 8 }} />

        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Período inicial:</Text>

          <DateTimePicker
            onConfirm={(date) => {
              startDateRef.current = date;
            }}
            hoursAgo={HOURS_AGO}
          />
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Período final:</Text>

          <DateTimePicker
            onConfirm={(date) => {
              endDateRef.current = date;
            }}
          />
        </View>

        <SubmitButton
          label="Buscar"
          onClick={handleFetchHistory}
          loading={isLoading}
          containerStyle={{ marginTop: 8 }}
        />
      </View>

      {!!coordinates.length && (
        <FlatList
          data={coordinates}
          renderItem={({ item }) => <CoordinateItem coordinate={item} />}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 10 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff0b",
    borderWidth: 1,
    borderColor: "#ffffff26",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 4,
  },
  hr: {
    height: 1,
    backgroundColor: "#ffffff26",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    justifyContent: "space-between",
  },
  dateLabel: {
    color: "white",
    fontSize: 20,
  },
});
