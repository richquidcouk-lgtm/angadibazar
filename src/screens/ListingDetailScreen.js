import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');
const COLORS = {
  saffron: '#e07b39',
  deep: '#b5470f',
  cream: '#fdf6ec',
  earth: '#2d1f0f',
  muted: '#9b7a5a',
};

export default function ListingDetailScreen({ route, navigation }) {
  const { listing } = route.params;
  const sellerPhone = listing.profiles?.phone;

  function contactSeller() {
    if (sellerPhone) {
      Linking.openURL(`tel:${sellerPhone}`);
    }
  }

  function whatsappSeller() {
    if (sellerPhone) {
      const cleaned = sellerPhone.replace(/[^0-9]/g, '');
      const message = `Hi, I'm interested in your listing "${listing.title}" on AngadiBazar.`;
      Linking.openURL(`https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {listing.images?.length > 0 ? (
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {listing.images.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.image} contentFit="cover" />
            ))}
          </ScrollView>
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}

        <View style={styles.details}>
          <Text style={styles.price}>Rs. {listing.price}</Text>
          <Text style={styles.title}>{listing.title}</Text>
          {listing.category && <Text style={styles.category}>{listing.category}</Text>}
          {listing.location && <Text style={styles.location}>{listing.location}</Text>}

          {listing.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{listing.description}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seller</Text>
            <Text style={styles.sellerName}>{listing.profiles?.name || 'Unknown'}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.callButton} onPress={contactSeller}>
          <Text style={styles.callText}>Call Seller</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.whatsappButton} onPress={whatsappSeller}>
          <Text style={styles.whatsappText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  image: {
    width,
    height: 300,
  },
  placeholder: {
    backgroundColor: '#f0e6d8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: COLORS.muted,
    fontSize: 15,
  },
  details: {
    padding: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.deep,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.earth,
    marginTop: 6,
  },
  category: {
    fontSize: 14,
    color: COLORS.saffron,
    marginTop: 6,
    fontWeight: '600',
  },
  location: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 4,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.earth,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: COLORS.earth,
    lineHeight: 22,
  },
  sellerName: {
    fontSize: 15,
    color: COLORS.earth,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e8ddd0',
    backgroundColor: '#fff',
  },
  callButton: {
    flex: 1,
    backgroundColor: COLORS.saffron,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  callText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  whatsappButton: {
    flex: 1,
    backgroundColor: '#25D366',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  whatsappText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backText: {
    color: COLORS.earth,
    fontWeight: '600',
    fontSize: 14,
  },
});
