import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

const COLORS = {
  saffron: '#e07b39',
  cream: '#fdf6ec',
  earth: '#2d1f0f',
};

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigation.replace('MainTabs');
    } else {
      navigation.replace('Auth');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AngadiBazar</Text>
      <Text style={styles.subtitle}>Your Local Marketplace</Text>
      <ActivityIndicator size="large" color={COLORS.saffron} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.saffron,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.earth,
    marginTop: 8,
  },
  loader: {
    marginTop: 40,
  },
});
