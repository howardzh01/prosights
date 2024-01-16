import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useState, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

function SearchBar({ setCompany }) {
  // always converts company to lowercase
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // if (searchTerm !== "" && resultRef.current === "" && !thinking) {
      if (searchTerm !== "") {
        send();
      }
    }
  };

  const send = async () => {
    // setMessages((oldMessages) => {
    //   const newMessages = [
    //     ...oldMessages,
    //     { role: "user", content: searchTerm },
    //   ];
    //   getAIResponse(newMessages);

    //   return newMessages;
    // });
    setCompany(searchTerm.toLowerCase());
    setSearchTerm("");
    // const container = messagesContainerRef.current;
    // shouldBeSnapping.current = true;
    // container.scrollTop = container.scrollHeight;
  };

  return (
    <div className="flex w-full flex-row bg-white border items-center border-customGray-50 rounded-lg px-4 py-1">
      <div className="flex flex-row items-center w-full">
        <Image
          src="/assets/search.svg"
          alt="Play"
          className="w-8 h-8 pr-4 object-contain"
          width={256}
          height={256}
        />
        <TextareaAutosize
          type="text"
          placeholder="Search for a company..."
          className={`w-full border-none font-nunito text-sm text-customGray-800 px-0 py-0 pr-2 mr-2 resize-none placeholder:text-customGray-150 focus:ring-0`}
          value={searchTerm}
          maxRows={1} // set to 1 so the textarea doesn't overflow
          minRows={1}
          // maxLength={2500}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

export default SearchBar;
