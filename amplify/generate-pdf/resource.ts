import { defineFunction } from "@aws-amplify/backend";

export const generatePdf = defineFunction({
  name: "generate-pdf",
  entry: "./handler.ts",
  runtime: 20,
  timeoutSeconds: 30
});
