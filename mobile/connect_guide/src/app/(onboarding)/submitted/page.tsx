import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { BottomNav } from '../../lib/design-system/BottomNav';
import { TopStatusBar } from '../../lib/design-system/TopStatusBar;
import { Button as CustomButton } from '../../lib/design-system/Button;
import { VerifiedBadge } from '../../lib/design-system/VerifiedBadge';
import { RatingStars } from '../../lib/design-system/RatingStars';
import { StatusChip } from '../../lib/design-system/StatusChip';
import { colors } from '../../lib/design-system/tokens';

export default function SubmittedPage() {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<string>('pending');

  useEffect(() => {
    // Check verification status from secure storage (in a real app, this would come from backend)
    const checkVerificationStatus = async () => {
      try {
        // In a real app, we would fetch this from the backend after submission
        // For now, we'll simulate it being pending initially
        setVerificationStatus('pending');
      } catch (err) {
        console.error('Failed to check verification status', err);
      }
    };

    checkVerificationStatus();
  }, []);

  const handleCheckStatus = async () => {
    // In a real app, this would make an API call to check verification status
    // For demo purposes, we'll randomly set it to approved after a delay
    setVerificationStatus('approved');

    // Navigate to dashboard after a short delay to simulate checking
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
      <TopStatusBar title="Verification Status" leftAction={() => router.back()} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
          Verification Submitted
        </Text>

        <View style={{ backgroundColor: colors.surfaceAlt, padding: 20, borderRadius: 16, width: '80%', alignItems: 'center' }}>
          <VerifiedBadge size="lg" />
          <Text style={{ marginTop: 12, fontSize: 18, fontWeight: '600', color: colors.textPrimary }}>
            Your documents have been submitted
          </Text>
          <Text style={{ marginTop: 6, color: colors.textMuted, textAlign: 'center' }}>
            Our team will review your verification documents. You'll be notified once the review is complete.
          </Text>

          <View style={{ marginTop: 20, width: '100%' }}>
            <StatusChip status={verificationStatus as any} className="mb-2">
              {verificationStatus.toUpperCase()}
            </StatusChip>
            {verificationStatus === 'pending' && (
              <Text style={{ textAlign: 'center', color: colors.textMuted }}>
                Review typically takes 1-2 business days
              </Text>
            )}
          </View>
        </View>

        <CustomButton
          title="Check Status"
          onPress={handleCheckStatus}
          className="mt-6"
        >
          Check Status
        </CustomButton>
      </View>
      <BottomNav />
    </View>
  );
}