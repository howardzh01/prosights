import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useState, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

function AiMessage({ content, embeds, suggestions, finishedGenerating }) {
  return (
    <div className="flex flex-row items-start">
      <Image
        src={"/logo.png"}
        alt="ProSights AI"
        width={1024}
        height={1024}
        className="rounded-full mr-4 md:mr-6 w-8 md:w-12"
      />
      <div className="pt-1 md:pt-3">
        <p className="text-sm md:text-base">{content}</p>
        <div className="flex flex-row space-x-4 mt-4">
          {suggestions.map((suggestion) => (
            <div className="text-primary border border-primary rounded-xl py-2 px-4 md:font-semibold text-xs">
              {suggestion}
            </div>
          ))}
          <div className="flex flex-row items-center">
            <Image
              src={"/assets/sparkles.svg"}
              alt="Sparkles"
              width={64}
              height={64}
              className="mr-1 w-4"
            />
            <p className="text-primary font-semibold text-xs">Show more</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiMessage;
