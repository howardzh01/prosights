import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import posthog from "posthog-js";

const PostHogUserTracker = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress.emailAddress,
      });
    }
  }, [isSignedIn, user, isLoaded]);

  return null; // This component does not render anything
};

export default PostHogUserTracker;
