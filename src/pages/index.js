import Link from "next/link";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
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
  console.log("testing purposes", isSignedIn, user, isLoaded);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const credentialImagesMobile = [
    "/assets/credentialsLogos/permira.png",
    "/assets/credentialsLogos/goldman.png",
    "/assets/credentialsLogos/ycombinator.png",
    "/assets/credentialsLogos/apple.png",
    "/assets/credentialsLogos/jane.png",
    "/assets/credentialsLogos/citi.png",
    "/assets/credentialsLogos/credit.png",
  ];
  const credentialImagesRegular = [
    "/assets/credentialsLogos/permira.svg",
    "/assets/credentialsLogos/goldman.svg",
    "/assets/credentialsLogos/ycombinator.svg",
    "/assets/credentialsLogos/apple.svg",
    "/assets/credentialsLogos/jane.svg",
    "/assets/credentialsLogos/citi.svg",
    "/assets/credentialsLogos/credit.svg",
  ];
  const today = new Date().toLocaleDateString("en-CA"); // Get today's date in yyyy-mm-dd format

  const handleVideoModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Add this useEffect hook to handle the Escape key press
  useEffect(() => {
    const closeOnEscapeKey = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => document.body.removeEventListener("keydown", closeOnEscapeKey);
  }, []);

  return (
    isLoaded &&
    !isSignedIn && (
      <div className="flex flex-col items-center">
        {isModalOpen && (
          <div
            className="fixed z-50 top-0 left-0 px-8 w-full h-full flex items-center justify-center bg-customGray-800 bg-opacity-90"
            onClick={handleVideoModal}
          >
            <div
              className="drop-shadow-lg flex flex-row items-center justify-center w-3/4"
              onClick={(e) => e.stopPropagation()} // Add this line
            >
              {/* <button onClick={handleVideoModal} className="float-right">
                Close
              </button> */}
              <button
                onClick={handleVideoModal}
                className="absolute z-50 top-3 right-2 text-4xl text-customGray-300 hover:text-customGray-100 transition duration-300"
              >
                &times; {/* This is the X button */}
              </button>
              <video controls autoPlay className="mt-4 ">
                <source src="/assets/ProSightsDemo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
        <div
          className="hidden md:flex md:h-[750px] w-full absolute top-0 left-0 bg-cover bg-center bg-customGray-800"
          style={{
            backgroundImage: "url('/assets/backgroundPatternUberLight.svg')",
            clipPath: `ellipse(75% 90% at 50% 0%)`,
          }}
        />
        <div
          className="flex h-[550px] md:hidden w-full absolute top-0 left-0 bg-cover bg-center bg-customGray-800"
          style={{
            backgroundImage: "url('/assets/backgroundPatternUberLight.svg')",
            clipPath: `ellipse(150% 100% at 50% 0%)`,
          }}
        />
        <div
          className="w-full absolute top-0 left-0 h-72 bg-cover bg-center bg-customGray-800"
          style={{
            backgroundImage: "url('/assets/backgroundPatternUberLight.svg')",
          }}
        />
        <div className="absolute m-0 px-2">
          <Navbar />
          <div className="flex flex-col items-center text-customGray-50 mt-8 md:mt-16 bg-opacity-50 pb-16">
            <div className="mb-4 md:mb-6">
              <p className="text-secondary border border-secondary px-6 py-2 rounded-3xl font-medium text-xs md:text-sm">
                Insight to Action ⚡️
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 md:mb-12 text-center">
              Research Platform Built <br className="hidden md:flex" /> by{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#009AFF] to-[#B84CEB]">
                Private Equity
              </span>{" "}
              Investors.
            </h1>
            <p className="mb-16 md:mb-20 text-sm md:text-lg lg:text-xl font-light md:max-w-3xl lg:max-w-5xl text-center leading-relaxed md:leading-relaxed">
              Aggregate the best alternative data solutions to support the
              entire deal process: origination, diligence, and portfolio
              monitoring. Our interface gives quicker, better insights that are
              easily shared.
            </p>
            <div className="flex items-center">
              <a
                href={`https://calendly.com/prosightsdemo/30min?date=${today}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row items-center bg-primary text-customGray-50 py-2 px-4 md:px-6 rounded-md hover:bg-blue-600 drop-shadow-lg mr-8 md:mr-12 transition duration-300"
              >
                <p className="mr-2 md:mr-4 text-sm md:text-lg">Book a Demo</p>
                <Image
                  src="/assets/topRightArrow.png"
                  alt="Go"
                  className="w-2 h-2 md:w-3 md:h-3"
                  width={64}
                  height={64}
                />
              </a>
              <Link
                onClick={handleVideoModal}
                href=""
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
                  <p className="text-primary text-sm md:text-lg group-hover:text-blue-600 transition duration-300">
                    Watch preview
                  </p>
                  <p className="text-xs md:text-sm text-customGray-100">
                    1 min
                  </p>
                </div>
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center pt-[10vh] md:pt-36">
            <p className="font-bold text-sm md:text-base lg:text-lg text-center text-customGray-800">
              Built by ex-private equity and tech professionals from
            </p>
            <div className="flex flex-wrap justify-center items-center mt-8 gap-x-8 md:gap-x-12 gap-y-6 md:gap-y-8 md:hidden">
              {credentialImagesMobile.map((image, index) => (
                <div key={index}>
                  <Image
                    src={image}
                    alt="Preview"
                    className="h-8 md:h-10 lg:h-12 w-auto object-contain"
                    width={128}
                    height={128}
                  />
                </div>
              ))}
            </div>
            <div className="hidden md:flex flex-wrap justify-center items-center mt-8 gap-x-8 md:gap-x-12 gap-y-6 md:gap-y-8">
              {credentialImagesRegular.map((image, index) => (
                <div key={index}>
                  <Image
                    src={image}
                    alt="Preview"
                    className="h-8 md:h-10 lg:h-12 w-auto object-contain"
                    width={128}
                    height={128}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="relative mt-24 md:mt-36 max-w-screen-2xl">
            <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full">
              <div className="w-full h-full bg-gradient-to-br from-primary to-secondary opacity-50 rounded-full filter blur-[100px]" />
            </div>
            <div
              ref={ref}
              className={`md:transition-all md:duration-500 ${
                inView ? "md:scale-100" : "md:scale-90"
              } px-4 md:px-16 `}
            >
              <Image
                src="/assets/preview5.png"
                alt="Preview"
                className="w-full h-full drop-shadow-2xl object-contain rounded-xl"
                width={4096}
                height={4096}
              />
            </div>
          </div>
          <p className="text-customGray-200 font-light pt-24 md:pt-48 pb-8 w-full text-center text-xs md:text-sm">
            Copyright © 2024 Prosights, Inc. All rights reserved.
          </p>
        </div>
      </div>
    )
  );
}

export default App;
