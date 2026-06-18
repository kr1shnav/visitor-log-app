import React from 'react';

import { View, StyleSheet, ScrollView, Alert } from 'react-native';

import { TextInput, Button, Text } from 'react-native-paper';

import { Controller, useForm } from 'react-hook-form';

import { createEquipmentLog } from '../services/supabaseService';

interface FormData {
  borrowerName: string;
  phoneNo: string;
  itemName: string;
  serialNo: string;
  quantity: string;
  remarks: string;
}

export default function EquipmentEntryScreen() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      borrowerName: '',
      phoneNo: '',
      itemName: '',
      serialNo: '',
      quantity: '1',
      remarks: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createEquipmentLog({
        borrower_name: data.borrowerName,

        phone_no: data.phoneNo,

        item_name: data.itemName,

        serial_no: data.serialNo,

        quantity: Number(data.quantity),

        remarks: data.remarks,

        status: 'OUT',
      });

      Alert.alert('Success', 'Equipment entry saved');

      reset();
    } catch (error) {
      console.log(error);

      Alert.alert('Error', 'Failed to save equipment');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant='headlineSmall' style={styles.title}>
        Equipment Register
      </Text>

      {/* Borrower Name */}

      <Controller
        control={control}
        name='borrowerName'
        rules={{
          required: 'Borrower Name is required',
          pattern: {
            value: /^[A-Za-z ]+$/,
            message: 'Only alphabets allowed',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label='Borrower Name *'
            mode='outlined'
            value={value}
            onChangeText={(text) => onChange(text.replace(/[^A-Za-z ]/g, ''))}
            style={styles.input}
          />
        )}
      />

      {errors.borrowerName && (
        <Text style={{ color: 'red' }}>{errors.borrowerName.message}</Text>
      )}

      {/* Phone */}

      <Controller
        control={control}
        name='phoneNo'
        rules={{
          required: 'Phone Number is required',
          pattern: {
            value: /^[0-9]{10}$/,
            message: 'Enter a valid 10-digit phone number',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label='Phone Number *'
            mode='outlined'
            keyboardType='phone-pad'
            maxLength={10}
            value={value}
            onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
            style={styles.input}
          />
        )}
      />

      {errors.phoneNo && (
        <Text style={{ color: 'red' }}>{errors.phoneNo.message}</Text>
      )}

      {/* Item Name */}

      <Controller
        control={control}
        name='itemName'
        rules={{
          required: 'Item Name is required',
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label='Item Name *'
            mode='outlined'
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      {errors.itemName && (
        <Text style={{ color: 'red' }}>{errors.itemName.message}</Text>
      )}

      {/* Serial No */}

      <Controller
        control={control}
        name='serialNo'
        render={({ field: { onChange, value } }) => (
          <TextInput
            label='Serial Number'
            mode='outlined'
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      {errors.serialNo && (
        <Text style={{ color: 'red' }}>{errors.serialNo.message}</Text>
      )}

      {/* Quantity */}

      <Controller
        control={control}
        name='quantity'
        rules={{
          required: 'Quantity is required',
          pattern: {
            value: /^[1-9][0-9]*$/,
            message: 'Enter a valid quantity',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label='Quantity *'
            mode='outlined'
            keyboardType='numeric'
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      {errors.quantity && (
        <Text style={{ color: 'red' }}>{errors.quantity.message}</Text>
      )}

      {/* Remarks */}

      <Controller
        control={control}
        name='remarks'
        render={({ field: { onChange, value } }) => (
          <TextInput
            label='Remarks'
            mode='outlined'
            multiline
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      <Button
        mode='contained'
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
      >
        Save Equipment Entry
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8FAFC',
  },

  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  input: {
    marginBottom: 12,
  },

  button: {
    marginTop: 10,
    marginBottom: 30,
  },
});
