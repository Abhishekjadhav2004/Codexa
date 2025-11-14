import React from 'react';
import { HeroSection, FeaturesSection, ProblemHighlights, CallToActionSection, FeaturedCoursesSection, CodingRoomSection } from "../components";


export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ProblemHighlights />
       <FeaturedCoursesSection />
      <CodingRoomSection />
      <CallToActionSection />
    </>
  );
};

export default HomePage;