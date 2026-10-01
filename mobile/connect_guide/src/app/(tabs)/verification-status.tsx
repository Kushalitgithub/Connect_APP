import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TopStatusBar } from '../../lib/design-system/TopStatusBar';
import { BottomNav } from '../../lib/design-system/BottomNav';
import { Button as CustomButton } from '../../lib/design-system/Button';
import { StatusChip } from '../../lib/design-system/StatusChip';
import { Card } from '../../lib/design-system/Card';
import { colors, withOpacity } from '../../lib/design-system/tokens';

interface VerificationStatusData {
  verification_status: 'pending' | 'approved' | 'rejected';
  bio: string | null;
  id_document_url: string | null;
  license_document_url: string | null;
  rating_avg: number;
  latest_action: {
    action: string;
    reason: string | null;
    created_at: string;
  } | null;
}

export default function VerificationStatusPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusData, setStatusData] = useState<VerificationStatusData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchVerificationStatus = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const accessToken = await SecureStore.getItemAsync('access_token');
      if (!accessToken) {
        Alert.alert('Error', 'Not authenticated. Please login again.');
        router.replace('/(auth)/login');
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/guide/me/verification-status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          Alert.alert('Session Expired', 'Please login again.');
          router.replace('/(auth)/login');
          return;
        }
        throw new Error('Failed to fetch verification status');
      }

      const data = await response.json();
      setStatusData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load verification status');
      Alert.alert('Error', err.message || 'Failed to load verification status');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const onRefresh = () => {
    fetchVerificationStatus(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <MaterialCommunityIcons name="check-circle" size={64} color={colors.statusChipText.accepted} />;
      case 'rejected':
        return <MaterialCommunityIcons name="close-circle" size={64} color={colors.error} />;
      case 'pending':
      default:
        return <MaterialCommunityIcons name="clock-outline" size={64} color={colors.pending} />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          title: 'Verification Approved',
          message: 'Congratulations! Your guide profile has been verified. You can now start offering tours.',
        };
      case 'rejected':
        return {
          title: 'Verification Rejected',
          message: 'Your verification was not approved. Please review the reason below and resubmit your documents.',
        };
      case 'pending':
      default:
        return {
          title: 'Verification Pending',
          message: 'Your documents are being reviewed by our team. This typically takes 1-2 business days.',
        };
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 16, color: colors.textSecondary }}>Loading verification status...</Text>
      </View>
    );
  }

  if (!statusData) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <TopStatusBar title="Verification Status" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <Text style={{ marginTop: 16, fontSize: 18, fontWeight: '600', color: colors.textPrimary }}>
            Failed to Load
          </Text>
          <Text style={{ marginTop: 8, color: colors.textSecondary, textAlign: 'center' }}>
            {error || 'Unable to load verification status'}
          </Text>
          <Button onPress={() => fetchVerificationStatus()} title="Retry" style={{ marginTop: 20 }}>
            Retry
          </Button>
        </View>
        <BottomNav />
      </View>
    );
  }

  const statusInfo = getStatusMessage(statusData.verification_status);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopStatusBar title="Verification Status" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Status Icon and Title */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          {getStatusIcon(statusData.verification_status)}
          <Text style={{ marginTop: 16, fontSize: 24, fontWeight: 'bold', color: colors.textPrimary }}>
            {statusInfo.title}
          </Text>
          <View style={{ marginTop: 12 }}>
            <StatusChip
              status={statusData.verification_status === 'approved' ? 'accepted' : statusData.verification_status as any}
            >
              {statusData.verification_status.toUpperCase()}
            </StatusChip>
          </View>
        </View>

        {/* Status Message */}
        <Card style={{ marginBottom: 20, padding: 16 }}>
          <Text style={{ fontSize: 16, color: colors.textSecondary, lineHeight: 24 }}>
            {statusInfo.message}
          </Text>
        </Card>

        {/* Rejection Reason (if rejected) */}
        {statusData.verification_status === 'rejected' && statusData.latest_action?.reason && (
          <Card style={{ marginBottom: 20, padding: 16, backgroundColor: withOpacity(colors.error, 0.1), borderColor: colors.error, borderWidth: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <MaterialCommunityIcons name="information" size={24} color={colors.error} style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.error, marginBottom: 8 }}>
                  Reason for Rejection
                </Text>
                <Text style={{ fontSize: 14, color: colors.textPrimary, lineHeight: 20 }}>
                  {statusData.latest_action.reason}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Profile Information */}
        <Card style={{ marginBottom: 20, padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>
            Profile Information
          </Text>

          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 4 }}>Bio</Text>
            <Text style={{ fontSize: 16, color: colors.textPrimary }}>
              {statusData.bio || 'Not provided'}
            </Text>
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 4 }}>ID Document</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons
                name={statusData.id_document_url ? "check-circle" : "close-circle"}
                size={20}
                color={statusData.id_document_url ? colors.statusChipText.accepted : colors.textMuted}
              />
              <Text style={{ fontSize: 16, color: colors.textPrimary, marginLeft: 8 }}>
                {statusData.id_document_url ? 'Uploaded' : 'Not uploaded'}
              </Text>
            </View>
          </View>

          <View>
            <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 4 }}>License Document</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons
                name={statusData.license_document_url ? "check-circle" : "close-circle"}
                size={20}
                color={statusData.license_document_url ? colors.statusChipText.accepted : colors.textMuted}
              />
              <Text style={{ fontSize: 16, color: colors.textPrimary, marginLeft: 8 }}>
                {statusData.license_document_url ? 'Uploaded' : 'Not uploaded'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        {statusData.verification_status === 'rejected' && (
          <CustomButton
            onPress={() => router.push('/(onboarding)/profile-info')}
            title="Update Profile & Resubmit"
            className="mb-4"
          >
            Update Profile & Resubmit
          </CustomButton>
        )}

        {statusData.verification_status === 'pending' && (
          <Text style={{ textAlign: 'center', color: colors.textMuted, fontSize: 14, marginTop: 8 }}>
            Pull down to refresh status
          </Text>
        )}

        {/* Timestamp */}
        {statusData.latest_action?.created_at && (
          <Text style={{ textAlign: 'center', color: colors.textMuted, fontSize: 12, marginTop: 20 }}>
            Last updated: {new Date(statusData.latest_action.created_at).toLocaleString()}
          </Text>
        )}
      </ScrollView>
      <BottomNav />
    </View>
  );
}
