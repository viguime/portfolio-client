import { ThemeToggle } from '@/components/ThemeToggle';
import { Hero } from '@/components/Hero';
import { GitHubReadme } from '@/components/GitHubReadme';
import { Projects } from '@/components/Projects';
import { AvailabilitySection } from '@/components/AvailabilitySection';
import { Footer } from '@/components/Footer';

function App() {
  return (
    <>
      <div id="main-content" className="min-h-screen">
        <ThemeToggle />
        <Hero />
        <GitHubReadme />
        <Projects />
        <AvailabilitySection />
        <Footer />
      </div>
    </>
  );
}

export default App;
