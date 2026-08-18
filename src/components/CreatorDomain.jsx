import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowLeft, CheckCircle2, Flame, LineChart, ShieldAlert, Sparkles, Trophy } from "lucide-react";

export default function CreatorDomain({ onNavigate }) {
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

      // Dashboard preview mock animations
      gsap.fromTo(
        ".mock-chart-bar",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.2,
          stagger: 0.1,
          transformOrigin: "bottom",
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".mockup-section",
            start: "top 75%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { label: "Total Reach", value: "2.3M+", icon: Flame, color: "#7c3aed" },
    { label: "Campaigns Executed", value: "45K+", icon: Trophy, color: "#db2777" },
    { label: "Average Growth Rate", value: "12.6%", icon: LineChart, color: "#10b981" },
  ];

  const perks = [
    {
      title: "Direct Brand Partnerships",
      description: "Partner with premier brands directly on the platform. No brokers, no hidden fees—just pure collaboration.",
    },
    {
      title: "Detailed Audience Analytics",
      description: "Understand your engagement patterns. Gain deep demographic insights to showcase your true influence.",
    },
    {
      title: "Guaranteed Payouts",
      description: "Your earnings are held securely in partner bank escrows and disbursed immediately upon campaign completion.",
    },
    {
      title: "Creative Liberty & Support",
      description: "Choose campaigns that match your aesthetic. Our 24/7 support ensures you can focus entirely on creating.",
    },
  ];

  return (
    <div ref={containerRef} className="bg-white min-h-[calc(100vh-80px)] w-full pt-20 pb-24">
      {/* Hero Banner */}
      <div className="domain-hero-section px-6 md:px-12 pt-12 pb-20 border-b border-gray-100 bg-gradient-to-b from-purple-50/35 to-transparent">
        <div className="max-w-6xl mx-auto flex flex-col">
          {/* Back Navigation */}
          <button
            onClick={() => onNavigate("explore")}
            className="self-start mb-10 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#7c3aed] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            Back to Domains
          </button>

          {/* Intro Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-bold text-xs mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                BridgeNow Creator Domain
              </div>
              <h1 className="domain-hero-title text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight font-outfit text-gray-900">
                Turn your passion <br />
                into a <span className="text-[#7c3aed]">scalable brand</span>
              </h1>
              <p className="domain-hero-desc text-gray-500 text-base sm:text-lg md:text-xl font-semibold mt-6 leading-relaxed max-w-lg">
                Connect with India's largest brand network. Access campaigns, manage your audience engagement, and receive daily interest-generating payouts.
              </p>

              <button className="mt-8 px-8 py-3.5 rounded-full font-bold text-white bg-gradient-to-r from-[#7c3aed] to-[#c084fc] hover:shadow-[0_0_24px_rgba(124,58,237,0.4)] transition-all">
                Apply as a Creator
              </button>
            </div>

            {/* Graphic Mockup (Vibe check) */}
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-purple-100 bg-[#7c3aed]/5 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center bg-white/80 backdrop-blur border border-purple-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-extrabold">C</div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-gray-800">Creative Hub</span>
                    <span className="text-xs text-gray-400">Campaign Manager</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#7c3aed] bg-purple-50 border border-purple-100 px-3 py-1 rounded-full">
                  5 Active Deals
                </span>
              </div>

              <div className="flex gap-4 items-end justify-center h-24 my-6 bg-white/40 backdrop-blur rounded-2xl p-4 border border-purple-50">
                {[40, 75, 55, 90, 65, 80].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div
                      className="w-full bg-[#7c3aed] rounded-t-md"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                <span>Analytics: Last 7 Days</span>
                <span className="text-green-600 font-bold">↑ 18.4% Engagement</span>
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
              Why Creators Choose BridgeNow
            </h2>
            <p className="text-gray-500 text-sm sm:text-base font-semibold mt-3">
              We provide the core tools, contracts, and financial services you need to focus entirely on producing content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {perks.map((perk, i) => (
              <div key={i} className="domain-feature-item p-6 sm:p-8 flex items-start gap-4 text-left feature-reveal">
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
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

      {/* Mockup Preview Section */}
      <div className="px-6 md:px-12 mt-24 mockup-section">
        <div className="max-w-6xl mx-auto bg-purple-50/20 border border-purple-100 rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold font-outfit text-gray-900">
              Live Brand Dashboard
            </h2>
            <p className="text-gray-500 text-sm sm:text-base font-semibold mt-4 leading-relaxed">
              Track open brand pitches, customize your media kit automatically, and access real-time statistics of your social integrations. Apply for sponsors with a single click.
            </p>
            <div className="flex flex-col gap-3.5 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px]">1</div>
                <span className="text-sm text-gray-700 font-semibold">Instant verification of Instagram & YouTube</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px]">2</div>
                <span className="text-sm text-gray-700 font-semibold">Customizable campaign media cards</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px]">3</div>
                <span className="text-sm text-gray-700 font-semibold">Immediate wallet settlement upon completion</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 shadow-xl flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800 text-sm">Engagement Tracker</span>
              <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded font-bold">↑ Active</span>
            </div>

            <div className="flex justify-between items-end h-28 border-b border-gray-100 pb-2">
              {[30, 45, 25, 75, 55, 95, 60].map((h, i) => (
                <div key={i} className="w-8 flex flex-col items-center gap-1 h-full justify-end">
                  <div
                    className="w-4 bg-purple-600 rounded-t mock-chart-bar"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[8px] text-gray-400 font-semibold">D{i + 1}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3 text-left">
                <span className="text-[9px] text-gray-400 font-bold uppercase">Follower Growth</span>
                <div className="text-base font-extrabold text-gray-800 mt-0.5">14,240</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-left">
                <span className="text-[9px] text-gray-400 font-bold uppercase">Profile Clicks</span>
                <div className="text-base font-extrabold text-gray-800 mt-0.5">2,960</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
