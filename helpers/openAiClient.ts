import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const openAiClient = new OpenAIClient(
  process.env.GPT_URL || "",
  new AzureKeyCredential(process.env.GPT_KEY || "")
);

export default openAiClient;
