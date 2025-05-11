import { Timer } from "@/components/Timer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="w-full max-w-[390px] bg-[#1E2132] min-h-screen">
        <Timer />
      </div>
    </div>
  );
}
