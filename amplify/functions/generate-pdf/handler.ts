import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { Schema } from "../../data/resource";
import fs from "fs/promises";
import path from "path";

export const handler: Schema["generatePdf"]["functionHandler"] = async (event) => {
  const html = event.arguments.html;
  if (!html) throw new Error("Missing html");

  // Obtener la ruta original del binario de Chromium
  let executablePath = await chromium.executablePath();

  if (executablePath) {
    // Copiar a /tmp para evitar ETXTBSY
    const tmpPath = path.join("/tmp", "chromium");
    await fs.copyFile(executablePath, tmpPath);
    executablePath = tmpPath;
  }

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath,
    headless: chromium.headless, // Usa el modo correcto según Sparticuz
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "domcontentloaded" });

  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  return Buffer.from(pdfBuffer).toString("base64");
};
