import { Schema } from "../../data/resource";

export const handler: Schema["generatePdf"]["functionHandler"] = async (event) => {
  if (!event.arguments.html) throw new Error("Missing HTML");

  return await new Promise<string>(async (resolve, reject) => {
    try {
      // @ts-ignore: Este import solo existe en Lambda con la Layer
      const { generatePdfFromHtml } = await import("/opt/nodejs/node_modules/lambda-utils");

      const pdfBuffer = await generatePdfFromHtml(event.arguments.html);
      resolve(pdfBuffer.toString("base64"));
    } catch (err) {
      reject(err);
    }
  });
};
