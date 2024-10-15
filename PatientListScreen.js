import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import axios from 'axios';

export default function PatientListScreen({ navigation }) {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]); // New state for filtered patients
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  useEffect(() => {
    fetchPatients();
  }, []);

  // Function to fetch the patients from the API
  const fetchPatients = () => {
    setLoading(true);
    axios.get('http://192.168.1.17:5000/patients')
      .then(response => {
        setPatients(response.data);
        setFilteredPatients(response.data); // Set both patients and filtered patients initially
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the patients!", error);
        setLoading(false);
      });
  };

  // Handle search logic
  const handleSearch = (text) => {
    setSearchTerm(text);

    if (text === '') {
      setFilteredPatients(patients); // If search is empty, show all patients
    } else {
      const filteredData = patients.filter(patient => 
        patient.name.toLowerCase().includes(text.toLowerCase()) || 
        patient.surname.toLowerCase().includes(text.toLowerCase()) ||
        patient.birthdate.includes(text) ||   // Search by birthdate
        patient.recordDate.includes(text)     // Search by recordDate
      );
      setFilteredPatients(filteredData);
    }
  };

  // Confirmation alert before deleting a patient
  function confirmDelete(patientId) {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this patient?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deletePatient(patientId),  // If confirmed, proceed to delete
          style: "destructive",
        }
      ]
    );
  }

  function deletePatient(patientId) {
    fetch(`http://192.168.1.17:5000/patients/${patientId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.log(data.message);  // Patient deleted successfully
            fetchPatients();  // Refresh the list
        } else {
            console.error(data.error);  // Handle errors
        }
    })
    .catch(error => console.error('Error:', error));
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Patients</Text>

      {/* Search input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher par nom, prénom, date de naissance ou date d'enregistrement..."
        value={searchTerm}
        onChangeText={handleSearch} // Update the list based on search
      />

      <FlatList
        data={filteredPatients}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.patientCard}>
            <Text style={styles.patientName}>{item.name} {item.surname}</Text>
            <Text>birthday: {item.birthdate}</Text>
         
            <Text>Sexe: {item.sex}</Text>
            <Text>Last Consultation Date: {item.recordDate}</Text>

            {/* Button to view details */}
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => {
                // Navigate to PatientDetailsScreen with patient data
                navigation.navigate('PatientDetailsScreen', {
                  patientId: item.id,
                });
              }}
            >
              <Text style={styles.detailsButtonText}>Voir détails</Text>
            </TouchableOpacity>

            {/* Button to delete the patient */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => confirmDelete(item.id)}  // Show confirmation before deleting
            >
              <Text style={styles.deleteButtonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  patientCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  detailsButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3D00',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
