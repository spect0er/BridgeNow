import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowLeft, CheckCircle2, Map, ShieldAlert, Sparkles, Navigation, Calendar, Banknote } from "lucide-react";

export default function OnGroundDomain({ onNavigate }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance hero animations
      gsap.fromTo(
        ".domain-hero-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
      gsap.fromTo(
        ".domain-hero-desc",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.1, ease: "power3.out" }
      );
      gsap.fromTo(
        ".domain-stat-card",
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, delay: 0.2, stagger: 0.1, ease: "power3.out" }
      );

      // Scroll trigger animations for features
      gsap.fromTo(
        ".feature-reveal",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".features-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { label: "On-Ground Jobs", value: "7K+", icon: Navigation, color: "#4d7c0f" },
    { label: "Growth Rate", value: "21.7%", icon: Sparkles, color: "#c026d3" },
    { label: "Geo-Verified Matches", value: "99.8%", icon: Map, color: "#10b981" },
  ];

  const perks = [
    {
      title: "Geo-Localized Shift Matching",
      description: "Find event coordination, field surveys, and logistics jobs directly within your radius. Zero commute friction.",
    },
    {
      title: "Fast Weekly Deposits",
      description: "Get paid fast. Payouts for completed shifts are deposited directly to your bank account every single Friday.",
    },
    {
      title: "On-Site Insurance & Support",
      description: "Safety first. All physical on-ground shifts include coordinate support and accidental insurance coverage.",
    },
    {
      title: "Flexible Shift Layouts",
      description: "Choose your hours. Book shifts that fit your schedule—day, night, weekends, or one-off campaign dates.",
    },
  ];

  return (
    <div ref={containerRef} className="bg-white min-h-[calc(100vh-80px)] w-full pt-20 pb-24">
      {/* Hero Banner */}
      <div className="domain-hero-section px-6 md:px-12 pt-12 pb-20 border-b border-gray-100 bg-gradient-to-b from-lime-50/35 to-transparent">
        <div className="max-w-6xl mx-auto flex flex-col">
          {/* Back Navigation */}
          <button
            onClick={() => onNavigate("explore")}
            className="self-start mb-10 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#4d7c0f] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            Back to Domains
          </button>

          {/* Intro Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100 text-lime-800 font-bold text-xs mb-5">
                <Navigation className="w-3.5 h-3.5" />
                BridgeNow On-Ground Domain
              </div>
              <h1 className="domain-hero-title text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight font-outfit text-gray-900">
                Opportunities <br />
                right in <span className="text-[#4d7c0f]">your neighborhood</span>
              </h1>
              <p className="domain-hero-desc text-gray-500 text-base sm:text-lg md:text-xl font-semibold mt-6 leading-relaxed max-w-lg">
                Book flexible coordinates, events, and audit shifts near you. Enjoy guaranteed weekly check deposits, shift-level insurance, and verified security.
              </p>

              <button className="mt-8 px-8 py-3.5 rounded-full font-bold text-white bg-gradient-to-r from-[#4d7c0f] to-[#84cc16] hover:shadow-[0_0_24px_rgba(77,124,15,0.4)] transition-all">
                Search Local Shifts
              </button>
            </div>

            {/* Graphic Mockup (Vibe check) */}
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-lime-150 bg-[#4d7c0f]/5 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center bg-white/80 backdrop-blur border border-lime-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#4d7c0f] flex items-center justify-center text-white font-extrabold">O</div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-gray-800">Local Radar</span>
                    <span className="text-xs text-gray-400">Shift Manager</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#4d7c0f] bg-lime-50 border border-lime-100 px-3 py-1 rounded-full">
                  3 Open Shifts
                </span>
              </div>

              {/* Shift list representation */}
              <div className="flex flex-col gap-2.5 my-6 bg-white/50 backdrop-blur rounded-2xl p-4 border border-lime-100 text-left text-xs font-sans">
                <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#4d7c0f]" />
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">Event Host - Bangalore</span>
                      <span className="text-[10px] text-gray-400">Sat, 2nd July • 6 hours</span>
                    </div>
                  </div>
                  <span className="font-bold text-lime-700">₹3,200</span>
                </div>
                <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-gray-100 opacity-80">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-600">Store Audit - Indiranagar</span>
                      <span className="text-[10px] text-gray-400">Mon, 4th July • 3 hours</span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-600">₹1,800</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                <span>Shift Code: BN-9943 Secured</span>
                <span className="text-lime-700 font-bold flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5" />
                  Weekly Friday Payouts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 md:px-12 -mt-10 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="domain-stat-card p-6 md:p-8 flex items-center gap-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white"
                  style={{ backgroundColor: stat.color }}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">
                    {stat.label}
                  </div>
                  <div className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-0.5">
                    {stat.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="px-6 md:px-12 mt-24 features-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold font-outfit text-gray-900">
              Work Dynamically in the Real World
            </h2>
            <p className="text-gray-500 text-sm sm:text-base font-semibold mt-3">
              We vet physical opportunities so you can accept assignments with confidence and get paid on time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {perks.map((perk, i) => (
              <div key={i} className="domain-feature-item p-6 sm:p-8 flex items-start gap-4 text-left feature-reveal">
                <CheckCircle2 className="w-6 h-6 text-lime-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{perk.title}</h3>
                  <p className="text-gray-500 text-sm sm:text-[15px] font-semibold mt-2 leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
