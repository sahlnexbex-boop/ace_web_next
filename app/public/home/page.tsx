import Hero from "@/components/hero"
import AceShorts from "@/components/ace-shorts"
import LatestNews from "@/components/latest-news"
import Courses from "@/components/courses"
import RankHolders from "@/components/rank-holders"
import RankHoldersForum from "@/components/rank-holders-forum"
import Publications from "@/components/publications"
import HybridLearning from "@/components/hybrid-learning"
import AboutUs from "@/components/about-us"
import OurFeatures from "@/components/our-features"
import SocialService from "@/components/social-service"
import Branches from "@/components/branches"
import SuccessStories from "@/components/success-stories"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <AboutUs />
      <Courses />
      <RankHolders />
      <RankHoldersForum />
      <SuccessStories/>
      <Publications />
      <HybridLearning />
      <AceShorts />
      <LatestNews />
      <SocialService />
      <Branches />
      <OurFeatures />
    </main>
  )
}
