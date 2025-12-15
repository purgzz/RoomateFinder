import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function Home() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  // Get static map image URL
  const getMapImageUrl = () => {
    const lat = location?.coords.latitude || 37.78825;
    const lng = location?.coords.longitude || -122.4324;
    const apiKey =
      Constants.expoConfig?.extra?.googleMapsApiKey ||
      "AIzaSyA4PyrL5urs9GTPX5r9lk3RuVuiBUHcIn8";

    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=640x420&scale=2&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="home" size={32} color="#FFFFFF" />
            <Text style={styles.title}>Bindle</Text>
            <Text style={styles.subtitle}>
              Find your perfect roomate today!
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mapContainer}>
          <View style={styles.mapHeader}>
            <Ionicons name="location" size={20} color="#6366F1" />
            <Text style={styles.mapTitle}>Your Location</Text>
          </View>

          <Image
            source={{ uri: getMapImageUrl() }}
            style={styles.map}
            resizeMode="cover"
          />

          <View style={styles.mapOverlay}>
            <Text style={styles.mapOverlayText}>
              📍{" "}
              {location
                ? `${location.coords.latitude.toFixed(
                    4
                  )}, ${location.coords.longitude.toFixed(4)}`
                : "Getting location..."}
            </Text>
          </View>
        </View>

        {errorMsg && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={20} color="#EF4444" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <Ionicons name="people" size={24} color="#6366F1" />
            <Text style={styles.featureTitle}>Smart Matching</Text>
            <Text style={styles.featureDescription}>
              AI-powered compatibility
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            <Text style={styles.featureTitle}>Verified Profiles</Text>
            <Text style={styles.featureDescription}>Safe and secure</Text>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="chatbubbles" size={24} color="#F59E0B" />
            <Text style={styles.featureTitle}>Easy Chat</Text>
            <Text style={styles.featureDescription}>Connect instantly</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerGradient: {
    backgroundColor: "#667eea",
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 10,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    flexGrow: 1,
  },
  mapContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    width: "80%",
    alignSelf: "center",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
  },
  mapHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginLeft: 8,
  },
  map: {
    width: "100%",
    height: 350,
    backgroundColor: "#F1F5F9",
    resizeMode: "cover",
  },
  mapOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  mapOverlayText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    color: "#DC2626",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  featureCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 16,
  },
});
