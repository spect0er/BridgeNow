import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowLeft, TrendingUp, Briefcase, MapPin, ArrowRight } from "lucide-react";

export default function ExploreNow({ onNavigate }) {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    // Stagger reveal animation for the page
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".explore-title",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
      gsap.fromTo(
        ".explore-subtitle",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.1, ease: "power3.out" }
      );
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, delay: 0.2, ease: "power3.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3D Tilt Effect on mouse movement
  const handleMouseMove = (e, index) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12; // max 12 degrees tilt
    const rotateY = ((x - centerX) / centerX) * 12;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      ease: "power2.out",
      duration: 0.3,
    });
  };

  const handleMouseLeave = (index) => {
    const card = cardRefs.current[index];
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: "power2.out",
      duration: 0.5,
    });
  };

  const domains = [
    {
      id: "creator",
      title: "Creator",
      tagline: "Influence. Collaborate. Scale.",
      brief: "For digital artists, social media influencers, and storytellers. BridgeNow connects you with top-tier brands for sponsorships, campaigns, and creative partnerships with high-yield compensation.",
      stat: "2.3M+ total reach",
      icon: TrendingUp,
      color: "#7c3aed",
      accentGlow: "explore-card-creator",
      mockup: (
        <div className="w-full h-full flex flex-col justify-between p-4 text-xs font-sans">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="font-bold text-gray-800">Sponsorship Feed</span>
            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">Active</span>
          </div>
          <div className="flex gap-2.5 items-center my-3">
            <div className="w-9 h-9 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold">C</div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-gray-800">Zara Brand Campaign</span>
              <span className="text-[10px] text-gray-400">Payout: ₹45,000</span>
            </div>
          </div>
          <div className="w-full bg-purple-50 border border-purple-100 rounded-xl p-2.5 flex justify-between items-center">
            <div>
              <div className="text-[10px] text-gray-400">Total Engagement</div>
              <div className="text-sm font-bold text-purple-900">18.4%</div>
            </div>
            <div className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">↑ 2.4%</div>
          </div>
        </div>
      ),
    },
    {
      id: "freelancer",
      title: "Freelancer",
      tagline: "Autonomy. Skills. Growth.",
      brief: "For independent developers, designers, copywriters, and consultants. Find contracts that match your expert skills, collaborate directly with clients, and build your digital reputation.",
      stat: "15K+ completed projects",
      icon: Briefcase,
      color: "#2563eb",
      accentGlow: "explore-card-freelancer",
      mockup: (
        <div className="w-full h-full flex flex-col justify-between p-4 text-xs font-sans">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="font-bold text-gray-800">Milestones Escrow</span>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Secure</span>
          </div>
          <div className="flex flex-col gap-1.5 my-2.5 text-left">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-gray-500">M1: Wireframing</span>
              <span className="text-green-600 font-bold">Released</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-blue-600 rounded-full" />
            </div>
            <div className="flex justify-between items-center text-[10px] mt-1">
              <span className="text-gray-500">M2: UI Development</span>
              <span className="text-blue-600 font-semibold">In Progress</span>
            </div>
          </div>
          <div className="w-full bg-blue-50 border border-blue-100 rounded-xl p-2.5 flex justify-between items-center">
            <div>
              <div className="text-[10px] text-gray-400">Escrow Value</div>
              <div className="text-sm font-bold text-blue-900">₹1,20,000</div>
            </div>
            <div className="text-[9px] bg-blue-600 text-white px-2 py-1 rounded font-bold">Sign-off</div>
          </div>
        </div>
      ),
    },
    {
      id: "onground",
      title: "On-Ground Talent",
      tagline: "Local impact. Real presence.",
      brief: "For local specialists, coordinators, event managers, and field staff. Tap into physical, local job opportunities near your location. High flexibility, weekly payouts, and zero spam.",
      stat: "7K+ local jobs",
      icon: MapPin,
      color: "#4d7c0f",
      accentGlow: "explore-card-onground",
      mockup: (
        <div className="w-full h-full flex flex-col justify-between p-4 text-xs font-sans">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="font-bold text-gray-800">Job Radar</span>
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Live</span>
          </div>
          <div className="flex gap-2.5 items-center my-3">
            <div className="w-9 h-9 rounded-full bg-lime-100 flex items-center justify-center text-lime-700 font-bold">📍</div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-gray-800">Event Lead - Tech Summit</span>
              <span className="text-[10px] text-gray-400">Within 4.2 km</span>
            </div>
          </div>
          <div className="w-full bg-lime-50 border border-lime-100 rounded-xl p-2.5 flex justify-between items-center">
            <div>
              <div className="text-[10px] text-gray-400">Weekly Payout</div>
              <div className="text-sm font-bold text-lime-900">₹18,500</div>
            </div>
            <div className="text-[9px] bg-lime-700 text-white px-2 py-1 rounded font-bold">Accept</div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative min-h-[calc(100vh-80px)] w-full pt-28 pb-16 px-6 md:px-12 flex flex-col justify-center items-center bg-white z-10 overflow-hidden"
    >
      {/* Decorative Aura Backgrounds */}
      <div className="explore-bg-glow top-1/4 left-1/4 bg-[#7c3aed]/10" />
      <div className="explore-bg-glow bottom-1/4 right-1/4 bg-[#2563eb]/10" />

      <div className="w-full max-w-6xl z-10 relative flex flex-col items-center">
        {/* Back Button */}
        <button
          onClick={() => onNavigate("home")}
          className="self-start mb-8 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#863bff] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        {/* Heading */}
        <div className="text-center max-w-2xl mb-16">
          <h1 className="explore-title text-4xl sm:text-5xl md:text-[56px] font-extrabold tracking-tight leading-tight font-outfit text-[#1e1b4b]">
            Choose Your <span className="text-[#863bff]">Domain</span>
          </h1>
          <p className="explore-subtitle text-gray-500 text-base sm:text-lg md:text-xl font-semibold mt-4 leading-relaxed">
            Select the path that matches your expertise and discover custom-tailored opportunities, secure escrows, and fast payouts.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 w-full">
          {domains.map((domain, index) => {
            const Icon = domain.icon;
            return (
              <div
                key={domain.id}
                ref={(el) => (cardRefs.current[index] = el)}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={() => handleMouseLeave(index)}
                onClick={() => onNavigate(domain.id)}
                className="explore-card-wrapper h-full cursor-pointer group"
              >
                <div
                  className={`explore-card ${domain.accentGlow} flex flex-col justify-between p-6 sm:p-8 h-[540px] w-full`}
                >
                  {/* Top: Icon + Title */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white`}
                        style={{ backgroundColor: domain.color }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">
                        Domain
                      </span>
                    </div>

                    <h2
                      className="text-2xl sm:text-3xl font-extrabold tracking-tight font-outfit mt-6"
                      style={{ color: domain.color }}
                    >
                      {domain.title}
                    </h2>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wide">
                      {domain.tagline}
                    </p>

                    <p className="text-gray-500 text-sm sm:text-[15px] mt-4 font-semibold leading-relaxed text-left">
                      {domain.brief}
                    </p>
                  </div>

                  {/* Middle: Custom Mini Mockup */}
                  <div className="explore-mockup-container w-full h-[160px] my-6 flex items-center justify-center p-2 rounded-2xl border border-gray-100 overflow-hidden">
                    {domain.mockup}
                  </div>

                  {/* Bottom: Stat & Arrow */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-5 mt-auto">
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        Highlight
                      </div>
                      <div className="text-sm font-extrabold text-[#1a1c1d] mt-0.5">
                        {domain.stat}
                      </div>
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 group-hover:scale-105`}
                      style={{ backgroundColor: domain.color }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
