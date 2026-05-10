import Hero from "@/components/home/Hero";
import Ticker from "@/components/home/Ticker";
import WhatWeDo from "@/components/home/WhatWeDo";
import ParticipantSupport from "@/components/home/ParticipantSupport";
import Series001 from "@/components/home/Series001";
import GarmentSystem from "@/components/home/GarmentSystem";
import DistributedAllocation from "@/components/home/DistributedAllocation";
import Contradiction from "@/components/home/Contradiction";
import FinalCta from "@/components/home/FinalCta";

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <Ticker />
      <WhatWeDo />
      <ParticipantSupport />
      <Series001 />
      <GarmentSystem />
      <DistributedAllocation />
      <Contradiction />
      <FinalCta />
    </main>
  );
}
