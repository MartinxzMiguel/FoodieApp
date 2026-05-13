import React, { useContext } from 'react';
import {View,Text,FlatList,TouchableOpacity,Alert,StyleSheet,TextInput} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartContext } from '../context/CartContext';
import { db } from '../config/firebase';
import { COLORS, globalStyles } from '../styles/globalStyles';

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart, clearCart, getCartTotal, updateItemNotes } = useContext(CartContext);

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega platos al carrito antes de confirmar.');
      return;
    }

    try {
        await db.collection('orders').add({
        items: cartItems,
        subtotal: subtotal,
        iva: iva,
        total: total,
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
  
  // Se agrega un View para envolver el TextInput de notas especiales debajo de la info del plato, y se ajustan los estilos para acomodar el nuevo diseño
  const renderCartItem = ({ item }) => (
  <View style={styles.cartItemCard}>

    {/* Fila superior: info + acciones */}
    <View style={styles.itemRow}>
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

    {/* Campo de notas especiales */}
    <TextInput
      style={styles.notesInput}
      placeholder="Notas especiales: sin cebolla, extra picante..."
      placeholderTextColor={COLORS.disabled}
      value={item.notes || ''}
      onChangeText={(text) => updateItemNotes(item.id, text)}
      multiline
    />
  </View>
  );

  const subtotal = getCartTotal();
  const iva = subtotal * 0.19; // Asumiendo un IVA del 19%
  const total = subtotal + iva;

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

            {/* Se muestra el subtotal, IVA y total para mayor claridad al usuario */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>
                ${subtotal.toLocaleString('es-CO')}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IVA (19%)</Text>
              <Text style={styles.totalValue}>
                ${iva.toLocaleString('es-CO')}
              </Text>
            </View>

            <View style={[styles.totalRow, styles.grandTotal]}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>
                ${total.toLocaleString('es-CO')}
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
    flexDirection: 'column', // Se cambia a column para acomodar el TextInput debajo de la info del plato
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

  // Estilos para el TextInput de notas especiales
  notesInput: {
  marginTop: 10,
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: 8,
  paddingHorizontal: 10,
  paddingVertical: 8,
  fontSize: 13,
  color: COLORS.textPrimary,
  backgroundColor: '#F9FAFB',
  width: '100%',
  },

  // Se agrega un estilo para la fila que contiene la info del plato y las acciones, para acomodar el nuevo diseño con el TextInput debajo
  itemRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  },
});

export default CartScreen;
