import { User } from "@/common/model";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, View } from "react-native";
import CoordinateItem, { Coordinate } from "./coordinate-item";

export interface CoordinatesRef {
  loadCoordinates: (selectedImei: string) => void;
}

interface Props {
  users: User[];
  selectedImei: string;
}

export function Coordinates({ users, selectedImei }: Props) {
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCoordinates = useCallback(async () => {
    setIsLoading(true);
    setCoordinates([]);

    try {
      const { email, password } = users.find((user) =>
        user.vehicles.find((vehicle) => vehicle.imei === selectedImei),
      )!;

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/getcoordinates/${selectedImei}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            senha: password,
          }),
        },
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
        })),
      );
    } catch (error) {
      Alert.alert("Error:", String(error));
    } finally {
      setIsLoading(false);
    }
  }, [users, selectedImei]);

  useEffect(() => {
    loadCoordinates();
  }, [loadCoordinates]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#1447e6" />
      </View>
    );
  }

  return (
    <FlatList
      data={coordinates}
      renderItem={({ item }) => <CoordinateItem coordinate={item} />}
      showsVerticalScrollIndicator={false}
      style={{
        marginTop: 16,
      }}
    />
  );
}

Coordinates.displayName = "Coordinates";

export default Coordinates;
