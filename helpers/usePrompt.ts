import { useState } from "react";
import { flushSync } from "react-dom";

export default function usePrompt() {
  const [returnedPrompt, setReturnedPrompt] = useState<PromptResponse>({
    response: "",
    timestamp: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isBeingTyped, setIsBeingTyped] = useState(false);

  async function sendPrompt(prompt: string, onFinishPrompt: () => void) {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "text/event-stream",
        },
        body: JSON.stringify({
          prompt,
        }),
      });
      const reader = response.body
        ?.pipeThrough(new TextDecoderStream())
        .getReader();
      if (!reader) {
        console.log("No reader!");
        return;
      }

      let text = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          console.log("done");
          break;
        }

        // I don't know why, but I get multiple responses at once. This bugs out if there is
        // \n\n inside a message
        for (const splitValue of value
          .split("\n\n")
          .filter((value) => value.trim() !== "")) {
          const returnedObject = JSON.parse(splitValue.replace(/^data: /, ""));

          text = returnedObject.finished
            ? returnedObject.text
            : text + returnedObject.text;
        }

        if (text) {
          flushSync(() => {
            setReturnedPrompt({ response: text, timestamp: Date.now() });
            setIsLoading(false);
            setIsBeingTyped(true);
          });
        }
      }
      setIsBeingTyped(false);
      onFinishPrompt();
    } catch (e) {
      setIsLoading(false);
      setIsBeingTyped(false);
      console.error("Couldn't get response");
    }
  }

  return [returnedPrompt, isLoading, isBeingTyped, sendPrompt] as const;
}
