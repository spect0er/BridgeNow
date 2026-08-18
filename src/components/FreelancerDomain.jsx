import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowLeft, CheckCircle2, ShieldCheck, Star, Zap, Laptop, Award, Code } from "lucide-react";

export default function FreelancerDomain({ onNavigate }) {
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

      // Skill tags stagger animations
      gsap.fromTo(
        ".skill-tag-animate",
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".skills-section",
            start: "top 80%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { label: "Completed Projects", value: "15K+", icon: Award, color: "#2563eb" },
    { label: "Client Satisfaction", value: "4.9/5", icon: Star, color: "#f59e0b" },
    { label: "Average Growth", value: "18.4%", icon: Zap, color: "#10b981" },
  ];

  const perks = [
    {
      title: "Milestone Escrow System",
      description: "No more chasing payments. Clients deposit project funds into an escrow account. Funds are released automatically as you hit defined milestones.",
    },
    {
      title: "Vetted Premium Clients",
      description: "Work with top-tier organizations and high-growth startups that value quality and professional delivery.",
    },
    {
      title: "Verified Contract Standards",
      description: "Standardized service contracts protect your intellectual property, layout timelines, and guarantee clear revisions policies.",
    },
    {
      title: "Zero Commision for Premium",
      description: "Keep 100% of your earnings. BridgeNow offers simple flat subscription pricing instead of taking high project cuts.",
    },
  ];

  const skillCategories = [
    "UI/UX Design", "Frontend React/Vue Dev", "Backend Node/Go API", "Mobile App Development",
    "Digital Copywriting", "Technical Writing", "SEO & Marketing", "Motion Graphics", "Video Production"
  ];

  return (
    <div ref={containerRef} className="bg-white min-h-[calc(100vh-80px)] w-full pt-20 pb-24">
      {/* Hero Banner */}
      <div className="domain-hero-section px-6 md:px-12 pt-12 pb-20 border-b border-gray-100 bg-gradient-to-b from-blue-50/35 to-transparent">
        <div className="max-w-6xl mx-auto flex flex-col">
          {/* Back Navigation */}
          <button
            onClick={() => onNavigate("explore")}
            className="self-start mb-10 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#2563eb] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            Back to Domains
          </button>

          {/* Intro Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs mb-5">
                <Laptop className="w-3.5 h-3.5" />
                BridgeNow Freelancer Domain
              </div>
              <h1 className="domain-hero-title text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight font-outfit text-gray-900">
                Work on terms <br />
                that match <span className="text-[#2563eb]">your caliber</span>
              </h1>
              <p className="domain-hero-desc text-gray-500 text-base sm:text-lg md:text-xl font-semibold mt-6 leading-relaxed max-w-lg">
                Connect with clients looking for experts. Access secure milestone billing, verified standard legal terms, and protect your delivery with smart escrows.
              </p>

              <button className="mt-8 px-8 py-3.5 rounded-full font-bold text-white bg-gradient-to-r from-[#2563eb] to-[#00b0ff] hover:shadow-[0_0_24px_rgba(37,99,235,0.4)] transition-all">
                Explore Premium Gigs
              </button>
            </div>

            {/* Graphic Mockup (Vibe check) */}
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-blue-100 bg-[#2563eb]/5 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center bg-white/80 backdrop-blur border border-blue-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-extrabold">F</div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-gray-800">Escrow Vault</span>
                    <span className="text-xs text-gray-400">Milestone System</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#2563eb] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  ₹1,50,000 Locked
                </span>
              </div>

              {/* Mini dashboard items */}
              <div className="flex flex-col gap-3 my-6 bg-white/40 backdrop-blur rounded-2xl p-4 border border-blue-50 text-left text-xs">
                <div className="flex justify-between items-center text-gray-600 font-semibold">
                  <span>Milestone 1: Prototype</span>
                  <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">Released</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-blue-600" />
                </div>
                <div className="flex justify-between items-center text-gray-600 font-semibold mt-1">
                  <span>Milestone 2: Final Integration</span>
                  <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">In Escrow</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-blue-600" />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                <span>Contract: Standard SLA Signed</span>
                <span className="text-blue-600 font-bold">100% Secure Transaction</span>
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
              Contracting Built for Professionals
            </h2>
            <p className="text-gray-500 text-sm sm:text-base font-semibold mt-3">
              Get back to building products and solutions without worrying about payment delays or scope creeps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {perks.map((perk, i) => (
              <div key={i} className="domain-feature-item p-6 sm:p-8 flex items-start gap-4 text-left feature-reveal">
                <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
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

      {/* Skills Showcase Section */}
      <div className="px-6 md:px-12 mt-24 skills-section">
        <div className="max-w-6xl mx-auto bg-blue-50/20 border border-blue-100 rounded-[32px] p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold font-outfit text-gray-900">
            Highly Demanded Specialties
          </h2>
          <p className="text-gray-500 text-sm sm:text-base font-semibold mt-4 leading-relaxed max-w-2xl mx-auto mb-8">
            We are actively sourcing experts in these domains. Clients look for verified portfolio credentials to award contracts immediately.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {skillCategories.map((skill, i) => (
              <div
                key={i}
                className="skill-tag-animate px-5 py-3 rounded-2xl bg-white border border-gray-150 text-gray-800 font-bold text-sm shadow-sm hover:border-[#2563eb] hover:text-[#2563eb] hover:shadow-md transition-all cursor-default"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
