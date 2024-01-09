import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { useInView } from "react-intersection-observer";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/router";
import HeadCountChart from "../components/charts/HeadCountChart";
import WebTrafficChart from "../components/charts/WebTrafficChart";
import WebGeoTrafficChart from "../components/charts/WebGeoTrafficChart";

function CacheCompanies() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  //   const [company, setCompany] = useState("stockx");
  const [country, setCountry] = useState("US");
  // const companyUrls = [
  //   "stockx.com",
  //   "goat.com",
  //   "grailed.com",
  //   "flightclub.com",
  //   "stadiumgoods.com",
  //   "zillow.com",
  //   "realtor.com",
  //   "redfin.com",
  //   "trulia.com",
  //   "streeteasy.com",
  //   "openai.com",
  //   "anthropic.com",
  //   "stability.ai",
  //   "deepmind.com",
  //   "mistral.ai",
  // ];

  // const companyUrls = [
  //   "Myfitnesspal.com",
  //   "Noom.com",
  //   "WeightWatchers.com",
  //   "LoseIt.com",
  //   "Simple.life",
  //   "Yuka.io",
  //   "tripadvisor.com",
  //   "Booking.com",
  //   "Kayak.com",
  //   "Expedia.com",
  //   "Travelocity.com",
  //   "Hopper.com",
  //   "Lululemon.com",
  //   "Fabletics.com",
  //   "Aloyoga.com",
  //   "Uber.com",
  //   "Lyft.com",
  //   "GoCurb.com",
  //   "Turo.com",
  //   "Zipcar.com",
  //   "Getaround.com",
  //   "Netflix.com",
  //   "Hulu.com",
  //   "HBOMax.com",
  //   "Showtime.com",
  //   "Paramountplus.com",
  //   "TV.apple.com",
  //   "Hulu.com",
  //   "DisneyPlus.com",
  // ];

  // const companyUrls = [
  //   "Spotify.com",
  //   "Pandora.com",
  //   "Soundcloud.com",
  //   "Music.apple.com",
  //   "ebay.com",
  //   "Etsy.com",
  //   "Amazon.com",
  //   "Temu.com",
  //   "Alibaba.com",
  //   "Dhgate.com",
  //   "Poshmark.com",
  //   "Facebook.com",
  //   "Snapchat.com",
  //   "BeReal.com",
  //   "Instagram.com",
  //   "X.com",
  //   "LinkedIn.com",
  //   "Pinterest.com",
  //   "Reddit.com",
  //   "Wechat.com",
  //   "Tiktok.com",
  //   "Whatsapp.com",
  //   "Discord.com",
  //   "Telegram.com",
  //   "Clubhouse.com",
  //   "Bumble.com",
  //   "Tinder.com",
  //   "Hinge.com",
  //   "Match.com",
  //   "Grindr.com",
  //   "Raya.com",
  //   "Okcupid.com",
  //   "eHarmony.com",
  //   "Coffeemeetsbagel.com",
  //   "Bing.com",
  //   "Google.com",
  //   "Yahoo.com",
  //   "Baidu.com",
  //   "Ask.com",
  //   "DuckDuckGo.com",
  //   "Bard.google.com",
  //   "Chat.Openai.com",
  //   "Shein.com",
  //   "Forever21.com",
  //   "Aliexpress.com",
  //   "Cider.com",
  //   "HM.com",
  //   "Zara.com",
  //   "Stockx.com",
  //   "Goat.com"
  //   "Grailed.com",
  //   "StadiumGoods.com",
  //   "FlightClub.com",
  //   "UberEats.com",
  //   "Doordash.com",
  //   "Postmates.com",
  //   "Seamless.com",
  //   "Grubhub.com",
  // ];
  const companyUrls = [
    "TheFarmersDog.com",
    "MyOllie.com",
    "Petplate.com",
    "Nomnomnow.com",
    "Freshpet.com",
    "justfoodfordogs.com",
    "Calm.com",
    "Headspace.com",
    "InsightTimer.com",
    "Balanceapp.com",
    "Watchbox.com",
    "Chrono24.com",
    "Jomashop.com",
    "Watchfinder.com",
    "Hodinkee.com",
    "BobsWatches.com",
    "Nike.com",
    "Adidas.com",
    "UnderArmour.com",
    "Reebok.com",
    "Fiverr.com",
    "Upwork.com",
    "JobandCollar.com",
    "TopTal.com",
    "Thumbtack.com",
    "TaskRabbit.com",
    "Wix.com",
    "Squarespace.com",
    "Vercel.com",
    "Webflow.com",
    "Godaddy.com",
    "Gopuff.com",
    "Jokr.com",
    "Getir.com",
    "Instacart.com",
    "Mercato.com",
    "FreshDirect.com",
    "Bitly.com",
    "Tinyurl.com",
    "Ow.ly",
    "Rebrandly.com",
    "Bl.ink",
    "justfoodfordogs.com",
    "Hoka.com",
    "On-Running.com",
    "AthleticPropulsionLabs.com",
    "Brooks.com",
    "Asics.com",
    "Hallow.com",
    "Glorify.com",
    "Pray.com",
    "Outdoorsy.com",
    "RVezy.com",
    "RVshare.com",
  ];
  // stockx, goat, grailed, flight-club,
  //   const company = "zillow";
  return (
    <div>
      {companyUrls.map((companyUrl, index) => (
        <div key={index} className="mx-12 my-12 w-1/2 space-y-8">
          {/* <SearchBoxDashboard setCompany={setCompany}></SearchBoxDashboard> */}

          <div className="text-4xl font-bold">{companyUrl}</div>

          {/* {user && company ? (
          <HeadCountChart user={user} companyName={company} />
        ) : (
          <p>loading</p>
        )} */}

          {user && companyUrl ? (
            <WebTrafficChart
              user={user}
              companyUrl={companyUrl}
              country={country}
            />
          ) : (
            <p>loading</p>
          )}

          {user && companyUrl ? (
            <WebGeoTrafficChart
              user={user}
              companyUrl={companyUrl}
              country={country}
            />
          ) : (
            <p>loading</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default CacheCompanies;
