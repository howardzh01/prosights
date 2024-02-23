import React from "react";
import { SignIn } from "@clerk/nextjs";

function Page() {
  return (
    <div
      className="relative flex flex-col justify-center items-center h-screen w-full bg-gradient-to-br from-primaryInfusion via-white to-primaryInfusion bg-contain bg-repeat bg-center"
      style={{
        backgroundImage: "url('/assets/backgroundPattern.svg')",
        backgroundSize: "cover",
      }}
    >
      <div className="flex justify-center items-center absolute top-0 left-0 w-full h-full">
        <div className="w-2/3 h-2/3 bg-gradient-to-br from-primary to-secondary opacity-10 rounded-full filter blur-[100px]" />
      </div>
      <p className="text-customGray-800 text-base mb-6 font-semibold z-50">
        New? Request access by emailing{" "}
        <a
          href="mailto:info@prosights.co"
          className="underline text-primary hover:text-blue-600 cursor-pointer transition duration-300"
        >
          info@prosights.co
        </a>
      </p>
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        redirectUrl="/"
      />
    </div>
  );
}

export default Page;
