import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function launchBrowser() {
  let browser;
  console.log("Launching browser...", process.env.AWS_EXECUTION_ENV);

  if (process.env.AWS_EXECUTION_ENV) {
    browser = await puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
      defaultViewport: { width: 1280, height: 800 }
    });
  } else {
    const puppeteer = require("puppeteer");
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
        "--single-process"
      ]
    });
  }

  return browser;
}

export async function generatePdfFromHtml(html: string): Promise<Buffer> {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();
  return pdfBuffer;
}

