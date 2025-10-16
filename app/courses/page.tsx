"use client";
import CourseHeader from '@/components/courseHeader';
import Courses from '@/components/courses';
import OurFeatures from '@/components/our-features';
import React from 'react'

export default function ListCourses() {
  return (
    <div>
        <CourseHeader/>
        <Courses/>
        <OurFeatures />
    </div>
  )
}
