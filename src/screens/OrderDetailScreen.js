import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, globalStyles } from '../styles/globalStyles';

const OrderDetailScreen = ({ route }) => {
  const { order } = route.params;

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQty}>Cantidad: {item.quantity}</Text>
      </View>
      <Text style={styles.itemPrice}>
        ${(item.price * item.quantity).toLocaleString('es-CO')}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.safeArea} edges={['bottom']}>
      <View style={globalStyles.container}>
        <View style={styles.header}>
          <Text style={globalStyles.title}>
            Pedido #{order.id.slice(-6).toUpperCase()}
          </Text>
          <Text style={globalStyles.bodyText}>
            {new Date(order.createdAt).toLocaleDateString('es-CO', {
              day: '2-digit', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </Text>
        </View>

        <FlatList
          data={order.items || []}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          contentContainerStyle={styles.listContainer}
          ListFooterComponent={
            <View style={styles.totalSection}>
              <View style={globalStyles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total del Pedido</Text>
                <Text style={styles.totalValue}>
                  ${(order.total || 0).toLocaleString('es-CO')}
                </Text>
              </View>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  itemInfo: { flex: 1 },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  itemQty: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  totalSection: { paddingTop: 8 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
});

export default OrderDetailScreen;
