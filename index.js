
const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>My Node.js Project</title>
      </head>
      <body style="background:#111;color:white;font-family:Arial;text-align:center;padding:60px">
        <h1>My Node.js Project is Online!</h1>
        <p>Your server is running successfully.</p>
        <p>Status: Online</p>
      </body>
    </html>
  `);
});

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    uptime: process.uptime()
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
