import https from "https";
import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import ffmpegStatic from "ffmpeg-static";
import { spawn } from "child_process";

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const fileUrl = body.fileUrl;
    if (!fileUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing fileUrl" }),
      };
    }

    const inputPath = path.join(os.tmpdir(), crypto.randomUUID() + path.extname(fileUrl));
    await downloadFile(fileUrl, inputPath);

    const outputPath = path.join(os.tmpdir(), crypto.randomUUID() + ".wav");
    await runFfmpeg(inputPath, outputPath);

    const wavBuffer = fs.readFileSync(outputPath);
    return {
      statusCode: 200,
      headers: { "Content-Type": "audio/wav" },
      body: wavBuffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

function downloadFile(url: string, dest: string) {
  return new Promise<void>((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { rejectUnauthorized: false }, (res) => {
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", reject);
  });
}

function runFfmpeg(input: string, output: string) {
  return new Promise<void>((resolve, reject) => {
    const ffmpeg = spawn(ffmpegStatic as string, ["-i", input, "-ar", "16000", "-ac", "1", output]);
    ffmpeg.on("error", reject);
    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}
