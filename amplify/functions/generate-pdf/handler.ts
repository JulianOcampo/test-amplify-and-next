import { Schema } from "../../data/resource";
import { generatePdfFromHtml } from "/opt/nodejs/utils"; 

export const handler: Schema["generatePdf"]["functionHandler"] = async (event) => {
  if (!event.arguments.html) throw new Error("Missing html");

  return await new Promise<string>(async (resolve, reject) => {
    try {
      const pdfBuffer = await generatePdfFromHtml(event.arguments.html);
      resolve(pdfBuffer.toString("base64")); // Retorna el PDF en base64
    } catch (err) {
      reject(err);
    }
  });
};
