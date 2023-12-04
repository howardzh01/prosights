import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useState, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

function SearchBox() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // if (searchTerm !== "" && resultRef.current === "" && !thinking) {
      if (searchTerm !== "") {
        send(searchTerm);
      }
    }
  };

  const send = async (text) => {
    // setMessages((oldMessages) => {
    //   const newMessages = [
    //     ...oldMessages,
    //     {
    //       sender: "self",
    //       text: text,
    //       review: false,
    //     },
    //   ];
    //   return newMessages;
    // });

    // getResponse(messages, text);

    setSearchTerm("");
    // const container = messagesContainerRef.current;
    // shouldBeSnapping.current = true;ß
    // container.scrollTop = container.scrollHeight;
  };

  return (
    <div className="flex items-stretch flex-row border border-customGray-300 rounded-2xl px-6 py-3">
      <div className="flex flex-row items-center w-full">
        <TextareaAutosize
          type="text"
          placeholder="Message"
          className={`w-full border-none font-nunito text-base text-dark px-0 py-0 pr-2 mr-2 resize-none placeholder:text-customLightGray focus:ring-0 caret-primary`}
          value={searchTerm}
          maxRows={8}
          minRows={1}
          // maxLength={2500}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="flex flex-row items-end justify-end">
        <div
          className={`flex flex-col justify-center items-center w-8 h-8 flex-shrink-0 rounded-md ${
            searchTerm.length > 0
              ? "bg-gradient-to-br from-primary to-secondary"
              : "bg-customGray-200"
          }`}
        >
          <Image
            src="/assets/upArrow.png"
            className="w-3 h-auto"
            alt="Send"
            width={32}
            height={32}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchBox;
