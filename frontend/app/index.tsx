import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');

export default function Home() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  // Create Google Maps embed URL with iframe
  const getMapUrl = () => {
    const lat = location?.coords.latitude || 37.78825;
    const lng = location?.coords.longitude || -122.4324;
    const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey || 'YOUR_GOOGLE_MAPS_API_KEY';
    
    // Create HTML with iframe for Google Maps Embed API
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; }
            iframe { width: 100%; height: 100%; border: none; }
          </style>
        </head>
        <body>
          <iframe 
            src="https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${lat},${lng}&zoom=15"
            allowfullscreen>
          </iframe>
        </body>
      </html>
    `;
    
    return html;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Roommate Finder</Text>
        <Text style={styles.subtitle}>Find your perfect roommate match today</Text>
        
        <View style={styles.mapContainer}>
          <WebView
            style={styles.map}
            source={{ html: getMapUrl() }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
          />
        </View>
        
        {errorMsg && (
          <Text style={styles.errorText}>{errorMsg}</Text>
        )}
        
        <Text style={styles.note}>
          Note: Add your Google Maps API key to see the map
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  mapContainer: {
    width: width - 40,
    height: width - 40, // Makes it square
    alignSelf: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  map: {
    flex: 1,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  note: {
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 12,
    fontStyle: 'italic',
  },
});

