import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  PanResponder,
  Animated,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { createSwipe } from "../src/services/api";
import { getCurrentUserId } from "../src/services/auth";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Hardcoded profiles
const profiles = [
  {
    id: 1,
    name: "Alex Johnson",
    age: 24,
    bio: "Software engineer who loves hiking and cooking. Looking for a clean, quiet roommate.",
    budget: "$800-1200",
    location: "Downtown",
    interests: ["Coding", "Hiking", "Cooking", "Photography"],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
  },
  {
    id: 2,
    name: "Sarah Chen",
    age: 22,
    bio: "Art student passionate about sustainability. Prefers eco-friendly living.",
    budget: "$600-900",
    location: "Midtown",
    interests: ["Art", "Sustainability", "Yoga", "Reading"],
    image:
      "https://images.unsplash.com/photo-1687610265701-1255ece05d75?w=400&h=600&fit=crop",
  },
  {
    id: 3,
    name: "Marcus Rodriguez",
    age: 26,
    bio: "Musician and part-time barista. Night owl who loves hosting small gatherings.",
    budget: "$700-1000",
    location: "East Side",
    interests: ["Music", "Coffee", "Socializing", "Gaming"],
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop",
  },
  {
    id: 4,
    name: "Emma Wilson",
    age: 23,
    bio: "Graduate student in psychology. Values quiet study time and good communication.",
    budget: "$650-950",
    location: "University District",
    interests: ["Psychology", "Studying", "Meditation", "Coffee"],
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop",
  },
  {
    id: 5,
    name: "David Kim",
    age: 25,
    bio: "Fitness enthusiast and early bird. Looking for someone who respects morning routines.",
    budget: "$800-1100",
    location: "West Side",
    interests: ["Fitness", "Early Rising", "Healthy Eating", "Running"],
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
  },
];

export default function Matches() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const likeOpacity = useRef(new Animated.Value(0)).current;
  const passOpacity = useRef(new Animated.Value(0)).current;

  const [currentUserId, setCurrentUserId] = useState<number | null>(1); // TEMP default 1

  useEffect(() => {
    (async () => {
      const id = await getCurrentUserId();

      if (!id) {
        setCurrentUserId(1);
        return;
      }

      setCurrentUserId(id);
    })();
  }, []);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      position.setOffset({
        x: (position.x as any)._value,
        y: (position.y as any)._value,
      });
    },
    onPanResponderMove: (evt, gestureState) => {
      position.setValue({ x: gestureState.dx, y: gestureState.dy });

      // Show like/pass indicators based on swipe direction
      const swipeThreshold = screenWidth * 0.1;
      if (gestureState.dx > swipeThreshold) {
        // Swiping right - show like indicator
        likeOpacity.setValue(
          Math.min(gestureState.dx / (screenWidth * 0.3), 1)
        );
        passOpacity.setValue(0);
      } else if (gestureState.dx < -swipeThreshold) {
        // Swiping left - show pass indicator
        passOpacity.setValue(
          Math.min(Math.abs(gestureState.dx) / (screenWidth * 0.3), 1)
        );
        likeOpacity.setValue(0);
      } else {
        // Reset indicators
        likeOpacity.setValue(0);
        passOpacity.setValue(0);
      }

      // Add rotation effect
      rotate.setValue(gestureState.dx / 10);
    },
    onPanResponderRelease: (evt, gestureState) => {
      position.flattenOffset();

      // Reset indicators
      likeOpacity.setValue(0);
      passOpacity.setValue(0);
      rotate.setValue(0);

      if (
        Math.abs(gestureState.dx) > screenWidth * 0.15 ||
        Math.abs(gestureState.vx) > 0.5
      ) {
        // Swipe away
        const direction = gestureState.dx > 0 ? 1 : -1;
        Animated.parallel([
          Animated.timing(position, {
            toValue: {
              x: direction * screenWidth * 1.5,
              y: gestureState.dy * 0.5,
            },
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(rotate, {
            toValue: direction * 30,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start(() => {
          handleSwipe(direction > 0 ? "like" : "pass");
        });
      } else {
        // Return to center
        Animated.parallel([
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }),
          Animated.spring(rotate, {
            toValue: 0,
            useNativeDriver: false,
          }),
        ]).start();
      }
    },
  });

  const handleSwipe = (action: "like" | "pass") => {
    const targetProfile = profiles[currentIndex];

    if (targetProfile) {
      console.log(`${action}: ${targetProfile.name}`);

      if (!currentUserId) {
        console.log("No user logged in; swipe not saved");
      } else {
        createSwipe({
          swiper_user_id: currentUserId,
          target_profile_id: targetProfile.id,
          action,
        }).catch((err) => {
          console.log("Failed to save swipe:", err?.message ?? err);
        });
      }
    }

    setCurrentIndex((prev) => prev + 1);
    position.setValue({ x: 0, y: 0 });
    rotate.setValue(0);
    likeOpacity.setValue(0);
    passOpacity.setValue(0);
  };

  const handleButtonPress = (action: "like" | "pass") => {
    const direction = action === "like" ? 1 : -1;
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: direction * screenWidth * 1.5, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotate, {
        toValue: direction * 30,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      handleSwipe(action);
    });
  };

  const handleRefresh = () => {
    setCurrentIndex(0);

    position.setValue({ x: 0, y: 0 });
    rotate.setValue(0);
    likeOpacity.setValue(0);
    passOpacity.setValue(0);

    console.log("Refreshed profiles");
  };

  const currentProfile = profiles[currentIndex];

  if (!currentProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Find Roommates</Text>
          <Text style={styles.subtitle}>Swipe right to like, left to pass</Text>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="heart-dislike" size={64} color="#E2E8F0" />
          </View>
          <Text style={styles.emptyTitle}>No More Profiles!</Text>
          <Text style={styles.emptySubtitle}>
            Check back later for new potential roommates
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={handleRefresh}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={20} color="#6366F1" />
            <Text style={styles.emptyButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Roommates</Text>
        <Text style={styles.subtitle}>Swipe right to like, left to pass</Text>
      </View>

      <View style={styles.cardContainer}>
        {/* Swipe Indicators */}
        <Animated.View
          style={[
            styles.swipeIndicator,
            styles.likeIndicator,
            { opacity: likeOpacity },
          ]}
        >
          <Ionicons name="heart" size={60} color="#10B981" />
          <Text style={styles.swipeText}>LIKE</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.swipeIndicator,
            styles.passIndicator,
            { opacity: passOpacity },
          ]}
        >
          <Ionicons name="close" size={60} color="#EF4444" />
          <Text style={styles.swipeText}>PASS</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                {
                  rotate: rotate.interpolate({
                    inputRange: [-180, 180],
                    outputRange: ["-15deg", "15deg"],
                  }),
                },
                {
                  scale: position.x.interpolate({
                    inputRange: [-screenWidth, 0, screenWidth],
                    outputRange: [0.85, 1, 0.85],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Image
            source={{ uri: currentProfile.image }}
            style={styles.profileImage}
          />

          {/* Gradient overlay for better text readability */}
          <View style={styles.imageGradient} />

          <View style={styles.cardOverlay}>
            <ScrollView
              style={styles.profileScroll}
              contentContainerStyle={styles.profileScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.profileInfo}>
                <View style={styles.nameContainer}>
                  <Text style={styles.name}>
                    {currentProfile.name}, {currentProfile.age}
                  </Text>

                  <View style={styles.ageBadge}>
                    <Text style={styles.ageText}>{currentProfile.age}</Text>
                  </View>
                </View>

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="cash" size={16} color="#6366F1" />
                    <Text style={styles.detailText}>
                      {currentProfile.budget}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Ionicons name="location" size={16} color="#10B981" />
                    <Text style={styles.detailText}>
                      {currentProfile.location}
                    </Text>
                  </View>
                </View>

                <Text style={styles.bio}>{currentProfile.bio}</Text>

                <View style={styles.interestsContainer}>
                  <Text style={styles.interestsTitle}>Interests</Text>

                  <View style={styles.interestsList}>
                    {currentProfile.interests.map((interest, index) => (
                      <View key={index} style={styles.interestTag}>
                        <Text style={styles.interestText}>{interest}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handleButtonPress("pass")}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.superLikeButton]}
          onPress={() => handleButtonPress("like")}
          activeOpacity={0.8}
        >
          <Ionicons name="star" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => handleButtonPress("like")}
          activeOpacity={0.8}
        >
          <Ionicons name="heart" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E293B",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginTop: 5,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    position: "relative",
  },
  swipeIndicator: {
    position: "absolute",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
  },
  likeIndicator: {
    borderColor: "#10B981",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  passIndicator: {
    borderColor: "#EF4444",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  swipeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
    color: "#1E293B",
  },
  card: {
    width: screenWidth - 40,
    height: screenHeight * 0.7,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    overflow: "hidden",
  },
  profileImage: {
    width: "15%",
    height: "60%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  imageGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "65%",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  cardOverlay: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  profileScroll: {
    flex: 1,
  },
  profileScrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E293B",
    flex: 1,
  },
  ageBadge: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ageText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  detailsRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "500",
    marginLeft: 6,
  },
  bio: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 20,
  },
  interestsContainer: {
    marginTop: "auto",
  },
  interestsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 12,
  },
  interestsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestTag: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  interestText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  passButton: {
    backgroundColor: "#EF4444",
  },
  superLikeButton: {
    backgroundColor: "#3B82F6",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  likeButton: {
    backgroundColor: "#10B981",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#6366F1",
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366F1",
    marginLeft: 8,
  },
});
