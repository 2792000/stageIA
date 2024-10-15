import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';


export default function PatientDetailsScreen({ route, navigation }) {
  const { patientId } = route.params; // Get the patient ID from route params
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.1.17:5000/patient/${patientId}`);
        setPatient(response.data);
      } catch (error) {
        console.error("Error fetching patient details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [patientId]);



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.container}>
        <Text>Patient not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Details</Text>
      <Text style={styles.label}>Name: <Text style={styles.info}>{patient.name}</Text></Text>
      <Text style={styles.label}>Surname: <Text style={styles.info}>{patient.surname}</Text></Text>
      <Text style={styles.label}>Date of Birth: <Text style={styles.info}>{patient.birthdate}</Text></Text>
      <Text style={styles.label}>Weight: <Text style={styles.info}>{patient.weight} kg</Text></Text>
      <Text style={styles.label}>Sex: <Text style={styles.info}>{patient.sex}</Text></Text>
      <Text style={styles.label}>Medical History: <Text style={styles.info}>{patient.medicalHistory}</Text></Text>
      <Text style={styles.label}>Last Consultation Date: <Text style={styles.info}>{patient.recordDate}</Text></Text>
      <Text style={styles.label}>Transcription: {patient.transcription}</Text>

      {/* Button to play audio */}
      <Button title="Listen to Recording" disabled/>

      {/* Navigation button to RecordScreen */}
      <Button title="new Consultation" onPress={() => navigation.navigate('RecordScreen', {
        name: patient.name,
        surname: patient.surname,
        day: patient.birthdate.split('-')[2], // Assuming birthdate is in YYYY-MM-DD format
        month: patient.birthdate.split('-')[1], // Extract month
        year: patient.birthdate.split('-')[0], // Extract year
        weight: patient.weight,
        sex: patient.sex,
        medicalHistory: patient.medicalHistory
      })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 18,
    marginVertical: 5,
    color: '#555',
  },
  info: {
    fontSize: 18,
    marginVertical: 5,
    color: '#FF0000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
