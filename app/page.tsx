"use client";

import {
  Board,
  generateBoard,
  playGameOfLife,
  ImageData,
} from "@/helpers/gameOfLife";
import usePrompt from "@/helpers/usePrompt";
import { KeyboardEvent, useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  // const [promptText, setPromptText] = useState("");
  // const [response, isResponseLoading, isResponseBeingTyped, sendPrompt] =
  //   usePrompt();
  // const [allResponses, setAllResponses] = useState<PromptResponse[]>([]);

  // const handleFinishPrompt = () => {
  //   setAllResponses((prev) => {
  //     const newAllResponses = [...prev, response];

  //     const responsesFromStorageAsString = localStorage.getItem("responses");

  //     let responsesFromStorage: PromptResponse[] = [];

  //     try {
  //       if (responsesFromStorageAsString) {
  //         responsesFromStorage = JSON.parse(responsesFromStorageAsString);
  //       }

  //       responsesFromStorage.push(response);
  //     } catch (e) {
  //       console.error(
  //         `Coudn't parse "${responsesFromStorageAsString}" into JSON`
  //       );
  //       responsesFromStorage = newAllResponses;
  //     }

  //     const responsesForStorage = JSON.stringify(responsesFromStorage);

  //     localStorage.setItem("responses", responsesForStorage);

  //     return [...prev, response];
  //   });
  // };

  // useEffect(() => {
  //   const responsesFromStorageAsString = localStorage.getItem("responses");

  //   try {
  //     if (responsesFromStorageAsString) {
  //       const responsesFromStorage = JSON.parse(responsesFromStorageAsString);
  //       setAllResponses(responsesFromStorage);
  //     }
  //   } catch (e) {
  //     console.error(
  //       `Coudn't parse "${responsesFromStorageAsString}" into JSON`
  //     );
  //   }
  // }, []);

  // const onEnterPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
  //   const isEnterPressed = e.keyCode == 13 && e.shiftKey == false;

  //   if (isEnterPressed) {
  //     e.preventDefault();
  //     sendPrompt(promptText, handleFinishPrompt);
  //     e.currentTarget.value = "";
  //   }
  // };

  const [board, setBoard] = useState<Board>();
  const [iterations, setIterations] = useState("");
  const [boardImageData, setBoardImageData] = useState<ImageData>();
  const [message, setMessage] = useState("");

  const play = () => {
    const iterationsNumber = Number(iterations);
    console.log(iterationsNumber);

    if (!Number.isInteger(iterationsNumber) || iterationsNumber < 1) {
      setMessage("Iterations must exist and be a positive integer");
      return;
    }

    if (!board) {
      setMessage("Please, generate the board first");
      return;
    }

    const imageData = playGameOfLife(board, iterationsNumber);

    setBoardImageData(imageData);
    setMessage("Image has been created");
  };

  const handleGenerateBoard = () => {
    setBoard(generateBoard);
    setMessage("Board has been generated");
  };

  return (
    <main className="flex flex-col gap-4 m-auto w-full max-w-lg">
      {/* {allResponses.map(({ response, timestamp }) => (
        <p key={timestamp}>{response}</p>
      ))}
      {isResponseLoading && <p>Loading...</p>}
      {isResponseBeingTyped && <p>{response.response}</p>}
      {allResponses.length === 0 && !response.response && (
        <p>Nothing to show</p>
      )}
      <textarea
        value={promptText}
        onChange={(e) => setPromptText(e.target.value)}
        onKeyDown={onEnterPress}
      ></textarea> */}
      {message && <p>{message}</p>}
      <label>
        Iterations:
        <input
          className="border-solid border-2 border-sky-500"
          onChange={(e) => setIterations(e.target.value)}
          value={iterations}
        />
      </label>
      <button
        className="border-solid border-2 border-sky-500"
        onClick={handleGenerateBoard}
      >
        Generate board
      </button>
      <button className="border-solid border-2 border-sky-500" onClick={play}>
        Run game
      </button>
      {boardImageData && (
        <Image
          src={boardImageData.imageUrl}
          height={boardImageData.height}
          width={boardImageData.width}
          alt="Game of Life board"
        />
      )}
    </main>
  );
}
