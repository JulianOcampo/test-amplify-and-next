import { convertToWav, generatePdfFromHtml } from "@/lib/utils";
import { NextResponse } from "next/server";
import { tmpdir } from "os";
import path from "path";
import fs from "fs";
import https from "https";
import http from "http";


async function downloadFile(url: string): Promise<string> {
    const filePath = path.join(tmpdir(), crypto.randomUUID() + path.extname(url.split("?")[0]));
    const fileStream = fs.createWriteStream(filePath);

    const client = url.startsWith("https") ? https : http;
    const agent = new https.Agent({ rejectUnauthorized: false }); // Ignorar SSL inválido en pruebas

    return new Promise((resolve, reject) => {
        client.get(url, { agent }, (res) => {
            if (res.statusCode && res.statusCode >= 400) {
                return reject(new Error(`Error descargando archivo: ${res.statusCode}`));
            }
            res.pipe(fileStream);
            fileStream.on("finish", () => {
                fileStream.close();
                resolve(filePath);
            });
        }).on("error", reject);
    });
}

export async function POST(request: Request) {
    try {
        const { fileUrl, format } = await request.json();

        if (!fileUrl || typeof fileUrl !== "string") {
            return NextResponse.json({ error: "Debe enviar 'fileUrl' (string)" }, { status: 400 });
        }

        // 1. Descargar
        const inputPath = await downloadFile(fileUrl);

        // 2. Convertir a WAV
        const wavPath = await convertToWav(inputPath);

        // 3. Generar PDF
        const pdfBuffer = await generatePdfFromHtml(`<h1>Archivo procesado</h1><p>${fileUrl}</p>`);

        // 4. Decidir qué devolver
        if (format === "wav") {
            const wavBuffer = fs.readFileSync(wavPath);
            return new NextResponse(wavBuffer, {
                headers: {
                    "Content-Type": "audio/wav",
                    "Content-Disposition": 'attachment; filename="resultado.wav"'
                }
            });
        }

        if (format === "pdf") {
            const pdfNodeBuffer = Buffer.from(pdfBuffer); // <-- conversión explícita
            return new NextResponse(pdfNodeBuffer, {
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": 'attachment; filename="resultado.pdf"'
                }
            });
        }

        // Si no pide formato, devolvemos ambos como base64
        // Si no pide formato, devolvemos ambos en base64
        return NextResponse.json({
            wavBase64: fs.readFileSync(wavPath).toString("base64"),
            pdfBase64: Buffer.from(pdfBuffer).toString("base64")
        });


    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
