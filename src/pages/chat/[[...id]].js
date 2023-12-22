import Link from "next/link";
import React, { Fragment, use } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import SearchBox from "../../components/SearchBox";
import SideBar from "../../components/SideBar";
import ChatEmptyState from "../../components/ChatEmptyState";
import HelpButton from "../../components/HelpButton";
import ChatFullState from "../../components/ChatFullState";
import Head from "next/head";
import { useUser } from "@clerk/clerk-react";
import ErrorToast from "../../components/ErrorToast";

function Chat() {
  // messages = [ { content: "hello", role: "user | assistant" }, ...]
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const { isSignedIn, user, isLoaded } = useUser();
  // const [reset, setReset] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [isInvalidChatId, setIsInvalidChatId] = useState(false);
  const [recentChats, setRecentChats] = useState([]);
  const resultRef = useRef();

  // After user loads, set chatid if specified and get chat
  useEffect(() => {
    if (router.query.id && isLoaded) {
      if (chatId === router.query.id[0]) {
        return;
      }
      setChatId(router.query.id[0]);
      getChat(user, router.query.id[0]);
    }
  }, [router, isLoaded]);

  // Clear typing box
  useEffect(() => {
    // Check if current is false in all messages
    if (messages.filter((message) => message.current).length === 0) {
      resultRef.current = "";
      // This is needed to trigger a reevaluation of the resultRef.current
      // setReset(!reset);
    }
  }, [messages]);

  // When message is submitted, ensure empty state is no longer there
  // useEffect(() => {
  //   if (isEmptyState && messages.length > 0) {
  //     setIsEmptyState(false);
  //   }
  // }, [messages]);

  // Reset states if forced to empty state
  useEffect(() => {
    if (messages.length === 0) {
      setIsInvalidChatId(false);
      setChatId(null);
      resultRef.current = "";
    }
  }, [messages]);

  // when messages change, save chat and push to router.
  useEffect(() => {
    if (
      messages.length > 0 &&
      messages.length % 2 === 0 &&
      isLoaded &&
      resultRef.current === ""
    ) {
      saveChat(user, messages, chatId).then((retChatId) => {
        if (messages.length === 2) {
          setChatId(retChatId);
          router.push(`/chat/${retChatId}`);
          if (
            recentChats.filter((chat) => chat.id === retChatId).length === 0
          ) {
            loadRecentChats(user);
          }
        }
      });
    }
  }, [messages]);

  // when page loads, retreive recent chats
  useEffect(() => {
    if (isLoaded) {
      loadRecentChats(user);
    }
  }, [isLoaded]);

  const loadRecentChats = async (user) => {
    const response = await fetch(`/api/private/getRecentChats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
      }),
      // signal: controller.signal,
    });
    const data = await response.json();
    setRecentChats(data.chatsData);
    console.log(data.chatsData);
  };

  const getChat = async (user, chatId) => {
    const response = await fetch(`/api/private/getChat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        chatId: chatId,
      }),
      // signal: controller.signal,
    });
    const data = await response.json();
    if (response.status == 404) {
      setIsInvalidChatId(true);
    }
    setMessages(data.messages);
  };

  const saveChat = async (user, messages, chatId) => {
    const response = await fetch(`/api/private/saveChat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        messages: messages,
        chatId: chatId,
      }),
    });
    const data = await response.json();
    return data.chatId;
  };

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
      {isInvalidChatId && <ErrorToast />}
      <Head>
        <title>ProSights Chat</title>
      </Head>
      <div className="flex h-screen relative overflow-hidden">
        {/* Sidebar */}
        <div className="absolute top-[-2%] left-[-8%] flex justify-center items-center w-[116%] h-[104%] ">
          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary opacity-30 rounded-full filter blur-[100px]" />
        </div>

        <div className="hidden md:flex md:flex-row justify-center w-64 my-5 border-right">
          <SideBar setMessages={setMessages} recentChatData={recentChats} />
        </div>
        {/* Main content */}
        <div className="flex flex-col justify-between w-full bg-background mx-2 my-4 px-4 md:px-8 lg:px-24 rounded-xl opacity-100 z-10">
          {/* Chat content */}
          {/* <ChatEmptyState /> */}
          {messages.length === 0 ? (
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
              <p>
                {chatId} {isInvalidChatId ? "404" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
