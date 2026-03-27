import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { supabase } from '../lib/supabase';

const COLORS = {
  saffron: '#e07b39',
  deep: '#b5470f',
  cream: '#fdf6ec',
  earth: '#2d1f0f',
  muted: '#9b7a5a',
};

const CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Grains',
  'Spices',
  'Dairy',
  'Handmade',
  'Clothing',
  'Electronics',
  'Other',
];

export default function SellScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
      selectionLimit: 5 - images.length,
    });
    if (!result.canceled) {
      setImages([...images, ...result.assets.map((a) => a.uri)]);
    }
  }

  async function getLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is needed to tag your listing.');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    const [place] = await Location.reverseGeocodeAsync(loc.coords);
    if (place) {
      const name = [place.city, place.district, place.region].filter(Boolean).join(', ');
      setLocation(name);
    }
  }

  async function uploadImages(userId) {
    const urls = [];
    for (let i = 0; i < images.length; i++) {
      const uri = images[i];
      const ext = uri.split('.').pop();
      const fileName = `${userId}/${Date.now()}_${i}.${ext}`;
      const response = await fetch(uri);
      const blob = await response.blob();
      const { error } = await supabase.storage
        .from('listing-images')
        .upload(fileName, blob, { contentType: `image/${ext}` });
      if (!error) {
        const { data } = supabase.storage.from('listing-images').getPublicUrl(fileName);
        urls.push(data.publicUrl);
      }
    }
    return urls;
  }

  async function handleSubmit() {
    if (!title || !price || !category) {
      Alert.alert('Missing Fields', 'Please fill in title, price, and category.');
      return;
    }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert('Error', 'You must be logged in.');
      setLoading(false);
      return;
    }

    let imageUrls = [];
    if (images.length > 0) {
      imageUrls = await uploadImages(user.id);
    }

    const { error } = await supabase.from('listings').insert({
      user_id: user.id,
      title,
      price: parseFloat(price),
      description,
      category,
      location,
      images: imageUrls,
      status: 'active',
    });

    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Your listing is live!');
      setTitle('');
      setPrice('');
      setDescription('');
      setCategory('');
      setLocation('');
      setImages([]);
      navigation.navigate('Home');
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Create Listing</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor={COLORS.muted}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Price (Rs.)"
        placeholderTextColor={COLORS.muted}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description (optional)"
        placeholderTextColor={COLORS.muted}
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
        <Text style={styles.locationButtonText}>
          {location || 'Detect My Location'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Photos ({images.length}/5)</Text>
      <View style={styles.imageRow}>
        {images.map((uri, i) => (
          <Image key={i} source={{ uri }} style={styles.thumbnail} contentFit="cover" />
        ))}
        {images.length < 5 && (
          <TouchableOpacity style={styles.addImage} onPress={pickImage}>
            <Text style={styles.addImageText}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Post Listing</Text>
        )}
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
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.earth,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.earth,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e8ddd0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.earth,
    marginBottom: 10,
    marginTop: 6,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryChip: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e8ddd0',
  },
  categoryChipActive: {
    backgroundColor: COLORS.saffron,
    borderColor: COLORS.saffron,
  },
  categoryText: {
    color: COLORS.earth,
    fontSize: 13,
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  locationButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e8ddd0',
    marginBottom: 16,
  },
  locationButtonText: {
    color: COLORS.saffron,
    fontSize: 14,
    fontWeight: '600',
  },
  imageRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  addImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e8ddd0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: {
    fontSize: 28,
    color: COLORS.muted,
  },
  submitButton: {
    backgroundColor: COLORS.saffron,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
