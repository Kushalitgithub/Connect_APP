import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, Text, Button, TextInput, Image, StyleSheet, Alert, FlatList } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://localhost:8000/api/v1';

export default function OnboardingScreen() {
  const [bio, setBio] = useState('');
  const [idDocument, setIdDocument] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [licenseDocument, setLicenseDocument] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickDocument = async (setDocumentFn: React.Dispatch<React.SetStateAction<{ uri: string; name: string; type: string } | null>>) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (!result.cancelled) {
        const name = result.uri.split('/').pop() || 'document';
        setDocumentFn({
          uri: result.uri,
          name,
          type: result.type || 'application/octet-stream',
        });
      }
    } catch (err) {
      Alert.alert('Error picking document', (err as Error).message);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const formData = new FormData();
      formData.append('bio', bio);

      if (idDocument) {
        formData.append('id_document', {
          uri: idDocument.uri,
          name: idDocument.name,
          type: idDocument.type,
        } as any);
      }

      if (licenseDocument) {
        formData.append('license_document', {
          uri: licenseDocument.uri,
          name: licenseDocument.name,
          type: licenseDocument.type,
        } as any);
      }

      const response = await fetch(`${API_URL}/guide/me/onboarding`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Note: Don't set Content-Type for FormData, it will be set automatically with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update profile');
      }

      const result = await response.json();
      Alert.alert('Success', result.message);
      // TODO: Navigate to home or profile screen after successful submission
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Please provide your bio and upload your identification and license documents
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Bio (optional)"
          multiline
          minHeight={80}
          value={bio}
          onChangeText={setBio}
        />

        <View style={styles.documentSection}>
          <Text style={styles.sectionTitle}>ID Document</Text>
          {idDocument ? (
            <View>
              <Text style={styles.documentName}>Selected: {idDocument.name}</Text>
              <Button title="Change ID Document" onPress={() => pickDocument(setIdDocument)} />
            </View>
          ) : (
            <Button title="Select ID Document" onPress={() => pickDocument(setIdDocument)} />
          )}
        </View>

        <View style={styles.documentSection}>
          <Text style={styles.sectionTitle}>License Document</Text>
          {licenseDocument ? (
            <View>
              <Text style={styles.documentName}>Selected: {licenseDocument.name}</Text>
              <Button title="Change License Document" onPress={() => pickDocument(setLicenseDocument)} />
            </View>
          ) : (
            <Button title="Select License Document" onPress={() => pickDocument(setLicenseDocument)} />
          )}
        </View>

        <Button
          title="Save Profile"
          disabled={isLoading}
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          {isLoading ? 'Saving...' : 'Save Profile'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  documentSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  documentName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});