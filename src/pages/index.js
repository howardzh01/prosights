import Link from "next/link";
import React, { useEffect } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { useInView } from "react-intersection-observer";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/router";

function App() {
  const { ref, inView } = useInView({
    triggerOnce: false, // Change this to false if you want the animation to trigger again whenever it comes in view
  });
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/chat");
    }
  }, [isLoaded, router]);

  return (
    isLoaded &&
    !isSignedIn && (
      <div
        className="bg-gradient-to-br from-primaryInfusion via-white to-primaryInfusion pb-48 bg-repeat bg-center"
        style={{
          backgroundImage: "url('/assets/backgroundPattern.svg')",
        }}
      >
        <Navbar />
        <div className="flex flex-col items-center text-black mt-16 bg-background bg-opacity-50 pb-16">
          <div className="mb-6">
            <p className="text-primary border border-primary px-6 py-2 rounded-3xl font-medium">
              Insight to Action ⚡️
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center">
            The AI Copilot for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#009AFF] to-[#B84CEB]">
              Investors
            </span>
            .
          </h1>
          <p className="mb-20 text-xl font-light max-w-2xl text-center leading-relaxed">
            Understand any company in 30 seconds by chatting with ProSights.{" "}
            <br />
            We help you make better decisions by analyzing alternative data.
          </p>
          <div className="flex items-center">
            <Link
              href="#"
              className="flex flex-row items-center bg-primary text-white py-2 px-6 rounded-md hover:bg-blue-600 drop-shadow-lg mr-12 transition duration-300"
            >
              <p className="mr-4 text-lg">Try for Free</p>
              <Image
                src="/assets/topRightArrow.png"
                alt="Go"
                className="w-3 h-3"
                width={64}
                height={64}
              />
            </Link>
            <Link
              href="#"
              className="group flex flex-row items-center px-4 rounded-md"
            >
              <div className="bg-primary group-hover:bg-blue-600 rounded-full flex items-center justify-center w-10 h-10 mr-3 drop-shadow-md transition duration-300">
                <Image
                  src="/assets/play.png"
                  alt="Play"
                  className="w-3 h-4"
                  width={110}
                  height={150}
                />
              </div>
              <div className="flex flex-col">
                <p className="text-primary text-lg group-hover:text-blue-600 transition duration-300">
                  Watch demo
                </p>
                <p className="text-sm text-customGray-600">1 min</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="relative mt-24">
          <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full">
            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary opacity-50 rounded-full filter blur-[100px]" />
          </div>
          <div
            ref={ref}
            className={`transition-all duration-500 ${
              inView ? "scale-100" : "scale-90"
            }`}
          >
            <Image
              src="/assets/preview.svg"
              alt="Play"
              className="w-full h-full drop-shadow-2xl px-16 object-contain"
              width={4096}
              height={4096}
            />
          </div>
        </div>
      </div>
    )
  );
}

export default App;
