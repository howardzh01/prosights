import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useState, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useUser } from "@clerk/clerk-react";
import UserMessage from "./UserMessage";
import AiMessage from "./AiMessage";

function ChatFullState({ messages }) {
  const { isSignedIn, user, isLoaded } = useUser();

  return (
    <div className="w-full space-y-4 mt-6">
      {messages &&
        messages.map((message) => {
          if (message.role === "user") {
            return (
              <UserMessage
                avatarURL={"/assets/defaultProfilePicture.png"}
                content={message.content}
              />
            );
          } else {
            return (
              <AiMessage
                content={message.content}
                embed={["?"]}
                suggestions={[
                  "Show me the company momentum",
                  "What are the comps valued at?",
                ]}
                finishedGenerating={true}
              />
            );
          }
        })}
    </div>
  );
}

export default ChatFullState;
