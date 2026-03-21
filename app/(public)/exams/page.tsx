"use client";
import ExamHeader from '@/components/examHeader';
import ExamListing from '@/components/examListing';
import RankHolders from '@/components/rank-holders';
import React from 'react'

export default function ExamAndResults() {
  return (
    <div>
        <ExamHeader/>
        <RankHolders/>
        <ExamListing/>
    </div>
  )
}
