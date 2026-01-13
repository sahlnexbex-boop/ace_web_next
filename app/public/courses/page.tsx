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
      "From foundation courses to advanced training we offer a wide range of courses specially curated keeping students in mind.",
  };
  
  return (
    <div>
      <CourseHeader data={data} />
      <Courses />
      <OurFeatures />
    </div>
  );
}
