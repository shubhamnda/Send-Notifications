import { ID } from 'appwrite';
import { Client, Users, Messaging } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID).setKey(process.env.APPWRITE_API_KEY);
   
  
  const users = new Users(client);
  const messaging = new Messaging(client);

  try {
    // List all users (for debugging or logging purposes)
    const response = await users.list();
    log(`Total users: ${response.total}`);
  } catch(err) {
    error("Could not list users: " + err.message);
  }

  // Handle the /ping route
  if (req.path === "/ping") {
    return res.text("Pong");
  }

  // Extract message details from the request body
  const { currentUserId, receiverUserId, message, title, body } = req.body;

if (!currentUserId || !receiverUserId || !message || !title || !body) {
  return res.json({ success: false, message: "Missing required parameters" }, 400);
}


try {
  const notificationResult = await messaging.createPush(
    ID.unique, 
    title,
    body,
    [], // No topics
    [receiverUserId], // User ID to receive the push
    [], // No additional targets
    { message },
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
    sdk.MessagePriority.High
  );

  log(`Notification result: ${JSON.stringify(notificationResult)}`);
  return res.json({ success: true, message: "Notification sent", result: notificationResult });
} catch (err) {
  log(`APNs Error: ${err.message}`);
  return res.json({ success: false, message: "Error sending notification: " + err.message }, 500);
}


  return res.json({
    motto: "Build like a team of hundreds_",
    learn: "https://appwrite.io/docs",
    connect: "https://appwrite.io/discord",
    getInspired: "https://builtwith.appwrite.io",
  });
};
