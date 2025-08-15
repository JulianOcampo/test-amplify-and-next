import { defineBackend } from "@aws-amplify/backend";
import { convertToWav } from "./functions/convert-to-wav/resource";
import { generatePdf } from "./functions/generate-pdf/resource";
import { sayHello } from './functions/say-hello/resource';
import { data } from './data/resource';
import { defineResources } from "./custom/layers/stack";

const backend = defineBackend({
  data,
  convertToWav,
  generatePdf,
  sayHello,
});

const custom = backend.createStack("WASCustomLayers");
const { ffmpegLayer, puppeteerUtilsLayer } = defineResources({ stack: custom });

backend.convertToWav.resources.cfnResources.cfnFunction.layers?.push(ffmpegLayer.layerVersionArn);

backend.generatePdf.resources.cfnResources.cfnFunction.layers?.push(puppeteerUtilsLayer.layerVersionArn);

