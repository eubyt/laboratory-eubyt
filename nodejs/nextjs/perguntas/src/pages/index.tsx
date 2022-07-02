import type { NextPage } from "next";
import HeadComponent from "../components/head";
import HeaderComponent from "../components/header";
import CardQuest from "../components/card-quest";
import { AuthProvider } from "../context/auth";
import { useEffect, useState } from "react";
import { createQuestion, getAllQuestion } from "../firebase";
import { Timestamp } from "firebase/firestore";
import React from "react";
import { ChatIcon } from "@heroicons/react/outline";
import { ButtonPrimary } from "../components/button";
import NewQuest from "../components/new-quest";

const BodyQuest = ({ search }: { search: string | undefined }) => {
  const [questions, setQuestion] = React.useState<
    {
      id: string;
      title: string;
      userName: string;
      body: string;
      date: Timestamp;
    }[]
  >([]);

  useEffect(() => {
    getAllQuestion().then((snapshot) => {
      let array: {
        id: string;
        title: string;
        userName: string;
        body: string;
        date: Timestamp;
      }[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        array.push({
          id: doc.id,
          title: data.title,
          userName: data.userName,
          body: data.body,
          date: data.date,
        });
      });
      setQuestion(array);
    });
  }, []);

  return (
    <>
      {questions
        .filter((x) => {
          if (search === undefined) return true;
          return x.body.includes(search) || x.title.includes(search);
        })
        .map((data) => (
          <CardQuest
            key={data.id}
            userName={data.userName}
            title={data.title}
            date={data.date.toDate().toDateString()}
            body={data.body}
          />
        ))}
    </>
  );
};

const Home: NextPage = () => {
  const [isNewQuest, setOpenNewQuest] = useState(false);
  const [search, setSearch] = useState(undefined);
  return (
    <>
      <AuthProvider>
        <HeadComponent title="Perguntas" />

        <main>
          <div className={isNewQuest ? "blur-lg" : ""}>
            <HeaderComponent setSearch={setSearch}/>
          </div>
          {isNewQuest && <NewQuest onClose={() => setOpenNewQuest(false)} />}
          <div className={`m-2 mt-4 ${isNewQuest ? "blur-lg" : ""}`}>
            <div className="max-w-4xl w-full mx-auto">
              <div className="flex">
                {/* feed */}
                <div className="flex flex-col w-full">
                  <BodyQuest search={search} />
                </div>
              </div>
              <div
                className="fixed"
                style={{
                  bottom: "0",
                  right: "0",
                  zIndex: 1,
                  margin: "1rem",
                }}
              >
                <ButtonPrimary
                  roundedfull
                  onClick={() => setOpenNewQuest(true)}
                >
                  <ChatIcon width="36px" height="36px" />
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </main>
      </AuthProvider>
    </>
  );
};

export default Home;
