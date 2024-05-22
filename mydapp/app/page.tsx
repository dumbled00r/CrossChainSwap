import NavBar from "@/components/NavBar";
import SwapSector from "@/components/SwapSector";

function Page() {
  return (
    <div className="w-full bg-[#CAF4FF] min-h-screen">
      <div className="flex flex-col items-center">
        <NavBar />
        <SwapSector />
      </div>
    </div>
  );
}

export default Page;
