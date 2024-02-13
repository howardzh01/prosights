import "../styles.css";
import Head from "next/head";
import { useState, useEffect } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { NextUIProvider } from "@nextui-org/react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/clerk-react";
import PostHogUserTracker from "../components/PostHogUserTracker";

// if (typeof window !== "undefined" &&
// !window.location.host.includes("localhost")) {
//   // checks that we are client-side
//   posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
//     api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
//     loaded: (posthog) => {
//       if (process.env.NODE_ENV === "development") posthog.debug(); // debug mode in development
//     },
//   });
// }

if (
  typeof window !== "undefined" &&
  !window.location.host.includes("localhost")
) {
  // checks that we are client-side
  posthog.init("phc_o9KYDXanMjHT7AvO9PIOJzHnA8BJKL9P1AKuImWt42u", {
    api_host: "https://app.posthog.com" || "https://app.posthog.com",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug(); // debug mode in development
    },
  });
}

// LogRocket.init("hw9ggu/negotiate");

// // Check that PostHog is client-side
// if (
//   typeof window !== "undefined" &&
//   !window.location.host.includes("127.0.0.1") &&
//   !window.location.host.includes("localhost")
// ) {
//   posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
//     api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
//     // Enable debug mode in development
//     loaded: (posthog) => {
//       if (process.env.NODE_ENV === "development") posthog.debug();
//     },
//   });
// }

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  // const session = useSession();
  // Create a new supabase browser client on every first render.
  // const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  // const router = useRouter();
  // useEffect(() => {
  //   // Check auth condition
  //   let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (re.test(session?.user?.email)) {
  //     LogRocket.identify(session?.user?.email);
  //     posthog.identify(session?.user?.id, { email: session?.user?.email });
  //   }
  // }, [session]);
  // useEffect(() => {
  //   // Track page views
  //   const handleRouteChange = () => posthog.capture("$pageview");
  //   router.events.on("routeChangeComplete", handleRouteChange);

  //   return () => {
  //     router.events.off("routeChangeComplete", handleRouteChange);
  //   };
  // }, []);

  // useEffect(() => {
  //   // Check auth condition
  //   console.log("value", user);
  //   if (user.id) {
  //     console.log("valueeee", user.id, user.primaryEmailAddress);
  //     posthog.identify(user.id, {
  //       email: user.primaryEmailAddress.emailAddress,
  //     });
  //   }
  // }, [user]);

  useEffect(() => {
    // Track page views
    const handleRouteChange = () => posthog.capture("$pageview");
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        {/* Doesn't seem to actually work? */}
        <meta
          name="description"
          content="Research Platform Built by Private Equity Investors"
        />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        {/* <!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    --> */}
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
        {/* <!--
      Notice the use of %PUBLIC_URL% in the tags above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
    --> */}
        <title>ProSights</title>
      </Head>
      {/* <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-11292521844"
        strategy="afterInteractive"
      /> */}
      {/* <Script id="gtag-config">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-11292521844');
        `}
      </Script> */}
      {/* <Analytics />
      <PostHogProvider client={posthog}>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}
        > */}
      <ClerkProvider {...pageProps}>
        <PostHogProvider client={posthog}>
          <NextUIProvider>
            <PostHogUserTracker />
            <Component {...pageProps} />
          </NextUIProvider>
        </PostHogProvider>
      </ClerkProvider>
      {/* </SessionContextProvider>
      </PostHogProvider> */}
    </>
  );
}
