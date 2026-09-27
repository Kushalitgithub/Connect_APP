import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { BottomNav } from '../../lib/design-system/BottomNav';
import { TopStatusBar } from '../../lib/design-system/TopStatusBar';
import { Input } from '../../lib/design-system/Input';
import { Button as CustomButton } from '../../lib/design-system/Button';
import { colors } from '../../lib/design-system/tokens';

export default function ProfileInfoPage() {
  const router = useRouter();
  const [bio, setBio] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [languages, setLanguages] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!bio || !specialty || !languages || !pricePerDay) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Store the profile info temporarily (in a real app, we would send to backend)
      // For now, we'll just store in SecureStore as a JSON string
      const profileInfo = { bio, specialty, languages, pricePerDay: Number(pricePerDay) };
      await SecureStore.setItemAsync('guide_profile_info', JSON.stringify(profileInfo));

      // Navigate to the next step
      router.push('/(onboarding)/document-upload');
    } catch (err: any) {
      Alert.alert('Error', 'Failed to save profile info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
      <TopStatusBar title="Profile Info" leftAction={() => router.back()} />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
          Tell us about yourself
        </Text>
        <Input
          placeholder="Bio (e.g., Experienced trekking guide)"
          value={bio}
          onChangeText={setBio}
          className="mb-4"
        />
        <Input
          placeholder="Specialty (e.g., Trekking, Cultural, Adventure)"
          value={specialty}
          onChangeText={setSpecialty}
          className="mb-4"
        />
        <Input
          placeholder="Languages (e.g., English, Nepali, Hindi)"
          value={languages}
          onChangeText={setLanguages}
          className="mb-4"
        />
        <Input
          placeholder="Price per day (in USD)"
          value={pricePerDay}
          onChangeText={setPricePerDay}
          keyboardType="numeric"
          className="mb-6"
        />
        <CustomButton
          title={loading ? 'Saving...' : 'Continue to Document Upload'}
          onPress={handleContinue}
          disabled={loading}
          className="mb-4"
        >
          {loading ? 'Saving...' : 'Continue to Document Upload'}
        </CustomButton>
      </View>
      <BottomNav />
    </View>
  );
}