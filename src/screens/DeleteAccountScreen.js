import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';

const COLORS = {
  cream: '#fdf6ec',
  earth: '#2d1f0f',
  muted: '#9b7a5a',
};

export default function DeleteAccountScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all your listings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              // Delete user's listings
              await supabase.from('listings').delete().eq('user_id', user.id);
              // Delete user's profile
              await supabase.from('profiles').delete().eq('id', user.id);
              // Sign out
              await supabase.auth.signOut();
            }
            setLoading(false);
            navigation.replace('Auth');
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Delete Account</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.warning}>
          Deleting your account will permanently remove:
        </Text>
        <Text style={styles.item}>- Your profile information</Text>
        <Text style={styles.item}>- All your listings</Text>
        <Text style={styles.item}>- Your uploaded images</Text>
        <Text style={styles.note}>This action cannot be undone.</Text>

        <TouchableOpacity
          style={[styles.deleteButton, loading && styles.disabled]}
          onPress={handleDelete}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.deleteText}>Delete My Account</Text>
          )}
        </TouchableOpacity>
      </View>
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
    paddingTop: 30,
  },
  warning: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.earth,
    marginBottom: 16,
  },
  item: {
    fontSize: 15,
    color: COLORS.earth,
    marginBottom: 6,
    lineHeight: 22,
  },
  note: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 30,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  deleteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
