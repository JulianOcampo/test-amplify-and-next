import { defineBackend } from "@aws-amplify/backend";
import { convertToWav } from "./functions/convert-to-wav/resource";
import { generatePdf } from "./functions/generate-pdf/resource";
import { sayHello } from './functions/say-hello/resource';


defineBackend({
  sayHello
});