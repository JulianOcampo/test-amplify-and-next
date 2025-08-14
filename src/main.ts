import { Amplify } from "aws-amplify"
import { generateClient } from "aws-amplify/api"
import outputs from "./../amplify_outputs.json"
import { Schema } from "@amplify/data/resource"

Amplify.configure(outputs)

const client = generateClient<Schema>()
client.queries.sayHello({
  name: "Amplify",
})