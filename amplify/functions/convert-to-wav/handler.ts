import { spawn } from "child_process";
import ffmpegStatic from "ffmpeg-static";
import https from "https";
import { Schema } from "../../data/resource";

export const handler: Schema["convertToWav"]["functionHandler"] = async (event) => {
  if (!event.arguments.fileUrl) throw new Error("Missing fileUrl");

  return await new Promise<string>((resolve, reject) => {
    const ffmpeg = spawn(ffmpegStatic as string, [
      "-i", "pipe:0",
      "-ar", "16000",
      "-ac", "1",
      "-f", "wav",
      "pipe:1"
    ]);

    const chunks: Buffer[] = [];

    ffmpeg.stdout.on("data", (chunk) => chunks.push(chunk));
    ffmpeg.on("error", reject);
    ffmpeg.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`ffmpeg exited with code ${code}`));
      } else {
        const buffer = Buffer.concat(chunks);
        resolve(buffer.toString("base64"));
      }
    });

    https.get(event.arguments.fileUrl!, { rejectUnauthorized: false }, (res) => {
      res.pipe(ffmpeg.stdin);
    }).on("error", reject);
  });
};
