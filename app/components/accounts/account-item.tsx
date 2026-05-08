import { FontAwesome6 } from "@expo/vector-icons";
import { Alert, Text, TouchableOpacity } from "react-native";
import { Colors, getSpacing, getTypography } from "../../src/theme";

interface Props {
  type: "user" | "vehicle" | "add";
  title: string;
  isSelected?: boolean;
  onClick?: () => void;
  onRemoveAccount?: () => void;
}

export default function AccountItem({
  type,
  title,
  isSelected,
  onClick,
  onRemoveAccount,
}: Props) {
  const icon = type === "user" ? "user" : type === "vehicle" ? "car" : "plus";
  const color = isSelected
    ? Colors.primary
    : type === "user"
    ? Colors.textSecondary
    : Colors.text;

  function handleRemoveUser() {
    if (type !== "user") {
      return;
    }

    Alert.alert("Atenção", "Deseja remover esta conta?", [
      {
        text: "Cancelar",
      },
      {
        text: "Remover",
        onPress: () => onRemoveAccount?.(),
        style: "destructive", // iOS specific style
      },
    ]);
  }

  return (
    <TouchableOpacity
      style={{
        alignItems: "center",
        gap: getSpacing('px1'),
        marginHorizontal: getSpacing('px3'),
      }}
      onPress={onClick}
      onLongPress={handleRemoveUser}
    >
      <FontAwesome6 name={icon} size={getTypography('h3')} color={color} />

      <Text style={{ color, fontSize: getTypography('h3') }}>{title}</Text>
    </TouchableOpacity>
  );
}
