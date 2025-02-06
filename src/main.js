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
    // Send push notification
    const notificationResult = await messaging.createPush(
      `msg_${Date.now()}`, // Unique message ID
      title,
      body,
      [], // topics
      [receiverUserId], // Send to specific user
      [], // targets
      { message }, // Custom data
      "open_app", // action
      "", // image
      "icon.png", // icon
      "default", // sound
      "#FFFFFF", // color
      "msg_tag", // tag
      null, // badge
      false, // draft
      "", // scheduledAt
      false, // contentAvailable
      false, // critical
      sdk.MessagePriority.High // priority
    );
    
    // Return success response after notification is sent
    return res.json({ success: true, message: "Notification sent", result: notificationResult });
  } catch (err) {
    return res.json({ success: false, message: "Error sending notification: " + err.message }, 500);
  }

  return res.json({
    motto: "Build like a team of hundreds_",
    learn: "https://appwrite.io/docs",
    connect: "https://appwrite.io/discord",
    getInspired: "https://builtwith.appwrite.io",
  });
};
