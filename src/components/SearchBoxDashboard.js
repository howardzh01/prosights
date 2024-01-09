import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useState, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

function SearchBoxDashboard({ setCompany }) {
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
    setCompany(searchTerm);
    setSearchTerm("");
    // const container = messagesContainerRef.current;
    // shouldBeSnapping.current = true;
    // container.scrollTop = container.scrollHeight;
  };

  return (
    <div className="flex w-1/2 items-stretch flex-row border border-customGray-300 rounded-2xl px-6 py-3">
      <div className="flex flex-row items-center w-full">
        <TextareaAutosize
          type="text"
          placeholder="Search for a Company"
          className={`w-full border-none font-nunito text-base text-dark px-0 py-0 pr-2 mr-2 resize-none placeholder:text-customLightGray focus:ring-0`}
          value={searchTerm}
          maxRows={1} // set to 1 so the textarea doesn't overflow
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
            onClick={send}
            alt="Send"
            width={32}
            height={32}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchBoxDashboard;
