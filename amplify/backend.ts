import { a, defineBackend } from "@aws-amplify/backend";
import { convertToWav } from "./convert-to-wav/resource";
import { generatePdf } from "./generate-pdf/resource";

defineBackend({
  generatePdf,
  convertToWav
});