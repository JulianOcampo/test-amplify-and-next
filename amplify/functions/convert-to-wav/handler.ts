import { spawn } from "child_process";
import path from "path";
import { tmpdir } from "os";
import crypto from "crypto";
import fs from "fs";
import ffmpegStatic from "ffmpeg-static";
import https from "https";

export const handler = async (event: { fileUrl: string }) => {
  if (!event.fileUrl) throw new Error("Missing fileUrl");

  const inputPath = path.join(tmpdir(), crypto.randomUUID());
  const outputPath = path.join(tmpdir(), crypto.randomUUID() + ".wav");

  await new Promise<void>((resolve, reject) => {
    const file = fs.createWriteStream(inputPath);
    https.get(event.fileUrl, { rejectUnauthorized: false }, res => {
      res.pipe(file);
      file.on("finish", () => file.close(() => resolve()));
    }).on("error", reject);
  });

  await new Promise<void>((resolve, reject) => {
    const ffmpeg = spawn(ffmpegStatic as string, [
      "-i", inputPath,
      "-ar", "16000",
      "-ac", "1",
      outputPath
    ]);
    ffmpeg.on("close", code => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });

  const buffer = fs.readFileSync(outputPath);
  return buffer.toString("base64");
};
