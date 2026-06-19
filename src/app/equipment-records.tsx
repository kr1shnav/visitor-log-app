import React, { useEffect, useState } from 'react';

import { FlatList, StyleSheet, View } from 'react-native';

import { Card, Text, TextInput, Button } from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';

import * as FileSystem from 'expo-file-system/legacy';

import * as Sharing from 'expo-sharing';

import { getEquipmentLogs, returnEquipment } from '../services/supabaseService';

export default function EquipmentRecordsScreen() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [borrowerFilter, setBorrowerFilter] = useState('');

  const [itemFilter, setItemFilter] = useState('');

  const [statusFilter, setStatusFilter] = useState('ALL');

  const [searchPressed, setSearchPressed] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const data = await getEquipmentLogs();
      setEquipment(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';

    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleSearch = () => {
    if (!selectedDate) {
      setFilteredEquipment(equipment);
      setSearchPressed(true);
      return;
    }

    const selectedDateString = selectedDate.toISOString().split('T')[0];

    const results = equipment.filter((record) => {
      const recordDate = new Date(record.created_at)
        .toISOString()
        .split('T')[0];

      const dateMatch = recordDate === selectedDateString;

      const borrowerMatch =
        !borrowerFilter ||
        record.borrower_name
          ?.toLowerCase()
          .includes(borrowerFilter.toLowerCase());

      const itemMatch =
        !itemFilter ||
        record.item_name?.toLowerCase().includes(itemFilter.toLowerCase());

      const statusMatch =
        statusFilter === 'ALL' || record.status === statusFilter;

      return dateMatch && borrowerMatch && itemMatch && statusMatch;
    });

    setFilteredEquipment(results);
    setSearchPressed(true);
  };

  const markReturned = async (id: string) => {
    try {
      await returnEquipment(id);

      const updatedData = await getEquipmentLogs();

      setEquipment(updatedData || []);

      if (selectedDate) {
        const selectedDateString = selectedDate.toISOString().split('T')[0];

        const results = updatedData.filter((record: any) => {
          const recordDate = new Date(record.created_at)
            .toISOString()
            .split('T')[0];

          const dateMatch = recordDate === selectedDateString;

          const borrowerMatch =
            !borrowerFilter ||
            record.borrower_name
              ?.toLowerCase()
              .includes(borrowerFilter.toLowerCase());

          const itemMatch =
            !itemFilter ||
            record.item_name?.toLowerCase().includes(itemFilter.toLowerCase());

          const statusMatch =
            statusFilter === 'ALL' || record.status === statusFilter;

          return dateMatch && borrowerMatch && itemMatch && statusMatch;
        });

        setFilteredEquipment(results);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const exportCSV = async () => {
    try {
      if (filteredEquipment.length === 0) {
        alert('No records to export');
        return;
      }

      const headers = [
        'Borrower Name',
        'Phone Number',
        'Item Name',
        'Serial Number',
        'Quantity',
        'Status',
        'In Time',
        'Out Time',
        'Remarks',
      ];

      const rows = filteredEquipment.map((item) => [
        item.borrower_name || '',
        item.phone_no || '',
        item.item_name || '',
        item.serial_no || '',
        item.quantity || '',
        item.status || '',
        item.in_time || '',
        item.out_time || '',
        item.remarks || '',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
          row
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(','),
        ),
      ].join('\n');

      const fileUri =
        FileSystem.documentDirectory + `equipment_records_${Date.now()}.csv`;

      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.log(error);

      alert('Failed to export CSV');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant='headlineSmall' style={styles.title}>
        Equipment Records
      </Text>

      <Button
        mode='outlined'
        onPress={() => setShowDatePicker(true)}
        style={styles.searchBar}
      >
        {selectedDate
          ? selectedDate.toISOString().split('T')[0]
          : 'Select Date *'}
      </Button>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode='date'
          onChange={(event, date) => {
            if (event.type === 'dismissed') {
              setShowDatePicker(false);
              return;
            }

            if (date) {
              setSelectedDate(date);
            }

            setShowDatePicker(false);
          }}
        />
      )}

      <TextInput
        mode='outlined'
        label='Borrower Name'
        value={borrowerFilter}
        onChangeText={setBorrowerFilter}
        style={styles.searchBar}
      />

      <TextInput
        mode='outlined'
        label='Item Name'
        value={itemFilter}
        onChangeText={setItemFilter}
        style={styles.searchBar}
      />

      <View style={styles.statusContainer}>
        <Button
          mode={statusFilter === 'ALL' ? 'contained' : 'outlined'}
          onPress={() => setStatusFilter('ALL')}
        >
          ALL
        </Button>

        <Button
          mode={statusFilter === 'OUT' ? 'contained' : 'outlined'}
          onPress={() => setStatusFilter('OUT')}
        >
          OUT
        </Button>

        <Button
          mode={statusFilter === 'RETURNED' ? 'contained' : 'outlined'}
          onPress={() => setStatusFilter('RETURNED')}
        >
          RETURNED
        </Button>
      </View>

      <Button
        mode='contained'
        onPress={handleSearch}
        style={styles.searchButton}
      >
        Search Records
      </Button>

      {!searchPressed ? (
        <View style={styles.center}>
          <Text>Select a date and search</Text>
        </View>
      ) : (
        <>
          <Button
            mode='contained'
            onPress={exportCSV}
            style={{
              marginBottom: 15,
            }}
          >
            Export CSV
          </Button>

          <Text variant='titleMedium' style={styles.count}>
            Records Found:
            {filteredEquipment.length}
          </Text>

          <FlatList
            data={filteredEquipment}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Content>
                  <Text variant='titleMedium'>{item.item_name}</Text>

                  <Text>Borrower: {item.borrower_name}</Text>

                  <Text>Phone: {item.phone_no}</Text>

                  <Text>Serial No: {item.serial_no}</Text>

                  <Text>Quantity: {item.quantity}</Text>

                  <Text>Status: {item.status}</Text>

                  <Text>In Time: {formatDateTime(item.in_time)}</Text>

                  {item.out_time && (
                    <Text>Returned: {formatDateTime(item.out_time)}</Text>
                  )}

                  {item.remarks && <Text>Remarks: {item.remarks}</Text>}

                  {item.status === 'OUT' && (
                    <Button
                      mode='contained'
                      style={{
                        marginTop: 10,
                      }}
                      onPress={() => markReturned(item.id)}
                    >
                      MARK RETURNED
                    </Button>
                  )}
                </Card.Content>
              </Card>
            )}
          />
        </>
      )}
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
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },

  searchBar: {
    marginBottom: 12,
  },

  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  searchButton: {
    marginBottom: 15,
  },

  count: {
    marginBottom: 12,
    fontWeight: 'bold',
  },

  card: {
    marginBottom: 12,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
