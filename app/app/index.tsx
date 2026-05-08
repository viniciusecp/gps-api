import { User } from "@/common/model";
import Accounts from "@/components/accounts";
import { Coordinates } from "@/components/coordinates";
import EmptyState from "@/components/empty-state";
import { HistoryFloatButton } from "@/components/history-float-button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function Index() {
  const [selectedImei, setSelectedImei] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function loadUsers() {
      const storageUsers = await AsyncStorage.getItem("users");

      if (storageUsers) {
        setUsers(JSON.parse(storageUsers));
      }
    }

    loadUsers();
  }, []);

  function onVehicleClick(vehicleImei: string) {
    setSelectedImei(vehicleImei);
  }

  async function onRemoveAccount(removeUser: User) {
    const newUsers = users.filter(
      (user) =>
        user.email !== removeUser.email ||
        user.password !== removeUser.password,
    );

    await AsyncStorage.setItem("users", JSON.stringify(newUsers));
    setUsers(newUsers);
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 8,
      }}
    >
      <Accounts
        users={users}
        onVehicleClick={onVehicleClick}
        onRemoveAccount={onRemoveAccount}
      />

      {!selectedImei ? (
        <EmptyState />
      ) : (
        <Coordinates users={users} selectedImei={selectedImei} />
      )}

      {selectedImei && <HistoryFloatButton selectedImei={selectedImei} />}
    </View>
  );
}
