import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { supabase } from '../lib/supabase';

const COLORS = {
  saffron: '#e07b39',
  deep: '#b5470f',
  cream: '#fdf6ec',
  earth: '#2d1f0f',
  muted: '#9b7a5a',
};

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);
    setPhone(user.phone || '');

    const { data } = await supabase
      .from('profiles')
      .select('name, phone')
      .eq('id', user.id)
      .single();
    if (data) {
      setName(data.name || '');
      if (data.phone) setPhone(data.phone);
    }
  }

  async function saveProfile() {
    if (!name) {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, name, phone }, { onConflict: 'id' });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Saved', 'Profile updated successfully.');
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigation.replace('Auth');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Your name"
        placeholderTextColor={COLORS.muted}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={[styles.input, styles.disabled]}
        value={phone}
        editable={false}
      />

      <TouchableOpacity
        style={[styles.saveButton, loading && styles.opacity]}
        onPress={saveProfile}
        disabled={loading}
      >
        <Text style={styles.saveText}>{loading ? 'Saving...' : 'Save Profile'}</Text>
      </TouchableOpacity>

      <View style={styles.links}>
        <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
          <Text style={styles.link}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('DeleteAccount')}>
          <Text style={[styles.link, styles.danger]}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  content: {
    padding: 20,
    paddingTop: 50,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.earth,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.earth,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.earth,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8ddd0',
  },
  disabled: {
    backgroundColor: '#f5f0e8',
    color: COLORS.muted,
  },
  saveButton: {
    backgroundColor: COLORS.saffron,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  opacity: {
    opacity: 0.6,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  links: {
    marginTop: 30,
    gap: 16,
  },
  link: {
    color: COLORS.deep,
    fontSize: 15,
    fontWeight: '500',
  },
  danger: {
    color: '#d32f2f',
  },
  signOutButton: {
    marginTop: 30,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  signOutText: {
    color: '#d32f2f',
    fontSize: 15,
    fontWeight: '600',
  },
});
