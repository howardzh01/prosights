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
      router.push("/dashboard");
    }
  }, [isLoaded, router]);

  return (
    isLoaded &&
    !isSignedIn && (
      <div
        className="bg-gradient-to-br from-primaryInfusion via-white to-primaryInfusion pb-24 md:pb-48 bg-repeat bg-center"
        style={{
          backgroundImage: "url('/assets/backgroundPattern.svg')",
        }}
      >
        <Navbar />
        <div className="flex flex-col items-center text-black mt-16 bg-background bg-opacity-50 pb-16">
          <div className="mb-4 md:mb-6">
            <p className="text-primary border border-primary px-6 py-2 rounded-3xl font-medium text-xs md:text-base">
              Insight to Action ⚡️
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-8 md:mb-12 text-center">
            Research Platform Built <br /> by{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#009AFF] to-[#B84CEB]">
              Private Equity
            </span>{" "}
            Investors.
          </h1>
          <p className="mb-16 md:mb-20 mx-4 md:mx-0 text-base md:text-xl font-light md:max-w-3xl lg:max-w-5xl text-center leading-relaxed md:leading-relaxed">
            Aggregate the best alternative data solutions to support the entire
            deal process: origination, diligence, and portfolio monitoring. Our
            interface gives quicker, better insights that can be easily shared.
          </p>
          <div className="flex items-center">
            {/* <a
              href="https://calend.ly/jw00zy"
              className="flex flex-row items-center bg-primary text-white py-2 px-4 md:px-6 rounded-md hover:bg-blue-600 drop-shadow-lg mr-12 transition duration-300"
            > */}
            <a
              href="https://calend.ly/jw00zy"
              className="flex flex-row items-center bg-primary text-white py-2 px-4 md:px-6 rounded-md hover:bg-blue-600 drop-shadow-lg transition duration-300"
            >
              <p className="mr-2 md:mr-4 text-base md:text-lg">Book a Demo</p>
              <Image
                src="/assets/topRightArrow.png"
                alt="Go"
                className="w-2 h-2 md:w-3 md:h-3"
                width={64}
                height={64}
              />
            </a>
            {/* <Link
              href="#"
              className="group flex flex-row items-center rounded-md"
            >
              <div className="bg-primary group-hover:bg-blue-600 rounded-full flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mr-3 drop-shadow-md transition duration-300">
                <Image
                  src="/assets/play.png"
                  alt="Play"
                  className="w-2 h-3 md:w-3 md:h-4"
                  width={110}
                  height={150}
                />
              </div>
              <div className="flex flex-col">
                <p className="text-primary text-base md:text-lg group-hover:text-blue-600 transition duration-300">
                  Watch demo
                </p>
                <p className="text-xs md:text-sm text-customGray-600">1 min</p>
              </div>
            </Link> */}
          </div>
        </div>
        <div className="relative mt-12 md:mt-24">
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
              src="/assets/preview2.svg"
              alt="Preview"
              className="w-full h-full drop-shadow-2xl px-4 md:px-16 object-contain"
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
