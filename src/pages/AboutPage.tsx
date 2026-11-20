import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { HERO_IMAGE, VENTURE_ASSUMPTIONS } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { FoodImage } from '../components/FoodImage';

export const AboutPage: React.FC = () => {
  const { navigate } = useApp();

  const values = [
    {
      title: 'Affordability',
      description:
        'Keeping everyday home-style meals aligned with realistic student budgets around our proposed ₹120 meal price.',
    },
    {
      title: 'Convenience',
      description:
        'Removing the friction of informal phone calls and messy schedules through straightforward digital ordering and meal plans.',
    },
    {
      title: 'Quality',
      description:
        'Prioritizing fresh ingredients, hygienic home-kitchen preparation, and honest post-delivery student feedback.',
    },
    {
      title: 'Customer Satisfaction',
      description:
        'Listening continuously to hostel and PG students in Dehradun to improve portion sizes, taste, and meal variety.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Our Story */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
          <p className="text-xs font-semibold text-[#1B6B44]">
            DBS Global University Entrepreneurship Venture · Dehradun, Uttarakhand
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#17231C] leading-tight">
            Our Story
          </h1>
          <div className="space-y-4 text-base text-[#56635B] leading-relaxed max-w-2xl">
            <p>
              HostelBite was created with a simple idea: students living away from home should not
              have to compromise on their everyday meals.
            </p>
            <p>
              Many hostel and PG students struggle to find affordable, convenient and home-style
              food regularly.
            </p>
            <p>
              HostelBite aims to solve this problem by connecting students with nearby home chefs
              and local food providers through a simple digital platform.
            </p>
            <p className="text-[#17231C] font-medium">
              Our mission is to make everyday meals more convenient, accessible and
              student-friendly.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('explore')}
              className="px-6 py-3 bg-[#1B6B44] hover:bg-[#135233] text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <span>Explore Home-Style Meals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('provider')}
              className="px-6 py-3 bg-white hover:bg-[#F3F0E6] text-[#17231C] border border-[#E5E1D6] text-sm font-semibold rounded-xl transition-colors"
            >
              Partner as a Food Provider
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="h-full min-h-[300px] rounded-2xl overflow-hidden border border-[#E5E1D6] bg-[#F3F0E6]">
            <FoodImage
              src={HERO_IMAGE}
              alt="Home-style Indian meal spread prepared for college students in Dehradun"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E5E1D6] rounded-2xl p-8 space-y-3">
          <div className="text-xs font-semibold text-[#1B6B44]">Our Mission</div>
          <h2 className="font-display text-2xl font-semibold text-[#17231C] leading-snug">
            To make affordable and home-style meals easily accessible to students living away from
            home.
          </h2>
          <p className="text-sm text-[#56635B] leading-relaxed">
            Starting with hostel and PG student clusters across Dehradun, Uttarakhand, we focus on
            dependable everyday food that fits student schedules and monthly allowances.
          </p>
        </div>

        <div className="bg-[#F3F0E6] border border-[#E5E1D6] rounded-2xl p-8 space-y-3">
          <div className="text-xs font-semibold text-[#D96B27]">Our Vision</div>
          <h2 className="font-display text-2xl font-semibold text-[#17231C] leading-snug">
            To become a trusted student-focused meal-ordering and subscription platform.
          </h2>
          <p className="text-sm text-[#56635B] leading-relaxed">
            Building a transparent bridge between local neighborhood home chefs seeking steady
            daily demand and students aged 18–25 looking for reliable, nutritious food.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="space-y-8">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#17231C]">Our Core Values</h2>
          <p className="text-sm sm:text-base text-[#56635B] mt-1">
            Four foundational principles guiding every feature of HostelBite.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => (
            <div
              key={val.title}
              className="bg-white border border-[#E5E1D6] rounded-2xl p-6 space-y-2.5"
            >
              <div className="font-mono text-xs font-semibold text-[#1B6B44]">0{idx + 1}.</div>
              <h3 className="font-display text-xl font-semibold text-[#17231C]">{val.title}</h3>
              <p className="text-sm text-[#56635B] leading-relaxed">{val.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Positioning vs Alternatives */}
      <section className="space-y-6 pt-6 border-t border-[#E5E1D6]">
        <div className="max-w-2xl space-y-1.5">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#17231C]">
            How HostelBite Fits the Student Food Landscape
          </h2>
          <p className="text-sm text-[#56635B]">
            Venture positioning: <strong className="text-[#17231C]">{VENTURE_ASSUMPTIONS.positioningStatement}</strong>.
          </p>
        </div>

        <div className="overflow-x-auto bg-white border border-[#E5E1D6] rounded-2xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#E5E1D6] bg-[#FAFAF6] text-xs text-[#56635B]">
                <th className="py-3.5 px-5 font-semibold">Option / Alternative</th>
                <th className="py-3.5 px-5 font-semibold">Ordering Convenience</th>
                <th className="py-3.5 px-5 font-semibold">Home-Style Suitability</th>
                <th className="py-3.5 px-5 font-semibold">Student Affordability</th>
                <th className="py-3.5 px-5 font-semibold">Key Observation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E1D6]">
              {VENTURE_ASSUMPTIONS.competitors.map((row) => {
                const isHostelBite = row.name.startsWith('HostelBite');
                return (
                  <tr
                    key={row.name}
                    className={isHostelBite ? 'bg-[#EAF3EE]/60 font-medium' : 'bg-white'}
                  >
                    <td className="py-4 px-5 text-[#17231C] font-semibold">
                      <span className="inline-flex items-center gap-2">
                        {isHostelBite && <Check className="w-4 h-4 text-[#1B6B44]" />}
                        {row.name}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-[#17231C]">{row.convenience}</td>
                    <td className="py-4 px-5 text-[#17231C]">{row.homestyleQuality}</td>
                    <td className="py-4 px-5 text-[#17231C]">{row.affordability}</td>
                    <td className="py-4 px-5 text-[#56635B]">{row.gap}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
