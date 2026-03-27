import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const COLORS = {
  cream: '#fdf6ec',
  earth: '#2d1f0f',
  muted: '#9b7a5a',
};

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Privacy Policy</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.updated}>Last updated: March 2026</Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.body}>
          AngadiBazar collects the following information when you use our app:{'\n'}
          - Phone number (for authentication){'\n'}
          - Name (for your profile){'\n'}
          - Location data (to show nearby listings){'\n'}
          - Photos you upload for your listings
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.body}>
          We use your information to:{'\n'}
          - Authenticate your identity{'\n'}
          - Display your listings to other users{'\n'}
          - Show relevant nearby listings{'\n'}
          - Enable communication between buyers and sellers
        </Text>

        <Text style={styles.sectionTitle}>3. Data Storage</Text>
        <Text style={styles.body}>
          Your data is securely stored on Supabase servers. We do not sell or share your personal
          information with third parties.
        </Text>

        <Text style={styles.sectionTitle}>4. Your Rights</Text>
        <Text style={styles.body}>
          You can:{'\n'}
          - View and edit your profile information{'\n'}
          - Delete your listings at any time{'\n'}
          - Request deletion of your account and all associated data
        </Text>

        <Text style={styles.sectionTitle}>5. Contact</Text>
        <Text style={styles.body}>
          For questions about this privacy policy, contact us at support@angadibazar.com
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  back: {
    color: COLORS.earth,
    fontWeight: '600',
    fontSize: 15,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.earth,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  updated: {
    color: COLORS.muted,
    fontSize: 13,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.earth,
    marginTop: 18,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: COLORS.earth,
    lineHeight: 22,
  },
});
