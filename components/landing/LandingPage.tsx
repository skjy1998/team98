import LandingHeader from "./LandingHeader";
import LandingHeroSection from "./LandingHeroSection";
import LandingFeatureSection from "./LandingFeatureSection";
import LandingWorkflowSection from "./LandingWorkflowSection";
import LandingCtaSection from "./LandingCtaSection";
import LandingFooter from "./LandingFooter";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <LandingHeader />
      <LandingHeroSection />
      <LandingFeatureSection />
      <LandingWorkflowSection />
      <LandingCtaSection />
      <LandingFooter />
    </main>
  );
}
