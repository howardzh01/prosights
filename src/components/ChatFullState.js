import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useState, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useUser } from "@clerk/clerk-react";
import UserMessage from "./UserMessage";
import AiMessage from "./AiMessage";

function ChatFullState() {
  const { isSignedIn, user, isLoaded } = useUser();
  return (
    <div className="w-full">
      <UserMessage
        avatarURL={"/assets/defaultProfilePicture.png"}
        message={
          "hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie hungry howie "
        }
      />
      <AiMessage
        message={"hungry howie wants a pizza"}
        embed={["?"]}
        suggestions={[
          "Show me the company momentum",
          "What are the comps valued at?",
        ]}
        finishedGenerating={true}
      />
    </div>
  );
}

export default ChatFullState;
