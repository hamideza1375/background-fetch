/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
} from 'react-native'
import BackgroundFetch from 'react-native-background-fetch'

const Colors = {
  gold: '#fedd1e',
  black: '#000',
  white: '#fff',
  lightGrey: '#ccc',
  blue: '#337AB7',
}

/// Util class for handling fetch-event peristence in AsyncStorage.
import Event from './src/Event'
import {create} from './notification'

const App = () => {
  const [events, setEvents] = React.useState<Event[]>([])

  React.useEffect(() => {
    initBackgroundFetch()
    loadEvents()
  }, [])

  /// Configure BackgroundFetch.
  const initBackgroundFetch = async () => {
    const status: number = await BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
        stopOnTerminate: false,
        enableHeadless: true,
        startOnBoot: true,
        // Android options
        forceAlarmManager: false, // <-- Set true to bypass JobScheduler.
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
        requiresCharging: false, // Default
        requiresDeviceIdle: false, // Default
        requiresBatteryNotLow: false, // Default
        requiresStorageNotLow: false, // Default
      },
      async (taskId: string) => {
        // Create an Event record.
        const event = await Event.create(taskId, false)
        // Update state.
        setEvents(prev => [...prev, event])
        // Finish.
        BackgroundFetch.finish(taskId)
      },
      (taskId: string) => {
        // Oh No!  Our task took too long to complete and the OS has signalled
        // that this task must be finished immediately.
        BackgroundFetch.finish(taskId)
      },
    )
  }

  /// Load persisted events from AsyncStorage.
  const loadEvents = () => {
    Event.all()
      .then(data => {
        setEvents(data)
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to load data from AsyncStorage: ' + error)
      })
  }

  /// [scheduleTask] button handler.
  /// Schedules a custom-task to fire in 5000ms
  BackgroundFetch.scheduleTask({
    taskId: 'com.transistorsoft.customtask',
    delay: 5000,
    forceAlarmManager: true,
  }).then(() => {})

  /// Clear the Events list.
  const onClickClear = () => {
    Event.destroyAll()
    setEvents([])
  }

  /// Fetch events renderer.
  const renderEvents = () => {
    if (!events.length) {
      return (
        <Text style={{padding: 10, fontSize: 16}}>
          Waiting for BackgroundFetch events...
        </Text>
      )
    }
    return events
      .slice()
      .reverse()
      .map(event => (
        <View key={event.key} style={styles.event}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.taskId}>
              {event.taskId}&nbsp;{event.isHeadless ? '[Headless]' : ''}
            </Text>
          </View>
          <Text style={styles.timestamp}>{event.timestamp}</Text>
        </View>
      ))
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.gold}}>
      <StatusBar barStyle={'light-content'}></StatusBar>
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Text style={styles.title}>BGFetch Demo</Text>
        </View>
        <ScrollView
          contentInsetAdjustmentBehavior='automatic'
          style={styles.eventList}>
          {renderEvents()}
        </ScrollView>
        <View style={styles.toolbar}>
          <Text>&nbsp;</Text>
          <View style={{flex: 1}} />
          <Button title='clear' onPress={onClickClear} />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    fontSize: 24,
    flex: 1,
    fontWeight: 'bold',
    color: Colors.black,
  },
  eventList: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  event: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
  },
  taskId: {
    color: Colors.blue,
    fontSize: 16,
    fontWeight: 'bold',
  },
  headless: {
    fontWeight: 'bold',
  },
  timestamp: {
    color: Colors.black,
  },
  toolbar: {
    height: 57,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    backgroundColor: Colors.gold,
  },
})

export default App
