import type { Schema } from "../../data/resource"
import { v4 as uuidv4 } from "uuid";
export const handler: Schema["sayHello"]["functionHandler"] = async (event) => {
  // arguments typed from `.arguments()`
  const { name } = event.arguments
  // return typed from `.returns()`
  return `Hello, ${name}! Your request ID is ${uuidv4()}`
}