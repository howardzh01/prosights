import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import FundedEntitySearch from "./dashboard/FundedEntitySearch";
import Image from "next/image";

function InfoButton({ infoType }) {
  const [showPopup, setShowPopup] = useState(false);
  const infoText = {
    companyName:
      "Specify the company of interest to generate the “About” and “Business Model” descriptions in the Company Overview section.",
    fundedEntity:
      "Specify the entity you wish to populate fundraising metrics for in the Company Overview section.",
    linkedInURL:
      "Specify the LinkedIn URL you wish to analyze in the Headcount section. ",
    websiteURL:
      "Specify the website URL you wish to analyze in the Website Traffic section.",
    appID:
      "Specify the Data.ai app ID (unified, iOS, Google Play) you wish to analyze in the App Usage section.",
  };

  return (
    <div className="relative">
      <div
        className="group cursor-pointer"
        onMouseOver={() => setShowPopup(true)}
        onMouseOut={() => setShowPopup(false)}
      >
        <Image
          src="/assets/info.svg"
          alt="info"
          width={128}
          height={128}
          className="w-4"
        />
      </div>
      <div
        id="infoPopup"
        className="absolute bg-customGray-700 text-white rounded-lg px-4 py-2 w-96 bottom-24 md:bottom-8 -left-12 text-xs z-50"
        style={{
          display: showPopup ? "block" : "none",
        }}
      >
        {infoText[infoType]}
      </div>
    </div>
  );
}

export default function DefineNewCompanyModal({
  show,
  toggleOff,
  setCompanyDic,
  setCompanyCompetitors,
  companyDirectory,
}) {
  const [companyName, setCompanyName] = useState("");
  const [fundedEntity, setFundedEntity] = useState(
    companyDirectory.findCompanyByUrl("")
  );
  const [linkedInURL, setLinkedInURL] = useState("");
  const [websiteURL, setWebsiteURL] = useState("");
  const [appID, setAppID] = useState("");

  const atLeastOneFieldPopulated = () => {
    return companyName || fundedEntity || linkedInURL || websiteURL || appID;
  };

  const handleGenerateReport = () => {
    let linkedInSlug = "";
    const linkedInPattern =
      /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/company\/([^\/?#]+)(?:\/|$)/;
    const match = linkedInURL.match(linkedInPattern);
    if (match) {
      linkedInSlug = match[1];
    }
    setCompanyDic({
      name: companyName,
      displayedName: fundedEntity.displayedName,
      appId: appID,
      url: websiteURL,
      linkedInSlug: linkedInSlug,
    });
    toggleOff();
  };

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={toggleOff}>
        <Dialog.Title></Dialog.Title>
        {/* Need to include Dialog.Title to prevent modal closing on first open click. See https://github.com/tailwindlabs/headlessui/issues/2535#issuecomment-1672667145*/}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-customGray-800 bg-opacity-50 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 w-screen overflow-y-auto">
          <div className="flex h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="w-[32rem] border-t-[20px] border-customGray-800 relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
                <div className="absolute right-0 top-0 hidden pr-2 pt-2 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-0"
                    onClick={toggleOff}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex flex-col px-12 py-8">
                  <div className="flex flex-row">
                    <Image
                      src="/assets/new.svg"
                      alt="info"
                      width={128}
                      height={128}
                      className="w-6 mr-3"
                    />
                    <p className="text-3xl font-bold text-customGray-800 ">
                      Define New Company
                    </p>
                  </div>
                  <p className="text-sm text-customGray-800 pt-3 leading-relaxed">
                    Customize your analysis if you can’t find a company or want
                    to modify existing sections. Each field affects different
                    parts of the analysis (must populate at least 1).
                  </p>
                  <div className="flex flex-row items-center pt-8 w-full justify-between">
                    <div className="flex flex-row items-center">
                      <p className="text-base font-medium text-customGray-800 pr-2">
                        Company Name
                      </p>

                      <InfoButton infoType="companyName" />
                    </div>
                    <input
                      type="text"
                      placeholder="TikTok"
                      className="px-4 py-2 rounded-md bg-customGray-50 placeholder:text-customGray-300 text-customGray-800 focus:outline-none w-60 text-sm"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-row items-center pt-6 w-full justify-between">
                    <div className="flex flex-row items-center">
                      <p className="text-base font-medium text-customGray-800 pr-2">
                        Funded Entity
                      </p>

                      <InfoButton infoType="fundedEntity" />
                    </div>
                    <div className="w-60">
                      <FundedEntitySearch
                        companyDirectory={companyDirectory}
                        setCompany={setFundedEntity}
                        setCompanyCompetitors={setCompanyCompetitors}
                      />
                    </div>
                    {/* <input
                      type="text"
                      placeholder="ByteDance Ltd."
                      className="px-4 py-2 rounded-md bg-customGray-50 placeholder:text-customGray-300 text-customGray-800 focus:outline-none w-60 text-sm"
                      value={fundedEntity}
                      onChange={(e) => setFundedEntity(e.target.value)}
                    /> */}
                  </div>
                  <div className="flex flex-row items-center pt-6 w-full justify-between">
                    <div className="flex flex-row items-center">
                      <p className="text-base font-medium text-customGray-800 pr-2">
                        LinkedIn URL
                      </p>

                      <InfoButton infoType="linkedInURL" />
                    </div>
                    <input
                      type="text"
                      placeholder="linkedin.com/company/tiktok/"
                      className="px-4 py-2 rounded-md bg-customGray-50 placeholder:text-customGray-300 text-customGray-800 focus:outline-none w-60 text-sm"
                      value={linkedInURL}
                      onChange={(e) => setLinkedInURL(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-row items-center pt-6 w-full justify-between">
                    <div className="flex flex-row items-center">
                      <p className="text-base font-medium text-customGray-800 pr-2">
                        Website URL
                      </p>

                      <InfoButton infoType="websiteURL" />
                    </div>
                    <input
                      type="text"
                      placeholder="tiktok.com"
                      className="px-4 py-2 rounded-md bg-customGray-50 placeholder:text-customGray-300 text-customGray-800 focus:outline-none w-60 text-sm"
                      value={websiteURL}
                      onChange={(e) => setWebsiteURL(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-row items-center pt-6 w-full justify-between">
                    <div className="flex flex-row items-center">
                      <p className="text-base font-medium text-customGray-800 pr-2">
                        App ID
                      </p>

                      <InfoButton infoType="appID" />
                    </div>
                    <input
                      type="text"
                      placeholder="1000600000575007"
                      className="px-4 py-2 rounded-md bg-customGray-50 placeholder:text-customGray-300 text-customGray-800 focus:outline-none w-60 text-sm"
                      value={appID}
                      onChange={(e) =>
                        setAppID(e.target.value.replace(/[^0-9]/g, ""))
                      }
                    />
                  </div>
                  <div
                    className={`flex flex-row mt-12 px-8 py-2 mx-auto ${
                      atLeastOneFieldPopulated()
                        ? "bg-primary text-white cursor-pointer"
                        : "bg-primaryLight text-white cursor-default"
                    } rounded-md font-semibold`}
                    onClick={
                      atLeastOneFieldPopulated()
                        ? handleGenerateReport
                        : undefined
                    }
                  >
                    Run Analysis
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
