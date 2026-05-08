import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Colors, getSpacing, getTypography } from "../../src/theme";

interface Props {
  label: string;
  onClick: () => void;
  loading?: boolean;
  containerStyle?: ViewStyle;
}

export function SubmitButton({
  label,
  onClick,
  loading,
  containerStyle,
}: Props) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.primary,
        alignItems: "center",
        paddingVertical: getSpacing('px3'),
        borderRadius: 8,
        ...containerStyle,
      }}
      disabled={loading}
      onPress={onClick}
    >
      {loading ? (
        <ActivityIndicator color={Colors.text} />
      ) : (
        <Text
          style={{
            color: Colors.text,
            fontSize: getTypography('button'),
            fontWeight: getTypography('fontWeight').bold
          }}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
