import { SignedIn, UserButton, useUser } from "@clerk/nextjs";

function UserProfileButton({ textColor = "text-white" }) {
  const { user } = useUser();

  return (
    <div className={`flex ${textColor}`}>
      <SignedIn>
        <div className="flex items-center gap-2">
          <UserButton showName afterSignOutUrl={"/"} />
        </div>
      </SignedIn>
    </div>
  );
}

export default UserProfileButton;
