import "../styles.css";
import Script from "next/script";
import Head from "next/head";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import LogRocket from "logrocket";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useRouter } from "next/router";

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

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        {/* Doesn't seem to actually work? */}
        <meta name="description" content="Create and Play AI Simulations" />
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
        <title>Simulation Labs</title>
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
        <Component {...pageProps} />
        {/* </SessionContextProvider>
      </PostHogProvider> */}
    </>
  );
}
