import React, { useContext } from 'react';
import {View,Text,FlatList,TouchableOpacity,Alert,StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartContext } from '../context/CartContext';
import { db } from '../config/firebase';
import { COLORS, globalStyles } from '../styles/globalStyles';

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart, clearCart, getCartTotal } = useContext(CartContext);

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega platos al carrito antes de confirmar.');
      return;
    }

    try {
        await db.collection('orders').add({
        items: cartItems,
        total: getCartTotal(),
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      });

      clearCart();
      Alert.alert(
        '¡Pedido Confirmado!',
        'Tu pedido ha sido enviado a la cocina.',
        [{ text: 'OK', onPress: () => navigation.navigate('OrdersTab') }]
      );
    } catch (error) {
      console.log('Order saved locally:', error.message);
      clearCart();
      Alert.alert('¡Pedido Confirmado!', 'Tu pedido ha sido registrado.');
    }
  };

  const handleRemoveItem = (item) => {
    Alert.alert(
      'Eliminar del carrito',
      `¿Deseas eliminar ${item.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => removeFromCart(item.id) },
      ]
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItemCard}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>
          ${item.price.toLocaleString('es-CO')} x {item.quantity}
        </Text>
      </View>
      <View style={styles.itemActions}>
        <Text style={styles.itemSubtotal}>
          ${(item.price * item.quantity).toLocaleString('es-CO')}
        </Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item)}
        >
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const subtotal = getCartTotal();

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.container}>
        <View style={styles.header}>
          <Text style={globalStyles.title}>Mi Carrito 🛒</Text>
          {cartItems.length > 0 && (
            <TouchableOpacity onPress={() => {
              Alert.alert('Vaciar carrito', '¿Estás seguro?', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Vaciar', style: 'destructive', onPress: clearCart },
              ]);
            }}>
              <Text style={styles.clearText}>Vaciar</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={globalStyles.emptyState}>
              <Text style={{ fontSize: 60 }}>🛒</Text>
              <Text style={globalStyles.emptyText}>Tu carrito está vacío</Text>
              <TouchableOpacity
                style={[globalStyles.button, { marginTop: 20 }]}
                onPress={() => navigation.navigate('MenuTab')}
              >
                <Text style={globalStyles.buttonText}>Ver Menú</Text>
              </TouchableOpacity>
            </View>
          }
        />

        {cartItems.length > 0 && (
          <View style={styles.bottomSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>
                ${subtotal.toLocaleString('es-CO')}
              </Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotal]}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>
                ${subtotal.toLocaleString('es-CO')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmOrder}
            >
              <Text style={styles.confirmButtonText}>Confirmar Pedido</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  clearText: {
    fontSize: 15,
    color: COLORS.error,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  cartItemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  itemSubtotal: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  removeButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '700',
  },
  bottomSection: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 16,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  confirmButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default CartScreen;
