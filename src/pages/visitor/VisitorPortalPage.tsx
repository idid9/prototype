import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Experience,
  Destination,
  Promotion,
  QuizQuestion,
  WebsiteContent,
} from '../../types';
import { DataService } from '../../services/dataService';
import { VisitorNavbar } from '../../components/visitor/VisitorNavbar';
import { HeroSection } from '../../components/visitor/HeroSection';
import { FeaturedDestinations } from '../../components/visitor/FeaturedDestinations';
import { ExperienceCatalog } from '../../components/visitor/ExperienceCatalog';
import { InteractiveQuiz } from '../../components/visitor/InteractiveQuiz';
import { MarketingSections } from '../../components/visitor/MarketingSections';
import { VisitorFooter } from '../../components/visitor/VisitorFooter';
import { ExperienceDetailPage } from '../../components/visitor/ExperienceDetailPage';

interface VisitorPortalPageProps {
  onGoToAdmin: () => void;
  initialSelectedExperience?: Experience | null;
}

export const VisitorPortalPage: React.FC<VisitorPortalPageProps> = ({
  onGoToAdmin,
  initialSelectedExperience = null,
}) => {
  const { isRtl } = useLanguage();

  // Real-time synced data state
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(DataService.getWebsiteContent());

  // Search & Filter State
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchDate, setSearchDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [guestsCount, setGuestsCount] = useState<number>(2);

  // Active Experience Detail view
  const [activeExperience, setActiveExperience] = useState<Experience | null>(initialSelectedExperience);

  useEffect(() => {
    if (initialSelectedExperience) {
      setActiveExperience(initialSelectedExperience);
    }
  }, [initialSelectedExperience]);

  // Subscribe to real-time collections
  useEffect(() => {
    // Record page view event
    DataService.recordEvent('page_view', '/');

    const unsubExp = DataService.subscribeExperiences(setExperiences);
    const unsubDest = DataService.subscribeDestinations(setDestinations);
    const unsubPromo = DataService.subscribePromotions(setPromotions);
    const unsubQuiz = DataService.subscribeQuizzes(setQuizzes);
    const unsubContent = DataService.subscribeWebsiteContent(setWebsiteContent);

    return () => {
      unsubExp();
      unsubDest();
      unsubPromo();
      unsubQuiz();
      unsubContent();
    };
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    if (activeExperience) {
      setActiveExperience(null);
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleSelectExperience = (exp: Experience) => {
    setActiveExperience(exp);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    DataService.recordEvent('experience_view', `/experience/${exp.slug}`, {
      experienceId: exp.id,
      title: exp.title,
    });
  };

  const handleExecuteSearch = () => {
    DataService.recordEvent('search', undefined, {
      destination: selectedDestination,
      category: selectedCategory,
      guests: guestsCount,
    });
    handleScrollToSection('experiences');
  };

  const handleSelectPromotion = (promo: Promotion) => {
    if (promo.linkedExperienceId) {
      const targetExp = experiences.find((e) => e.id === promo.linkedExperienceId);
      if (targetExp) {
        handleSelectExperience(targetExp);
        return;
      }
    }
    if (promo.destinationId) {
      setSelectedDestination(promo.destinationId);
    }
    handleScrollToSection('experiences');
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <VisitorNavbar
        onNavigateSection={handleScrollToSection}
        onGoToAdmin={onGoToAdmin}
      />

      {/* Main View: Either Detail View or Discovery Landing */}
      {activeExperience ? (
        <ExperienceDetailPage
          experience={activeExperience}
          websiteContent={websiteContent}
          onBack={() => setActiveExperience(null)}
          onExperienceBooked={(inqId) => {
            console.log('Inquiry confirmed:', inqId);
          }}
        />
      ) : (
        <main className="flex-1">
          {/* Section: Hero */}
          <div id="explore">
            <HeroSection
              content={websiteContent}
              destinations={destinations}
              selectedDestination={selectedDestination}
              onSelectDestination={(id) => {
                setSelectedDestination(id);
                handleScrollToSection('experiences');
              }}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                handleScrollToSection('experiences');
              }}
              searchDate={searchDate}
              onSetSearchDate={setSearchDate}
              guestsCount={guestsCount}
              onSetGuestsCount={setGuestsCount}
              onExecuteSearch={handleExecuteSearch}
            />
          </div>

          {/* Section: Featured Destinations */}
          <FeaturedDestinations
            destinations={destinations}
            onSelectDestination={(id) => {
              setSelectedDestination(id);
              handleScrollToSection('experiences');
            }}
          />

          {/* Section: Experiences Dynamic Catalog */}
          <ExperienceCatalog
            experiences={experiences}
            destinations={destinations}
            selectedDestination={selectedDestination}
            onSelectDestination={setSelectedDestination}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onOpenExperienceDetail={handleSelectExperience}
          />

          {/* Section: Interactive Matcher & Saudi Knowledge Game */}
          <InteractiveQuiz
            quizQuestions={quizzes}
            experiences={experiences}
            onSelectExperience={handleSelectExperience}
          />

          {/* Section: Campaigns, Why Local, and About */}
          <MarketingSections
            promotions={promotions}
            content={websiteContent}
            onSelectPromotion={handleSelectPromotion}
          />
        </main>
      )}

      {/* Footer */}
      <VisitorFooter
        content={websiteContent}
        onNavigateSection={handleScrollToSection}
        onGoToAdmin={onGoToAdmin}
      />
    </div>
  );
};
