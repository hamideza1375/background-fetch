/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import BackgroundFetch from "react-native-background-fetch";

import Event from "./src/Event";
import { create } from './notification';

AppRegistry.registerComponent(appName, () => App);

const backgroundFetchHeadlessTask = async (event) => {
  if (event.timeout) {
    console.log('[BackgroundFetch] 💀 HeadlessTask TIMEOUT: ', event.taskId);
    BackgroundFetch.finish(event.taskId);
    return;
  }

  create('title', 'body')


  console.log('[BackgroundFetch] 💀 HeadlessTask start: ', event.taskId);

  await Event.create(event.taskId, true);  // <-- true means "Headless"

  BackgroundFetch.finish(event.taskId);
}

BackgroundFetch.registerHeadlessTask(backgroundFetchHeadlessTask);

