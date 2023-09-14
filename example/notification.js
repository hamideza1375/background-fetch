import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';

let id = ''

export const create = async (title, body, icon, notificationId, onClick) => {
  const channelId = await notifee.createChannel({ id: 'default', name: 'Default Channel', importance: AndroidImportance.HIGH });
  await notifee.requestPermission();

  id = Math.random().toString()
  const notification = notifee.displayNotification({
    id: notificationId ? notificationId : id,
    title: title,
    body: body,
    android: icon ? {
      channelId,
      // asForegroundService:true,
      largeIcon: icon,
      style: { type: AndroidStyle.BIGPICTURE, picture: icon },
      pressAction: {
        id: 'default',
      },
    } :
      { channelId },
    ios: icon ? {
      categoryId: "reminder",
      attachments: [{ url: icon }]
    } :
      {
        // categoryId: "new-episode",
        categoryId: "reminder",

      },
  });



  return notification;
}
