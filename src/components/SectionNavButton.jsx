import React from "react";
import { useSectionNavigation } from "../hooks/useSectionNavigation";

export function SectionNavButton({ sectionId, children, className = "" }) {
  const scrollToSection = useSectionNavigation();

  return (
    <button className={className} type="button" onClick={() => scrollToSection(sectionId)}>
      {children}
    </button>
  );
}
