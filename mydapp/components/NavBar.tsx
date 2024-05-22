import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

const NavBar = () => {
  return (
    <div className="flex justify-between w-full h-auto p-4 items-center border-2 border-white border-t-0">
      <div className="flex flex-row items-center">
        <Image
          src="/assets/images/logo.png"
          alt="logo"
          width={50}
          height={50}
        />
        <span className="text-[#4ea9b1] font-bold text-2xl ml-5">
          Crosschain Swap
        </span>
      </div>
      <ConnectButton />
    </div>
  );
};

export default NavBar;
