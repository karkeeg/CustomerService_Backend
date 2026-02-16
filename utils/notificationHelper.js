const Notification = require("../models/notificationModel");

/**
 * Utility to create a notification
 * @param {string} recipient - User ID of the recipient
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type (request, approval, system, update)
 * @param {Object} metadata - Optional metadata (e.g., related IDs)
 * @param {string} sender - Optional User ID of the sender
 */
const createNotification = async ({
  recipient,
  title,
  message,
  type = "system",
  metadata = {},
  sender = null,
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      title,
      message,
      type,
      metadata,
      sender,
    });
    console.log(`Notification created for user ${recipient}: ${title}`);
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    // Don't throw error to prevent main process from failing
    return null;
  }
};

module.exports = { createNotification };
