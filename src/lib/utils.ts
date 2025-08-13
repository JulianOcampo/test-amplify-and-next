import ffmpegStatic from "ffmpeg-static";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import crypto from "crypto";

import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

// Conversión a WAV usando ffmpeg-static
export function convertToWav(inputPath: string): Promise<string> {
    const outputPath = path.join(tmpdir(), crypto.randomUUID() + ".wav");
    console.log("Usando ffmpeg:", ffmpegStatic);
    console.log("Existe:", fs.existsSync(ffmpegStatic as string));

    return new Promise((resolve, reject) => {
        const ffmpeg = spawn(ffmpegStatic as string, [
            "-i", inputPath,
            "-ar", "16000",
            "-ac", "1",
            outputPath
        ]);

        ffmpeg.stderr.on("data", (d) => console.log("[ffmpeg]", d.toString()));
        ffmpeg.on("error", reject);
        ffmpeg.on("close", (code) => {
            if (code === 0) resolve(outputPath);
            else reject(new Error(`ffmpeg salió con código ${code}`));
        });
    });
}

// Generar PDF usando Puppeteer Core y Chromium reducido
export async function generatePdfFromHtml(html: string) {
    console.log("Generando PDF. Entorno Amplify:", !!process.env.AWS_EXECUTION_ENV);

    const browser = await puppeteer.launch({
        args: [...chromium.args, "--ignore-certificate-errors"],
        defaultViewport: { width: 1280, height: 800 },
        executablePath: await chromium.executablePath(),
        headless: true
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();
    return pdfBuffer;
}


