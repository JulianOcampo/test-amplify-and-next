import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { Schema } from "../../data/resource";

export const handler: Schema["generatePdf"]["functionHandler"] = async (event) => {
  const html = event.arguments.html;
  if (!html) throw new Error("Missing html");

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "domcontentloaded" });

  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  return Buffer.from(pdfBuffer).toString("base64");
};
