"use client";
import CourseHeader from "@/components/courseHeader";
import Courses from "@/components/courses";
import OurFeatures from "@/components/our-features";
import React, { useEffect } from "react";

export default function ListCourses() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const data = {
    header: "Our Courses",
    content_01:
      "Expert coaching with quality study materials, regular tests, and ",
    content_02: "guidance for complete exam preparation.",
  };
  
  return (
    <div>
      <CourseHeader data={data} />
      <Courses />
      <OurFeatures />
    </div>
  );
}
