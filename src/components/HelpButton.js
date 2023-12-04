import Link from "next/link";
import Image from "next/image";
import React from "react";

function HelpButton() {
  return (
    <div className="">
      <Image
        src="/assets/question.png"
        alt="?"
        width={25}
        height={25}
        className="rounded-full"
      />
    </div>
  );
}

export default HelpButton;
