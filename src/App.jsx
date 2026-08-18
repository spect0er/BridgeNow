import React, { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Briefcase, TrendingUp, ArrowRight, Users, ShieldCheck, Star, Menu, X, LogOut } from "lucide-react";
import "./App.css";

import ExploreNow from "./components/ExploreNow";
import CreatorDomain from "./components/CreatorDomain";
import FreelancerDomain from "./components/FreelancerDomain";
import OnGroundDomain from "./components/OnGroundDomain";
import Dashboard from "./components/Dashboard";
import AuthModal from "./components/AuthModal";
import { useAuth } from "./context/AuthContext";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash;
    if (hash === "#/explore") return "explore";
    if (hash === "#/creator") return "creator";
    if (hash === "#/freelancer") return "freelancer";
    if (hash === "#/onground") return "onground";
    if (hash === "#/dashboard") return "dashboard";
    return "home";
  });

  const navigateTo = (view) => {
    if (view === "home") {
      window.location.hash = "";
    } else {
      window.location.hash = `#/${view}`;
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#/explore") {
        setCurrentView("explore");
      } else if (hash === "#/creator") {
        setCurrentView("creator");
      } else if (hash === "#/freelancer") {
        setCurrentView("freelancer");
      } else if (hash === "#/onground") {
        setCurrentView("onground");
      } else if (hash === "#/dashboard") {
        setCurrentView("dashboard");
      } else {
        setCurrentView("home");
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [principal, setPrincipal] = useState(500000);
  const [activeCatIdx, setActiveCatIdx] = useState(0);
  const [activePatternIdx, setActivePatternIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { 
    currentUser, 
    authModal, 
    openAuthModal: handleOpenAuth, 
    closeAuthModal, 
    logout,
    setCurrentUser 
  } = useAuth();

  const handleSuccessLogin = (user) => {
    setCurrentUser(user);
    navigateTo("dashboard");
  };

  const handleLogout = () => {
    logout();
    navigateTo("home");
  };

  const textRef = useRef(null);
  const containerRef = useRef(null);
  const section4Ref = useRef(null);
  const section5Ref = useRef(null);
  const section5CardRef = useRef(null);
  const section5TextRef = useRef(null);
  const section6Ref = useRef(null);
  const section7Ref = useRef(null);
  const section7PathRef = useRef(null);

  const formatINR = (value, showDecimals = false) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    })
      .format(value)
      .replace(/\s/g, "");
  };

  const sliceEarnings = Math.round(principal * 1.30015);
  const traditionalEarnings = Math.round(principal * 1.140246);
  const additionalEarnings = sliceEarnings - traditionalEarnings;

  const categories = [
    { label: "Transfers", icon: "compare_arrows" },
    { label: "Food & Dining", icon: "restaurant" },
    { label: "Groceries", icon: "eco" },
    { label: "Transfers", icon: "compare_arrows" },
    { label: "Shopping", icon: "local_mall" },
    { label: "Travel", icon: "flight" },
    { label: "Transport", icon: "directions_car" },
    { label: "Food & Dining", icon: "restaurant" },
    { label: "Groceries", icon: "eco" }
  ];

  const patternDatasets = [
    [
      { label: "Food & Dining", value: "₹6,464", percentage: "37%", barWidth: "37%", barColor: "#ff7a00", icon: "restaurant" },
      { label: "Groceries", value: "₹5,285", percentage: "31%", barWidth: "31%", barColor: "#00c853", icon: "eco" },
      { label: "Transfers", value: "₹1,600", percentage: "9%", barWidth: "9%", barColor: "#00c853", icon: "compare_arrows" }
    ],
    [
      { label: "Travel", value: "₹1,330", percentage: "8%", barWidth: "8%", barColor: "#00b0ff", icon: "flight" },
      { label: "Transport", value: "₹865", percentage: "5%", barWidth: "5%", barColor: "#aa00ff", icon: "directions_car" },
      { label: "Food & Dining", value: "₹6,464", percentage: "37%", barWidth: "37%", barColor: "#ff7a00", icon: "restaurant" }
    ]
  ];

  const breakdownPoints = [
    { left: "65%", bottom: "45%", value: "AVG. ₹2.0L" },
    { left: "80%", bottom: "62%", value: "AVG. ₹2.1L" }
  ];

  const slides = [
    {
      label: "for creators",
      bg: "/images/card_creator.png",
      title: "For Creators",
      desc: "Build your profile, showcase your work and collaborate with top brands.",
      buttonText: "Explore Creators",
      themeColor: "#7c3aed",
      badgeText: "Total Reach",
      badgeValue: "2.3M+",
      iconKey: "TrendingUp",
      badgeIconBg: "bg-[#8b5cf6]",
      percentage: "↑ 12.6%",
      avatars: [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64"
      ],
      plusCount: "+127",
      number: "01"
    },
    {
      label: "for freelancers",
      bg: "/images/card_freelancer.png",
      title: "For Freelancers",
      desc: "Find work that matches your skills. Deliver, earn and grow your reputation.",
      buttonText: "Explore Freelancers",
      themeColor: "#2563eb",
      badgeText: "Projects Completed",
      badgeValue: "15K+",
      iconKey: "Briefcase",
      badgeIconBg: "bg-[#3b82f6]",
      percentage: "↑ 18.4%",
      avatars: [
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64"
      ],
      plusCount: "+89",
      number: "02"
    },
    {
      label: "for on-ground",
      bg: "/images/card_onground.png",
      title: "For On-Ground Professionals",
      desc: "Connect with local opportunities near you. Real work, real impact.",
      buttonText: "Explore Professionals",
      themeColor: "#4d7c0f",
      badgeText: "On-Ground Jobs",
      badgeValue: "7K+",
      iconKey: "MapPin",
      badgeIconBg: "bg-[#4d7c0f]",
      percentage: "↑ 21.7%",
      avatars: [
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=64&h=64",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=64&h=64",
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=64&h=64"
      ],
      plusCount: "+56",
      number: "03"
    }
  ];

  // Direct scroll/resize listener for header scroll background and mobile state checking
  useEffect(() => {
    const checkScrollAndMobile = () => {
      setIsScrolled(window.scrollY > 20);
      setIsMobile(window.innerWidth < 768);
    };
    checkScrollAndMobile();
    window.addEventListener("scroll", checkScrollAndMobile, { passive: true });
    window.addEventListener("resize", checkScrollAndMobile, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkScrollAndMobile);
      window.removeEventListener("resize", checkScrollAndMobile);
    };
  }, []);

  useEffect(() => {
    if (currentView !== "home") return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeSlide, slides.length, currentView]);

  useEffect(() => {
    if (currentView !== "home") return;
    const interval = setInterval(() => {
      setActiveCatIdx((prev) => (prev + 1) % 9);
    }, 2500);
    return () => clearInterval(interval);
  }, [currentView]);

  useEffect(() => {
    if (currentView !== "home") return;
    const interval = setInterval(() => {
      setActivePatternIdx((prev) => (prev + 1) % 2);
    }, 3500);
    return () => clearInterval(interval);
  }, [currentView]);

  useEffect(() => {
    if (currentView !== "home") return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ── DESKTOP SCROLL ANIMATIONS ──
      mm.add("(min-width: 768px)", () => {
        // ── SECTION 2: ENTRANCE ANIMATION ──
        gsap.fromTo(textRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );

        gsap.fromTo(".card-wrapper",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".card-wrapper",
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // ── SECTION 4: KNOW WHERE YOUR MONEY GOES ──
        const tl4 = gsap.timeline({
          scrollTrigger: {
            trigger: section4Ref.current,
            start: "top 80px",
            end: "+=120%",
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          }
        });

        // Fan out Card 1, Card 2, Card 3
        tl4.fromTo(".section4-card-1",
          { xPercent: 100, x: 24, rotation: -2, opacity: 0.75 },
          { xPercent: 0, x: 0, rotation: 0, opacity: 1, ease: "none" },
          0
        );

        tl4.fromTo(".section4-card-2",
          { scale: 1.05 },
          { scale: 1, ease: "none" },
          0
        );

        tl4.fromTo(".section4-card-3",
          { xPercent: -100, x: -24, rotation: 2, opacity: 0.75 },
          { xPercent: 0, x: 0, rotation: 0, opacity: 1, ease: "none" },
          0
        );

        // ── SECTION 5: SAFE SPACE VAULT ANIMATION ──
        const tl5 = gsap.timeline({
          scrollTrigger: {
            trigger: section5Ref.current,
            start: "top 80px",
            end: "+=120%",
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          }
        });

        tl5.to(section5TextRef.current, {
          x: () => {
            if (!section5CardRef.current || !section5TextRef.current) return 0;
            const cardW = section5CardRef.current.offsetWidth;
            const textW = section5TextRef.current.offsetWidth;
            return -1 * ((cardW - textW) / 2 - 64);
          },
          ease: "power1.inOut"
        });
      });

      // ── MOBILE FALLBACK RESET ──
      mm.add("(max-width: 767px)", () => {
        // Reset Section 2 variables
        gsap.set(textRef.current, { clearProps: "all" });
        gsap.set(".card-wrapper", { clearProps: "all" });

        // Reset Section 4 cards
        gsap.set(".section4-card-1", { clearProps: "all" });
        gsap.set(".section4-card-2", { clearProps: "all" });
        gsap.set(".section4-card-3", { clearProps: "all" });

        // Reset Section 5 textbox
        gsap.set(section5TextRef.current, { clearProps: "all" });
      });

      // ── SECTION 6: CUSTOMER SUPPORT ANIMATION ──
      gsap.timeline({
        scrollTrigger: {
          trigger: section6Ref.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      })
        .fromTo(".section6-image-container",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        )
        .fromTo(".section6-heading",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.6"
        )
        .fromTo(".section6-badges",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.6"
        );

      // ── SECTION 7: FLOWING STRING FOOTER ──
      if (section7Ref.current && section7PathRef.current) {
        const pathEl = section7PathRef.current;
        const totalLen = pathEl.getTotalLength();
        gsap.set(pathEl, { strokeDasharray: totalLen, strokeDashoffset: totalLen });

        // Set initial states for labels
        gsap.set(".section7-label", { opacity: 0, scale: 0.8, y: 15 });

        const tl7 = gsap.timeline({
          scrollTrigger: {
            trigger: section7Ref.current,
            start: "top 60%",
            end: "bottom 40%",
            scrub: 1,
          }
        });

        // Draw the string
        tl7.to(pathEl, { strokeDashoffset: 0, ease: "none", duration: 1 });

        // Stagger labels in sync with the path draw
        tl7.to(".section7-label-1", { opacity: 1, scale: 1, y: 0, duration: 0.15, ease: "power2.out" }, 0.05);
        tl7.to(".section7-label-2", { opacity: 1, scale: 1, y: 0, duration: 0.15, ease: "power2.out" }, 0.2);
        tl7.to(".section7-label-3", { opacity: 1, scale: 1, y: 0, duration: 0.15, ease: "power2.out" }, 0.4);
        tl7.to(".section7-label-4", { opacity: 1, scale: 1, y: 0, duration: 0.15, ease: "power2.out" }, 0.55);
        tl7.to(".section7-label-5", { opacity: 1, scale: 1, y: 0, duration: 0.15, ease: "power2.out" }, 0.75);
      }
    });

    return () => ctx.revert();
  }, [currentView]);

  const catContainerHeight = isMobile ? 180 : 260;
  const catItemHeight = 52;
  const catGap = 12;
  const catOffset = (catContainerHeight / 2) - (activeCatIdx * (catItemHeight + catGap)) - (catItemHeight / 2);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden font-sans select-none">

      {/* ── HEADER ── */}
      {currentView !== "dashboard" && (
        <header className={`fixed top-0 left-0 right-0 z-50 h-20 px-8 md:px-12 flex justify-between items-center transition-all duration-300 ${isScrolled || mobileMenuOpen
          ? "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm"
          : "bg-white border-b border-transparent"
          }`}>
          <div className="cursor-pointer" onClick={() => navigateTo("home")}>
            <span className="text-[#863bff] font-outfit font-extrabold text-[32px] md:text-[34px] tracking-[-0.04em] select-none lowercase">
              bridge-now
            </span>
          </div>
          <nav className="hidden lg:flex items-center gap-3">
            <a href={currentView === "home" ? "#savings" : "/#savings"} className="text-[13px] font-semibold px-[18px] py-[8.5px] rounded-full bg-white text-[#1a1c1d] hover:bg-[#e4e4e7] transition-all duration-300 border border-transparent shadow-sm">
              Savings account
            </a>
            <a href={currentView === "home" ? "#credit" : "/#credit"} className="text-[13px] font-semibold px-[18px] py-[8.5px] rounded-full bg-white text-[#1a1c1d] hover:bg-[#e4e4e7] transition-all duration-300 border border-transparent shadow-sm">
              UPI credit card
            </a>
            <a href={currentView === "home" ? "#offer" : "/#offer"} className="inline-flex items-center gap-1 text-[13px] font-semibold px-[18px] py-[8.5px] rounded-full bg-white text-[#1a1c1d] hover:bg-[#e4e4e7] transition-all duration-300 border border-transparent shadow-sm">
              What we offer <span className="text-[14px] text-gray-400 font-bold ml-0.5">+</span>
            </a>
            <button
              onClick={() => navigateTo("explore")}
              className={`text-[13px] font-bold px-5 py-[8.5px] rounded-full border transition-all duration-300 shadow-sm ${
                currentView === "explore"
                  ? "bg-gradient-to-r from-[#7c3aed] to-[#c084fc] text-white border-transparent"
                  : "bg-white text-[#863bff] border-[#863bff]/20 hover:bg-[#863bff]/5"
              }`}
            >
              Explore Now
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => navigateTo("dashboard")}
                  className="flex items-center gap-2 text-[13px] font-bold px-4 py-[8.5px] rounded-full bg-purple-50 text-[#863bff] border border-purple-200 hover:bg-purple-100 transition-all shadow-sm"
                >
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-5 h-5 rounded-full object-cover" />
                  <span>{currentUser.name.split(' ')[0]} (Console)</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => handleOpenAuth("login")}
                  className="text-[13px] font-bold px-4 py-[8.5px] rounded-full bg-white text-[#1a1c1d] border border-gray-200 hover:bg-gray-100 transition-all shadow-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleOpenAuth("register")}
                  className="text-[13px] font-bold px-5 py-[8.5px] rounded-full bg-gradient-to-r from-[#7c3aed] to-[#c084fc] text-white shadow-md hover:shadow-lg transition-all active:scale-95 duration-200"
                >
                  Register
                </button>
              </div>
            )}
          </nav>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none z-50"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[#1a1c1d]" />
            ) : (
              <Menu className="w-6 h-6 text-[#1a1c1d]" />
            )}
          </button>
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-x-0 top-20 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-xl py-6 px-8 z-40 flex flex-col gap-4">
              <a href={currentView === "home" ? "#savings" : "/#savings"} onClick={() => setMobileMenuOpen(false)} className="text-[15px] font-bold py-2.5 text-[#1a1c1d] hover:text-[#863bff] transition-colors border-b border-gray-50">
                Savings account
              </a>
              <a href={currentView === "home" ? "#credit" : "/#credit"} onClick={() => setMobileMenuOpen(false)} className="text-[15px] font-bold py-2.5 text-[#1a1c1d] hover:text-[#863bff] transition-colors border-b border-gray-50">
                UPI credit card
              </a>
              <a href={currentView === "home" ? "#offer" : "/#offer"} onClick={() => setMobileMenuOpen(false)} className="text-[15px] font-bold py-2.5 text-[#1a1c1d] hover:text-[#863bff] transition-colors border-b border-gray-50">
                What we offer +
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateTo("explore");
                }}
                className="w-full text-center text-[15px] font-bold py-3 px-6 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#c084fc] text-white shadow-md transition-all duration-300"
              >
                Explore Now
              </button>
              {currentUser ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo("dashboard");
                    }}
                    className="w-full text-center text-[15px] font-bold py-3 px-6 rounded-full bg-purple-50 text-[#863bff] border border-purple-200 shadow-sm"
                  >
                    Console ({currentUser.name})
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-center text-[15px] font-bold py-2.5 text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleOpenAuth("login");
                    }}
                    className="flex-1 text-center text-[15px] font-bold py-3 rounded-full border border-gray-200 bg-white text-[#1a1c1d]"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleOpenAuth("register");
                    }}
                    className="flex-1 text-center text-[15px] font-bold py-3 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#c084fc] text-white shadow-md"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          )}
        </header>
      )}

      <div className={currentView === "home" ? "" : "hidden"}>
          {/* ── SECTION 1: HERO VIEWPORT CARD ── */}
          <section className="min-h-screen h-auto md:h-screen w-full p-4 md:p-8 pb-4 md:pb-8 pt-24 flex flex-col flex-shrink-0 bg-white">
        <div className="w-full h-full rounded-[24px] md:rounded-[36px] relative overflow-hidden flex flex-col justify-between p-6 md:p-12 shadow-sm border border-[#e4e4e7] flex-1">
          <img src="/assets/desktop-hero-bg-waves.jpg" alt="Hero Background" className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0" />
          <div className="absolute inset-0 bg-black/25 z-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-0" />

          {/* Spacer */}
          <div className="h-0 w-full relative z-10" />

          {/* Main Hero Copy & Actions */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto my-auto pt-4 md:pt-8">
            <h1 className="text-white text-4xl sm:text-6xl md:text-[5.5rem] font-bold tracking-tight leading-[1.1] font-outfit hero-title mb-4 md:mb-6">
              Where Brands<br className="hidden md:block" />Meet Creators.
            </h1>
            <p className="text-white/95 text-base sm:text-xl md:text-[22px] font-medium tracking-wide hero-subtitle mb-8 md:mb-10 max-w-2xl">
              India's premium creator collaboration platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 md:mb-12">
              <button 
                onClick={() => {
                  if (currentUser) {
                    navigateTo("dashboard");
                  } else {
                    handleOpenAuth("register");
                  }
                }}
                className="px-8 py-3.5 text-[0.9375rem] font-semibold text-white bg-gradient-to-r from-[#7c3aed] to-[#c084fc] rounded-full shadow-[0_0_24px_rgba(124,58,237,0.5)] hover:shadow-[0_0_32px_rgba(124,58,237,0.6)] transition-all transform active:scale-95 duration-200"
              >
                {currentUser ? "Go to Dashboard" : "Start Collaborating"}
              </button>
              <button onClick={() => navigateTo("explore")} className="px-8 py-3.5 text-[0.9375rem] font-semibold text-white border border-white/30 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all transform active:scale-95 duration-200">
                Explore Now
              </button>
            </div>
          </div>

          {/* Stats & Trust Badges */}
          <div className="relative z-10 flex flex-col items-center w-full mt-auto">
            {/* Stats Capsule */}
            <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl md:rounded-full px-6 py-3.5 md:px-8 md:py-4 gap-6 md:gap-8 mb-6 md:mb-8 shadow-2xl shadow-black/20 max-w-full">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-white/80" strokeWidth={1.5} />
                <div className="text-left">
                  <div className="text-white font-bold text-base md:text-lg leading-tight">2.3M+</div>
                  <div className="text-white/70 text-[10px] md:text-xs font-medium">Creators</div>
                </div>
              </div>
              <div className="hidden md:block w-px h-8 md:h-10 bg-white/20" />
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-white/80" strokeWidth={1.5} />
                <div className="text-left">
                  <div className="text-white font-bold text-base md:text-lg leading-tight">25K+</div>
                  <div className="text-white/70 text-[10px] md:text-xs font-medium">Brands</div>
                </div>
              </div>
              <div className="hidden md:block w-px h-8 md:h-10 bg-white/20" />
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-white/80" strokeWidth={1.5} />
                <div className="text-left">
                  <div className="text-white font-bold text-base md:text-lg leading-tight">45K+</div>
                  <div className="text-white/70 text-[10px] md:text-xs font-medium">Campaigns</div>
                </div>
              </div>
              <div className="hidden md:block w-px h-8 md:h-10 bg-white/20" />
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Star className="w-5 h-5 md:w-6 md:h-6 text-white/80" strokeWidth={1.5} />
                <div className="text-left">
                  <div className="text-white font-bold text-base md:text-lg leading-tight">4.9/5</div>
                  <div className="text-white/70 text-[10px] md:text-xs font-medium">Rating</div>
                </div>
              </div>
            </div>

            {/* Trust logos */}
            <div className="flex flex-col items-center w-full">
              <p className="text-white/70 text-xs md:text-sm font-medium mb-3 md:mb-5">
                Trusted by 20,000+ creators and leading brands
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 opacity-90 pb-2">
                <div className="text-white font-bold text-xl md:text-2xl tracking-tighter">boAt</div>
                <div className="text-white font-bold text-xl md:text-2xl tracking-tighter italic">zomato</div>
                <div className="flex items-center gap-1 text-white font-bold text-lg md:text-xl tracking-tight">
                  <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6H7v-2h2V7h2v2h2v2h-2v6zm4-6h-2V9h2v2z" />
                  </svg>
                  SWIGGY
                </div>
                <div className="flex items-center gap-1 text-white font-bold text-lg md:text-xl tracking-tight">
                  <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 14.5s2 3 5 3 5-3 5-3v-5s-2-3-5-3-5 3-5 3v5zm-2 0s-2 3-5 3-5-3-5-3v-5s2-3 5-3 5 3 5 3v5z" />
                  </svg>
                  Myntra
                </div>
                <div className="text-white font-medium text-xl md:text-2xl">Uber</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: SCROLLYTELLING CONTAINER ── */}
      {/* 
        Layout logic:
        - The section is tall (300vh) to give enough scroll runway.
        - Part A (text) is sticky at top-[80px] (right below the h-20 navbar).
        - Part B (card) is also sticky at top-[80px] with higher z-index.
        - As the user scrolls, the card naturally rises into view and covers the text.
        - The text fades out based on how much of it is still visible.
      */}
      <section
        ref={containerRef}
        className="relative bg-white scrollytelling-section"
      >

        {/* Part A: Section Header Text */}
        <div
          ref={textRef}
          className="w-full px-6 sm:px-8 md:px-12 pt-20 pb-10 flex flex-col items-start bg-white"
        >
          <h2 className="text-[#1e1b4b] text-4xl sm:text-6xl md:text-[76px] font-extrabold tracking-tight leading-[1.1] font-outfit">
            Opportunities <br /> for <span className="text-[#6d28d9]">everyone.</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-xl md:text-[22px] font-semibold mt-6 tracking-wide leading-relaxed max-w-2xl">
            Creators, freelancers, or on-ground experts — BridgeNow connects talent with the right opportunities.
          </p>
        </div>

        {/* Part B: Card Wrapper */}
        <div
          className="w-full card-wrapper pb-20 md:pb-28"
        >
          <div
            className="w-full bg-white/60 backdrop-blur-[10px] overflow-hidden flex flex-col justify-between pb-8 pr-4 pl-4 sm:pr-8 sm:pl-8 md:pb-12 md:pr-12 md:pl-12 border border-[#e4e4e7] card-inner"
          >

            {/* Background Images Cross-fade */}
            <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: "inherit" }}>
              {slides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === activeSlide ? "opacity-90 z-0" : "opacity-0 -z-10"
                    }`}
                >
                  <img src={slide.bg} alt={slide.label} className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/50 to-transparent z-[1]" />
            </div>

            <div className="h-0 w-full relative z-10" />

            {/* Middle Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between w-full h-full my-auto pb-4 gap-8">

              {/* Left Details */}
              <div className="w-full max-w-sm md:max-w-md bg-white/45 backdrop-blur-md border border-white/60 p-6 sm:p-8 md:p-10 rounded-[24px] md:rounded-[28px] self-start md:self-center shadow-xl shadow-black/5">
                {/* Number bubble */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold mb-6 shadow-md"
                  style={{ backgroundColor: slides[activeSlide].themeColor }}
                >
                  {slides[activeSlide].number}
                </div>
                <h3
                  className="text-2xl sm:text-3xl md:text-[42px] font-extrabold tracking-tight leading-tight font-outfit"
                  style={{ color: slides[activeSlide].themeColor }}
                >
                  {slides[activeSlide].title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base mt-4 font-semibold leading-relaxed">
                  {slides[activeSlide].desc}
                </p>
                <button
                  onClick={() => {
                    const views = ["creator", "freelancer", "onground"];
                    navigateTo(views[activeSlide]);
                  }}
                  className="bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full text-[0.8125rem] font-bold text-[#1e1b4b] flex items-center w-fit shadow-sm hover:shadow-md transition-all gap-2 mt-6 border border-gray-100 hover:bg-white active:scale-95 duration-200"
                >
                  {slides[activeSlide].buttonText} <ArrowRight className="w-4 h-4" style={{ color: slides[activeSlide].themeColor }} />
                </button>
              </div>

              {/* Right Badge / Stats Container */}
              <div className="flex flex-col items-start md:items-end gap-4 self-end md:self-center z-10">

                {/* Stats Pill */}
                <div className="bg-white/90 backdrop-blur-md rounded-full px-5 py-3 inline-flex items-center gap-3 shadow-xl border border-white/60">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: slides[activeSlide].themeColor }}
                  >
                    {React.createElement(
                      {
                        TrendingUp: TrendingUp,
                        Briefcase: Briefcase,
                        MapPin: MapPin
                      }[slides[activeSlide].iconKey],
                      { className: "w-4.5 h-4.5" }
                    )}
                  </div>
                  <div>
                    <div className="text-[0.875rem] font-extrabold text-[#1e1b4b] leading-tight">
                      {slides[activeSlide].badgeValue}
                    </div>
                    <div className="text-[0.6875rem] font-bold text-gray-500">
                      {slides[activeSlide].badgeText}
                    </div>
                  </div>
                  <div className="ml-2 text-[0.75rem] font-extrabold text-green-600 bg-green-50/80 px-2 py-0.5 rounded-md border border-green-100">
                    {slides[activeSlide].percentage}
                  </div>
                </div>

                {/* Avatars List */}
                <div className="flex -space-x-2.5 items-center pl-2">
                  {slides[activeSlide].avatars.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt="Avatar"
                      className="w-9 h-9 rounded-full border-2 border-white relative z-10 object-cover shadow-sm"
                    />
                  ))}
                  <div
                    className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center relative z-0 shadow-sm"
                    style={{ backgroundColor: slides[activeSlide].themeColor }}
                  >
                    <span className="text-[0.6875rem] font-bold text-white">
                      {slides[activeSlide].plusCount}
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Progress Tracker */}
            <div className="relative z-10 grid grid-cols-3 gap-4 md:gap-8 w-full pt-6">
              {slides.map((s, i) => {
                return (
                  <div key={i} className="flex flex-col gap-1.5 text-left cursor-pointer" onClick={() => setActiveSlide(i)}>
                    <span
                      className="text-[10px] md:text-xs tracking-wider uppercase select-none transition-colors duration-300 font-extrabold"
                      style={{ color: i === activeSlide ? "#ffffff" : "rgba(255, 255, 255, 0.6)" }}
                    >
                      {s.label}
                    </span>
                    <div className="progress-track w-full bg-black/15">
                      <div
                        key={`${activeSlide}-${i}`}
                        className="progress-fill"
                        style={{
                          width: i < activeSlide ? "100%" : i === activeSlide ? "100%" : "0%",
                          backgroundColor: "#ffffff",
                          transition: i === activeSlide ? "width 4000ms linear" : "none"
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </section>

      {/* ── SECTION 3: GROW YOUR MONEY SECTION ── */}
      <section
        className="min-h-screen h-auto md:h-screen w-full px-4 sm:px-8 md:px-12 py-8 md:py-12 flex flex-col flex-shrink-0 bg-white relative z-30"
      >
        <div className="w-full h-full rounded-[24px] md:rounded-[36px] relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 md:p-12 border border-[#e4e4e7] flex-1">
          <img src="/assets/desktop-grow-your-money-bg.webp" alt="Grow your money Background" className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10 pointer-events-none" />

          {/* Top Title */}
          <div className="relative z-10 w-full flex flex-col items-start pt-2">
            <h2 className="text-white text-4xl md:text-5xl lg:text-[56px] font-extrabold tracking-tight leading-[1.08] font-outfit max-w-2xl hero-title">
              Grow your money,<br />transparently
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-end w-full mt-12 md:mt-auto mb-2">

            {/* Card 1: No minimum balance */}
            <div className="glass-card flex flex-col justify-center items-center text-center p-6 md:p-8 h-[160px] md:h-[180px] w-full">
              <h3 className="text-white text-xl md:text-2xl font-bold font-outfit mb-3">
                No minimum balance
              </h3>
              <p className="text-white/85 text-xs md:text-[13px] font-semibold leading-relaxed max-w-xs">
                Zero balance savings account with no hidden conditions or hidden charges.
              </p>
            </div>

            {/* Card 2: Interest credited every day */}
            <div className="glass-card flex flex-col justify-between items-center text-center p-6 md:p-8 h-[400px] md:h-[450px] w-full">
              <h3 className="text-white text-lg md:text-xl font-bold font-outfit leading-snug">
                Interest credited <br /> every day
              </h3>

              {/* Transactions List */}
              <div className="w-full bg-white rounded-[20px] p-4 flex flex-col gap-3.5 my-3 shadow-md">

                {/* Row 1: Jan 15 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <span className="material-symbols-outlined text-base font-bold">arrow_upward</span>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[#1a1c1d] font-bold text-[11px] md:text-xs">Interest for Jan 15</span>
                      <span className="text-[#71717a] font-semibold text-[9px] md:text-[10px] mt-0.5">16 Jan '26</span>
                    </div>
                  </div>
                  <span className="text-[#10b981] font-bold text-xs">₹14.94</span>
                </div>

                {/* Row 2: Jan 14 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <span className="material-symbols-outlined text-base font-bold">arrow_upward</span>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[#1a1c1d] font-bold text-[11px] md:text-xs">Interest for Jan 14</span>
                      <span className="text-[#71717a] font-semibold text-[9px] md:text-[10px] mt-0.5">15 Jan '26</span>
                    </div>
                  </div>
                  <span className="text-[#10b981] font-bold text-xs">₹14.94</span>
                </div>

                {/* Row 3: Jan 13 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <span className="material-symbols-outlined text-base font-bold">arrow_upward</span>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[#1a1c1d] font-bold text-[11px] md:text-xs">Interest for Jan 13</span>
                      <span className="text-[#71717a] font-semibold text-[9px] md:text-[10px] mt-0.5">14 Jan '26</span>
                    </div>
                  </div>
                  <span className="text-[#10b981] font-bold text-xs">₹14.94</span>
                </div>

              </div>

              <p className="text-white/80 text-[11px] md:text-xs font-semibold leading-relaxed max-w-[240px]">
                Watch your balance grow every single day. Interest paid daily, not monthly or quarterly.
              </p>
            </div>

            {/* Card 3: Linked to 100% repo-rate */}
            <div className="glass-card flex flex-col justify-between items-center text-center p-6 md:p-8 h-[420px] md:h-[490px] w-full">
              <h3 className="text-white text-lg md:text-xl font-bold font-outfit leading-snug">
                Linked to 100% <br /> repo-rate
              </h3>

              {/* Calculator Panel */}
              <div className="w-full bg-white rounded-[20px] p-4 flex flex-col justify-between my-3 shadow-md flex-1 min-h-[220px]">

                {/* Additional Earnings display */}
                <div className="flex flex-col items-center mb-1">
                  <span className="text-[#1a1c1d] text-2xl md:text-3xl font-extrabold font-outfit">
                    {formatINR(additionalEarnings)}
                  </span>
                  <span className="text-[#71717a] text-[10px] md:text-[11px] font-semibold mt-0.5">
                    Additional earnings in 5Y
                  </span>
                </div>

                {/* Rates comparison list */}
                <div className="flex flex-col gap-2 w-full text-left border-t border-gray-100 pt-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[#71717a] text-[9px] md:text-[10px] font-semibold">Earn with slice</span>
                      <span className="text-[#1a1c1d] text-[10px] md:text-xs font-bold mt-0.5">@5.25% p.a.</span>
                    </div>
                    <span className="text-[#10b981] font-bold text-xs md:text-[13px]">
                      {formatINR(sliceEarnings)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[#71717a] text-[9px] md:text-[10px] font-semibold">Traditional savings a/c</span>
                      <span className="text-[#1a1c1d] text-[10px] md:text-xs font-bold mt-0.5">@~2.62% p.a.</span>
                    </div>
                    <span className="text-[#1a1c1d] font-bold text-xs md:text-[13px]">
                      {formatINR(traditionalEarnings)}
                    </span>
                  </div>
                </div>

                {/* Slider bar */}
                <div className="w-full relative pt-8 pb-1">
                  {/* Tooltip bubble aligned to slide center */}
                  <div
                    className="absolute bg-black text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-[4px] -top-0.5 left-1/2 -translate-x-1/2 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-black flex flex-col items-center shadow-md select-none pointer-events-none"
                    style={{
                      left: `calc(8px + (${principal - 10000} / 990000) * (100% - 16px))`
                    }}
                  >
                    {formatINR(principal)}
                  </div>

                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="calc-slider"
                  />
                </div>

              </div>

              <p className="text-white/80 text-[11px] md:text-xs font-semibold leading-relaxed max-w-[240px]">
                Your interest rate moves with RBI repo rate. Completely transparent, no hidden calculations.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 4: KNOW WHERE YOUR MONEY GOES ── */}
      <section
        ref={section4Ref}
        className="relative bg-white section4-container"
      >
        <div
          className="z-20 w-full"
        >
          <div className="w-full flex flex-col items-center px-8 md:px-12 max-w-6xl mx-auto">
            <h2 className="text-[#3b0764] text-4xl sm:text-5xl md:text-[56px] font-extrabold tracking-tight leading-[1.1] font-outfit text-center">
              Know where your money goes
            </h2>
            <p className="text-[#5b21b6] text-base sm:text-lg md:text-[18px] md:text-[20px] font-semibold mt-3 tracking-wide leading-relaxed max-w-2xl text-center">
              See exactly where your money flows, spot trends, and make informed decisions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full mt-8 md:mt-12 relative">

              {/* Card 1: Automatic Categorization */}
              <div
                className="section4-card-1 relative overflow-hidden rounded-[28px] md:rounded-[36px] shadow-lg border border-black/5 bg-[#0c0d10] flex flex-col justify-between p-5 sm:p-6 lg:p-8 select-none h-[380px] md:h-[460px]"
              >
                <img src="/assets/desktop-card-automatic-categorization.webp" alt="Automatic Categorization Background" className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/45 z-[1] pointer-events-none" />

                <div
                  className="relative w-full overflow-hidden category-mask z-10 mx-auto"
                  style={{ height: `${catContainerHeight}px` }}
                >
                  <div
                    className="absolute w-full flex flex-col gap-3 transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] left-0"
                    style={{
                      transform: `translateY(${catOffset}px)`
                    }}
                  >
                    {categories.map((cat, idx) => {
                      const isActive = idx === activeCatIdx;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 px-4 py-2.5 lg:px-5 lg:py-3 rounded-full transition-all duration-500 mx-auto w-fit min-w-[160px] lg:min-w-[190px] border ${isActive
                            ? "bg-white text-[#1a1c1d] border-transparent shadow-xl scale-[1.05]"
                            : "bg-white/10 text-white/50 border-white/5 backdrop-blur-md"
                            }`}
                        >
                          <span className="material-symbols-outlined text-base lg:text-lg font-bold">
                            {cat.icon}
                          </span>
                          <span className="text-[12px] lg:text-[14px] font-bold tracking-wide">
                            {cat.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-auto pt-4 text-center relative z-10">
                  <h4 className="text-white text-lg md:text-xl font-extrabold font-outfit tracking-wide">
                    Automatic categorization
                  </h4>
                </div>
              </div>

              {/* Card 2: Monthly Patterns */}
              <div
                className="section4-card-2 relative overflow-hidden rounded-[28px] md:rounded-[36px] shadow-lg border border-black/5 bg-[#0c0d10] flex flex-col justify-between p-5 sm:p-6 lg:p-8 select-none h-[380px] md:h-[460px]"
              >
                <img src="/assets/desktop-card-monthly-patterns.webp" alt="Monthly Patterns Background" className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/45 z-[1] pointer-events-none" />

                <div className="w-full max-w-[250px] lg:max-w-[280px] bg-white/95 backdrop-blur-lg rounded-[20px] lg:rounded-[24px] p-3.5 lg:p-5 shadow-2xl mx-auto flex flex-col gap-2.5 lg:gap-3.5 mt-2 md:mt-4 relative z-10">
                  {patternDatasets[activePatternIdx].map((item, idx) => {
                    return (
                      <div key={idx} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between min-w-0">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 flex-shrink-0">
                              <span className="material-symbols-outlined text-sm font-bold">
                                {item.icon}
                              </span>
                            </div>
                            <span className="text-[#1a1c1d] font-bold text-[11px] lg:text-[13px] truncate">
                              {item.label}
                            </span>
                          </div>
                          <div className="flex flex-col items-end flex-shrink-0 ml-2">
                            <span className="text-[#1a1c1d] font-extrabold text-[11px] lg:text-[13px]">
                              {item.value}
                            </span>
                            <span className="text-[#71717a] font-semibold text-[8px] lg:text-[9px] mt-0.5">
                              {item.percentage}
                            </span>
                          </div>
                        </div>

                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
                            style={{
                              width: item.barWidth,
                              backgroundColor: item.barColor
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-auto pt-4 text-center relative z-10">
                  <h4 className="text-white text-lg md:text-xl font-extrabold font-outfit tracking-wide">
                    Monthly patterns
                  </h4>
                </div>
              </div>

              {/* Card 3: Clear Breakdowns */}
              <div
                className="section4-card-3 relative overflow-hidden rounded-[28px] md:rounded-[36px] shadow-lg border border-black/5 bg-[#0c0d10] flex flex-col justify-between p-5 sm:p-6 lg:p-8 select-none h-[380px] md:h-[460px]"
              >
                <img src="/assets/desktop-card-clear-breakdown.webp" alt="Clear Breakdowns Background" className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/45 z-[1] pointer-events-none" />

                <div className="relative w-full h-[140px] md:h-[180px] mt-4 md:mt-6 overflow-visible z-10">
                  <svg viewBox="0 0 300 150" className="w-full h-full overflow-visible">
                    <defs>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#ffffff" floodOpacity="0.4" />
                      </filter>
                    </defs>

                    <path
                      d="M 10 120 C 50 125, 90 20, 130 85 C 170 140, 210 50, 290 70"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="4"
                      strokeLinecap="round"
                      filter="url(#glow)"
                    />
                  </svg>

                  <div
                    className="absolute transition-all duration-[900ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
                    style={{
                      left: breakdownPoints[activePatternIdx].left,
                      bottom: breakdownPoints[activePatternIdx].bottom,
                      transform: "translate(-50%, 50%)"
                    }}
                  >
                    <div className="absolute bg-white text-[#1a1c1d] text-[10px] md:text-[11px] font-extrabold px-2.5 py-1 rounded-[6px] bottom-full left-1/2 -translate-x-1/2 -translate-y-2.5 shadow-xl whitespace-nowrap flex flex-col items-center after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-white">
                      {breakdownPoints[activePatternIdx].value}
                    </div>

                    <div className="w-4.5 h-4.5 rounded-full bg-white shadow-2xl flex items-center justify-center relative">
                      <div className="w-2 h-2 rounded-full bg-[#863bff] animate-pulse" />
                      <div className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-75" />
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 text-center relative z-10">
                  <h4 className="text-white text-lg md:text-xl font-extrabold font-outfit tracking-wide">
                    Clear breakdowns
                  </h4>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: A SAFE SPACE FOR YOUR MONEY ── */}
      <section
        ref={section5Ref}
        className="relative bg-white flex items-center justify-center min-h-[calc(100vh-80px)] w-full overflow-hidden"
      >
        <div className="w-full max-w-[1440px] px-6 py-12 md:py-24">
          <div
            ref={section5CardRef}
            className="relative w-full min-h-[440px] h-auto md:h-[760px] rounded-[24px] md:rounded-[48px] overflow-hidden border-[6px] md:border-[12px] border-[#e2f5ec] bg-[#f4fbf7] shadow-xl flex items-center justify-center"
          >
            {/* Watercolor Vault Background Illustration */}
            <img
              src="/assets/desktop-safe-space-bg.webp"
              alt="Safe Space Vault Background"
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            />

            {/* Sliding Textbox Container */}
            <div
              ref={section5TextRef}
              className="section5-textbox flex flex-col justify-center items-start gap-4 md:gap-6 text-left"
            >
              <h2 className="text-[#0b3052] font-outfit text-3xl md:text-[54px] font-extrabold leading-tight tracking-[-0.02em]">
                A safe space<br />for your money
              </h2>
              <p className="text-[#5b738c] font-semibold text-sm md:text-[17px] leading-relaxed max-w-[460px]">
                slice account is a savings account held with our partner bank, where your funds are always secure and earn high returns.
              </p>
              <button className="bg-white hover:bg-gray-50 text-[#0b3052] font-bold text-xs md:text-base px-8 py-3.5 rounded-full shadow-md border border-[#e2f5ec] transition-colors mt-3">
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: CUSTOMER SUPPORT ── */}
      <section
        ref={section6Ref}
        className="relative bg-white pt-24 md:pt-32 pb-0 w-full flex flex-col items-center justify-center overflow-hidden border-t border-gray-100"
      >
        <div className="w-full max-w-[1240px] px-6 flex flex-col items-center justify-center text-center gap-12">
          {/* Illustration Container */}
          <div className="section6-image-container relative w-full max-w-[480px] aspect-[4/3] flex items-center justify-center">
            <img
              src="/assets/desktop-customer-support.webp"
              alt="Customer Support Speech Bubbles Illustration"
              className="w-full h-auto object-contain select-none pointer-events-none"
            />
          </div>

          {/* Heading Container */}
          <h2 className="section6-heading text-[#0b3052] font-outfit text-3xl md:text-[56px] font-extrabold tracking-[-0.03em] leading-tight max-w-[800px]">
            Customer support<br />only when you need it
          </h2>

          {/* Badges Container */}
          <div className="section6-badges flex flex-wrap gap-4 md:gap-6 justify-center items-center">
            {/* Badge 1: No spam calls */}
            <div className="flex items-center gap-3 px-6 py-4 rounded-full bg-[#f2fcf5] border border-[#d2f3dd] shadow-sm">
              <span className="material-symbols-outlined text-[#00c853] text-[20px] md:text-[24px]">
                eco
              </span>
              <span className="text-[#154627] font-bold text-sm md:text-base">
                No spam calls
              </span>
            </div>

            {/* Badge 2: 24/7 access customer support */}
            <div className="flex items-center gap-3 px-6 py-4 rounded-full bg-[#fff2f6] border border-[#ffd2e1] shadow-sm">
              <span className="material-symbols-outlined text-[#ff2d7c] text-[20px] md:text-[24px]">
                history
              </span>
              <span className="text-[#520b24] font-bold text-sm md:text-base">
                24/7 access customer support
              </span>
            </div>
          </div>
        </div>
      </section>
      </div>

      {currentView === "explore" && <ExploreNow onNavigate={navigateTo} />}
      {currentView === "creator" && <CreatorDomain onNavigate={navigateTo} />}
      {currentView === "freelancer" && <FreelancerDomain onNavigate={navigateTo} />}
      {currentView === "onground" && <OnGroundDomain onNavigate={navigateTo} />}
      {currentView === "dashboard" && <Dashboard onNavigate={navigateTo} currentUser={currentUser} onLogout={handleLogout} />}

      {/* ── SECTION 7: FLOWING STRING FOOTER ── */}
      {currentView !== "dashboard" && (
        <section
          ref={section7Ref}
          className="relative w-full overflow-hidden"
          style={{ marginTop: "-40px" }}
        >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/assets/desktop-footer-bg.webp')`,
            borderRadius: "40px 40px 0 0",
          }}
        />
        {/* Dark overlay for footer text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0.72) 100%)",
            borderRadius: "40px 40px 0 0",
          }}
        />

        <div className={`relative z-10 w-full h-full px-6 md:px-12 pb-0 ${currentView === "home" ? "pt-16" : "pt-8"}`}>
          {currentView === "home" && (
            <>
              {/* Top Section: Hero Text + QR Code */}
              <div className="flex flex-col md:flex-row justify-between items-start max-w-[1400px] mx-auto">
                {/* Hero Text */}
                <div className="max-w-[600px] pt-8 pl-2 md:pl-4">
                  <h1
                    className="font-outfit font-extrabold tracking-[-0.03em] leading-[1.05] mb-6"
                    style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", color: "#ffffff" }}
                  >
                    Join the new age<br />of banking!
                  </h1>
                  <button
                    className="px-8 py-3.5 rounded-full text-[15px] font-bold text-white flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #c850c0 0%, #e040a0 100%)",
                      boxShadow: "0 8px 32px rgba(200,80,192,0.35)",
                    }}
                  >
                    Get slice
                  </button>
                </div>

                {/* QR Code Card */}
                <div
                  className="hidden md:flex flex-col items-center mt-4 mr-4 p-5"
                  style={{
                    background: "rgba(255,255,255,0.65)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderRadius: "24px",
                    border: "1px solid rgba(255,255,255,0.5)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    width: "200px",
                  }}
                >
                  <img
                    src="/assets/desktop-qr-code.webp"
                    alt="QR Code"
                    className="w-full aspect-square object-contain rounded-xl mb-3"
                  />
                  <p className="text-[12px] font-bold text-gray-600 text-center leading-snug">
                    Scan to download<br /><span style={{ color: "#c850c0" }}>slice</span> app
                  </p>
                </div>
              </div>



              {/* Wavy SVG String + Labels */}
              <div className="hidden md:block relative w-full h-[350px] pointer-events-none mt-8 mb-4">
                {/* Base guide path (gray) */}
                <svg
                  className="absolute w-full h-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 1200 280"
                  fill="none"
                >
                  <path
                    d="M -20 200 C 80 200 120 200 180 120 C 240 40 300 40 380 100 C 460 160 500 180 580 140 C 660 100 700 40 800 80 C 900 120 940 180 1020 100 C 1100 20 1140 60 1220 60"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>

                {/* Active drawing path (white, animated) */}
                <svg
                  className="absolute w-full h-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 1200 280"
                  fill="none"
                >
                  <path
                    ref={section7PathRef}
                    d="M -20 200 C 80 200 120 200 180 120 C 240 40 300 40 380 100 C 460 160 500 180 580 140 C 660 100 700 40 800 80 C 900 120 940 180 1020 100 C 1100 20 1140 60 1220 60"
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.4))" }}
                  />
                </svg>

                {/* Label 1: Optimization */}
                <div className="section7-label section7-label-1 absolute pointer-events-auto" style={{ left: "8%", top: "55%" }}>
                  <div className="section7-card">
                    <span className="section7-card-title">Optimization</span>
                  </div>
                </div>

                {/* Label 2: Growth */}
                <div className="section7-label section7-label-2 absolute pointer-events-auto" style={{ left: "27%", top: "20%" }}>
                  <div className="section7-card">
                    <span className="section7-card-title">Growth</span>
                  </div>
                </div>

                {/* Label 3: Savings */}
                <div className="section7-label section7-label-3 absolute pointer-events-auto" style={{ left: "45%", top: "55%" }}>
                  <div className="section7-card">
                    <span className="section7-card-title">Savings</span>
                  </div>
                </div>

                {/* Label 4: Security */}
                <div className="section7-label section7-label-4 absolute pointer-events-auto" style={{ left: "63%", top: "15%" }}>
                  <div className="section7-card">
                    <span className="section7-card-title">Security</span>
                  </div>
                </div>

                {/* Label 5: Credit card */}
                <div className="section7-label section7-label-5 absolute pointer-events-auto" style={{ left: "82%", top: "35%" }}>
                  <div className="section7-card">
                    <span className="section7-card-title">Credit card</span>
                  </div>
                </div>
              </div>

              {/* Mobile Cards List */}
              <div className="md:hidden flex flex-wrap gap-3 justify-center mt-6 mb-8 px-4">
                {["Optimization", "Growth", "Savings", "Security", "Credit card"].map((title, i) => (
                  <div key={i} className="section7-card">
                    <span className="section7-card-title">{title}</span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="w-full max-w-[1400px] mx-auto my-8">
                <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.15) 80%, transparent)" }} />
              </div>
            </>
          )}

          {/* ── FOOTER CONTENT ── */}
          <footer className="relative z-20 w-full max-w-[1400px] mx-auto pt-8 pb-14 px-4 md:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">

              {/* Column 1: Company Info */}
              <div className="flex flex-col gap-5">
                <h3 className="footer-heading">bridge-now small finance bank ltd</h3>
                <div className="footer-text">
                  <span className="font-bold" style={{ color: "#ffffff" }}>Corporate office address:</span> No. 9 Ashford Park View, 80 ft Road, Koramangala, 3rd Block, Bangalore, Karnataka, 560034
                </div>
                <div className="flex flex-col gap-1">
                  <span className="footer-heading" style={{ fontSize: "13px" }}>Contact us</span>
                  <a href="tel:08048329999" className="footer-link">08048329999</a>
                  <a href="mailto:help@bridgenow.com" className="footer-link">help@bridgenow.com</a>
                </div>
              </div>

              {/* Column 2: Important Links */}
              <div className="flex flex-col gap-2.5">
                <h3 className="footer-heading mb-2">Important links</h3>
                <a href="#" className="footer-link">Privacy</a>
                <a href="#" className="footer-link">Terms of services</a>
                <a href="#" className="footer-link">Disclaimer</a>
                <a href="#" className="footer-link">Safety and security</a>
                <a href="#" className="footer-link">Regulatory disclosures</a>
                <a href="#" className="footer-link">Customer service</a>
                <a href="#" className="footer-link">Rates and pricing</a>
                <a href="#" className="footer-link">Policies</a>
                <a href="#" className="footer-link">Product information</a>
                <a href="#" className="footer-link">Online banking (NESFB)</a>
              </div>

              {/* Column 3: Company */}
              <div className="flex flex-col gap-2.5">
                <h3 className="footer-heading mb-2">Company</h3>
                <a href="#" className="footer-link">Careers</a>
                <a href="#" className="footer-link">Open positions</a>
                <a href="#" className="footer-link">Help center</a>
                <a href="#" className="footer-link">Contact us</a>
                <a href="#" className="footer-link">Report vulnerability</a>
                <a href="#" className="footer-link">Report fraud</a>
                <a href="#" className="footer-link">Press</a>
                <a href="#" className="footer-link">About Us</a>
              </div>

              {/* Column 4: Connect */}
              <div className="flex flex-col gap-5">
                <h3 className="footer-heading">Connect with us</h3>
                <div className="flex items-center gap-4">
                  {/* X (Twitter) */}
                  <a href="#" className="footer-social" aria-label="X">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </a>
                  {/* LinkedIn */}
                  <a href="#" className="footer-social" aria-label="LinkedIn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  </a>
                  {/* Facebook */}
                  <a href="#" className="footer-social" aria-label="Facebook">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  </a>
                  {/* Instagram */}
                  <a href="#" className="footer-social" aria-label="Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z" /></svg>
                  </a>
                  {/* Reddit */}
                  <a href="#" className="footer-social" aria-label="Reddit">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" /></svg>
                  </a>
                </div>

                <p className="footer-text" style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  © bridge-now. All Rights Reserved.
                </p>

                <p className="footer-text" style={{ fontSize: "12px" }}>
                  256 Bit SSL Security
                </p>

                {/* Security Badges */}
                <div className="flex items-center gap-3">
                  <div className="bg-white/50 backdrop-blur-sm rounded-md px-3 py-1.5 border border-gray-300/80 shadow-sm">
                    <span style={{ fontSize: "9px", fontWeight: 700, color: "#1e1b4b", letterSpacing: "0.03em" }}>PCI DSS<br />COMPLIANT</span>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-md px-3 py-1.5 border border-gray-300/80 shadow-sm">
                    <span style={{ fontSize: "9px", fontWeight: 700, color: "#1e1b4b", letterSpacing: "0.03em" }}>ISO 27001</span>
                  </div>
                </div>
              </div>

            </div>
          </footer>

        </div>
      </section>
      )}

      {/* ── AUTHENTICATION FLOATING MODAL ── */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={closeAuthModal}
        onSuccessLogin={handleSuccessLogin}
      />
    </div>
  );
}


