import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function SplashScreen({ navigation }) {
  const handleLogout = () => {
    // Handle logout logic here, e.g., clearing user data, navigating to login screen
    navigation.navigate('Login'); // Replace 'Login' with your login screen name
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <Image 
        style={styles.logo}
        source={require('./assets/big_logo.png')} // Correct path to the local image
      />
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Start a Consultation</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PatientList')}
      >
        <Text style={styles.buttonText}>View Patient List</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 50,
  },
  button: {
    width: '80%', // Set a fixed width for all buttons
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center', // Center the text inside the button
    marginVertical: 10, // Space between buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  logoutButton: {
    position: 'absolute', // Position the logout button absolutely
    top: 40, // Adjust the top position
    left: 20, // Adjust the left position
    backgroundColor: 'transparent', // Make the background transparent
  },
  logoutText: {
    color: '#ff0000', // Color for the logout text
    fontSize: 16, // Font size for the logout text
  },
});
