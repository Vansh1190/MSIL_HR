/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import OneSignal from 'react-native-onesignal';
import Toast from 'react-native-simple-toast';
import * as RootNavigation from './src/navigations/RootNavigation';



AppRegistry.registerComponent(appName, () => App);

// OneSignal Initialization
// app id -> old (4-SEP-2025)->42fcb50a-922f-4b0e-9ba3-701d663beede
//42fcb50a-922f-4b0e-9ba3-701d663beede
//00bd1ef6-7b9f-44a1-98ce-986d3f9654ce
//OneSignal.setAppId("00bd1ef6-7b9f-44a1-98ce-986d3f9654ce");
OneSignal.setAppId("00bd1ef6-7b9f-44a1-98ce-986d3f9654ce");

// promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
// We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
OneSignal.promptForPushNotificationsWithUserResponse();

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
// $&
  let notification = notificationReceivedEvent.getNotification();
// $&
  const data = notification.additionalData
// $&
//   Toast.show("New Notification: "+notification?.title);
  // Complete with null means don't show a notification.
  notificationReceivedEvent.complete(notification);
});

//Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {
// $&
  RootNavigation.navigate('Notification');
});

