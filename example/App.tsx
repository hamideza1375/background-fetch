import React from 'react'
import { Button } from 'react-native'
import BackgroundFetch from 'react-native-background-fetch'
import Event from './src/Event'

const App = () => {
  // const clear = ()=>{Event.destroyAll()}
  // React.useLayoutEffect(() => {clear()}, [])

  React.useEffect(() => {initBackgroundFetch()}, [])

  const initBackgroundFetch = async () => {
    await BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        stopOnTerminate: false,
        enableHeadless: true,
        startOnBoot: true,
        forceAlarmManager: false,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
        requiresCharging: false,
        requiresDeviceIdle: false,
        requiresBatteryNotLow: false,
        requiresStorageNotLow: false,
      },
      async (taskId: string) => {
        BackgroundFetch.finish(taskId)
      },
      (taskId: string) => {
        BackgroundFetch.finish(taskId)
      },
    )
  }

  BackgroundFetch.scheduleTask({
    taskId: 'com.transistorsoft.customtask',
    delay: 5000,
    forceAlarmManager: true,
  }).then(() => {})



  return <Button title='background-fetch'/>
}

export default App
