import { SignedIn, UserButton } from "@clerk/nextjs";

function UserProfileButton({ textColor = "text-white" }) {
  return (
    <div className={`flex ${textColor}`}>
      <SignedIn>
        <div className="items-center gap-2 hidden md:flex">
          <UserButton showName={false} afterSignOutUrl={"/"} />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <UserButton showName={false} afterSignOutUrl={"/"} />
        </div>
      </SignedIn>
    </div>
  );
}

export default UserProfileButton;
