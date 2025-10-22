import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Switch,
  Alert,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function Profile() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    age: '25',
    bio: 'Software engineer who loves hiking and cooking. Looking for a clean, quiet roommate.',
    budget: '800-1200',
    location: 'Downtown',
    interests: ['Coding', 'Hiking', 'Cooking', 'Photography'],
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    isStudent: false,
    hasPets: false,
    smokes: false,
    nightOwl: false,
    cleanFreak: true,
    social: true,
  });

  const [editingField, setEditingField] = useState<string | null>(null);

  const handleSave = () => {
    Alert.alert('Profile Updated', 'Your profile has been saved successfully!');
  };

  const handleImagePress = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera') },
        { text: 'Photo Library', onPress: () => console.log('Photo Library') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = profile.interests;
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    
    setProfile({ ...profile, interests: newInterests });
  };

  const availableInterests = [
    'Coding', 'Hiking', 'Cooking', 'Photography', 'Music', 'Art', 'Sports',
    'Gaming', 'Reading', 'Travel', 'Fitness', 'Yoga', 'Movies', 'Coffee',
    'Wine', 'Crafting', 'Gardening', 'Dancing', 'Writing', 'Volunteering'
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Your Profile</Text>
            <Text style={styles.subtitle}>Customize your roommate preferences</Text>
          </View>

          {/* Profile Photo Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Photo</Text>
            <TouchableOpacity style={styles.imageContainer} onPress={handleImagePress}>
              <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
              <View style={styles.imageOverlay}>
                <Text style={styles.imageOverlayText}>Tap to change</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
                placeholder="Enter your name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.input}
                value={profile.age}
                onChangeText={(text) => setProfile({ ...profile, age: text })}
                placeholder="Enter your age"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={profile.bio}
                onChangeText={(text) => setProfile({ ...profile, bio: text })}
                placeholder="Tell potential roommates about yourself"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Living Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Living Preferences</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Budget Range ($)</Text>
              <TextInput
                style={styles.input}
                value={profile.budget}
                onChangeText={(text) => setProfile({ ...profile, budget: text })}
                placeholder="e.g., 800-1200"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Preferred Location</Text>
              <TextInput
                style={styles.input}
                value={profile.location}
                onChangeText={(text) => setProfile({ ...profile, location: text })}
                placeholder="e.g., Downtown, Midtown"
              />
            </View>
          </View>

          {/* Lifestyle Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lifestyle Preferences</Text>
            
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Student</Text>
              <Switch
                value={profile.isStudent}
                onValueChange={(value) => setProfile({ ...profile, isStudent: value })}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor={profile.isStudent ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Has Pets</Text>
              <Switch
                value={profile.hasPets}
                onValueChange={(value) => setProfile({ ...profile, hasPets: value })}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor={profile.hasPets ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Smokes</Text>
              <Switch
                value={profile.smokes}
                onValueChange={(value) => setProfile({ ...profile, smokes: value })}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor={profile.smokes ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Night Owl</Text>
              <Switch
                value={profile.nightOwl}
                onValueChange={(value) => setProfile({ ...profile, nightOwl: value })}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor={profile.nightOwl ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Clean Freak</Text>
              <Switch
                value={profile.cleanFreak}
                onValueChange={(value) => setProfile({ ...profile, cleanFreak: value })}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor={profile.cleanFreak ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Social</Text>
              <Switch
                value={profile.social}
                onValueChange={(value) => setProfile({ ...profile, social: value })}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor={profile.social ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>

          {/* Interests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests & Hobbies</Text>
            <Text style={styles.sectionSubtitle}>Tap to add or remove interests</Text>
            
            <View style={styles.interestsContainer}>
              {availableInterests.map((interest, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.interestTag,
                    profile.interests.includes(interest) && styles.interestTagSelected
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text style={[
                    styles.interestText,
                    profile.interests.includes(interest) && styles.interestTextSelected
                  ]}>
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </TouchableOpacity>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
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
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 15,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E5EA',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    paddingVertical: 8,
  },
  imageOverlayText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#1C1C1E',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 5,
  },
  switchLabel: {
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestTag: {
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
  },
  interestTagSelected: {
    backgroundColor: '#007AFF',
  },
  interestText: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  interestTextSelected: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 40,
  },
});
