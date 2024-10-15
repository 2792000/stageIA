import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen({ navigation }) {
  const [recording, setRecording] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [recordedUri, setRecordedUri] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [weight, setWeight] = useState('');
  const [sex, setSex] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Icon name="home" size={24} color="black" />
          <Text style={styles.headerTitle}>Home</Text>
        </View>
      ),
    });
  }, [navigation]);

  const validateFields = () => {
    if (!name || !surname || !day || !month || !year || !sex || !medicalHistory) {
      Alert.alert('Tous les champs doivent être remplis');
      return False;
    }
    return true;
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission d\'accès à l\'enregistrement audio refusée');
        return;
      }

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      setIsPaused(false);

      const id = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
      setIntervalId(id);
    } catch (err) {
      console.error('Échec du démarrage de l\'enregistrement', err);
    }
  };

  const pauseRecording = async () => {
    try {
      if (recording && !isPaused) {
        await recording.pauseAsync();
        setIsPaused(true);
        clearInterval(intervalId);
      } else if (recording && isPaused) {
        await recording.startAsync();
        setIsPaused(false);
        const id = setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);
        setIntervalId(id);
      }
    } catch (err) {
      console.error('Échec de la pause/reprise de l\'enregistrement', err);
    }
  };

  const stopRecording = async () => {
    if (!validateFields()) return;
  
    try {
      setRecording(null);
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Enregistrement arrêté et stocké à', uri);
  
        const fileInfo = await FileSystem.getInfoAsync(uri);
        const newUri = FileSystem.documentDirectory + fileInfo.uri.split('/').pop().replace('.m4a', '.wav');
        await FileSystem.moveAsync({
          from: uri,
          to: newUri
        });
        console.log('Enregistrement sauvegardé à', newUri);
        setRecordedUri(newUri);
  
        navigation.navigate('Save', { recordedUri: newUri, name, surname, day, month, year, weight, sex, medicalHistory });
      }
  
      clearInterval(intervalId);
      setRecordingDuration(0);
    } catch (err) {
      console.error('Échec de l\'arrêt de l\'enregistrement', err);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consultation Medicale</Text>
      <Image 
        style={styles.image}
        source={require('./assets/logo.png')} // Correct path to the local image
      />
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
      <View style={styles.dateContainer}>
        <TextInput
          style={styles.dateInput}
          placeholder="Jour"
          value={day}
          onChangeText={setDay}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.dateInput}
          placeholder="Mois"
          value={month}
          onChangeText={setMonth}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.dateInput}
          placeholder="Année"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Poids"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <View style={styles.radioContainer}>
        <Text>Sexe:</Text>
        <View style={styles.radioGroup}>
          <RadioButton
            value="Masculin"
            status={sex === 'Masculin' ? 'checked' : 'unchecked'}
            onPress={() => setSex('Masculin')}
          />
          <Text>Masculin</Text>
        </View>
        <View style={styles.radioGroup}>
          <RadioButton
            value="Féminin"
            status={sex === 'Féminin' ? 'checked' : 'unchecked'}
            onPress={() => setSex('Féminin')}
          />
          <Text>Féminin</Text>
        </View>
      </View>
      <TextInput
        style={styles.textArea}
        placeholder="Historique médical"
        value={medicalHistory}
        onChangeText={setMedicalHistory}
        multiline={true}
        numberOfLines={4}
      />
      <View style={styles.recordContainer}>
        <TouchableOpacity onPress={startRecording} disabled={!!recording}>
          <Icon name="microphone" size={40} color={recording ? "gray" : "red"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={pauseRecording} disabled={!recording}>
          <Icon name="pause" size={40} color={recording ? "black" : "gray"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={stopRecording} disabled={!recording}>
          <Icon name="stop" size={40} color={recording ? "black" : "gray"} />
        </TouchableOpacity>
      </View>
      {recording && <Text style={styles.timer}>{formatTime(recordingDuration)}</Text>}

      
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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  dateInput: {
    width: '30%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
  },
  textArea: {
    width: '100%',
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  recordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  timer: {
    marginTop: 10,
    fontSize: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
