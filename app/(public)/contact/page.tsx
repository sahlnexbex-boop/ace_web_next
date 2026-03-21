"use client";
import ContactSection from "@/components/contact_form";
import CourseHeader from "@/components/courseHeader";
import React from "react";

export default function Contact() {
  const data = {
    header: "Contact Us",
    content_01: "If you'd like to get in touch with Ace Institute,",
    content_02: "here are the ways you can reach us.",
  };

  return (
    <div>
      <CourseHeader data={data} />
      <ContactSection />
    </div>
  );
}
