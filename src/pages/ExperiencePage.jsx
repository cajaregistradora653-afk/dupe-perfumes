import ExperienceBanner from '../components/ExperienceBanner';
import ExperienceCenter from '../components/ExperienceCenter';

const ExperiencePage = () => {
  return (
    <div>
      {/* Banner cinematográfico propio (dark). El padding top vive en el banner. */}
      <ExperienceBanner />
      <ExperienceCenter />
    </div>
  );
};

export default ExperiencePage;
