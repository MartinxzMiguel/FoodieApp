import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);


  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  }, []); 

  const loadCart = async () => {
    try {
      const stored = await AsyncStorage.getItem('@foodie_cart');
      if (stored) {
        setCartItems(stored); 
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async (items) => {
    try {
      await AsyncStorage.setItem('@foodie_cart', items); 
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };
  
  const addToCart = (dish) => {
    const updatedCart = [...cartItems];
    updatedCart.push({  
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      quantity: 1,
    });
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };
  
  const removeFromCart = (dishId) => {
    const updatedCart = cartItems;  
    const index = updatedCart.findIndex(item => item.id === dishId);
    if (index > -1) {
      updatedCart.splice(index, 1);  
    }
    setCartItems(updatedCart); 
    saveCart(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
