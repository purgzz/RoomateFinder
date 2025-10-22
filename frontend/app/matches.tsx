import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, PanResponder, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Hardcoded profiles
const profiles = [
  {
    id: 1,
    name: 'Alex Johnson',
    age: 24,
    bio: 'Software engineer who loves hiking and cooking. Looking for a clean, quiet roommate.',
    budget: '$800-1200',
    location: 'Downtown',
    interests: ['Coding', 'Hiking', 'Cooking', 'Photography'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    age: 22,
    bio: 'Art student passionate about sustainability. Prefers eco-friendly living.',
    budget: '$600-900',
    location: 'Midtown',
    interests: ['Art', 'Sustainability', 'Yoga', 'Reading'],
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Marcus Rodriguez',
    age: 26,
    bio: 'Musician and part-time barista. Night owl who loves hosting small gatherings.',
    budget: '$700-1000',
    location: 'East Side',
    interests: ['Music', 'Coffee', 'Socializing', 'Gaming'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop',
  },
  {
    id: 4,
    name: 'Emma Wilson',
    age: 23,
    bio: 'Graduate student in psychology. Values quiet study time and good communication.',
    budget: '$650-950',
    location: 'University District',
    interests: ['Psychology', 'Studying', 'Meditation', 'Coffee'],
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop',
  },
  {
    id: 5,
    name: 'David Kim',
    age: 25,
    bio: 'Fitness enthusiast and early bird. Looking for someone who respects morning routines.',
    budget: '$800-1100',
    location: 'West Side',
    interests: ['Fitness', 'Early Rising', 'Healthy Eating', 'Running'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop',
  },
];

export default function Matches() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

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
    },
    onPanResponderRelease: (evt, gestureState) => {
      position.flattenOffset();
      
      if (Math.abs(gestureState.dx) > screenWidth * 0.3 || Math.abs(gestureState.vx) > 0.5) {
        // Swipe away
        const direction = gestureState.dx > 0 ? 1 : -1;
        Animated.timing(position, {
          toValue: { x: direction * screenWidth * 1.5, y: gestureState.dy * 0.5 },
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          handleSwipe(direction > 0 ? 'like' : 'pass');
        });
      } else {
        // Return to center
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const handleSwipe = (action: 'like' | 'pass') => {
    console.log(`${action}: ${profiles[currentIndex]?.name}`);
    setCurrentIndex(prev => prev + 1);
    position.setValue({ x: 0, y: 0 });
  };

  const handleButtonPress = (action: 'like' | 'pass') => {
    const direction = action === 'like' ? 1 : -1;
    Animated.timing(position, {
      toValue: { x: direction * screenWidth * 1.5, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      handleSwipe(action);
    });
  };

  const currentProfile = profiles[currentIndex];

  if (!currentProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No More Profiles!</Text>
          <Text style={styles.emptySubtitle}>Check back later for new potential roommates</Text>
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
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                {
                  scale: position.x.interpolate({
                    inputRange: [-screenWidth, 0, screenWidth],
                    outputRange: [0.8, 1, 0.8],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Image source={{ uri: currentProfile.image }} style={styles.profileImage} />
          <View style={styles.cardOverlay}>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{currentProfile.name}, {currentProfile.age}</Text>
              <Text style={styles.budget}>Budget: {currentProfile.budget}</Text>
              <Text style={styles.location}>📍 {currentProfile.location}</Text>
              <Text style={styles.bio}>{currentProfile.bio}</Text>
              
              <View style={styles.interestsContainer}>
                <Text style={styles.interestsTitle}>Interests:</Text>
                <View style={styles.interestsList}>
                  {currentProfile.interests.map((interest, index) => (
                    <View key={index} style={styles.interestTag}>
                      <Text style={styles.interestText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
      
      <View style={styles.actionButtons}>
        <Animated.View 
          style={[styles.actionButton, styles.passButton]}
          onTouchEnd={() => handleButtonPress('pass')}
        >
          <Text style={styles.actionButtonText}>✕</Text>
        </Animated.View>
        <Animated.View 
          style={[styles.actionButton, styles.likeButton]}
          onTouchEnd={() => handleButtonPress('like')}
        >
          <Text style={styles.actionButtonText}>♥</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 5,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: screenWidth - 40,
    height: screenHeight * 0.7,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardOverlay: {
    flex: 1,
    padding: 20,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 5,
  },
  budget: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 22,
    marginBottom: 15,
  },
  interestsContainer: {
    marginTop: 'auto',
  },
  interestsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  interestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 14,
    color: '#1C1C1E',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 40,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  passButton: {
    backgroundColor: '#FF3B30',
  },
  likeButton: {
    backgroundColor: '#34C759',
  },
  actionButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
