const { Expo } = require('expo-server-sdk');
const User = require('../models/userModel');

// Create a new Expo SDK client
let expo = new Expo();

/**
 * Send a push notification to a specific user
 * @param {string} userId - Target user ID
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Optional data payload
 */
const sendPushNotification = async (userId, title, body, data = {}) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.expoPushToken) {
      console.log(`Push notification skipped: No token for user ${userId}`);
      return;
    }

    // Check that the token is a valid Expo push token
    if (!Expo.isExpoPushToken(user.expoPushToken)) {
      console.error(`Push notification error: Invalid token ${user.expoPushToken}`);
      return;
    }

    // Construct the message
    const message = {
      to: user.expoPushToken,
      sound: 'default',
      title,
      body,
      data,
    };

    // Send the message
    const chunks = expo.chunkPushNotifications([message]);
    const tickets = [];

    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending push notification chunk:', error);
      }
    }

    // NOTE: In a production app, you should check tickets for errors and 
    // handle receipt receipts, especially to identify and remove inactive tokens.
    // console.log('Push tickets:', tickets);
    
  } catch (error) {
    console.error('Error in sendPushNotification helper:', error);
  }
};

module.exports = {
  sendPushNotification,
};
