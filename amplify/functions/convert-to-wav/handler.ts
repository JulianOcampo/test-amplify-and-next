import { spawn } from "child_process";
import https from "https";
import { Schema } from "../../data/resource";

export const handler: Schema["convertToWav"]["functionHandler"] = async (event) => {
  if (!event.arguments.fileUrl) throw new Error("Missing fileUrl");

  return await new Promise<string>((resolve, reject) => {
    const ffmpegPath = "/opt/bin/ffmpeg"; // ffmpeg desde el Layer

    const ffmpeg = spawn(ffmpegPath, [
      "-i", "pipe:0",  // Entrada por stdin
      "-ar", "16000",  // Sample rate
      "-ac", "1",      // Mono
      "-f", "wav",     // Salida WAV
      "pipe:1"         // Salida por stdout
    ]);

    const chunks: Buffer[] = [];

    ffmpeg.stdout.on("data", (chunk) => chunks.push(chunk));
    ffmpeg.on("error", reject);
    ffmpeg.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`ffmpeg exited with code ${code}`));
      } else {
        const buffer = Buffer.concat(chunks);
        resolve(buffer.toString("base64")); // Retorna el WAV en base64
      }
    });

    https
      .get(event.arguments.fileUrl!, { rejectUnauthorized: false }, (res) => {
        res.pipe(ffmpeg.stdin);
      })
      .on("error", reject);
  });
};