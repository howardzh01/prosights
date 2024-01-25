import Link from "next/link";
import Image from "next/image";
import React from "react";

function Navbar() {
  return (
    <nav className="bg-transparent ">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <div>
              <Link href="/" className="flex items-center py-5 text-black">
                <Image
                  src="/assets/fullLogoBlack.png"
                  alt="ProSights logo"
                  width={4096}
                  height={4096}
                  className="w-24 md:w-28"
                />
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {/* <div className="flex items-center mr-4">
              <Link
                href="/about"
                className="py-5 px-3 text-gray-700 hover:text-gray-900"
              >
                About Us
              </Link>
            </div> */}
            <Link
              href="/sign-in"
              className="py-2 px-6 text-sm md:text-base font-medium bg-primary hover:bg-blue-600 text-white rounded-lg transition duration-300"
            >
              Login
            </Link>
          </div>

          {/* mobile button goes here */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
