import React, { useEffect, useState } from 'react';

import { View, FlatList, StyleSheet, Alert } from 'react-native';

import {
  Card,
  Text,
  Button,
  TextInput,
  Avatar,
  Chip,
  Divider,
  Dialog,
  Portal,
} from 'react-native-paper';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { router } from 'expo-router';

import {
  getUsers,
  createUser,
  resetPassword,
} from '../services/supabaseService';

export default function UserManagementScreen() {
  const [users, setUsers] = useState<any[]>([]);

  const [fullName, setFullName] = useState('');

  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');

  const [role, setRole] = useState('USER');

  const [dialogVisible, setDialogVisible] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState('');

  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    checkAccess();
    fetchUsers();
  }, []);

  const checkAccess = async () => {
    const storedUser = await AsyncStorage.getItem('user');

    if (!storedUser) {
      router.replace('/login' as any);
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== 'ADMIN') {
      Alert.alert('Access Denied');

      router.back();
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers();

      setUsers(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateUser = async () => {
    if (!fullName || !username || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      await createUser({
        full_name: fullName,
        username,
        password,
        role,
      });

      Alert.alert('Success', 'User created successfully');

      setFullName('');
      setUsername('');
      setPassword('');
      setRole('USER');

      fetchUsers();
    } catch (error: any) {
      console.log(error);

      Alert.alert('Error', error?.message || 'Failed to create user');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    try {
      await resetPassword(selectedUserId, newPassword);

      Alert.alert('Success', 'Password updated successfully');

      setDialogVisible(false);
      setNewPassword('');
      setSelectedUserId('');
    } catch (error) {
      console.log(error);

      Alert.alert('Error', 'Failed to update password');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant='headlineSmall' style={styles.title}>
        User Management
      </Text>

      {/* Create User Card */}

      <Card style={styles.formCard}>
        <Card.Title
          title='Create New User'
          left={(props) => <Avatar.Icon {...props} icon='account-plus' />}
        />

        <Card.Content>
          <TextInput
            label='Full Name'
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            mode='outlined'
          />

          <TextInput
            label='Username'
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            mode='outlined'
            autoCapitalize='none'
          />

          <TextInput
            label='Password'
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            mode='outlined'
            secureTextEntry
          />

          <View style={styles.roleContainer}>
            <Button
              mode={role === 'USER' ? 'contained' : 'outlined'}
              style={styles.roleButton}
              onPress={() => setRole('USER')}
            >
              USER
            </Button>

            <Button
              mode={role === 'ADMIN' ? 'contained' : 'outlined'}
              style={styles.roleButton}
              onPress={() => setRole('ADMIN')}
            >
              ADMIN
            </Button>
          </View>

          <Button
            mode='contained'
            onPress={handleCreateUser}
            style={styles.createBtn}
            icon='account-plus'
          >
            Create User
          </Button>
        </Card.Content>
      </Card>

      {/* Empty State */}

      {users.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name='account-group-outline'
            size={80}
            color='#94A3B8'
          />

          <Text style={styles.emptyTitle}>No Users Found</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card style={styles.userCard}>
              <Card.Content>
                <View style={styles.userHeader}>
                  <View style={styles.userInfo}>
                    <Avatar.Icon size={50} icon='account' />

                    <View style={styles.userTextContainer}>
                      <Text variant='titleMedium'>{item.full_name}</Text>

                      <Text style={styles.username}>@{item.username}</Text>
                    </View>
                  </View>

                  <Chip
                    icon={item.role === 'ADMIN' ? 'shield-account' : 'account'}
                  >
                    {item.role}
                  </Chip>
                </View>

                <Divider
                  style={{
                    marginVertical: 12,
                  }}
                />

                <Button
                  mode='outlined'
                  icon='lock-reset'
                  onPress={() => {
                    setSelectedUserId(item.id);
                    setDialogVisible(true);
                  }}
                >
                  Reset Password
                </Button>
              </Card.Content>
            </Card>
          )}
        />
      )}
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => {
            setDialogVisible(false);
            setNewPassword('');
          }}
        >
          <Dialog.Title>Reset Password</Dialog.Title>

          <Dialog.Content>
            <TextInput
              label='New Password'
              mode='outlined'
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </Dialog.Content>

          <Dialog.Actions>
            <Button
              onPress={() => {
                setDialogVisible(false);
                setNewPassword('');
              }}
            >
              Cancel
            </Button>

            <Button onPress={handleResetPassword}>Update</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8FAFC',
  },

  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '700',
  },

  formCard: {
    marginBottom: 20,
    borderRadius: 18,
    elevation: 3,
  },

  input: {
    marginBottom: 15,
  },

  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  roleButton: {
    flex: 1,
    marginHorizontal: 5,
  },

  createBtn: {
    marginTop: 10,
    borderRadius: 12,
  },

  userCard: {
    marginBottom: 15,
    borderRadius: 18,
    elevation: 3,
  },

  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  userTextContainer: {
    marginLeft: 12,
  },

  username: {
    color: '#64748B',
  },

  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
  },
});
