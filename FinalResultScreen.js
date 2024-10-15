import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

export default function FinalResultScreen({ route }) {
  const { name, surname, day, month, year, weight, sex, medicalHistory, transcription } = route.params;

  const generatePDF = async () => {
    try {
      const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAA...'; // Replace with your base64 image data

      const html = `
        <h1>Résultat Final</h1>
        <img src="data:image/png;base64,${base64Image}" style="width:100px; height:100px;"/>
        <p><strong>Nom&Prénom:</strong> ${name} ${surname}</p>
        <p><strong>Date de naissance:</strong> ${day}/${month}/${year}</p>
        <p><strong>Poids:</strong> ${weight}</p>
        <p><strong>Sexe:</strong> ${sex}</p>
        <p><strong>Historique médical:</strong> ${medicalHistory}</p>
        <p><strong>Transcription (Résumé médical):</strong></p>
        <pre>${transcription}</pre>
      `;

      const options = {
        html,
        fileName: 'FinalResult',
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      Alert.alert('PDF Generated', `File saved to: ${file.filePath}`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };



const downloadPDF = async () => {
  try {
    // Call backend to generate the PDF
    const response = await fetch('http://192.168.1.17:5000/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name, 
        surname, 
        day, 
        month, 
        year, 
        weight, 
        sex, 
        medicalHistory, 
        transcription 
      }),
    });

    const responseText = await response.text();
    console.log('Server response:', responseText);

    // Ensure response is OK and contains JSON
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // Safely parse the JSON response
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (error) {
      throw new Error('Failed to parse server response');
    }

    const pdfUrl = `http://192.168.1.17:5000${result.pdf_url}`;

    // Download the PDF file
    const downloadResumable = FileSystem.createDownloadResumable(
      pdfUrl,
      FileSystem.documentDirectory + `${name}_${surname}_Result.pdf`
    );

    const { uri } = await downloadResumable.downloadAsync();
    Alert.alert('Download complete', `PDF downloaded to: ${uri}`);

    // Optionally share the PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    }
  } catch (error) {
    console.error('Error downloading PDF:', error.message);
    Alert.alert('Error', `Failed to download PDF: ${error.message}`);
  }
};

  





  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        style={styles.image}
        source={require('./assets/big_logo.png')} // Ensure this path is correct
      />
      <Text style={styles.title}>Résultat Final</Text>
      <Text style={styles.text}>Nom&Prénom: {name} {surname}</Text>
      <Text style={styles.text}>Date de naissance: {`${day}/${month}/${year}`}</Text>
      <Text style={styles.text}>Poids: {weight}</Text>
      <Text style={styles.text}>Sexe: {sex}</Text>
      <Text style={styles.text}>Historique médical: {medicalHistory}</Text>
      <Text style={styles.subtitle}>Transcription (Résumé médical):</Text>
      <Text style={styles.transcription}>{transcription}</Text>
      <Button title="Download PDF" onPress={downloadPDF} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  transcription: {
    fontSize: 16,
    marginBottom: 20,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});
