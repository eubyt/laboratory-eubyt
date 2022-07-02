import React from "react";
import { AuthContext } from "../context/auth";
import { ButtonPrimary } from "./button";
import { useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import { createQuestion } from "../firebase";

const NewQuest = ({ onClose }: { onClose: () => void }) => {
  const auth = React.useContext(AuthContext);
  const [title, setTile] = React.useState("");
  const [body, setBody] = React.useState("");

  const onCreate = () => {
    const quest = {
        title, 
        body,
        userName: auth.displayName,
        date: Timestamp.fromDate(new Date())
    }

    createQuestion(quest).then(() => window.location.reload())

  }

  return (
    <div
      id="close"
      className="fixed w-screen h-screen items-center justify-center flex"
      style={{
        top: "0",
        left: "0",
        zIndex: 2,
      }}
      onMouseDown={(e) => {
        const id = (e.target as HTMLDivElement).id;
        if (id === "close") {
          onClose();
        }
      }}
    >
      <div className="border border-zinc-300 rounded-md drop-shadow-md p-3 flex flex-col w-auto mt-4 bg-slate-50 w-1/4">
        <div className="flex flex-col">
          <h2 className="text-2xl">Criar uma nova pergunta</h2>
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Titulo"
              className="px-6 py-3 rounded text-xl font-medium mt-4"
              value={title}
              onChange={(e) => setTile(e.target.value)}
            />
            <textarea
              placeholder="Pergunta"
              className="px-6 py-3 rounded text-xl font-medium mt-4"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <ButtonPrimary onClick={() => onCreate()}>Criar</ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewQuest;
