import { useState, useEffect, useRef, Fragment, useContext } from "react";
import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/router";
import HeadCountChart from "../components/charts/HeadCountChart";
import WebTrafficChart from "../components/charts/WebTrafficChart";
import SearchBoxDashboard from "../components/SearchBoxDashboard";
import WebGeoTrafficChart from "../components/charts/WebGeoTrafficChart";
import { Dialog, Transition } from "@headlessui/react";
import UserProfileButton from "../components/UserProfileButton";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import CompanySummaryView from "../components/CompanySummaryView";
import useSWR from "swr";
import {
  getGeoTrafficData,
  getHeadCount,
  getTrafficData,
  getCrunchbaseData,
  getCompanyDescription,
} from "../api";
import ChartModal from "../components/ChartModal";
import { createContext } from "react";
import { RELEVANT_CONTINENTS } from "../constants";

// id is the id of the heading, level is the header level e.g. 2 = h2
const headings = [
  {
    id: "companyOverview",
    text: "Company Overview",
    level: 2,
  },
  {
    id: "employeeCount",
    text: "Employee Count",
    level: 2,
  },
  {
    id: "traffic",
    text: "Website Traffic",
    level: 2,
  },
  {
    id: "mau",
    text: "Website MAU",
    level: 2,
  },
  {
    id: "trafficByChannel",
    text: "Website Traffic by Channel",
    level: 2,
  },
  {
    id: "trafficByDevice",
    text: "Website Traffic by Device",
    level: 2,
  },
  {
    id: "usersByDevice",
    text: "Users by Device",
    level: 2,
  },
  {
    id: "trafficByOrganicVsPaid",
    text: "Website Traffic by Organic vs Paid",
    level: 2,
  },
  {
    id: "trafficByGeo",
    text: "Website Traffic by Geo",
    level: 2,
  },
];

// gets a class for the table of contents headings to apply styles to subheadings
const getClassName = (level) => {
  // currently only using h2 for section headings which has no extra style right now in styles.css, add h3 h4 etc if needed
  switch (level) {
    case 2:
      return "head2";
    default:
      return null;
  }
};

export const SelectedChartContext = createContext();
export const ChartDataContext = createContext();

function Dashboard() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [company, setCompany] = useState("stockx");
  const [country, setCountry] = useState("US");

  const [selectedChart, setSelectedChart] = useState("");
  const [chartData, setChartData] = useState();

  // API Data
  const { data: headCountData, error: headCountError } = useSWR(
    user && company ? [`/api/private/getHeadCount`, user.id, company] : null,
    getHeadCount,
    { revalidateOnFocus: false }
  );
  // const { data: webTrafficData, error: webTrafficError } = useSWR(
  //   user && company && country
  //     ? [`/api/private/getWebTrafficData`, company + ".com", country]
  //     : null,
  //   (url, companyUrl, country) => {
  //     console.log(companyUrl);
  //     return getTrafficData(url, user, companyUrl, country);
  //   }
  // );
  const { data: webTrafficData, error: webTrafficError } = useSWR(
    user && company && country
      ? [`/api/private/getWebTrafficData`, user.id, company + ".com", country]
      : null,

    getTrafficData,
    { revalidateOnFocus: false }
  );
  const { data: webTrafficGeoData, error: webTrafficGeoError } = useSWR(
    user && company
      ? [
          `/api/private/getWebTrafficGeoData`,
          user.id,
          company + ".com",
          RELEVANT_CONTINENTS,
        ]
      : null,
    getGeoTrafficData,
    { revalidateOnFocus: false }
  );

  const { data: crunchbaseData, error: crunchbaseError } = useSWR(
    user && company
      ? [`/api/private/getCrunchbaseData`, user.id, company]
      : null,
    getCrunchbaseData,
    { revalidateOnFocus: false }
  );
  const { data: companyDescription, error: companyDescriptionError } = useSWR(
    user && company ? [`/api/private/getCompanyDescription`, company] : null,
    ([url, company]) => {
      return getCompanyDescription([
        url,
        user.id,
        company,
        // crunchbaseCompanyDescription,
      ]);
    },
    { revalidateOnFocus: false }
  );
  // useEffect(() => {
  //   console.log("companyName", companyName, user.id);
  //   setHeadCountData(user, companyName);
  // }, [companyName]);

  const regions = {
    global: "Global",
    US: "United States",
    AU: "Australia",
    CA: "Canada",
    FR: "France",
    DE: "Germany",
    IT: "Italy",
    NL: "Netherlands",
    PL: "Poland",
    ES: "Spain",
    SE: "Sweden",
    GB: "United Kingdom",
  };
  // stockx, goat, grailed, flight-club,
  //   const company = "zillow";

  // State to keep track of all fully visible elements
  const [fullyVisibleElements, setFullyVisibleElements] = useState(new Set());

  const { activeId } = useHeadsObserver();

  function useHeadsObserver() {
    const observer = useRef();
    const [activeId, setActiveId] = useState("");

    useEffect(() => {
      const handleObsever = (entries) => {
        let hasVisibleElementsChanged = false;
        const newFullyVisibleElements = new Set(fullyVisibleElements);

        entries.forEach((entry) => {
          if (entry.intersectionRatio === 1) {
            if (!newFullyVisibleElements.has(entry.target.id)) {
              hasVisibleElementsChanged = true;
            }
            newFullyVisibleElements.add(entry.target.id);
          } else {
            if (newFullyVisibleElements.has(entry.target.id)) {
              hasVisibleElementsChanged = true;
            }
            newFullyVisibleElements.delete(entry.target.id);
          }
        });

        if (hasVisibleElementsChanged) {
          setFullyVisibleElements(newFullyVisibleElements);

          // Convert the set to an array and sort it based on the DOM order
          const sortedFullyVisibleEntries = Array.from(newFullyVisibleElements)
            .map((id) => document.getElementById(id))
            .sort(
              (a, b) =>
                a.getBoundingClientRect().top - b.getBoundingClientRect().top
            );

          // Set the activeId to the first element in the sorted array
          if (sortedFullyVisibleEntries.length > 0) {
            setActiveId(sortedFullyVisibleEntries[0].id);
          } else {
            setActiveId("");
          }
        }
      };

      observer.current = new IntersectionObserver(handleObsever, {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      });

      const elements = document.querySelectorAll("h2"); // currently only using h2 for section headings, add h3 h4 etc if needed
      elements.forEach((elem) => observer.current.observe(elem));

      return () => observer.current?.disconnect();
    }, [isLoaded, fullyVisibleElements]); // need isLoaded since the elements are conditionally rendered once user loads

    return { activeId };
  }

  return (
    <>
      <SelectedChartContext.Provider
        value={{ selectedChart, setSelectedChart }}
      >
        <ChartDataContext.Provider value={{ chartData, setChartData }}>
          <ChartModal
            open={!!selectedChart && !!chartData}
            setOpen={() => {
              setSelectedChart("");
              setChartData(null);
            }}
            selectedChart={selectedChart}
            chartData={chartData}
          />

          <div className="flex flex-col h-screen">
            <Transition.Root show={sidebarOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-40 lg:hidden"
                onClose={setSidebarOpen}
              >
                <Transition.Child
                  as={Fragment}
                  enter="transition-opacity ease-linear duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-900/80" />
                </Transition.Child>

                <div className="fixed inset-0 flex">
                  <Transition.Child
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                  >
                    <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                          <button
                            type="button"
                            className="-m-2.5 p-2.5"
                            onClick={() => setSidebarOpen(false)}
                          >
                            <span className="sr-only">Close sidebar</span>
                            <XMarkIcon
                              className="h-6 w-6 text-white"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </Transition.Child>
                      {/* Sidebar component, swap this element with another sidebar if you like */}
                      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary px-6 py-5">
                        <SearchBoxDashboard
                          setCompany={setCompany}
                        ></SearchBoxDashboard>

                        <nav className="flex flex-1 flex-col">
                          <ul
                            role="list"
                            className="flex flex-1 flex-col gap-y-7"
                          >
                            <li>
                              <ul role="list" className="-mx-2 space-y-1">
                                {headings.map((heading) => (
                                  <li
                                    key={heading.id}
                                    className={getClassName(heading.level)}
                                  >
                                    <a
                                      href={`#${heading.id}`}
                                      className={`${
                                        activeId === heading.id
                                          ? "bg-primaryHover"
                                          : ""
                                      } group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-white w-full`}
                                    >
                                      {heading.text}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition.Root>

            <div className="z-40 flex w-full h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Separator */}
              <div
                className="h-6 w-px bg-gray-900/10 lg:hidden"
                aria-hidden="true"
              />

              <div className="flex items-center w-full justify-between gap-x-4 self-stretch lg:gap-x-6">
                <button
                  type="button"
                  aria-label="Scroll to top"
                  onClick={() => {
                    const mainSection = document.getElementById("mainSection");
                    if (mainSection) {
                      mainSection.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  <Image
                    src="/assets/fullLogoBlack.png"
                    alt="ProSights logo"
                    width={112}
                    height={(112 * 361) / 1421}
                  />
                </button>

                <div className="w-2/5 hidden lg:block">
                  <SearchBoxDashboard
                    setCompany={setCompany}
                  ></SearchBoxDashboard>
                </div>

                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  <UserProfileButton textColor="text-black" />
                </div>
              </div>
            </div>

            <div className="flex h-full overflow-auto">
              {/* Static sidebar for desktop */}
              <div className="hidden shrink-0 grow-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary px-6 py-5">
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {headings.map((heading) => (
                            <li
                              key={heading.id}
                              className={getClassName(heading.level)}
                            >
                              <a
                                href={`#${heading.id}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  document
                                    .querySelector(`#${heading.id}`)
                                    .scrollIntoView({
                                      behavior: "smooth",
                                    });
                                }}
                                className={`${
                                  activeId === heading.id
                                    ? "bg-primaryHover"
                                    : "hover:bg-primaryHover"
                                } group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-white w-full`}
                              >
                                {heading.text}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

              <main
                id="mainSection"
                className="py-10 overflow-y-auto overflow-x-hidden w-screen"
              >
                {user && company ? (
                  <div className="px-4 sm:px-6 lg:px-8">
                    <div className="text-4xl font-bold">
                      {company + ".com"} for {country}
                    </div>

                    <CompanySummaryView
                      user={user}
                      companyName={company}
                      crunchbaseData={crunchbaseData}
                      companyDescription={companyDescription}
                    ></CompanySummaryView>

                    <HeadCountChart headCountData={headCountData} />

                    <WebTrafficChart trafficData={webTrafficData} />

                    <WebGeoTrafficChart
                      geoTrafficData={webTrafficGeoData}
                      relevant_continents={RELEVANT_CONTINENTS}
                    />
                  </div>
                ) : (
                  // TODO: add a loading spinner later from another codebase
                  <p>loading</p>
                )}
              </main>
            </div>
          </div>
        </ChartDataContext.Provider>
      </SelectedChartContext.Provider>
    </>
  );
}

export default Dashboard;
