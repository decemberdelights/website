"use client";

import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import MenuPreviewSection from "@/components/sections/MenuPreviewSection";
import VisitSection from "@/components/sections/VisitSection";
import FranchiseSection from "@/components/sections/FranchiseSection";
import CareerSection from "@/components/sections/CareerSection";
import ShopSection from "@/components/sections/ShopSection";

export default function Home() {
  return (
    <div style={{ width: "100%", position: "relative", overflow: "hidden" }}>
      <HeroSection />
      <AboutSection />
      <MenuPreviewSection />
      <ShopSection />
      <VisitSection />
      <FranchiseSection />
      <CareerSection />
    </div>
  );
}
