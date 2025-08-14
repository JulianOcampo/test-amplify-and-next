import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { convertToWav } from "../functions/convert-to-wav/resource";
import { generatePdf } from "../functions/generate-pdf/resource";

const schema = a.schema({
  convertToWav: a.mutation()
    .arguments({ fileUrl: a.string() })
    .returns(a.string())
    .handler(a.handler.function(convertToWav)),

  generatePdf: a.mutation()
    .arguments({ html: a.string() })
    .returns(a.string())
    .handler(a.handler.function(generatePdf)),
});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
  authorizationModes: { defaultAuthorizationMode: "apiKey" },
});
