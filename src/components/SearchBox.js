import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

function SearchBox() {
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleSearch = (event) => {
      event.preventDefault();
      // Implement your search logic here
      console.log(`Searching for: ${searchTerm}`);
    };
  
    return (
      <form onSubmit={handleSearch} className="flex flex-row items-center rounded-lg border border-gray-400 px-6 py-3 w-full">
        <input
          type="text"
          placeholder="How is the category trending?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none p-0 w-full outline-none rounded-lg bg-transparent focus:outline-none focus:border-none"
        />
        <button
          type="submit"
          className="bg-blue-500 px-2 h-6 text-white mx-2"
        >
            <Image
              src="/assets/upArrow.png"
              alt="Play"
              className="flex justify-center w-3 h-3 drop-shadow-md"
              width={100}
              height={100}
            />
        </button>
      </form>

      
    );
  }
  
  export default SearchBox;