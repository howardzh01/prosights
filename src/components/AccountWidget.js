import React from "react";

const UserProfile = () => {
  return (
    <div className="flex items-center bg-purple-800 text-white p-2 rounded-lg">
      <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center mr-2">
        <span className="font-medium">JW</span>
      </div>
      <div className="flex flex-col">
        <span className="font-semibold">Justin Wu</span>
      </div>
      <Image
        src="/assets/downSymbol.png"
        alt="User Avatar"
        width={5}
        height={5}
        className="rounded-full "
      />
    </div>
  );
};

export default UserProfile;
