import React, { useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomNav } from '../../lib/design-system/BottomNav';
import { TopStatusBar } from '../../lib/design-system/TopStatusBar;
import { Input } from '../../lib/design-system/Input';
import { Button as CustomButton } from '../../lib/design-system/Button';
import { colors } from '../../lib/design-system/tokens';

// In a real app, we would use expo-document-picker or expo-image-picker to pick a file.
// For this example, we'll simulate the file pick by allowing the user to enter a file URI or using a placeholder.
// We'll also simulate the upload to private object storage by just storing the URI locally.

export default function DocumentUploadPage() {
  const router = useRouter();
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Simulate picking a file (in a real app, this would open the file picker)
  const pickFile = async () => {
    // For demonstration, we'll set a placeholder file.
    // In a real app, you would use:
    //   const result = await DocumentPicker.getDocumentAsync({});
    //   setFileUri(result.uri);
    //   setFileName(result.name);
    setFileUri('https://example.com/document.pdf');
    setFileName('guide_verification_document.pdf');
  };

  const handleUpload = async () => {
    if (!fileUri) {
      Alert.alert('Error', 'Please pick a document first');
      return;
    }

    setUploading(true);
    try {
      // In a real app, we would upload the file to a private object storage (like S3) and get a URL.
      // For this example, we'll just store the file URI locally (simulating successful upload).
      await SecureStore.setItemAsync('guide_document_uri', fileUri);
      await SecureStore.setItemAsync('guide_document_name', fileName);

      // After uploading, we can go to the submitted state.
      router.replace('/(onboarding)/submitted');
    } catch (err: any) {
      Alert.alert('Upload Failed', 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
      <TopStatusBar title="Document Upload" leftAction={() => router.back()} />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
          Upload Verification Document
        </Text>
        <Text style={{ textAlign: 'center', marginBottom: 10 }}>
          Please upload a valid identification document (e.g., passport, driver's license) or any other required verification document.
        </Text>

        {fileName ? (
          <View style={{ backgroundColor: colors.surfaceAlt, padding: 15, borderRadius: 8, marginVertical: 10 }}>
            <MaterialCommunityIcons name="attachment" size={24} color={colors.primary} style={{ marginRight: 10 }} />
            <Text>{fileName}</Text>
          </View>
        ) : (
          <View style={{ borderWidth: 2, borderStyle: 'dashed', borderColor: colors.border, borderRadius: 12, padding: 40, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name="cloud-upload" size={48} color={colors.textMuted} />
            <Text style={{ marginTop: 10, color: colors.textSecondary }}>Tap to pick a document</Text>
          </View>
        )}

        <Button
          title="Pick Document"
          onPress={pickFile}
          disabled={uploading}
          className="mb-4"
        />

        <CustomButton
          title={uploading ? 'Uploading...' : 'Upload Document'}
          onPress={handleUpload}
          disabled={uploading || !fileUri}
          className="mb-4"
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </CustomButton>

        <Button
          title="Skip for now"
          onPress={() => router.replace('/(onboarding)/submitted')}
          color="link"
        />
      </View>
      <BottomNav />
    </View>
  );
}