import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Divider } from "@mui/material";
import { useRouter } from "next/router";

function NewChatButton({ setIsEmptyState }) {
  const router = useRouter();
  const handleClick = () => {
    // handle the click event here
    console.log("CLICK");
    router.push("/chat");
    setIsEmptyState(true);
  };
  return (
    <div
      className="flex justify-center space-x-2 mt-8  p-2 rounded-xl bg-customTeal-100 hover:cursor-pointer"
      onClick={handleClick}
    >
      <Image
        src="/assets/plus.png"
        alt="+"
        width={64}
        height={64}
        className="rounded-full object-contain w-3"
      />

      <span className="font-semibold text-xs md:text-sm">New Chat</span>
    </div>
  );
}

export default NewChatButton;
