const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const SibApiV3Sdk = require("@sendinblue/client");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Sendinblue Client
const sendinblueClient = new SibApiV3Sdk.TransactionalEmailsApi();
sendinblueClient.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.SENDINBLUE_API_KEY);

// Middleware
app.use(cors(
  {
    origin: "http://localhost:5173", 
    methods: "POST,GET",
    credentials: true,
  }
));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running at URL_ADDRESS:3000");
});

// API Endpoint for Form Submission
app.post("/submit-form", async (req, res) => {
  const { fullName, phone, email, state, campus, course } = req.body;

  if (!fullName || !email || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sendSmtpEmail = {
    to: [{ email: email }],
    sender: { email: "madhavarora132005@gmail.com" }, // Your verified sender email
    subject: "New Enquiry Form Submission",
    htmlContent: `
      <h2>New Enquiry Received</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>State:</strong> ${state}</p>
      <p><strong>Campus:</strong> ${campus}</p>
      <p><strong>Course:</strong> ${course}</p>
    `,
  };

  try {
    await sendinblueClient.sendTransacEmail(sendSmtpEmail);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error.message);
    console.error("Error details:", error);
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});