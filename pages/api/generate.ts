import { NextApiRequest, NextApiResponse } from "next";
import openAiClient from "@/helpers/openAiClient";

interface ResponseData {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");

  const { prompt } = JSON.parse(req.body);

  const events = openAiClient.listChatCompletions(
    "gpt-4",
    [{ role: "user", content: prompt }],
    { stream: true, maxTokens: 1000, temperature: 0.7 }
  );

  let response = "";
  for await (const event of events) {
    for (const choice of event.choices) {
      const delta = choice.delta?.content;
      if (delta !== undefined) {
        const message = { text: delta, finished: false };
        const stringifiedMessage = JSON.stringify(message);
        console.log(`data: ${stringifiedMessage}\n\n`);
        res.write(`data: ${stringifiedMessage}\n\n`);
        response += delta;
      }
    }
  }

  const message = { text: response, finished: true };
  const stringifiedMessage = JSON.stringify(message);
  console.log(`data: ${stringifiedMessage}\n\n`);
  res.write(`data: ${stringifiedMessage}\n\n`);
  res.end();
}
