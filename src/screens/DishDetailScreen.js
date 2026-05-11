import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartContext } from '../context/CartContext';
import { COLORS, globalStyles } from '../styles/globalStyles';

const DishDetailScreen = ({ route, navigation }) => {
  const { addToCart } = useContext(CartContext);
  const { dish } = route.params; 

  const handleAddToCart = () => {
    addToCart({
      id: dish.dishId,         
      name: dish.dishName,
      price: dish.dishPrice,
      image: dish.dishImage,
    });
    Alert.alert(
      '¡Agregado!',
      `${dish.dishName} se agregó al carrito`,
      [
        { text: 'Seguir viendo', style: 'cancel' },
        { text: 'Ver carrito', onPress: () => navigation.navigate('CartTab') },
      ]
    );
  };

  return (
    <SafeAreaView style={globalStyles.safeArea} edges={['bottom']}>
      <ScrollView style={globalStyles.container}>
        <Image
          source={{ uri: dish?.dishImage || 'https://via.placeholder.com/400x250' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.dishName}>{dish?.dishName || 'Plato no encontrado'}</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingText}>{dish?.dishRating || '0.0'}</Text>
            </View>
          </View>

          <Text style={styles.category}>{dish?.dishCategory || 'Sin categoría'}</Text>

          <Text style={styles.price}>
            ${(dish?.dishPrice || 0).toLocaleString('es-CO')}
          </Text>

          <View style={globalStyles.divider} />

          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>
            {dish?.dishDescription || 'Sin descripción disponible.'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onClick={handleAddToCart}
        >
          <Text style={styles.addToCartText}>🛒 Agregar al Carrito</Text>
          <Text style={styles.addToCartPrice}>
            ${(dish?.dishPrice || 0).toLocaleString('es-CO')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heroImage: {
    width: '100%',
    height: 250,
    backgroundColor: COLORS.border,
  },
  contentContainer: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dishName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ratingStar: {
    fontSize: 16,
    color: COLORS.star,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400E',
  },
  category: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 6,
    marginBottom: 10,
  },
  price: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  bottomBar: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  addToCartPrice: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default DishDetailScreen;
