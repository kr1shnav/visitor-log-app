import React, { useEffect, useState } from 'react';

import { View, FlatList, StyleSheet, Alert } from 'react-native';

import { Card, Text, Button, TextInput } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { router } from 'expo-router';

import {
  getUsers,
  createUser,
  resetPassword,
} from '../services/supabaseService';

export default function UserManagementScreen() {
  const checkAccess = async () => {
    const storedUser = await AsyncStorage.getItem('user');

    if (!storedUser) {
      router.replace('/login');
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== 'ADMIN') {
      alert('Access Denied');

      router.back();
    }
  };
  
  useEffect(() => {
    checkAccess();
    fetchUsers();
  }, []);

  const [users, setUsers] = useState<any[]>([]);

  const [fullName, setFullName] = useState('');

  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');

  const [role, setRole] = useState('USER');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsers();

    setUsers(data || []);
  };

  const handleCreateUser = async () => {
    try {
      await createUser({
        full_name: fullName,
        username,
        password,
        role,
      });

      Alert.alert('Success', 'User created');

      setFullName('');
      setUsername('');
      setPassword('');

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetPassword = async (id: string) => {
    Alert.prompt('Reset Password', 'Enter new password', async (password) => {
      if (!password) return;

      await resetPassword(id, password);

      Alert.alert('Success', 'Password Updated');
    });
  };

  return (
    <View style={styles.container}>
      <Text variant='headlineSmall' style={styles.title}>
        User Management
      </Text>

      <TextInput
        label='Full Name'
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />

      <TextInput
        label='Username'
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <TextInput
        label='Password'
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <Button mode='contained' onPress={handleCreateUser}>
        Create User
      </Button>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text>{item.full_name}</Text>

              <Text>{item.username}</Text>

              <Text>{item.role}</Text>

              <Button
                mode='outlined'
                onPress={() => handleResetPassword(item.id)}
              >
                Reset Password
              </Button>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  title: {
    marginBottom: 20,
    textAlign: 'center',
  },

  input: {
    marginBottom: 10,
  },

  card: {
    marginTop: 10,
  },
});
