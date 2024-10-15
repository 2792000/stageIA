import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateBirthdate = (birthdate) => {
    const re = /^\d{4}-\d{2}-\d{2}$/;
    return re.test(birthdate);
  };

  const handleSignup = () => {
    if (!validateEmail(email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide.');
      return;
    }

    if (!validateBirthdate(birthdate)) {
      Alert.alert('Erreur', 'Veuillez entrer une date de naissance valide au format AAAA-MM-JJ.');
      return;
    }

    axios.post('http://192.168.1.17:5000/signup', {
      name,
      surname,
      email,
      specialty,
      password,
      birthdate
    })
    .then(response => {
      Alert.alert('Succès', response.data.message);
      navigation.navigate('Login');
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
      <Text style={styles.title}>Inscription Admin</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={surname}
        onChangeText={setSurname}
      />
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
        placeholder="Spécialité"
        value={specialty}
        onChangeText={setSpecialty}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Date de naissance (AAAA-MM-JJ)"
        value={birthdate}
        onChangeText={setBirthdate}
      />
      <Button title="S'inscrire" onPress={handleSignup} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Vous avez déjà un compte ? Connectez-vous</Text>
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
  loginText: {
    marginTop: 20,
    fontSize: 16,
    color: '#007BFF',
    textAlign: 'center',
  },
});
