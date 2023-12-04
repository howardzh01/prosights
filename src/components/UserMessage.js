import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useState, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

function UserMessage({ avatarURL, content }) {
  return (
    <div className="flex flex-row items-start">
      <Image
        src={avatarURL}
        alt="User Avatar"
        width={64}
        height={64}
        className="rounded-full mr-6 w-12"
      />
      <p className="pt-3">{content}</p>
    </div>
  );
}

export default UserMessage;
