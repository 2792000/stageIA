export default function UpdatePatientScreen({ route }) {
    const { name, surname, day, month, year, weight, sex, medicalHistory, transcription } = route.params;
  
    const [patientName, setPatientName] = useState(name);
    const [patientSurname, setPatientSurname] = useState(surname);
    const [patientDay, setPatientDay] = useState(day);
    const [patientMonth, setPatientMonth] = useState(month);
    const [patientYear, setPatientYear] = useState(year);
    const [patientWeight, setPatientWeight] = useState(weight);
    const [patientSex, setPatientSex] = useState(sex);
    const [patientMedicalHistory, setPatientMedicalHistory] = useState(medicalHistory);
    const [patientTranscription, setPatientTranscription] = useState(transcription || '');
  
    return (
      <View style={styles.container}>
        <Text>Update Patient Details</Text>
        {/* Other input fields here */}
        <TextInput
          style={styles.input}
          placeholder="Transcription"
          value={patientTranscription}
          onChangeText={setPatientTranscription}
        />
        {/* Rest of your UI to update patient */}
      </View>
    );
  }
  