import Link from "next/link";
import React, { Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import SearchBox from "../components/SearchBox";
import SideBar from "../components/SideBar";
import ChatEmptyState from "../components/ChatEmptyState";
import HelpButton from "../components/HelpButton";
import ChatFullState from "../components/ChatFullState";
import Head from "next/head";

function Chat() {
  // messages = [ { content: "hello", role: "user | assistant" }, ...]
  const [messages, setMessages] = useState([]);
  const [isEmptyState, setIsEmptyState] = useState(true);
  const [reset, setReset] = useState(false);
  const [result, setResult] = useState("");
  const resultRef = useRef();

  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  useEffect(() => {
    // Check if current is false in all messages
    if (messages.filter((message) => message.current).length === 0) {
      resultRef.current = "";
      // This is needed to trigger a reevaluation of the resultRef.current
      // setReset(!reset);
    }
  }, [messages]);

  useEffect(() => {
    if (isEmptyState && messages.length > 0) {
      setIsEmptyState(false);
    }
  }, [messages]);

  const getAIResponse = async (messages) => {
    const fetchResponse = async () => {
      const response = await fetch(`/api/private/getAIResponse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageHistory: messages,
        }),
        // signal: controller.signal,
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      const processStream = async () => {
        const { value, done } = await reader.read();
        if (done) {
          // Message ended, so set current to false & add warning if applicable
          setMessages((oldMessages) => {
            const messageMapping = oldMessages.map((message) => {
              if (message.current) {
                let messageContent = {
                  ...message,
                  content: message.content,
                  current: false,
                };
                return messageContent;
              } else {
                return message;
              }
            });
            return messageMapping;
          });
          return;
        }

        let previousResult = resultRef.current;
        resultRef.current = resultRef.current + decoder.decode(value);

        if (previousResult === "") {
          // Start of new message
          setMessages((oldMessages) => {
            const newMessages = [
              ...oldMessages,
              {
                role: "assistant",
                content: resultRef.current,
                current: true,
              },
            ];
            return newMessages;
          });
        } else {
          // Middle of a new message
          setMessages((oldMessages) => {
            const newMessages = oldMessages.map((message) => {
              if (message.current) {
                return {
                  ...message,
                  content: resultRef.current,
                };
              } else {
                return message;
              }
            });
            return newMessages;
          });
        }
        processStream();
      };
      processStream();
    };
    fetchResponse();
  };

  return (
    <div className="bg-customPurple-100">
      <Head>
        <title>ProSights Chat</title>
      </Head>

      <div className="flex h-screen relative overflow-hidden">
        {/* Sidebar */}
        <div className="absolute top-[-2%] left-[-8%] flex justify-center items-center w-[116%] h-[104%] ">
          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary opacity-30 rounded-full filter blur-[100px]" />
        </div>

        <div className="flex flex-row justify-center w-64 my-5 border-right">
          <SideBar setIsEmptyState={setIsEmptyState} />
        </div>
        {/* Main content */}
        <div className="flex flex-col justify-between w-full bg-background mx-2 my-4 px-24 rounded-xl opacity-100 z-10">
          {/* Chat content */}
          {/* <ChatEmptyState /> */}
          {isEmptyState ? (
            <ChatEmptyState />
          ) : (
            <ChatFullState messages={messages} />
          )}

          {/* Help Button */}
          <div className="absolute top-8 right-8">
            <HelpButton />
          </div>

          {/* Search area */}
          <div className="flex flex-row justify-center w-full my-5">
            <div className="w-full">
              <SearchBox
                setMessages={setMessages}
                getAIResponse={getAIResponse}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
