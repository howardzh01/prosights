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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const credentialImages = [
    "/assets/credentialsLogos/permira.svg",
    "/assets/credentialsLogos/goldman.svg",
    "/assets/credentialsLogos/ycombinator.svg",
    "/assets/credentialsLogos/apple.svg",
    "/assets/credentialsLogos/jane.svg",
    "/assets/credentialsLogos/citi.svg",
    "/assets/credentialsLogos/credit.svg",
  ];
  const heightRef = useRef(null);
  const [backgroundHeight, setBackgroundHeight] = useState(0);

  const handleVideoModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, router]);

  useEffect(() => {
    const handleResize = () => {
      if (heightRef.current) {
        const rect = heightRef.current.getBoundingClientRect();
        setBackgroundHeight(rect.top);
      }
    };

    // Delay the initial measure just a bit to allow for the layout to settle
    const timeoutId = setTimeout(handleResize, 300); // Adjust the delay as needed

    window.addEventListener("resize", handleResize);

    // Clean up the event listener and the timeout when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []); // Empty array ensures this effect runs only on mount

  return (
    isLoaded &&
    !isSignedIn && (
      <div className="">
        {isModalOpen && (
          <div
            className="fixed z-50 top-0 left-0 px-8 w-full h-full flex items-center justify-center bg-customGray-800 bg-opacity-90"
            onClick={handleVideoModal}
          >
            <div
              className="drop-shadow-lg"
              onClick={(e) => e.stopPropagation()} // Add this line
            >
              <button onClick={handleVideoModal} className="float-right">
                Close
              </button>
              <video controls autoPlay className="mt-4">
                <source src="/assets/ProSightsDemo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
        <div
          className="hidden md:flex w-full absolute top-0 left-0 bg-cover bg-center bg-customGray-800"
          style={{
            height: `${backgroundHeight}px`,
            backgroundImage: "url('/assets/backgroundPatternUberLight.svg')",
            clipPath: `ellipse(60% ${backgroundHeight / 2}px at 50% ${
              backgroundHeight / 2
            }px)`,
          }}
        />
        <div
          className="flex md:hidden w-full absolute top-0 left-0 bg-cover bg-center bg-customGray-800"
          style={{
            height: `${backgroundHeight}px`,
            backgroundImage: "url('/assets/backgroundPatternUberLight.svg')",
            clipPath: `ellipse(100% ${backgroundHeight / 2}px at 50% ${
              backgroundHeight / 2
            }px)`,
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
                href="https://calendly.com/prosightsdemo"
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
          <div ref={heightRef}></div>
          <div className="flex flex-col justify-center items-center pt-24 md:pt-36">
            <p className="font-bold text-sm md:text-base lg:text-lg text-center text-customGray-800">
              Built by ex-private equity and tech professionals from
            </p>
            <div className="flex flex-wrap justify-center items-center mt-8 gap-x-8 md:gap-x-12 gap-y-6 md:gap-y-8">
              {credentialImages.map((image, index) => (
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
          <div className="relative mt-12 md:mt-36">
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
                src="/assets/preview3.png"
                alt="Preview"
                className="w-full h-full drop-shadow-2xl px-4 md:px-16 object-contain"
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
