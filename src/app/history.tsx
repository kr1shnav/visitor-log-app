import React, { useEffect, useState } from 'react';

import { View, StyleSheet, FlatList, Alert } from 'react-native';

import {
  Card,
  Text,
  TextInput,
  Button,
  Switch,
  Divider,
  Chip,
} from 'react-native-paper';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import DateTimePicker from '@react-native-community/datetimepicker';

import { getVisitors } from '../services/supabaseService';

import * as FileSystem from 'expo-file-system/legacy';

import * as Sharing from 'expo-sharing';

import * as Print from 'expo-print';

export default function VisitorRecordsScreen() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<any[]>([]);

  const [visitorIdFilter, setVisitorIdFilter] = useState('');

  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [nameFilter, setNameFilter] = useState('');

  const [statusFilter, setStatusFilter] = useState('ALL');

  const [searchPressed, setSearchPressed] = useState(false);

  const [enableTimeFilter, setEnableTimeFilter] = useState(false);

  const [fromTime, setFromTime] = useState<Date | null>(null);

  const [toTime, setToTime] = useState<Date | null>(null);

  const [showFromPicker, setShowFromPicker] = useState(false);

  const [showToPicker, setShowToPicker] = useState(false);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const data = await getVisitors();

      setVisitors(data || []);
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
      alert('Please select a date');
      return;
    }

    const selectedYear = selectedDate.getFullYear();

    const selectedMonth = String(selectedDate.getMonth() + 1).padStart(2, '0');

    const selectedDay = String(selectedDate.getDate()).padStart(2, '0');

    const selectedDateString = `${selectedYear}-${selectedMonth}-${selectedDay}`;

    console.log('Selected Date:', selectedDateString);

    const results = visitors.filter((visitor) => {
      if (!visitor.created_at) return false;

      const visitorCreatedDate = new Date(visitor.created_at);

      const visitorYear = visitorCreatedDate.getFullYear();

      const visitorMonth = String(visitorCreatedDate.getMonth() + 1).padStart(
        2,
        '0',
      );

      const visitorDay = String(visitorCreatedDate.getDate()).padStart(2, '0');

      const visitorDate = `${visitorYear}-${visitorMonth}-${visitorDay}`;

      const dateMatch = visitorDate === selectedDateString;

      const nameMatch =
        !nameFilter ||
        visitor.full_name?.toLowerCase().includes(nameFilter.toLowerCase());

      const statusMatch =
        statusFilter === 'ALL' || visitor.status === statusFilter;

      // OPTIONAL VISITOR ID SEARCH
      const visitorIdMatch =
        !visitorIdFilter ||
        visitor.visitor_id
          ?.toLowerCase()
          .includes(visitorIdFilter.toLowerCase());

      let timeMatch = true;

      if (enableTimeFilter && fromTime && toTime) {
        const visitorMinutes =
          visitorCreatedDate.getHours() * 60 + visitorCreatedDate.getMinutes();

        const fromMinutes = fromTime.getHours() * 60 + fromTime.getMinutes();

        const toMinutes = toTime.getHours() * 60 + toTime.getMinutes();

        timeMatch =
          visitorMinutes >= fromMinutes && visitorMinutes <= toMinutes;
      }

      return (
        dateMatch && nameMatch && statusMatch && visitorIdMatch && timeMatch
      );
    });

    console.log('Results Found:', results.length);

    setFilteredVisitors(results);

    setSearchPressed(true);
  };

  const exportPDF = async () => {
    try {
      if (filteredVisitors.length === 0) {
        Alert.alert('No Records', 'No records available to export');
        return;
      }

      let html = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 15px;
            }

            h1 {
              text-align: center;
              color: #1A237E;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 9px;
            }

            th, td {
              border: 1px solid #000;
              padding: 5px;
              text-align: left;
              word-wrap: break-word;
            }

            th {
              background-color: #1A237E;
              color: white;
            }

            tr:nth-child(even) {
              background-color: #f2f2f2;
            }

            a {
              color: blue;
            }
          </style>
        </head>

        <body>
          <h1>Visitor Report</h1>

          <table>
            <tr>
              <th>Visitor ID</th>
              <th>Name</th>
              <th>Company</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Photo</th>
              <th>ID Card</th>
            </tr>
    `;

      filteredVisitors.forEach((visitor) => {
        html += `
        <tr>
          <td>${visitor.visitor_id || ''}</td>

          <td>${visitor.full_name || ''}</td>

          <td>${visitor.company_name || ''}</td>

          <td>${visitor.mobile_no || ''}</td>

          <td>${visitor.status || ''}</td>

          <td>${formatDateTime(visitor.in_time)}</td>

          <td>
            ${visitor.out_time ? formatDateTime(visitor.out_time) : ''}
          </td>

          <td>
            ${
              visitor.image_url
                ? `<a href="${visitor.image_url}">Photo Link</a>`
                : 'N/A'
            }
          </td>

          <td>
            ${
              visitor.id_card_image_url
                ? `<a href="${visitor.id_card_image_url}">ID Card Link</a>`
                : 'N/A'
            }
          </td>
        </tr>
      `;
      });

      html += `
          </table>

          <br />

          <p>
            Generated On:
            ${new Date().toLocaleString()}
          </p>

        </body>
      </html>
    `;

      const { uri } = await Print.printToFileAsync({
        html,
      });

      const fileName = `visitor_report_${Date.now()}.pdf`;

      const newPath = FileSystem.documentDirectory + fileName;

      await FileSystem.copyAsync({
        from: uri,
        to: newPath,
      });

      await Sharing.shareAsync(newPath, {
        mimeType: 'application/pdf',
        dialogTitle: 'Save Visitor Report',
        UTI: 'com.adobe.pdf',
      });

      Alert.alert('Success', 'PDF generated successfully');
    } catch (error) {
      console.log(error);

      Alert.alert('Error', 'Failed to export PDF');
    }
  };

  const showExportOptions = () => {
    Alert.alert('Export Report', 'Choose export format', [
      {
        text: 'CSV',
        onPress: exportCSV,
      },
      {
        text: 'PDF',
        onPress: exportPDF,
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const exportCSV = async () => {
    try {
      if (filteredVisitors.length === 0) {
        Alert.alert('No records to export');
        return;
      }

      const headers = [
        'Visitor ID',
        'Name',
        'Company',
        'Mobile',
        'Status',
        'In Time',
        'Out Time',
      ];

      const rows = filteredVisitors.map((visitor) => [
        visitor.visitor_id || '',
        visitor.full_name || '',
        visitor.company_name || '',
        visitor.mobile_no || '',
        visitor.status || '',
        formatDateTime(visitor.in_time),
        visitor.out_time ? formatDateTime(visitor.out_time) : '',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
          row
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(','),
        ),
      ].join('\n');

      const fileName = `visitor_report_${Date.now()}.csv`;

      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Opens Android save dialog
      await Sharing.shareAsync(fileUri);

      Alert.alert('Success', 'Report generated successfully');
    } catch (error) {
      console.log(error);

      Alert.alert('Error', 'Failed to export report');
    }
  };
  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Loading Visitor Records...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant='headlineSmall' style={styles.title}>
        Visitor Records
      </Text>

      <TextInput
        mode='outlined'
        label='Select Date'
        value={selectedDate ? selectedDate.toLocaleDateString() : ''}
        editable={false}
        style={styles.searchBar}
        right={
          <TextInput.Icon
            icon='calendar'
            onPress={() => setShowDatePicker(true)}
          />
        }
      />

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode='date'
          display='default'
          maximumDate={new Date()}
          onChange={(event, date) => {
            setShowDatePicker(false);

            if (date) {
              setSelectedDate(date);
            }
          }}
        />
      )}

      <TextInput
        mode='outlined'
        label='Visitor Name (Optional)'
        value={nameFilter}
        onChangeText={setNameFilter}
        style={styles.searchBar}
      />

      <TextInput
        mode='outlined'
        label='Visitor ID (Optional)'
        value={visitorIdFilter}
        onChangeText={setVisitorIdFilter}
        style={styles.searchBar}
      />

      <Text variant='titleMedium' style={styles.statusLabel}>
        Status
      </Text>

      <View style={styles.statusContainer}>
        <Button
          mode={statusFilter === 'ALL' ? 'contained' : 'outlined'}
          onPress={() => setStatusFilter('ALL')}
        >
          All
        </Button>

        <Button
          mode={statusFilter === 'ACTIVE' ? 'contained' : 'outlined'}
          onPress={() => setStatusFilter('ACTIVE')}
        >
          Active
        </Button>

        <Button
          mode={statusFilter === 'CHECKED_OUT' ? 'contained' : 'outlined'}
          onPress={() => setStatusFilter('CHECKED_OUT')}
        >
          Checked Out
        </Button>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 15,
        }}
      >
        <Text>Enable Time Filter</Text>

        <Switch value={enableTimeFilter} onValueChange={setEnableTimeFilter} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 15,
        }}
      ></View>
      {enableTimeFilter && (
        <>
          <Button
            mode='outlined'
            onPress={() => setShowFromPicker(true)}
            style={styles.searchBar}
          >
            {fromTime
              ? `From: ${fromTime.toLocaleTimeString()}`
              : 'Select From Time'}
          </Button>

          <Button
            mode='outlined'
            onPress={() => setShowToPicker(true)}
            style={styles.searchBar}
          >
            {toTime ? `To: ${toTime.toLocaleTimeString()}` : 'Select To Time'}
          </Button>
        </>
      )}

      {showFromPicker && (
        <DateTimePicker
          value={fromTime || new Date()}
          mode='time'
          onChange={(event, date) => {
            setShowFromPicker(false);

            if (date) {
              setFromTime(date);
            }
          }}
        />
      )}

      {showToPicker && (
        <DateTimePicker
          value={toTime || new Date()}
          mode='time'
          onChange={(event, date) => {
            setShowToPicker(false);

            if (date) {
              setToTime(date);
            }
          }}
        />
      )}

      <Button
        mode='contained'
        onPress={handleSearch}
        style={styles.searchButton}
      >
        Search Records
      </Button>

      {!searchPressed ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name='file-search-outline'
            size={80}
            color='#94A3B8'
          />

          <Text style={styles.emptyTitle}>Search Visitor Records</Text>

          <Text style={styles.emptySubtitle}>
            Select filters and tap Search Records
          </Text>
        </View>
      ) : (
        <>
          <Text variant='titleMedium' style={styles.countText}>
            Visitors Found: {filteredVisitors.length}
          </Text>

          <Button mode='contained' icon='export' onPress={showExportOptions}>
            Export Report
          </Button>

          <FlatList
            data={filteredVisitors}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text variant='titleMedium'>{item.full_name}</Text>

                      <Text
                        style={{
                          color: '#1A237E',
                          fontWeight: 'bold',
                        }}
                      >
                        Visitor ID: {item.visitor_id}
                      </Text>

                      <Text style={styles.companyText}>
                        {item.company_name}
                      </Text>
                    </View>

                    <Chip mode='outlined'>{item.status}</Chip>
                  </View>

                  <Divider
                    style={{
                      marginVertical: 10,
                    }}
                  />

                  <Text>Designation: {item.designation}</Text>

                  <Text>Mobile: {item.mobile_no}</Text>

                  <Text>Vehicle: {item.vehicle_no}</Text>

                  {item.host_name && <Text>Host: {item.host_name}</Text>}

                  <Text>Purpose: {item.purpose}</Text>

                  <Text>Laptop Bag: {item.laptop_bag ? 'Yes' : 'No'}</Text>

                  <Text>Logged By: {item.created_by_name}</Text>

                  <Text>Username: {item.created_by}</Text>

                  <Text>In Time: {formatDateTime(item.in_time)}</Text>

                  {item.out_time && (
                    <Text>Out Time: {formatDateTime(item.out_time)}</Text>
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

  statusLabel: {
    marginBottom: 10,
  },

  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  searchButton: {
    marginBottom: 16,
  },

  countText: {
    marginBottom: 12,
    fontWeight: 'bold',
  },

  card: {
    marginBottom: 15,
    borderRadius: 18,
    elevation: 3,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '600',
  },

  emptySubtitle: {
    color: '#64748B',
    textAlign: 'center',
    marginTop: 10,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  companyText: {
    color: '#64748B',
  },
});
