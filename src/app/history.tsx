import React, { useEffect, useState } from 'react';

import { FlatList, StyleSheet, View } from 'react-native';

import { Card, Text, TextInput, Button, Switch } from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';

import { getVisitors } from '../services/supabaseService';

export default function VisitorRecordsScreen() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<any[]>([]);

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

      let timeMatch = true;

      if (enableTimeFilter && fromTime && toTime) {
        const visitorMinutes =
          visitorCreatedDate.getHours() * 60 + visitorCreatedDate.getMinutes();

        const fromMinutes = fromTime.getHours() * 60 + fromTime.getMinutes();

        const toMinutes = toTime.getHours() * 60 + toTime.getMinutes();

        timeMatch =
          visitorMinutes >= fromMinutes && visitorMinutes <= toMinutes;
      }

      return dateMatch && nameMatch && statusMatch && timeMatch;
    });

    console.log('Results Found:', results.length);

    setFilteredVisitors(results);

    setSearchPressed(true);
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

      <Button
        mode='outlined'
        onPress={() => setShowDatePicker(true)}
        style={styles.searchBar}
      >
        {selectedDate
          ? `Date: ${selectedDate.toLocaleDateString()}`
          : 'Select Date *'}
      </Button>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode='date'
          display='default'
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
          <Text>Select a date and press Search Records</Text>
        </View>
      ) : (
        <>
          <Text variant='titleMedium' style={styles.countText}>
            Visitors Found: {filteredVisitors.length}
          </Text>

          <FlatList
            data={filteredVisitors}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Content>
                  <Text variant='titleMedium'>{item.full_name}</Text>

                  <Text>Company: {item.company_name}</Text>

                  <Text>Designation: {item.designation}</Text>

                  <Text>Mobile: {item.mobile_no}</Text>

                  <Text>Vehicle: {item.vehicle_no}</Text>

                  <Text>Purpose: {item.purpose}</Text>

                  <Text>Status: {item.status}</Text>

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
    marginBottom: 12,
    borderRadius: 12,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
