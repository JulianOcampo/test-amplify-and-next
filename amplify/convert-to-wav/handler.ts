import { spawn } from "child_process";
import ffmpegStatic from "ffmpeg-static";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import crypto from "crypto";

export const handler = async (event: any) => {
  const inputUrl = event?.inputUrl;
  if (!inputUrl) {
    return { statusCode: 400, body: "inputUrl is required" };
  }

  const outputPath = path.join(tmpdir(), crypto.randomUUID() + ".wav");

  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(ffmpegStatic as string, [
      "-i", inputUrl,
      "-ar", "16000",
      "-ac", "1",
      outputPath
    ]);

    ffmpeg.stderr.on("data", (d) => console.log("[ffmpeg]", d.toString()));
    ffmpeg.on("error", reject);
    ffmpeg.on("close", (code) => {
      if (code === 0) {
        const wavData = fs.readFileSync(outputPath);
        resolve({
          statusCode: 200,
          isBase64Encoded: true,
          headers: { "Content-Type": "audio/wav" },
          body: wavData.toString("base64")
        });
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });
  });
};
