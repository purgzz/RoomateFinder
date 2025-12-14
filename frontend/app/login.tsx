import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { setCurrentUserId } from "../src/services/auth";

export default function Login() {
  const [userId, setUserId] = useState("1");
  const router = useRouter();

  const onLogin = async () => {
    const id = Number(userId);
    if (!Number.isFinite(id) || id <= 0) {
      Alert.alert("Invalid", "Enter a valid numeric user id (ex: 1).");
      return;
    }
    await setCurrentUserId(id);
    router.replace("/matches");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login (temp)</Text>
      <Text style={styles.sub}>For now, type a user id like 1.</Text>

      <TextInput
        value={userId}
        onChangeText={setUserId}
        keyboardType="numeric"
        style={styles.input}
        placeholder="User ID"
      />

      <TouchableOpacity style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
  sub: { fontSize: 14, opacity: 0.7, marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 12 },
  button: { backgroundColor: "#6366F1", padding: 14, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "700" },
});
