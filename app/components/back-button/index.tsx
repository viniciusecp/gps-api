import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export default function BackButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={{
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 8,
        marginTop: 8,
        marginLeft: 8,
      }}
    >
      <FontAwesome6 name="arrow-left" size={24} color="#fafafa" />

      <Text style={{ color: "#fafafa", fontSize: 20 }}>Voltar</Text>
    </TouchableOpacity>
  );
}
