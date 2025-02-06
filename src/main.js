import { Client, Users, Messaging, ID } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const users = new Users(client);
  const messaging = new Messaging(client);

  try {
    const response = await users.list();
    log(`Total users: ${response.total}`);
  } catch(err) {
    error("Could not list users: " + err.message);
  }

  if (req.path === "/ping") {
    return res.text("Pong");
  }

  const { currentUserId, receiverUserId, message, title, body } = req.body;

  if (!currentUserId || !receiverUserId || !message || !title || !body) {
    return res.json({ success: false, message: "Missing required parameters" }, 400);
  }

  try {
    const notificationResult = await messaging.createPush(
      ID.unique(), 
      title,
      body,
      [],
      [receiverUserId],
      [],
      {
        aps: {
          alert: {
            title: title,
            body: message
          },
          sound: "default"
        }
      },
      "open_app",
      "",
      "icon.png",
      "default",
      "#FFFFFF",
      "msg_tag",
      null,
      false,
      "",
      false,
      false,
      Messaging.MessagePriority.HIGH
    );

    log(`Notification result: ${JSON.stringify(notificationResult)}`);
    return res.json({ success: true, message: "Notification sent", result: notificationResult });
  } catch (err) {
    error(`APNs Error: ${err.message}`);
    return res.json({ success: false, message: "Error sending notification: " + err.message }, 500);
  }

  return res.json({
    motto: "Build like a team of hundreds_",
    learn: "https://appwrite.io/docs",
    connect: "https://appwrite.io/discord",
    getInspired: "https://builtwith.appwrite.io",
  });
};
