import { defineBackend } from "@aws-amplify/backend";
import { convertToWavFunction } from "./convert-to-wav/resource";
import { generatePdfFunction } from "./generate-pdf/resource";

defineBackend({
  convertToWavFunction,
  generatePdfFunction
});
