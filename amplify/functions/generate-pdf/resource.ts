import { defineFunction } from "@aws-amplify/backend";

export const generatePdf = defineFunction({
  name: "generate-pdf",
  entry: "./handler.ts",
  runtime: 20,
  timeoutSeconds: 360,
  memoryMB: 2048,
  bundling: {
    minify: false
  },
  layers: {
    "layer-puppeteer-utils":
      "arn:aws:lambda:us-east-2:018889390014:layer:layer-puppeteer-utils:1",
  },
});
