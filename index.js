

const express = require("express");
const { chromium } = require("playwright");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Playwright + Chromium server is running!");
});

app.get("/health", (req, res) => {
  res.json({ status: "online" });
});

app.post("/screenshot", async (req, res) => {
  const { url } = req.body;

  if (!url || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({
      error: "A valid HTTP or HTTPS URL is required"
    });
  }

  let browser;

  try {
    const target = new URL(url);

    if (target.username || target.password) {
      return res.status(400).json({
        error: "URLs containing credentials are not allowed"
      });
    }

    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000
    });

    const title = await page.title();

    const screenshot = await page.screenshot({
      fullPage: true,
      type: "png"
    });

    res.json({
      success: true,
      title,
      screenshot: screenshot.toString("base64")
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on ${PORT}`);
});
