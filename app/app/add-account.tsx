import { User } from "@/common/model";
import BackButton from "@/components/back-button";
import { SubmitButton } from "@/components/submit-button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AddAccount() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Atenção", "Preencha todos os campos!");

      return;
    }

    const storageUsers = await AsyncStorage.getItem("users");
    let users: User[] = [];

    if (storageUsers) {
      users = JSON.parse(storageUsers);
    }

    const userAlreadyExists = users.find(
      (user) => email === user.email && password === user.password
    );

    if (userAlreadyExists) {
      Alert.alert("Atenção", "Usuário já adicionado!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/authentication`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            senha: password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.Erro) {
        Alert.alert(data.Erro);
        return;
      }

      users.push({
        name: data.nome,
        email,
        password,
        vehicles: data.veiculos.map((veiculo: any) => ({
          imei: veiculo.imei,
          name: veiculo.veiculo,
        })),
      });

      await AsyncStorage.setItem("users", JSON.stringify(users));

      router.push("/");
    } catch (error) {
      Alert.alert("Error:", String(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton />

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ffffff1a",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 24,
            }}
          >
            <Text
              style={{
                color: "#fafafa",
                fontSize: 32,
                fontWeight: "bold",
                alignSelf: "center",
                marginBottom: 32,
              }}
            >
              RastroApp
            </Text>

            <TextInput
              onChangeText={setEmail}
              value={email}
              placeholder="Digite seu email aqui..."
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              placeholderTextColor="#fafafa3e"
              style={styles.input}
            />

            <TextInput
              onChangeText={setPassword}
              value={password}
              placeholder="Digite sua senha aqui..."
              secureTextEntry
              placeholderTextColor="#fafafa3e"
              style={styles.input}
            />

            <SubmitButton
              label="Acessar"
              onClick={handleLogin}
              loading={isLoading}
              containerStyle={{ marginTop: 18 }}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#ffffff0b",
    borderWidth: 1,
    borderColor: "#ffffff26",
    borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 12,
    color: "#fafafa",
    marginBottom: 12,
    fontSize: 18,
  },
});
