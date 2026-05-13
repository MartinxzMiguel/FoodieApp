import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  // ✅ BUG 1 CORREGIDO: faltaba [cartItems] como dependencia
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  }, [cartItems]);

  const loadCart = async () => {
    try {
      const stored = await AsyncStorage.getItem('@foodie_cart');
      if (stored) {
        setCartItems(JSON.parse(stored)); // ✅ BUG 2 CORREGIDO: hay que parsear el string
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async (items) => {
    try {
      await AsyncStorage.setItem('@foodie_cart', JSON.stringify(items)); // ✅ BUG 3 CORREGIDO: hay que serializar el arreglo
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (dish) => {
    const existing = cartItems.find(item => item.id === dish.id);
    let updatedCart;

    if (existing) {
      // ✅ BUG 4 CORREGIDO: si el plato ya existe, incrementar cantidad en vez de duplicar
      updatedCart = cartItems.map(item =>
        item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [
        ...cartItems,
        {
          id: dish.id,
          name: dish.name,
          price: dish.price,
          image: dish.image,
          quantity: 1,
        },
      ];
    }

    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  const removeFromCart = (dishId) => {
    // ✅ BUG 5 CORREGIDO: no mutar el estado directamente con splice
    const updatedCart = cartItems.filter(item => item.id !== dishId);
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Se agrega la función UpdateItemNotes para permitir al usuario agregar notas a los platos en el carrito
  const updateItemNotes = (dishId, notes) => {
    const updatedCart = cartItems.map(item =>
      item.id === dishId ? { ...item, notes } : item
    );
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  const updateQuantity = (dishId, delta) => {
    const item = cartItems.find(i => i.id === dishId);
    if (!item) return;

    if (item.quantity + delta <= 0) {
      // Si llega a 0, eliminar el item
      const updatedCart = cartItems.filter(i => i.id !== dishId);
      setCartItems(updatedCart);
      saveCart(updatedCart);
    } else {
      const updatedCart = cartItems.map(i =>
        i.id === dishId ? { ...i, quantity: i.quantity + delta } : i
      );
      setCartItems(updatedCart);
      saveCart(updatedCart);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        updateItemNotes,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};