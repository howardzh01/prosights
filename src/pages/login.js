import React from "react";
import { SignIn } from "@clerk/nextjs";

function Login() {
  return (
    <div
      className="relative flex justify-center items-center h-screen w-full bg-gradient-to-br from-primaryInfusion via-white to-primaryInfusion bg-contain bg-repeat bg-center"
      style={{
        backgroundImage: "url('/assets/backgroundPattern.svg')",
        backgroundSize: "cover",
      }}
    >
      <div className="flex justify-center items-center absolute top-0 left-0 w-full h-full">
        <div className="w-2/3 h-2/3 bg-gradient-to-br from-primary to-secondary opacity-10 rounded-full filter blur-[100px]" />
      </div>
      <SignIn
        path="/login"
        routing="path"
        signUpUrl="/sign-up"
        redirectUrl="/"
      />
    </div>
  );
}

export default Login;
