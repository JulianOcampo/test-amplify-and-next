import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const handler = async (event: any) => {
  const html = event?.html;
  if (!html) {
    return { statusCode: 400, body: "HTML is required" };
  }

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "domcontentloaded" });

  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

  await browser.close();

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/pdf" },
    body: Buffer.from(pdfBuffer).toString("base64"),
    isBase64Encoded: true
  };
};
