import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { BottomNav } from '../../lib/design-system/BottomNav';
import { TopStatusBar } from '../../lib/design-system/TopStatusBar';
import { Input } from '../../lib/design-system/Input';
import { Button as CustomButton } from '../../lib/design-system/Button';
import { colors } from '../../lib/design-system/tokens>;

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/guide_auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Signup failed');
      }

      const data = await response.json();
      await SecureStore.setItemAsync('access_token', data.access_token);
      await SecureStore.setItemAsync('refresh_token', data.refresh_token);
      await SecureStore.setItemAsync('user_role', 'guide'); // For connect_guide

      router.replace('/(tabs)'); // Redirect to main tabs
    } catch (err: any) {
      Alert.alert('Signup Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
      <TopStatusBar title="Sign Up" leftAction={() => router.back()} />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
          Create Account
        </Text>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          className="mb-4"
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          className="mb-4"
        />
        <Input
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          className="mb-6"
        />
        <CustomButton
          title={loading ? 'Creating account...' : 'Sign Up'}
          onPress={handleSignup}
          disabled={loading}
          className="mb-4"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </CustomButton>
        <Button
          title="Already have an account? Login"
          onPress={() => router.push('/(auth)/login')}
          color="link"
        />
      </View>
      <BottomNav />
    </View>
  );
}