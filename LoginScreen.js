import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = () => {
    if (!validateEmail(email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide.');
      return;
    }

    axios.post('http://192.168.1.17:5000/login', {
      email,
      password
    })
    .then(response => {
      //Alert.alert('Succès', response.data.message);
      // Navigate to home screen or dashboard after login
      navigation.navigate('Splash');
    })
    .catch(error => {
      Alert.alert('Erreur', error.response.data.error || 'Une erreur s\'est produite');
    });
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('./assets/big_logo.png')}  // Ensure the correct path to your logo
        style={styles.logo}
      />
      <Text style={styles.title}>Connexion Admin</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Se connecter" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>Vous n'avez pas de compte ? Inscrivez-vous</Text>
      </TouchableOpacity>

      {/* Lien pour mot de passe oublié */}
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  signupText: {
    marginTop: 20,
    fontSize: 16,
    color: '#007BFF',
    textAlign: 'center',
  },
  forgotPasswordText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
  },
});
