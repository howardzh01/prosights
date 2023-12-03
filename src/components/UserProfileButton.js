import { SignedIn, UserButton } from "@clerk/nextjs";

function UserProfileButton() {
  return (
    <div className="flex text-white">
      <SignedIn>
        <UserButton showName={false} afterSignOutUrl={"/"} />
      </SignedIn>
    </div>
  );
}

export default UserProfileButton;
