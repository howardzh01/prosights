import { useRouter } from "next/router";
import Image from "next/image";
import { useSession } from "@supabase/auth-helpers-react";
import styles from "../../components/Loader.module.css";
import ResponsiveNavBar from "../../components/ResponsiveNavBar";
import { useEffect, useReducer, useState } from "react";
import SimulationCard from "../../components/SimulationCard";
import ProfileModal from "../../components/ProfileModal";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Container,
} from "@mui/material/";

export default function ProfilePage() {
  const session = useSession();
  const router = useRouter();
  const { username } = router.query;
  const defaultImageUrl =
    "https://ohozahtshujfrigjhysp.supabase.co/storage/v1/object/public/profile-images/default_pfp.png";
  const [userExists, setUserExists] = useState(null);
  const [loading, setLoading] = useState(false);
  const [featuredSimulationsLoading, setFeaturedSimulationsLoading] =
    useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [triggerLoad, setTriggerLoad] = useState(true);
  const [avatarURL, setAvatarURL] = useState(defaultImageUrl);
  const [displayName, setDisplayName] = useState("");
  const [about, setAbout] = useState("");
  const [featuredSimulations, setFeaturedSimulations] = useState([]);
  const [simulationsToDisplay, setSimulationsToDisplay] = useState([]);
  const [allUserSimulations, setAllUserSimulations] = useState([]);
  const [cursor, setCursor] = useState("");
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [sortType, setSortType] = useState("recent");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedSimulations, setCheckedSimulations] = useState({});
  const [initialCheckedSimulations, setInitialCheckedSimulations] = useState(
    {}
  );
  const [numSimulationsDisplayed, setNumSimulationsDisplayed] = useState(100);
  const [profileModalState, setProfileModalState] = useState(false);
  const maxNumOfFeaturedSims = 6;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSimulationChange = (id) => {
    setCheckedSimulations((prevState) => {
      const updatedState = {
        ...prevState,
        [id]: !prevState[id],
      };

      return updatedState;
    });
  };

  const loadSimulations = async (sortType) => {
    if (username) {
      setLoading(true);
      const res = await fetch(`/api/getSimulations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: cursor,
          number: 9,
          alreadyFetchedIDs: simulationsToDisplay.map(
            (simulation) => simulation.id
          ),
          sortType: sortType,
          creatorUsername: username,
        }),
      });
      const data = await res.json();
      setSimulationsToDisplay([...simulationsToDisplay, ...data.data]);
      setCursor(data.newCursor);
      setLoading(false);
    }
  };

  const loadFeaturedSimulations = async () => {
    const res = await fetch(`/api/getUserFeaturedSimulations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    });
    const data = await res.json();
    // setSimulationsToDisplay(data.featuredSimulations);
    setFeaturedSimulations(data.featuredSimulations);
    setFeaturedSimulationsLoading(false);
  };

  const loadAllUserSimulations = async () => {
    const res = await fetch(`/api/getUserAllSimulations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    });
    const data = await res.json();
    setAllUserSimulations(data.data);

    // Create an array to store the checked state of each simulation
    const newCheckedSimulations = data.data.reduce((acc, simulation) => {
      acc[simulation.id] = featuredSimulations.some(
        (featSim) => featSim.id === simulation.id
      );
      return acc;
    }, {});

    // Check if each simulation is in featuredSimulations
    data.data.forEach((simulation, index) => {
      if (featuredSimulations.some((featSim) => featSim.id === simulation.id)) {
        newCheckedSimulations[simulation.id] = true;
      }
    });

    // Update the state
    setCheckedSimulations(newCheckedSimulations);
  };

  const closeModalWithoutSaving = () => {
    setIsModalOpen(false);
    setCheckedSimulations({ ...initialCheckedSimulations });
    setSearchTerm("");
  };

  const saveModal = () => {
    setSaveLoading(true);
    const newFeaturedSimulations = allUserSimulations
      .filter((simulation) => checkedSimulations[simulation.id])
      .map((simulation) => simulation.id);

    fetch("/api/updateUserFeaturedSimulations", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session.user.id,
        newFeaturedSimulations: newFeaturedSimulations,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          setIsModalOpen(false);
          setSaveLoading(false);
          setSearchTerm("");
        }
      })
      .catch((error) => console.error(error));
  };

  const checkUserExists = async () => {
    const res = await fetch(`/api/checkUserExists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    });
    const data = await res.json();

    if (data.data === null) {
      setUserExists(false);
    } else {
      setUserExists(true);
      setIsOwnProfile(data.isOwnProfile);
      setAvatarURL(data.data.avatar_url);
      setDisplayName(data.data.full_name);
      setAbout(data.data.about);
    }
  };

  const hideProfileModal = () => {
    setProfileModalState(false);
  };

  useEffect(() => {
    if (username) {
      checkUserExists();
    }
  }, [username, profileModalState]);

  useEffect(() => {
    if (username != null && userExists && !featuredSimulationsLoading) {
      loadAllUserSimulations();
    }
  }, [username, userExists, featuredSimulationsLoading]);

  useEffect(() => {
    if (username != null) {
      loadAllUserSimulations();
    }
  }, [username]);

  useEffect(() => {
    if (cursor === "" && username != null && userExists && triggerLoad) {
      loadFeaturedSimulations();
      loadSimulations(sortType);
      setTriggerLoad(false); // Reset the trigger
    }
  }, [username, sortType, cursor, triggerLoad, userExists]);

  useEffect(() => {
    if (isModalOpen) {
      setInitialCheckedSimulations({ ...checkedSimulations });
    }
  }, [isModalOpen]);

  return userExists === null ? (
    <div
      className={`${styles.loaderContainer}`}
      style={{ margin: 0, marginTop: "12rem" }}
    >
      <span className={`${styles.loader} ${styles.medium}`}></span>
    </div>
  ) : userExists ? (
    <div>
      <div className="sticky top-0 z-50">
        <ResponsiveNavBar />
      </div>
      <ProfileModal
        modalState={profileModalState}
        userInfo={session?.user}
        hideModal={hideProfileModal}
      />
      <Dialog
        open={isModalOpen}
        onClose={closeModalWithoutSaving}
        className="bg-dark bg-opacity-25 text-white shadow-lg"
        PaperProps={{
          style: {
            backgroundColor: "#F5F7F9",
            padding: "0.5rem 0",
            borderRadius: "0.75rem",
          },
        }}
      >
        <DialogTitle className="flex flex-row justify-between items-center">
          <p className="font-nunitoSans text-xl font-bold pb-0 hidden md:block">
            Edit featured simulations
          </p>
          <p className="font-nunitoSans text-xl font-bold pb-0 md:hidden">
            Edit featured
          </p>
          <div onClick={closeModalWithoutSaving} className="cursor-pointer">
            &#10005;
          </div>
        </DialogTitle>
        <p className="font-nunitoSans text-base px-6">
          Choose up to {maxNumOfFeaturedSims} public simulations to display
        </p>
        <div className="flex bg-white items-center border-none px-4 py-0 rounded-lg mt-6 mb-8 focus:outline-none mx-6">
          <Image
            src={require("../../assets/search.png")}
            alt="search"
            width={16}
            height={16}
          />
          <input
            type="text"
            placeholder={`Search simulations`}
            value={searchTerm}
            onChange={handleSearchChange}
            className="ml-2 font-nunito text-base text-dark placeholder:text-customMediumGray caret-primary outline-none focus:outline-none focus:ring-0 focus:border-none border-none w-full"
          />
        </div>
        <div className="border-t border-customLightGray"></div>
        <DialogContent className="max-h-[48rem]">
          {allUserSimulations
            .filter((simulation) =>
              simulation.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, numSimulationsDisplayed)
            .map((simulation, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 bg-customLightGray text-dark rounded-lg m-0 font-nunitoSans hover:bg-customGray"
              >
                <div className="flex items-center w-full">
                  <input
                    type="checkbox"
                    id={`simulation-${simulation.id}`}
                    className={`mr-2 rounded-sm border-customGray focus:border-primary hover:cursor-pointer`}
                    checked={checkedSimulations[simulation.id] || false}
                    onChange={() => handleSimulationChange(simulation.id)}
                    disabled={
                      Object.values(checkedSimulations).filter(Boolean)
                        .length >= maxNumOfFeaturedSims &&
                      !checkedSimulations[simulation.id]
                    }
                  />
                  <label
                    htmlFor={`simulation-${index}`}
                    className={`font-bold text-base truncate flex-grow mr-4 max-w-[8rem] md:max-w-[16rem] lg:max-w-[20rem] ${
                      Object.values(checkedSimulations).filter(Boolean)
                        .length >= maxNumOfFeaturedSims &&
                      !checkedSimulations[index]
                        ? "text-customGray opacity-50"
                        : "text-dark"
                    }`}
                  >
                    {simulation.name}
                  </label>
                </div>
                <div className="text-customGray opacity-50 text-right whitespace-nowrap flex-shrink-0">
                  {simulation.total_plays} plays
                </div>
              </div>
            ))}
          {allUserSimulations.filter((simulation) =>
            simulation.name.toLowerCase().includes(searchTerm.toLowerCase())
          ).length > numSimulationsDisplayed && (
            <button
              onClick={() =>
                setNumSimulationsDisplayed(numSimulationsDisplayed + 100)
              }
              className="text-center w-full font-nunitoSans mt-2 hover:text-primary hover:cursor-pointer"
            >
              Load More
            </button>
          )}
        </DialogContent>
        <div className="border-t border-customLightGray mb-4"></div>
        <DialogActions>
          <Container className="px-4">
            <div className="flex justify-between items-center w-full">
              <p className="font-nunitoSans text-base text-alert">
                {maxNumOfFeaturedSims -
                  Object.values(checkedSimulations).filter(Boolean).length}{" "}
                remaining
              </p>
              {saveLoading ? (
                <div className="flex justify-center items-center mr-6">
                  <div className={styles.loaderContainer}>
                    <span className={`${styles.loader} ${styles.small}`}></span>
                  </div>
                </div>
              ) : (
                <Button onClick={saveModal}>
                  <p className="font-nunitoSans font-bold text-primary">
                    Save Featured
                  </p>
                </Button>
              )}
            </div>
          </Container>
        </DialogActions>
      </Dialog>
      <div className="flex flex-col w-full items-center">
        <div className="mt-16 px-8 md:px-12 lg:px-16 w-full md:w-[52rem] lg:w-[65rem] xl:w-[80rem]">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex flex-row mb-6 md:mb-0 md:mr-8 lg:mr-36 items-center md:max-w-1/3">
              <Image
                className="rounded-full w-24 h-24 md:w-32 md:h-32 object-cover mr-4 md:mr-6"
                src={avatarURL}
                width={512}
                height={512}
                alt="Profile photo"
              />
              <div className="flex flex-col items-start font-nunitoSans">
                <p className="text-xl md:text-2xl font-bold text-dark overflow-hidden line-clamp-2">
                  {displayName}
                </p>
                <p className="text-base font-semibold text-customGray mb-2">
                  @{username}
                </p>
                <p className="text-base font-semibold text-customGray">
                  {allUserSimulations.length} public simulations
                </p>
                {isOwnProfile && (
                  <div
                    className="hidden md:flex rounded-lg bg-white px-4 py-2 md:flex-row items-center justify-center mt-4 hover:opacity-50 hover:cursor-pointer"
                    onClick={() => {
                      setProfileModalState(!profileModalState);
                    }}
                  >
                    <p className="text-primary text-sm font-nunitoSans font-semibold">
                      Profile Settings
                    </p>
                  </div>
                )}
              </div>
            </div>
            {isOwnProfile && (
              <div
                className="md:hidden rounded-lg bg-white px-4 py-2 flex flex-row items-center justify-center mt-0 mb-8 hover:opacity-50 hover:cursor-pointer"
                onClick={() => {
                  setProfileModalState(!profileModalState);
                }}
              >
                <p className="text-primary text-sm font-nunitoSans font-semibold">
                  Profile Settings
                </p>
              </div>
            )}
            <div className="flex flex-col md:w-1/2">
              <p className="text-customGray font-semibold text-base font-nunitoSans mb-2">
                About
              </p>
              <p className="text-dark text-lg font-nunito">{about}</p>
            </div>
          </div>
          <div className="border-t mt-8 md:mt-16"></div>
          {featuredSimulations.length > 0 || isOwnProfile ? (
            <div className="flex flex-row justify-between items-end mt-12 md:mt-16">
              <p className="font-nunitoSans font-bold text-2xl">Featured</p>
              {isOwnProfile && (
                <div className="flex flex-col">
                  <p
                    className="font-nunitoSans font-semibold text-base text-customGray hover:text-primary hover:cursor-pointer md:hidden md:text-lg"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Customize featured
                  </p>
                  <p
                    className="font-nunitoSans font-semibold text-base text-customGray hover:text-primary hover:cursor-pointer hidden md:block"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Customize featured sims
                  </p>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="max-w-screen-2xl mt-4">
          {featuredSimulations.length === 0 ? (
            <p></p>
          ) : (
            <div className="max-w-screen-2xl mt-8 mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-12">
              {featuredSimulations.map((simulation, index) => (
                <SimulationCard
                  key={index}
                  bgColor={"white"}
                  textColor={"dark"}
                  infoColor={"customDarkModeGray"}
                  creator={simulation.creatorUsername}
                  title={simulation.name}
                  description={simulation.instructions}
                  plays={simulation.total_plays}
                  dollarCost={simulation.dollar_cost}
                  aiAvatar={simulation.all_avatar_urls[0]}
                  creatorAvatarURL={avatarURL}
                  id={simulation.id}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-4 px-8 md:px-12 lg:px-16 w-full md:w-[52rem] lg:w-[65rem] xl:w-[80rem]">
          <div className="flex flex-row justify-between items-end mt-8 md:mt-8">
            <div className="flex flex-col">
              <p className="font-nunitoSans font-bold text-2xl mb-8">
                All Simulations
              </p>
              <div className="flex flex-row items-center">
                <p className="font-nunitoSans text-base text-dark mr-4 hidden md:block">
                  Sort by:{" "}
                </p>
                <select
                  className="border-customLightGray rounded-lg py-1 font-nunitoSans text-base font-bold text-left focus:outline-none focus:ring-0"
                  onChange={(e) => {
                    const newSortType = e.target.value;
                    setSortType(newSortType);
                    setSimulationsToDisplay([]);
                    setCursor("");
                    setTriggerLoad(true);
                  }}
                >
                  <option value="recent">Recent</option>
                  <option value="top">Top</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-screen-2xl mt-4">
          {simulationsToDisplay.length === 0 ? (
            <p className="font-nunitoSans text-center">
              No simulations to show
            </p>
          ) : (
            <div className="max-w-screen-2xl mt-8 mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-12">
              {simulationsToDisplay.map((simulation, index) => (
                <SimulationCard
                  key={index}
                  bgColor={"white"}
                  textColor={"dark"}
                  infoColor={"customDarkModeGray"}
                  creator={simulation.creatorUsername}
                  title={simulation.name}
                  description={simulation.instructions}
                  plays={simulation.total_plays}
                  dollarCost={simulation.dollar_cost}
                  aiAvatar={simulation.all_avatar_urls[0]}
                  creatorAvatarURL={avatarURL}
                  id={simulation.id}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-row items-center justify-center mb-36">
          {cursor != null && sortType != "featured" ? (
            loading ? (
              <div className={styles.loaderContainer}>
                <span className={`${styles.loader} ${styles.medium}`}></span>
              </div>
            ) : (
              <button
                onClick={() => {
                  loadSimulations(sortType);
                }}
                className="font-nunitoSans text-lg font-semibold text-customGray hover:opacity-30"
              >
                Click to Load More
              </button>
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div>User does not exist!</div>
  );
}
