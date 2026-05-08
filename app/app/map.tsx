import BackButton from "@/components/back-button";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function Map() {
  const { latitude, longitude } = useLocalSearchParams();
  const lat = Number(latitude);
  const lon = Number(longitude);

  return (
    <View style={{ flex: 1 }}>
      <BackButton />

      <MapView
        style={{ flex: 1, marginTop: 12 }}
        initialRegion={{
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker
          coordinate={{
            latitude: lat,
            longitude: lon,
          }}
          title="Ultima localização"
        />
      </MapView>
    </View>
  );
}
