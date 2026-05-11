import React, { useState, useEffect } from 'react';
import {View,Text,FlatList,TouchableOpacity,ActivityIndicator,StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../config/firebase';
import { COLORS, globalStyles } from '../styles/globalStyles';

const OrderHistoryScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    try {
      unsubscribe = db
        .collection('orders')
        .orderBy('createdAt', 'desc')
        .onSnapshot(
          (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setOrders(ordersData);
            setLoading(false);
          },
          (error) => {
            console.log('Firestore listener error:', error.message);
            setOrders([]);
            setLoading(false);
          }
        );
    } catch (error) {
      console.log('Using empty orders:', error.message);
      setOrders([]);
      setLoading(false);
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return COLORS.primary;
      case 'preparing': return COLORS.warning;
      case 'delivered': return COLORS.success;
      default: return COLORS.textSecondary;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'Preparando';
      case 'delivered': return 'Entregado';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Fecha no disponible';
    }
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetail', { order: item })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Pedido #{item.id.slice(-6).toUpperCase()}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>

      <View style={styles.orderItems}>
        {(item.items || []).slice(0, 3).map((dish, index) => (
          <Text key={index} style={styles.orderItemText}>
            • {dish.name} x{dish.quantity}
          </Text>
        ))}
        {(item.items || []).length > 3 && (
          <Text style={styles.moreItems}>
            +{item.items.length - 3} más...
          </Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>
          Total: ${(item.total || 0).toLocaleString('es-CO')}
        </Text>
        <Text style={styles.viewDetail}>Ver detalle →</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[globalStyles.container, globalStyles.emptyState]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={globalStyles.emptyText}>Cargando pedidos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.container}>
        <View style={styles.header}>
          <Text style={globalStyles.title}>Mis Pedidos 📋</Text>
        </View>

        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={globalStyles.emptyState}>
              <Text style={{ fontSize: 60 }}>📋</Text>
              <Text style={globalStyles.emptyText}>
                Aún no tienes pedidos
              </Text>
              <TouchableOpacity
                style={[globalStyles.button, { marginTop: 20 }]}
                onPress={() => navigation.navigate('MenuTab')}
              >
                <Text style={globalStyles.buttonText}>Ver Menú</Text>
              </TouchableOpacity>
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
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  orderDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  orderItems: {
    marginBottom: 10,
  },
  orderItemText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  moreItems: {
    fontSize: 13,
    color: COLORS.primary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  orderTotal: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
  },
  viewDetail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});

export default OrderHistoryScreen;
