import { defineFunction } from "@aws-amplify/backend";

export const convertToWavFunction = defineFunction({
  name: "convert-to-wav",
  entry: "./handler.ts",
  runtime: 20, 
  timeoutSeconds: 30,
});
