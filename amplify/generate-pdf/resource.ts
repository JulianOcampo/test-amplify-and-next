import { defineFunction } from "@aws-amplify/backend";

export const generatePdfFunction = defineFunction({
    name: "generate-pdf",
    entry: "./handler.ts",
    runtime: 20,
    timeoutSeconds: 30,
});
