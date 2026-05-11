import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,Alert,StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, globalStyles } from '../styles/globalStyles';

const STORAGE_KEY = '@foodie_user_profile';

const ProfileScreen = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const profile = stored;  
        setUserName(profile.name || '');
        setUserEmail(profile.email || '');
        setUserPhone(profile.phone || '');
        setUserAddress(profile.address || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveProfile = async () => {
    try {
      const profile = {
        name: userName,
        email: userEmail,
        phone: userPhone,
        address: userAddress,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setIsEditing(false);
      Alert.alert('¡Guardado!', 'Tu perfil ha sido actualizado.');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'No se pudo guardar el perfil.');
    }
  };

  const clearProfile = async () => {
    Alert.alert(
      'Borrar perfil',
      '¿Estás seguro de que deseas borrar toda tu información?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setUserName('');
            setUserEmail('');
            setUserPhone('');
            setUserAddress('');
            setIsEditing(false);
            Alert.alert('Perfil borrado', 'Tu información ha sido eliminada.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView style={globalStyles.container}>
        <View style={styles.header}>
          <Text style={globalStyles.title}>Mi Perfil 👤</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userName ? userName.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
            <Text style={styles.avatarName}>
              {userName || 'Sin nombre'}
            </Text>
          </View>

          <View style={globalStyles.divider} />

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Nombre completo</Text>
            <TextInput
              style={[styles.fieldInput, !isEditing && styles.fieldDisabled]}
              value={userName}
              onChangeText={setUserName}
              placeholder="Tu nombre"
              placeholderTextColor={COLORS.disabled}
              editable={isEditing}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Correo electrónico</Text>
            <TextInput
              style={[styles.fieldInput, !isEditing && styles.fieldDisabled]}
              value={userEmail}
              onChangeText={setUserEmail}
              placeholder="correo@ejemplo.com"
              placeholderTextColor={COLORS.disabled}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={isEditing}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Teléfono</Text>
            <TextInput
              style={[styles.fieldInput, !isEditing && styles.fieldDisabled]}
              value={userPhone}
              onChangeText={setUserPhone}
              placeholder="300 123 4567"
              placeholderTextColor={COLORS.disabled}
              keyboardType="phone-pad"
              editable={isEditing}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Dirección de entrega</Text>
            <TextInput
              style={[styles.fieldInput, styles.fieldMultiline, !isEditing && styles.fieldDisabled]}
              value={userAddress}
              onChangeText={setUserAddress}
              placeholder="Calle, número, barrio, ciudad"
              placeholderTextColor={COLORS.disabled}
              multiline
              numberOfLines={3}
              editable={isEditing}
            />
          </View>

          <View style={styles.buttonContainer}>
            {isEditing ? (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={saveProfile}
                >
                  <Text style={styles.saveButtonText}>💾 Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => {
                    setIsEditing(false);
                    loadProfile(); 
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>✏️ Editar Perfil</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={globalStyles.divider} />

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={clearProfile}
          >
            <Text style={styles.dangerButtonText}>🗑️ Borrar datos del perfil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  formContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  avatarName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.surface,
  },
  fieldMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  fieldDisabled: {
    backgroundColor: '#F3F4F6',
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    marginTop: 8,
    gap: 10,
  },
  actionButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: COLORS.secondary,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dangerButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: COLORS.error,
    fontSize: 15,
    fontWeight: '600',
  },
  debugBox: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderStyle: 'dashed',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#3B82F6',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
});

export default ProfileScreen;
