import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  BarChart3,
  Wallet,
  Settings,
  Bell,
  User,
  Plus,
  Search,
  Send,
  Check,
  CheckCircle2,
  Globe,
  ArrowUpRight,
  TrendingUp,
  Building,
  Users,
  Clock,
  Star,
  X,
  ChevronDown,
  Edit,
  Mail,
  Phone,
  Shield,
  ArrowLeft
} from "lucide-react";
import {
  fetchGigsApi,
  createGigApi,
  updateGigProgressApi,
  deleteGigApi,
  fetchWalletApi,
  depositFundsApi,
  withdrawFundsApi
} from "../services/dashboardService";

export default function Dashboard({ onNavigate, currentUser, onLogout }) {
  // --- Core State ---
  const [activeTab, setActiveTab] = useState("overview");
  const [userRole, setUserRole] = useState("talent"); // 'talent' (creator/freelancer) or 'brand' (buyer/client)
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const userKey = currentUser ? currentUser.email : "guest";

  // --- Profile Settings State (persisted in localStorage per user) ---
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(`bn_dashboard_profile_${userKey}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return {
      name: currentUser ? currentUser.name : "Karan Sharma",
      username: currentUser ? currentUser.email.split('@')[0] : "karansharma_creates",
      avatar: currentUser ? currentUser.avatar : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150",
      bio: "High-energy tech creator & video producer. Passionate about bridging brands with audiences through cinematic storytelling.",
      location: "Mumbai, India",
      email: currentUser ? currentUser.email : "karan.sharma@example.com",
      phone: "+91 98765 43210",
      skills: ["Video Editing", "Cinematography", "Tech Reviews", "UI Design", "Content Strategy"],
      upiId: currentUser ? `${currentUser.email.split('@')[0]}@okaxis` : "karancreates@okaxis",
      bankName: "BridgeNow SFB - ****4321"
    };
  });

  useEffect(() => {
    if (currentUser) {
      setProfile((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        avatar: currentUser.avatar || prev.avatar,
        username: currentUser.email ? currentUser.email.split('@')[0] : prev.username,
      }));
      if (currentUser.role === 'brand') {
        setUserRole('brand');
      }
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`bn_dashboard_profile_${userKey}`, JSON.stringify(profile));
  }, [profile, userKey]);

  // --- Static Clean Wallet State (No live ticking) ---
  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem(`bn_dashboard_wallet_${userKey}`);
    return saved ? parseFloat(saved) : 0.00;
  });

  const [totalInterestEarned, setTotalInterestEarned] = useState(() => {
    const saved = localStorage.getItem(`bn_dashboard_interest_${userKey}`);
    return saved ? parseFloat(saved) : 0.00;
  });

  // Modal State for Deposit & Withdraw
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI / GPay");

  // Dynamic Transactions Log State
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(`bn_dashboard_transactions_${userKey}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(`bn_dashboard_transactions_${userKey}`, JSON.stringify(transactions));
  }, [transactions, userKey]);

  // --- Active Gigs / Campaigns State (persisted per user) ---
  const [talentGigs, setTalentGigs] = useState(() => {
    const saved = localStorage.getItem(`bn_dashboard_talent_gigs_${userKey}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [brandCampaigns, setBrandCampaigns] = useState(() => {
    const saved = localStorage.getItem(`bn_dashboard_brand_campaigns_${userKey}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(`bn_dashboard_talent_gigs_${userKey}`, JSON.stringify(talentGigs));
  }, [talentGigs, userKey]);

  useEffect(() => {
    localStorage.setItem(`bn_dashboard_brand_campaigns_${userKey}`, JSON.stringify(brandCampaigns));
  }, [brandCampaigns, userKey]);

  // --- Sync with Backend SQLite Database ---
  useEffect(() => {
    if (currentUser) {
      // Sync Gigs from SQLite DB
      fetchGigsApi().then((gigs) => {
        if (Array.isArray(gigs)) {
          const mappedGigs = gigs.map(g => ({
            id: g.id.toString(),
            title: g.title,
            brand: g.brand,
            category: g.category || 'Sponsorship',
            earnings: g.budget,
            budget: g.budget,
            status: g.status,
            progress: g.progress,
            deadline: g.dueDate || '7 Days',
            logoBg: "bg-purple-600"
          }));
          setTalentGigs(mappedGigs);
          setBrandCampaigns(mappedGigs);
        }
      }).catch(err => console.log('SQLite gig sync notice:', err));

      // Sync Wallet & Transactions from SQLite DB
      fetchWalletApi().then((data) => {
        if (data && data.success) {
          setWalletBalance(data.walletBalance || 0);
          if (Array.isArray(data.transactions)) {
            setTransactions(data.transactions);
          }
        }
      }).catch(err => console.log('SQLite wallet sync notice:', err));
    }
  }, [currentUser]);

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return;

    try {
      if (currentUser) {
        const res = await depositFundsApi(amt, paymentMethod);
        if (res.success) {
          setWalletBalance(res.walletBalance);
          setTransactions(prev => [res.transaction, ...prev]);
        }
      } else {
        const newBal = walletBalance + amt;
        setWalletBalance(newBal);
        localStorage.setItem(`bn_dashboard_wallet_${userKey}`, newBal.toString());

        const newTx = {
          id: `tx-${Date.now()}`,
          title: `Deposit via ${paymentMethod}`,
          type: "credit",
          amount: amt,
          date: new Date().toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }),
          status: "Completed"
        };
        setTransactions(prev => [newTx, ...prev]);
      }

      setNotifications(prev => [
        { id: Date.now(), text: `₹${amt.toLocaleString("en-IN")} deposited to your wallet.`, time: "Just now", read: false },
        ...prev
      ]);

      setShowDepositModal(false);
      setDepositAmount("");
      triggerToast(`Successfully deposited ₹${amt.toLocaleString("en-IN")} into wallet!`);
    } catch (err) {
      triggerToast(err.message || "Failed to deposit funds.", "error");
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0) return;
    if (amt > walletBalance) {
      triggerToast("Insufficient wallet balance for this withdrawal.", "error");
      return;
    }

    try {
      if (currentUser) {
        const res = await withdrawFundsApi(amt);
        if (res.success) {
          setWalletBalance(res.walletBalance);
          setTransactions(prev => [res.transaction, ...prev]);
        }
      } else {
        const newBal = walletBalance - amt;
        setWalletBalance(newBal);
        localStorage.setItem(`bn_dashboard_wallet_${userKey}`, newBal.toString());

        const newTx = {
          id: `tx-${Date.now()}`,
          title: `Withdrawal to ${profile.bankName}`,
          type: "debit",
          amount: amt,
          date: new Date().toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }),
          status: "Completed"
        };
        setTransactions(prev => [newTx, ...prev]);
      }

      setNotifications(prev => [
        { id: Date.now(), text: `₹${amt.toLocaleString("en-IN")} transferred to your bank account.`, time: "Just now", read: false },
        ...prev
      ]);

      setShowWithdrawModal(false);
      setWithdrawAmount("");
      triggerToast(`Successfully transferred ₹${amt.toLocaleString("en-IN")} to bank!`);
    } catch (err) {
      triggerToast(err.message || "Failed to withdraw funds.", "error");
    }
  };

  // --- Notifications Panel Mock State ---
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("bn_dashboard_notifications");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, text: "boAt Lifestyle deposited ₹45,000 into Milestone Escrow.", time: "2 hrs ago", read: false },
      { id: 2, text: "Zomato verified your deliverables. ₹85,000 released to Wallet.", time: "1 day ago", read: true },
      { id: 3, text: "Interest payout of ₹37.24 credited to your savings balance.", time: "Today at 12:00 AM", read: false }
    ];
  });

  useEffect(() => {
    localStorage.setItem("bn_dashboard_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // --- Explore Gigs State ---
  const [marketGigs, setMarketGigs] = useState(() => {
    const saved = localStorage.getItem("bn_dashboard_market_gigs");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "mg-1",
        title: "4K Cinematic Unboxing Video",
        brand: "boAt Lifestyle",
        category: "Video",
        budget: 65000,
        duration: "15 Days",
        desc: "We are looking for a creator to film a cinematic 4K unboxing and review reel for our upcoming premium ANC wireless headphones.",
        logoBg: "bg-black",
        logoLetter: "B",
        applied: false,
        appliedRequests: 0,
        pitchText: "",
        proposedBudget: 65000,
        status: "Open"
      },
      {
        id: "mg-2",
        title: "UI Redesign Pitch for Food Delivery App",
        brand: "Zomato",
        category: "Design",
        budget: 120000,
        duration: "30 Days",
        desc: "Design clean, high-conversion mockups for a new food ordering experience geared towards late-night dining demographics.",
        logoBg: "bg-red-500",
        logoLetter: "Z",
        applied: false,
        appliedRequests: 0,
        pitchText: "",
        proposedBudget: 120000,
        status: "Open"
      },
      {
        id: "mg-3",
        title: "Technical Writing: Intro to Smart Escrows",
        brand: "BridgeNow Finance",
        category: "Writing",
        budget: 35000,
        duration: "7 Days",
        desc: "Write a comprehensive, reader-friendly technical blog post describing the mechanics of secure escrow deposits and yield generation.",
        logoBg: "bg-purple-600",
        logoLetter: "B",
        applied: false,
        appliedRequests: 0,
        pitchText: "",
        proposedBudget: 35000,
        status: "Open"
      },
      {
        id: "mg-4",
        title: "Instagram Promotional Reel & Story Set",
        brand: "Swiggy Instamart",
        category: "Video",
        budget: 50000,
        duration: "10 Days",
        desc: "Create an engaging, humorous Instagram reel showcasing how Swiggy Instamart delivers groceries in under 10 minutes.",
        logoBg: "bg-orange-500",
        logoLetter: "S",
        applied: false,
        appliedRequests: 0,
        pitchText: "",
        proposedBudget: 50000,
        status: "Open"
      },
      {
        id: "mg-5",
        title: "React/Tailwind Front-End Developer for Portal",
        brand: "CoinSwitch Kuber",
        category: "Development",
        budget: 180000,
        duration: "45 Days",
        desc: "Build highly responsive landing pages and interactive dashboards using React, Vite, and Tailwind CSS. Design assets provided.",
        logoBg: "bg-blue-600",
        logoLetter: "C",
        applied: false,
        appliedRequests: 0,
        pitchText: "",
        proposedBudget: 180000,
        status: "Open"
      },
      {
        id: "mg-6",
        title: "Social Media Thread on Decentralized Trust",
        brand: "Polygon Labs",
        category: "Marketing",
        budget: 25000,
        duration: "5 Days",
        desc: "Draft a viral 10-tweet Twitter thread explaining how smart contracts reduce counterparty risk in peer-to-peer commerce.",
        logoBg: "bg-indigo-600",
        logoLetter: "P",
        applied: false,
        appliedRequests: 0,
        pitchText: "",
        proposedBudget: 25000,
        status: "Open"
      }
    ];
  });

  const [marketSearch, setMarketSearch] = useState("");
  const [marketCat, setMarketCat] = useState("All");
  const [marketBudget, setMarketBudget] = useState(200000);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyGig, setApplyGig] = useState(null);
  const [applyRequests, setApplyRequests] = useState(1);
  const [applyPitch, setApplyPitch] = useState("");
  const [applyProposedBudget, setApplyProposedBudget] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem("bn_dashboard_market_gigs", JSON.stringify(marketGigs));
  }, [marketGigs]);

  const triggerToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleApplyGig = (e) => {
    e.preventDefault();
    if (!applyGig) return;

    const budgetVal = parseInt(applyProposedBudget) || applyGig.budget;

    setMarketGigs(prev => prev.map(g => {
      if (g.id === applyGig.id) {
        return {
          ...g,
          applied: true,
          appliedRequests: applyRequests,
          pitchText: applyPitch,
          proposedBudget: budgetVal,
          status: "Pending Approval"
        };
      }
      return g;
    }));

    triggerToast(`Proposal submitted for "${applyGig.title}" with ${applyRequests} requests!`);

    const pendingNotif = {
      id: Date.now(),
      text: `Submitted proposal for "${applyGig.title}" to ${applyGig.brand}.`,
      time: "Just now",
      read: false
    };
    setNotifications(prev => [pendingNotif, ...prev]);

    const gigId = applyGig.id;
    const gigTitle = applyGig.title;
    const gigBrand = applyGig.brand;
    const gigBudget = budgetVal;
    const gigLogoBg = applyGig.logoBg;

    setApplyModalOpen(false);
    setApplyPitch("");
    setApplyRequests(1);
    setApplyProposedBudget("");

    setTimeout(() => {
      setMarketGigs(currentGigs => currentGigs.map(g => {
        if (g.id === gigId) {
          return { ...g, status: "Selected" };
        }
        return g;
      }));

      const newActiveGig = {
        id: `tg-${Date.now()}`,
        title: gigTitle,
        brand: gigBrand,
        earnings: gigBudget,
        status: "In Progress",
        progress: 0,
        deadline: "Within 14 Days",
        logoBg: gigLogoBg
      };
      setTalentGigs(currentActive => [newActiveGig, ...currentActive]);

      const selectNotif = {
        id: Date.now() + 1,
        text: `🎉 Congratulations! ${gigBrand} selected you for "${gigTitle}"! Work order is active.`,
        time: "Just now",
        read: false
      };
      setNotifications(currentNotifs => [selectNotif, ...currentNotifs]);

      setChatConversations(currentChats => {
        const existingChatIndex = currentChats.findIndex(c => c.name.toLowerCase().includes(gigBrand.toLowerCase()));
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        if (existingChatIndex !== -1) {
          return currentChats.map((c, idx) => {
            if (idx === existingChatIndex) {
              return {
                ...c,
                lastMsg: `Hi Karan! We reviewed your proposal and selected you for the '${gigTitle}' gig.`,
                messages: [
                  ...c.messages,
                  {
                    sender: "brand",
                    text: `Hi Karan! We reviewed your proposal and selected you for the '${gigTitle}' gig. We have deposited the milestone of ${new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(gigBudget)} into secure BridgeNow Escrow. Let's begin!`,
                    time: timeNow
                  }
                ]
              };
            }
            return c;
          });
        } else {
          const newChat = {
            id: currentChats.length + 1,
            name: `${gigBrand} Partnerships`,
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=64&h=64",
            status: "Verified Brand",
            lastMsg: `Hi Karan! We've selected you for '${gigTitle}'. Let's begin!`,
            messages: [
              {
                sender: "brand",
                text: `Hi Karan! We reviewed your proposal and selected you for the '${gigTitle}' gig. We have deposited the milestone of ${new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(gigBudget)} into secure BridgeNow Escrow. Let's begin!`,
                time: timeNow
              }
            ],
            role: "talent"
          };
          return [newChat, ...currentChats];
        }
      });

      triggerToast(`🎉 ${gigBrand} selected you for "${gigTitle}"!`);
    }, 8000);
  };

  // Form for New Gig / Campaign
  const [newGigForm, setNewGigForm] = useState({ title: "", secondary: "", value: "", deadline: "" });
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddNewItem = async (e) => {
    e.preventDefault();
    if (!newGigForm.title || !newGigForm.value) return;

    const val = parseInt(newGigForm.value) || 20000;
    const titleVal = newGigForm.title;
    const brandVal = newGigForm.secondary || (userRole === "talent" ? "Direct Brand Partnership" : profile.name);
    const deadlineVal = newGigForm.deadline || "30 Jul 2026";

    try {
      let createdObj = {
        id: `tg-${Date.now()}`,
        title: titleVal,
        brand: brandVal,
        earnings: val,
        budget: val,
        status: "In Progress",
        progress: 10,
        deadline: deadlineVal,
        logoBg: "bg-purple-600",
        creatorsCount: 0,
        applicationsCount: 0,
        datePosted: new Date().toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })
      };

      if (currentUser) {
        const dbGig = await createGigApi({
          title: titleVal,
          brand: brandVal,
          category: userRole === "talent" ? "Sponsorship" : "Campaign",
          budget: val,
          dueDate: deadlineVal
        });

        if (dbGig) {
          createdObj = {
            id: dbGig.id.toString(),
            title: dbGig.title,
            brand: dbGig.brand,
            category: dbGig.category,
            earnings: dbGig.budget,
            budget: dbGig.budget,
            status: dbGig.status,
            progress: dbGig.progress,
            deadline: dbGig.dueDate || '7 Days',
            logoBg: "bg-purple-600",
            creatorsCount: 0,
            applicationsCount: 0,
            datePosted: new Date().toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })
          };
        }
      }

      setTalentGigs(prev => [createdObj, ...prev]);
      setBrandCampaigns(prev => [createdObj, ...prev]);
      setNewGigForm({ title: "", secondary: "", value: "", deadline: "" });
      setShowAddModal(false);
      triggerToast(`Successfully created "${createdObj.title}"!`);
    } catch (err) {
      triggerToast(err.message || "Failed to create campaign.", "error");
    }
  };

  // --- Inbox Chat State (persisted in localStorage) ---
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [chatConversations, setChatConversations] = useState(() => {
    const saved = localStorage.getItem("bn_dashboard_chats");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 1,
        name: "boAt Lifestyle",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=64&h=64",
        status: "Active Sponsor",
        lastMsg: "Let's close the Instagram reel draft today.",
        messages: [
          { sender: "brand", text: "Hey Karan! Love your recent tech reel. Can we do a custom sponsorship for our new Airdopes?", time: "10:30 AM" },
          { sender: "me", text: "Hi boAt Team! Yes, absolutely. I think the cinematic unboxing style would work perfectly with your target audience.", time: "11:15 AM" },
          { sender: "brand", text: "That sounds amazing. The budget proposed is ₹45,000. We will set up the Escrow on BridgeNow once you accept.", time: "11:20 AM" },
          { sender: "me", text: "I have accepted the campaign details and verified my bank credentials. Ready to shoot!", time: "11:45 AM" },
          { sender: "brand", text: "Perfect, the milestone funds have been deposited in the BridgeNow escrow. Let's close the Instagram reel draft today.", time: "2:15 PM" }
        ],
        role: "talent"
      },
      {
        id: 2,
        name: "Zomato Creator Ops",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=64&h=64",
        status: "Campaign Support",
        lastMsg: "Payment released. Check your BridgeNow Wallet!",
        messages: [
          { sender: "brand", text: "Hi Karan, can you upload the final analytics screenshot of the YouTube integration?", time: "Yesterday" },
          { sender: "me", text: "Sure! Attached are the stats: 120k views, 8.4% click-through rate, and 450 sign-ups using my link.", time: "Yesterday" },
          { sender: "brand", text: "Outstanding engagement! We've reviewed and approved the deliverable. Payment released. Check your BridgeNow Wallet!", time: "Yesterday" }
        ],
        role: "talent"
      },
      {
        id: 3,
        name: "Aman Gupta (Co-founder, boAt)",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=64&h=64",
        status: "VIP Brand Partner",
        lastMsg: "Great work on the deliverables, Karan!",
        messages: [
          { sender: "brand", text: "Hey Karan, loved the unboxing video! Great energy.", time: "5 Jul" },
          { sender: "me", text: "Thanks Aman! Really appreciate the feedback. It was awesome working with the boAt team.", time: "5 Jul" },
          { sender: "brand", text: "Great work on the deliverables, Karan! We'll sync up for the next product launch soon.", time: "6 Jul" }
        ],
        role: "talent"
      },
      // Brand perspective chats
      {
        id: 4,
        name: "Rohan Patel (Tech Creator)",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64",
        status: "Applicant",
        lastMsg: "Let me know when the escrow is funded.",
        messages: [
          { sender: "me", text: "Hey Rohan, thanks for applying to our Monsoon Campaign. Can you share your current engagement rate?", time: "Yesterday" },
          { sender: "brand", text: "Hi! My average engagement is 7.2% with 90k active followers on Instagram. Here is my media kit.", time: "Yesterday" },
          { sender: "me", text: "Looks great. We'd love to hire you. Sending over contract terms on BridgeNow.", time: "10:00 AM" },
          { sender: "brand", text: "Thanks! Accepted the terms. Let me know when the escrow is funded.", time: "10:15 AM" }
        ],
        role: "brand"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("bn_dashboard_chats", JSON.stringify(chatConversations));
  }, [chatConversations]);

  const [chatInput, setChatInput] = useState("");
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatId, chatConversations]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const currentChat = chatConversations.find(c => c.id === selectedChatId);
    if (!currentChat) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const updatedChats = chatConversations.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          lastMsg: chatInput,
          messages: [
            ...chat.messages,
            { sender: "me", text: chatInput, time: timeStr }
          ]
        };
      }
      return chat;
    });

    setChatConversations(updatedChats);
    const sentText = chatInput;
    setChatInput("");

    // Simulate Brand response
    setTimeout(() => {
      let automatedResponse = "Thanks for the message! Our coordinator will review this and get back to you shortly.";
      
      const textLower = sentText.toLowerCase();
      if (textLower.includes("draft") || textLower.includes("video") || textLower.includes("reel")) {
        automatedResponse = "Awesome. Send over the preview link or file whenever it is ready. We will review it within 12 hours.";
      } else if (textLower.includes("escrow") || textLower.includes("payment") || textLower.includes("money") || textLower.includes("earnings")) {
        automatedResponse = "All payments are handled securely in BridgeNow. Escrows are automated, so as soon as deliverables are verified, they will be instantly credited to your wallet.";
      } else if (textLower.includes("hello") || textLower.includes("hi") || textLower.includes("hey")) {
        automatedResponse = `Hey ${profile.name}! Hope you are doing great. How can we help you today?`;
      } else if (textLower.includes("agreement") || textLower.includes("terms") || textLower.includes("sign")) {
        automatedResponse = "Terms signed and logged. We are ready to roll on our end!";
      }

      setChatConversations(prevChats => {
        return prevChats.map(chat => {
          if (chat.id === selectedChatId) {
            return {
              ...chat,
              lastMsg: automatedResponse,
              messages: [
                ...chat.messages,
                { sender: "brand", text: automatedResponse, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
              ]
            };
          }
          return chat;
        });
      });
    }, 1800);
  };

  // Filter conversations based on current user role
  const filteredChats = chatConversations.filter(c => c.role === userRole);
  
  // Ensure selectedChatId matches a chat in the current role, fallback if not
  useEffect(() => {
    const chatExists = filteredChats.some(c => c.id === selectedChatId);
    if (!chatExists && filteredChats.length > 0) {
      setSelectedChatId(filteredChats[0].id);
    }
  }, [userRole]);

  // Selected chat data
  const activeChat = chatConversations.find(c => c.id === selectedChatId);

  // --- Notifications Panel Mock ---

  // Helper formatting INR
  const formatINR = (value, showDecimals = true) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 4 : 0
    }).format(value).replace(/\s/g, "");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      
      {/* Top Navbar */}
      <nav className="h-16 bg-white border-b border-slate-200 px-6 flex justify-between items-center fixed top-0 left-0 right-0 z-40 shadow-sm">
        
        {/* Left Side: Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate("home")}
            className="flex items-center gap-1.5 text-slate-500 hover:text-[#863bff] transition-colors font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Main Website</span>
          </button>
          
          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
          
          <div className="cursor-pointer" onClick={() => onNavigate("home")}>
            <span className="text-[#863bff] font-outfit font-extrabold text-2xl tracking-[-0.04em] lowercase select-none">
              bridge-now
            </span>
            <span className="ml-1 text-[10px] uppercase font-extrabold tracking-wider bg-purple-100 text-[#863bff] px-1.5 py-0.5 rounded">
              Console
            </span>
          </div>
        </div>

        {/* Right Side: Notifications, Switch Mode, Profile */}
        <div className="flex items-center gap-4">
          
          {/* Switch Role Button (Fiverr Mode Toggle) */}
          <button
            onClick={() => setUserRole(prev => prev === "talent" ? "brand" : "talent")}
            className={`hidden md:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all duration-300 ${
              userRole === "talent"
                ? "bg-purple-50 text-[#863bff] border-purple-200 hover:bg-purple-100/70"
                : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100/70"
            }`}
          >
            {userRole === "talent" ? (
              <>
                <Building className="w-3.5 h-3.5" />
                <span>Switch to Brand Console</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span>Switch to Talent Console</span>
              </>
            )}
          </button>

          {/* Notifications Icon */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="p-2 text-slate-500 hover:text-[#863bff] rounded-full hover:bg-slate-100 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-500 rounded-full text-[8.5px] font-bold text-white flex items-center justify-center leading-none border border-white">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-85 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                  <span className="font-bold text-sm text-slate-800">Notifications</span>
                  <button 
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                    className="text-xs text-[#863bff] font-bold hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="flex gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${n.read ? "bg-slate-200" : "bg-[#863bff]"}`}></div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold text-slate-700 leading-snug">{n.text}</span>
                        <span className="text-[10px] text-slate-400 font-medium mt-1">{n.time}</span>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-center text-xs text-slate-400 py-4">No notifications yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-1.5 focus:outline-none"
            >
              <img
                src={profile.avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-purple-200 object-cover shadow-inner"
              />
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 border-b border-slate-100 mb-1">
                  <p className="font-bold text-sm text-slate-800 leading-tight">{profile.name}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">@{profile.username}</p>
                  <div className="mt-2 text-[10px] font-bold inline-flex items-center bg-purple-50 text-[#863bff] px-2 py-0.5 rounded-full border border-purple-100 uppercase tracking-wide">
                    {userRole === "talent" ? "Level 2 Creator" : "Verified Partner"}
                  </div>
                </div>

                {/* Mobile-only toggle */}
                <button
                  onClick={() => {
                    setUserRole(prev => prev === "talent" ? "brand" : "talent");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left md:hidden px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                >
                  {userRole === "talent" ? <Building className="w-4 h-4 text-purple-500" /> : <User className="w-4 h-4 text-blue-500" />}
                  <span>Switch to {userRole === "talent" ? "Brand" : "Talent"} Mode</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("settings");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Profile Settings</span>
                </button>

                <div className="h-px bg-slate-100 my-1"></div>

                <button
                  onClick={() => {
                    if (onLogout) {
                      onLogout();
                    } else {
                      onNavigate("home");
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-pink-600 hover:bg-pink-50 flex items-center gap-2"
                >
                  <X className="w-4 h-4 text-pink-500" />
                  <span>Logout Console</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </nav>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex pt-16 h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex z-35">
          <div className="p-4 flex flex-col gap-1">
            
            {/* Nav Tabs */}
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-left transition-all ${
                activeTab === "overview"
                  ? "bg-purple-50 text-[#863bff] border-l-4 border-[#863bff]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span>Overview</span>
            </button>

            {userRole === "talent" && (
              <button
                onClick={() => setActiveTab("explore_gigs")}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-left transition-all ${
                  activeTab === "explore_gigs"
                    ? "bg-purple-50 text-[#863bff] border-l-4 border-[#863bff]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Globe className="w-4.5 h-4.5" />
                <span>Explore Gigs</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab("projects")}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-left transition-all ${
                activeTab === "projects"
                  ? "bg-purple-50 text-[#863bff] border-l-4 border-[#863bff]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4.5 h-4.5" />
                <span>{userRole === "talent" ? "Active Gigs" : "Campaigns"}</span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">
                {userRole === "talent" ? talentGigs.length : brandCampaigns.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("inbox")}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-left transition-all ${
                activeTab === "inbox"
                  ? "bg-purple-50 text-[#863bff] border-l-4 border-[#863bff]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4.5 h-4.5" />
                <span>Inbox Messages</span>
              </div>
              <span className="text-[10px] bg-pink-100 text-pink-600 font-bold px-2 py-0.5 rounded-full">
                1
              </span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-left transition-all ${
                activeTab === "analytics"
                  ? "bg-purple-50 text-[#863bff] border-l-4 border-[#863bff]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <BarChart3 className="w-4.5 h-4.5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab("wallet")}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-left transition-all ${
                activeTab === "wallet"
                  ? "bg-purple-50 text-[#863bff] border-l-4 border-[#863bff]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Wallet className="w-4.5 h-4.5" />
              <span>Wallet & Payouts</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-left transition-all ${
                activeTab === "settings"
                  ? "bg-purple-50 text-[#863bff] border-l-4 border-[#863bff]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Settings className="w-4.5 h-4.5" />
              <span>Settings</span>
            </button>

          </div>

          {/* Sidebar Wallet Overview */}
          <div className="p-4 m-4 rounded-2xl bg-gradient-to-tr from-purple-900 to-indigo-800 text-white flex flex-col gap-2.5 shadow-md">
            <div>
              <p className="text-[10px] text-purple-200 font-bold uppercase tracking-wider">Interest Savings A/C</p>
              <p className="text-lg font-mono font-bold mt-1 tracking-tight leading-none text-purple-50">
                {formatINR(walletBalance, true)}
              </p>
            </div>
            <div className="flex justify-between items-center text-[10px] text-purple-200 border-t border-purple-800 pt-2 font-medium">
              <span>Rate: 7.15% p.a.</span>
              <span className="text-[#10b981] font-bold">● Ticking Live</span>
            </div>
          </div>

        </aside>

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8 text-left pb-24 md:pb-8">
          
          {/* ===================================================================
              OVERVIEW TAB
              =================================================================== */}
          {activeTab === "overview" && (
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
              
              {/* Profile Greeting Section */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4.5 text-center md:text-left flex-col md:flex-row">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-20 h-20 rounded-full border-4 border-purple-100 object-cover shadow-sm"
                  />
                  <div>
                    <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 font-outfit">
                      Welcome back, {profile.name}!
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      {userRole === "talent" 
                        ? "Level 2 Creator  •  Video & Cinematic Production"
                        : "Verified Brand Administrator"}
                    </p>
                    <p className="text-xs text-[#863bff] font-bold mt-2 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full w-fit mx-auto md:mx-0">
                      💳 Account: {profile.bankName}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs bg-[#863bff] text-white hover:bg-purple-700 shadow-md shadow-purple-500/20 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{userRole === "talent" ? "New Service Gig" : "Post Campaign"}</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab("settings")}
                    className="px-4 py-2.5 rounded-full border border-slate-200 font-bold text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Explore Gigs Quick Banner (Only for Talent role) */}
              {userRole === "talent" && (
                <div className="bg-gradient-to-r from-purple-900 to-indigo-800 rounded-3xl p-6 text-white text-left relative overflow-hidden shadow-lg">
                  <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
                    <Globe className="w-32 h-32 text-white" />
                  </div>
                  <div className="max-w-xl relative z-10">
                    <span className="text-[9px] bg-white/20 text-white font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
                      Marketplace Open
                    </span>
                    <h2 className="text-lg md:text-xl font-extrabold font-outfit mt-3 leading-snug">
                      Browse open brand campaigns and pitch your services directly!
                    </h2>
                    <p className="text-xs text-purple-200 font-medium leading-relaxed mt-2">
                      Find high-paying unboxing reels, technical writing, design redesigns, and more from boAt, Zomato, and Swiggy. Attach requests to fast-track your approval!
                    </p>
                    <button
                      onClick={() => setActiveTab("explore_gigs")}
                      className="mt-4 px-5 py-2.5 bg-white text-purple-900 font-bold text-xs rounded-full hover:bg-slate-100 shadow-md transform active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <span>Explore Brand Gigs</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Stat Grid Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Stat 1: Wallet Balance */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between h-[130px]">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Wallet Savings Balance
                    </span>
                    <h3 className="text-xl font-bold font-mono text-slate-850 mt-1 tracking-tight">
                      {formatINR(walletBalance, true)}
                    </h3>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold border-t border-slate-100 pt-3">
                    <span className="text-green-600 font-bold">● Credited Daily</span>
                    <button 
                      onClick={() => setActiveTab("wallet")} 
                      className="text-[#863bff] hover:underline"
                    >
                      History
                    </button>
                  </div>
                </div>

                {/* Stat 2: Earnings / Budget */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-[130px]">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      {userRole === "talent" ? "Earnings This Month" : "Total Budget Managed"}
                    </span>
                    <h3 className="text-xl font-bold text-slate-850 mt-1 tracking-tight">
                      {userRole === "talent" ? "₹1,90,000" : "₹6,50,000"}
                    </h3>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold border-t border-slate-100 pt-3">
                    <span className="text-green-600 font-bold">↑ 14.8% vs last month</span>
                    <button onClick={() => setActiveTab("analytics")} className="text-[#863bff] hover:underline">Analytics</button>
                  </div>
                </div>

                {/* Stat 3: Response Rate */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-[130px]">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Response Rate
                    </span>
                    <h3 className="text-xl font-bold text-slate-850 mt-1 tracking-tight">
                      98%
                    </h3>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold border-t border-slate-100 pt-3">
                    <span>Avg. Response Time: 1.2 hrs</span>
                    <button onClick={() => setActiveTab("inbox")} className="text-[#863bff] hover:underline">Inbox</button>
                  </div>
                </div>

                {/* Stat 4: Active Projects */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-[130px]">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      {userRole === "talent" ? "Active Gig Projects" : "Ongoing Campaigns"}
                    </span>
                    <h3 className="text-xl font-bold text-slate-850 mt-1 tracking-tight">
                      {userRole === "talent" ? talentGigs.filter(g => g.status !== "Completed").length : brandCampaigns.filter(c => c.status !== "Completed").length}
                    </h3>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold border-t border-slate-100 pt-3">
                    <span>Delivered on time: 100%</span>
                    <button onClick={() => setActiveTab("projects")} className="text-[#863bff] hover:underline">Manage</button>
                  </div>
                </div>

              </div>

              {/* Active list + Chat widget side-by-side */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Active Projects Tracker */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="font-outfit font-extrabold text-lg text-slate-800">
                      {userRole === "talent" ? "Your Active Gigs" : "Your Campaigns"}
                    </h3>
                    <button 
                      onClick={() => setActiveTab("projects")} 
                      className="text-xs text-[#863bff] font-bold hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {userRole === "talent" ? (
                      talentGigs.length > 0 ? (
                        talentGigs.map(gig => (
                          <div key={gig.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold ${gig.logoBg}`}>
                                {gig.brand[0]}
                              </div>
                              <div className="text-left">
                                <h4 className="text-sm font-bold text-slate-800 leading-tight">{gig.title}</h4>
                                <p className="text-xs text-slate-400 font-medium mt-1">{gig.brand} • Payout: {formatINR(gig.earnings, false)}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-5">
                              {/* Progress bar */}
                              <div className="hidden sm:flex flex-col text-right w-24">
                                <span className="text-[10px] text-slate-400 font-bold">{gig.progress}% Complete</span>
                                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                                  <div 
                                    className="h-full bg-purple-600 rounded-full" 
                                    style={{ width: `${gig.progress}%` }}
                                  />
                                </div>
                              </div>
                              
                              {/* Status badge */}
                              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                                gig.status === "Completed" 
                                  ? "bg-green-50 text-green-600 border-green-200"
                                  : gig.status === "Revision Needed"
                                  ? "bg-amber-50 text-amber-600 border-amber-200"
                                  : "bg-blue-50 text-blue-600 border-blue-200"
                              }`}>
                                {gig.status}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center">
                          <Briefcase className="w-10 h-10 text-slate-300 mb-2" />
                          <h4 className="text-sm font-bold text-slate-700">No Active Gigs Yet</h4>
                          <p className="text-xs text-slate-400 mt-1 max-w-sm font-medium">
                            You haven't joined any active brand gigs yet. Browse open opportunities on the marketplace to start earning!
                          </p>
                          <button 
                            onClick={() => setActiveTab("explore_gigs")} 
                            className="mt-4 px-4 py-2 bg-[#863bff] text-white text-xs font-bold rounded-full hover:bg-purple-700 shadow-sm transition-all"
                          >
                            Explore Open Gigs
                          </button>
                        </div>
                      )
                    ) : (
                      brandCampaigns.length > 0 ? (
                        brandCampaigns.map(camp => (
                          <div key={camp.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                {camp.title[0]}
                              </div>
                              <div className="text-left">
                                <h4 className="text-sm font-bold text-slate-800 leading-tight">{camp.title}</h4>
                                <p className="text-xs text-slate-400 font-medium mt-1">Budget: {formatINR(camp.budget, false)} • Posted {camp.datePosted}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-5">
                              <div className="hidden sm:flex flex-col text-right">
                                <span className="text-[10px] text-slate-400 font-bold">{camp.applicationsCount} Applicants</span>
                                <span className="text-[10px] text-[#863bff] font-bold">{camp.creatorsCount} Creators Hired</span>
                              </div>
                              
                              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                                camp.status === "Active" 
                                  ? "bg-green-50 text-green-600 border-green-200"
                                  : "bg-slate-100 text-slate-500 border-slate-200"
                              }`}>
                                {camp.status}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center">
                          <Building className="w-10 h-10 text-slate-300 mb-2" />
                          <h4 className="text-sm font-bold text-slate-700">No Active Campaigns</h4>
                          <p className="text-xs text-slate-400 mt-1 max-w-sm font-medium">
                            Post your first campaign to connect with verified creators and talent on BridgeNow!
                          </p>
                          <button 
                            onClick={() => setShowAddModal(true)} 
                            className="mt-4 px-4 py-2 bg-[#863bff] text-white text-xs font-bold rounded-full hover:bg-purple-700 shadow-sm transition-all"
                          >
                            + Post Campaign
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Mini Inbox Chat widget */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[340px]">
                  <div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                      <h3 className="font-outfit font-extrabold text-lg text-slate-800">Recent Chats</h3>
                      <button onClick={() => setActiveTab("inbox")} className="text-xs text-[#863bff] font-bold hover:underline">
                        Open Inbox
                      </button>
                    </div>

                    <div className="flex flex-col gap-3">
                      {filteredChats.slice(0, 3).map(chat => (
                        <div 
                          key={chat.id} 
                          onClick={() => {
                            setSelectedChatId(chat.id);
                            setActiveTab("inbox");
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={chat.avatar}
                              alt={chat.name}
                              className="w-10 h-10 rounded-full object-cover shadow-sm"
                            />
                            <div className="text-left w-32 sm:w-48 lg:w-32">
                              <h4 className="text-xs font-bold text-slate-800 truncate">{chat.name}</h4>
                              <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{chat.lastMsg}</p>
                            </div>
                          </div>
                          <span className="text-[9px] text-[#863bff] bg-purple-50 px-2 py-0.5 rounded-full font-bold">
                            Active
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <p className="text-[10px] text-slate-400 font-semibold text-center">
                      Need help? Contact <span className="text-[#863bff] hover:underline cursor-pointer">Support Care</span>
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ===================================================================
              GIGS / PROJECTS TAB
              =================================================================== */}
          {activeTab === "projects" && (
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
              
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-800 font-outfit">
                    {userRole === "talent" ? "Your Gigs & Collaborations" : "Manage Campaigns"}
                  </h1>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    {userRole === "talent" 
                      ? "Track your work deliverables, milestone escrow details, and payout approvals." 
                      : "Create and publish campaign requests to creator networks, approve deliverables, and manage escrows."}
                  </p>
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs bg-[#863bff] text-white hover:bg-purple-700 shadow-md active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{userRole === "talent" ? "Create New Gig" : "Create Campaign"}</span>
                </button>
              </div>

              {/* Main Table/Grid */}
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center flex-wrap gap-4">
                  <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">
                    {userRole === "talent" ? "All Gigs" : "All Campaigns"}
                  </h3>
                  
                  {/* Quick Filters */}
                  <div className="flex gap-2">
                    <button className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors">
                      All
                    </button>
                    <button className="px-3.5 py-1.5 rounded-full bg-purple-50 text-[#863bff] text-xs font-bold border border-purple-100 hover:bg-purple-100/50 transition-colors">
                      Active
                    </button>
                    <button className="px-3.5 py-1.5 rounded-full bg-slate-50 text-slate-400 text-xs font-semibold hover:bg-slate-100 transition-colors">
                      Completed
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {userRole === "talent" ? (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-150">
                          <th className="py-4 px-6">Gig / Campaign Info</th>
                          <th className="py-4 px-6">Brand Partner</th>
                          <th className="py-4 px-6">Earnings</th>
                          <th className="py-4 px-6">Due Date</th>
                          <th className="py-4 px-6">Status / Progress</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                        {talentGigs.length > 0 ? (
                          talentGigs.map(gig => (
                            <tr key={gig.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 px-6">
                                <span className="font-bold text-slate-800 hover:text-[#863bff] cursor-pointer block">{gig.title}</span>
                                <span className="text-[10px] text-slate-400 mt-1 block">ID: {gig.id}</span>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-bold ${gig.logoBg}`}>
                                    {gig.brand[0]}
                                  </div>
                                  <span>{gig.brand}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-slate-800 font-mono font-bold">
                                {formatINR(gig.earnings, false)}
                              </td>
                              <td className="py-4 px-6 text-slate-500 font-medium">
                                {gig.deadline}
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex flex-col gap-1.5 w-32">
                                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded w-fit border ${
                                    gig.status === "Completed" 
                                      ? "bg-green-50 text-green-600 border-green-200"
                                      : gig.status === "Revision Needed"
                                      ? "bg-amber-50 text-amber-600 border-amber-200"
                                      : "bg-blue-50 text-blue-600 border-blue-200"
                                  }`}>
                                    {gig.status}
                                  </span>
                                  <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-600 rounded-full animate-pulse" style={{ width: `${gig.progress}%` }}></div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <button 
                                  onClick={() => {
                                    setSelectedChatId(chatConversations.find(c => c.name.toLowerCase().includes(gig.brand.split(" ")[0].toLowerCase()))?.id || 1);
                                    setActiveTab("inbox");
                                  }}
                                  className="px-3.5 py-1.5 text-xs text-[#863bff] bg-purple-50 hover:bg-purple-100 rounded-full font-bold border border-purple-100"
                                >
                                  Send Message
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="py-12 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <Briefcase className="w-10 h-10 text-slate-300 mb-2" />
                                <h4 className="text-sm font-bold text-slate-700">No Gigs Found</h4>
                                <p className="text-xs text-slate-400 mt-1 max-w-sm font-medium">
                                  Apply to gigs on the marketplace or create a custom service order.
                                </p>
                                <button 
                                  onClick={() => setActiveTab("explore_gigs")} 
                                  className="mt-4 px-4 py-2 bg-[#863bff] text-white text-xs font-bold rounded-full hover:bg-purple-700 shadow-sm"
                                >
                                  Explore Marketplace Gigs
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-150">
                          <th className="py-4 px-6">Campaign Pitch Name</th>
                          <th className="py-4 px-6">Campaign Budget</th>
                          <th className="py-4 px-6">Date Published</th>
                          <th className="py-4 px-6">Creators Registered</th>
                          <th className="py-4 px-6">Status</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                        {brandCampaigns.length > 0 ? (
                          brandCampaigns.map(camp => (
                            <tr key={camp.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 px-6">
                                <span className="font-bold text-slate-800 hover:text-blue-600 cursor-pointer block">{camp.title}</span>
                                <span className="text-[10px] text-slate-400 mt-1 block">ID: {camp.id}</span>
                              </td>
                              <td className="py-4 px-6 text-slate-800 font-mono font-bold">
                                {formatINR(camp.budget, false)}
                              </td>
                              <td className="py-4 px-6 text-slate-500 font-medium">
                                {camp.datePosted}
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex flex-col text-left">
                                  <span className="text-slate-800 font-bold">{camp.creatorsCount} Creators Hired</span>
                                  <span className="text-[10px] text-[#863bff] font-bold mt-0.5">{camp.applicationsCount} Reviewing Pitches</span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded w-fit border ${
                                  camp.status === "Active" 
                                    ? "bg-green-50 text-green-600 border-green-200"
                                    : "bg-slate-100 text-slate-500 border-slate-200"
                                }`}>
                                  {camp.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <button 
                                  onClick={() => {
                                    setSelectedChatId(4);
                                    setActiveTab("inbox");
                                  }}
                                  className="px-3.5 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full font-bold border border-blue-100"
                                >
                                  View applicants
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="py-12 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <Building className="w-10 h-10 text-slate-300 mb-2" />
                                <h4 className="text-sm font-bold text-slate-700">No Campaigns Found</h4>
                                <p className="text-xs text-slate-400 mt-1 max-w-sm font-medium">
                                  Create your first brand campaign to start receiving creator pitches!
                                </p>
                                <button 
                                  onClick={() => setShowAddModal(true)} 
                                  className="mt-4 px-4 py-2 bg-[#863bff] text-white text-xs font-bold rounded-full hover:bg-purple-700 shadow-sm"
                                >
                                  + Create Campaign
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ===================================================================
              INBOX / CHAT TAB
              =================================================================== */}
          {activeTab === "inbox" && (
            <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row">
              
              {/* Chat Sidebar Contacts */}
              <div className="w-full md:w-80 border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-outfit font-extrabold text-lg text-slate-850 text-left">Inbox Conversations</h3>
                  
                  {/* Search box */}
                  <div className="relative mt-3">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input 
                      type="text" 
                      placeholder="Search chats..."
                      className="w-full text-xs font-semibold pl-9 pr-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:border-[#863bff] bg-slate-50"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-50 p-2 flex flex-col gap-1">
                  {filteredChats.length > 0 ? (
                    filteredChats.map(chat => (
                      <div 
                        key={chat.id}
                        onClick={() => setSelectedChatId(chat.id)}
                        className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer text-left transition-all ${
                          chat.id === selectedChatId 
                            ? "bg-purple-50/70 border border-purple-100 shadow-sm" 
                            : "hover:bg-slate-50 border border-transparent"
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          <img
                            src={chat.avatar}
                            alt={chat.name}
                            className="w-11 h-11 rounded-full object-cover border border-slate-100 shadow-sm"
                          />
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-slate-800 truncate">{chat.name}</h4>
                            <span className="text-[8px] text-slate-400 font-bold uppercase">Active</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{chat.lastMsg}</p>
                          <span className="text-[9px] font-bold text-[#863bff] mt-1 inline-block uppercase tracking-wide">
                            {chat.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 font-semibold">
                      No conversations in {userRole} mode.
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Viewpane */}
              <div className="flex-1 flex flex-col bg-slate-50/25">
                {activeChat ? (
                  <>
                    {/* Chat Header */}
                    <div className="h-16 bg-white border-b border-slate-200 px-6 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img
                          src={activeChat.avatar}
                          alt={activeChat.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm"
                        />
                        <div className="text-left">
                          <h4 className="text-sm font-bold text-slate-800 leading-tight">{activeChat.name}</h4>
                          <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-0.5">
                            <span>●</span> Online  •  <span className="text-slate-400 font-semibold">{activeChat.status}</span>
                          </p>
                        </div>
                      </div>
                      
                      {/* Brand Info Capsule */}
                      <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-[#863bff] font-bold text-xs border border-purple-100 shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-current text-purple-600" />
                        <span>VIP Partnership Escrow</span>
                      </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                      {activeChat.messages.map((msg, index) => {
                        const isMe = msg.sender === "me";
                        return (
                          <div 
                            key={index}
                            className={`flex flex-col max-w-[70%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
                          >
                            <div className={`p-4 rounded-3xl text-sm leading-relaxed text-left ${
                              isMe 
                                ? "bg-[#863bff] text-white rounded-tr-none shadow-md shadow-purple-500/10" 
                                : "bg-white border border-slate-250 text-slate-800 rounded-tl-none shadow-sm"
                            }`}>
                              {msg.text}
                            </div>
                            <span className="text-[9px] text-slate-400 font-semibold mt-1.5 px-1">{msg.time}</span>
                          </div>
                        );
                      })}
                      <div ref={chatBottomRef} />
                    </div>

                    {/* Chat Input Footer */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-3.5 items-center">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder={`Message ${activeChat.name}...`}
                        className="flex-1 text-sm font-semibold px-4.5 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#863bff] bg-slate-50 focus:bg-white transition-all shadow-inner"
                      />
                      
                      <button 
                        type="submit"
                        className="h-11 w-11 rounded-2xl bg-[#863bff] hover:bg-purple-700 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all flex-shrink-0"
                      >
                        <Send className="w-4.5 h-4.5" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
                    <MessageSquare className="w-16 h-16 text-slate-200 stroke-1 mb-4" />
                    <p className="font-outfit font-extrabold text-lg text-slate-700">No Chat Selected</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">Please select an inbox discussion from the contact sidebar.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ===================================================================
              ANALYTICS TAB
              =================================================================== */}
          {activeTab === "analytics" && (
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
              
              <div>
                <h1 className="text-2xl font-extrabold text-slate-800 font-outfit">Performance Analytics</h1>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Track your monthly gig impressions, content click-through rates, and historical payout metrics.
                </p>
              </div>

              {/* Chart Widgets Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* SVG Curve Chart Card */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-left">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Metrics Monitor</span>
                      <h3 className="font-outfit font-extrabold text-lg text-slate-800 mt-0.5">Impressions & Engagement</h3>
                    </div>

                    <div className="flex gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                        <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span> Reach (Views)
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span> Clicks (Leads)
                      </span>
                    </div>
                  </div>

                  {/* Custom SVG Curve Line chart */}
                  <div className="w-full h-64 relative bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                      
                      {/* Grid Lines */}
                      <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="160" x2="500" y2="160" stroke="#f1f5f9" strokeWidth="1" />

                      {/* Area Fill Gradient for Reach */}
                      <defs>
                        <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#863bff" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#863bff" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M 0 160 C 50 140, 100 150, 150 90 C 200 30, 250 80, 300 40 C 350 0, 400 120, 450 60 L 500 80 L 500 200 L 0 200 Z" 
                        fill="url(#purpleGlow)"
                      />

                      {/* Reach Line Curve */}
                      <path 
                        d="M 0 160 C 50 140, 100 150, 150 90 C 200 30, 250 80, 300 40 C 350 0, 400 120, 450 60 L 500 80" 
                        fill="none" 
                        stroke="#863bff" 
                        strokeWidth="3.5" 
                        strokeLinecap="round"
                        className="drop-shadow-[0_2px_8px_rgba(134,59,255,0.25)]"
                      />

                      {/* Click Line Curve */}
                      <path 
                        d="M 0 180 C 60 170, 120 160, 180 130 C 240 100, 300 120, 360 80 C 420 40, 480 140, 500 100" 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="2.5" 
                        strokeDasharray="4"
                        strokeLinecap="round"
                      />

                      {/* Highlight Dots */}
                      <circle cx="150" cy="90" r="5" fill="#863bff" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="300" cy="40" r="5" fill="#863bff" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="450" cy="60" r="5" fill="#863bff" stroke="#ffffff" strokeWidth="1.5" />
                    </svg>

                    {/* Custom Tooltip */}
                    <div className="absolute top-12 left-[32%] bg-slate-900 text-white rounded-xl p-2.5 text-[10px] font-bold shadow-lg flex flex-col gap-1 border border-slate-800 text-left pointer-events-none">
                      <span className="text-slate-400">Week 3 (Peak)</span>
                      <span className="text-purple-300"> Reach: +24,200</span>
                      <span className="text-blue-300"> Conversion: 8.4%</span>
                    </div>
                  </div>

                  {/* Chart X-axis Labels */}
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-4 px-2">
                    <span>Jun 01</span>
                    <span>Jun 08</span>
                    <span>Jun 15</span>
                    <span>Jun 22</span>
                    <span>Jun 29</span>
                    <span>Jul 06</span>
                  </div>
                </div>

                {/* Performance overview sidebar */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="text-left">
                    <h3 className="font-outfit font-extrabold text-lg text-slate-800 border-b border-slate-100 pb-3 mb-4">
                      Performance Caps
                    </h3>
                    
                    <div className="flex flex-col gap-4">
                      {/* Metric 1 */}
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold text-slate-800">Profile Impressions</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">30-day organic reach</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-800 font-mono">180,450</p>
                          <p className="text-[9px] text-green-600 font-bold">↑ 22.4%</p>
                        </div>
                      </div>

                      {/* Metric 2 */}
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold text-slate-800">Milestone Success Rate</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Successful milestone completion</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-800 font-mono">100%</p>
                          <p className="text-[9px] text-slate-550 font-bold bg-slate-105 px-2 py-0.5 rounded">Excellent</p>
                        </div>
                      </div>

                      {/* Metric 3 */}
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold text-slate-800">Delivered Orders</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Total brand files delivered</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-800 font-mono">18</p>
                          <p className="text-[9px] text-green-650 font-bold">On Time</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150 text-left mt-6">
                    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-[#863bff]" /> Optimization Insight
                    </h4>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed mt-2">
                      Your tech reels generate <span className="font-bold text-slate-800">42% higher leads</span>. Focus on tech sponsorship applications this week for optimal payout yields.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              WALLET / ESCROW TAB
              =================================================================== */}
          {activeTab === "wallet" && (
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
              
              <div>
                <h1 className="text-2xl font-extrabold text-slate-800 font-outfit">Wallet & Payouts</h1>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Manage your secure bank-partner payouts and track interest earned daily on your wallet balance.
                </p>
              </div>

              {/* Main Wallet Display */}
              <div className="bg-gradient-to-tr from-purple-900 via-indigo-900 to-slate-900 rounded-[32px] p-6 md:p-8 text-white shadow-xl flex flex-col justify-between gap-8">
                
                <div className="flex justify-between items-start flex-wrap gap-4 text-left">
                  <div>
                    <span className="text-xs font-bold text-purple-300 uppercase tracking-widest">
                      BridgeNow Savings Balance
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold font-mono text-white tracking-tight mt-1">
                      {formatINR(walletBalance, true)}
                    </h2>
                  </div>

                  <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 flex gap-4 text-left shadow-lg">
                    <div>
                      <span className="text-[10px] text-purple-200 font-bold uppercase">Live Daily Interest</span>
                      <h4 className="text-lg font-mono font-bold mt-0.5 text-emerald-400">
                        + {formatINR(totalInterestEarned, true)}
                      </h4>
                    </div>
                    <div className="w-px h-8 bg-white/20"></div>
                    <div className="text-right">
                      <span className="text-[10px] text-purple-200 font-bold uppercase">Annual Yield</span>
                      <p className="text-lg font-bold mt-0.5 text-purple-100">7.15%</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3.5 border-t border-white/10 pt-6 justify-between items-center text-left">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowWithdrawModal(true)}
                      className="px-5 py-2.5 bg-white text-[#1a1c1d] rounded-full text-xs font-bold hover:bg-slate-100 shadow-md transform active:scale-95 transition-all"
                    >
                      Withdraw to Bank
                    </button>
                    <button 
                      onClick={() => setShowDepositModal(true)}
                      className="px-5 py-2.5 bg-white/10 text-white rounded-full text-xs font-bold hover:bg-white/20 border border-white/20 transform active:scale-95 transition-all"
                    >
                      + Add / Deposit Funds
                    </button>
                  </div>

                  <div className="text-xs text-purple-300 font-medium">
                    UPI ID: <span className="font-mono font-bold text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded">{profile.upiId}</span>
                  </div>
                </div>

              </div>

              {/* Transactions logs & Escrows list */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Milestone Escrows */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-left">
                  <h3 className="font-outfit font-extrabold text-lg text-slate-850 mb-5">
                    Secure Payout Protection
                  </h3>

                  <div className="flex flex-col gap-4">
                    <div className="p-4 bg-slate-50/60 border border-slate-200/80 rounded-2xl flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">Milestone 1 Secured</span>
                        <h4 className="text-sm font-bold text-slate-800 mt-1.5">boAt Reel Collaboration Draft</h4>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Deposited: ₹45,000  •  State: Held in Escrow</p>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                        Pending Sign-off
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50/60 border border-slate-200/80 rounded-2xl flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">Escrow Disbursed</span>
                        <h4 className="text-sm font-bold text-slate-800 mt-1.5">Zomato Gold Launch Deliverable</h4>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Payout: ₹85,000  •  State: Credited to Wallet</p>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                        Released
                      </span>
                    </div>
                  </div>
                </div>

                {/* Wallet Transactions Log */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-left flex flex-col justify-between">
                  <div>
                    <h3 className="font-outfit font-extrabold text-lg text-slate-850 border-b border-slate-100 pb-3 mb-4">
                      Transaction Activity
                    </h3>

                    <div className="flex flex-col gap-3.5 max-h-56 overflow-y-auto pr-1">
                      {transactions.map((tx) => (
                        <div key={tx.id} className="flex justify-between items-center text-xs pb-2 border-b border-slate-50 last:border-0">
                          <div className="flex flex-col pr-2">
                            <span className="font-bold text-slate-800 truncate">{tx.title}</span>
                            <span className="text-[9px] text-slate-400 mt-0.5">{tx.date}</span>
                          </div>
                          <span className={`font-mono font-bold shrink-0 ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-700'}`}>
                            {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                      {transactions.length === 0 && (
                        <p className="text-xs text-slate-400 text-center py-4">No recent transactions.</p>
                      )}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-4 text-center mt-4">
                    Protected by Bank Escrow Verification.
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ===================================================================
              SETTINGS TAB
              =================================================================== */}
          {activeTab === "settings" && (
            <div className="max-w-6xl mx-auto flex flex-col gap-6 text-left">
              
              <div>
                <h1 className="text-2xl font-extrabold text-slate-800 font-outfit">Console Settings</h1>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Customize your verified profile, bank credentials, and notification thresholds.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-8">
                
                {/* Form fields */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Alert success
                    alert("Profile updated successfully!");
                  }}
                  className="flex flex-col gap-6"
                >
                  
                  {/* Photo & Display Name */}
                  <div className="flex items-center gap-5 flex-wrap">
                    <img 
                      src={profile.avatar}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full object-cover border border-purple-200 shadow"
                    />
                    
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                      <label className="text-xs font-bold text-slate-400 uppercase">Profile Photo URL</label>
                      <input 
                        type="text" 
                        value={profile.avatar}
                        onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                        className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#863bff] bg-slate-5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* Display Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Display Name</label>
                      <input 
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#863bff]"
                      />
                    </div>

                    {/* Username */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Username</label>
                      <input 
                        type="text"
                        value={profile.username}
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                        className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#863bff]"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                      <input 
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#863bff]"
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Phone Number</label>
                      <input 
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#863bff]"
                      />
                    </div>

                    {/* UPI ID */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Settlement UPI ID</label>
                      <input 
                        type="text"
                        value={profile.upiId}
                        onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                        className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#863bff]"
                      />
                    </div>

                    {/* Bank Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Settlement Bank</label>
                      <input 
                        type="text"
                        value={profile.bankName}
                        onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                        className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#863bff]"
                      />
                    </div>

                  </div>

                  {/* Biography */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Creator Bio</label>
                    <textarea 
                      rows="3"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#863bff]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-fit px-8 py-3 rounded-full font-bold text-xs bg-[#863bff] text-white hover:bg-purple-700 shadow-md shadow-purple-500/10 self-start mt-2 active:scale-95 transition-all"
                  >
                    Save Changes
                  </button>

                </form>

              </div>

            </div>
          )}

          {/* ===================================================================
              EXPLORE GIGS TAB
              =================================================================== */}
          {activeTab === "explore_gigs" && (
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-800 font-outfit">Explore Brand Gigs</h1>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    Find and pitch to active advertising campaign gigs offered by top-tier brands.
                  </p>
                </div>
              </div>

              {/* Filters Panel */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search bar */}
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search for brand campaigns, unboxing gigs..."
                      value={marketSearch}
                      onChange={(e) => setMarketSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#863bff] focus:ring-2 focus:ring-[#863bff]/10 text-slate-700 placeholder-slate-400"
                    />
                  </div>

                  {/* Budget range slider */}
                  <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3 px-4 flex items-center justify-between gap-4 w-full lg:w-80">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">Max Budget</span>
                      <span className="text-xs font-bold text-slate-800 font-mono mt-0.5">
                        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(marketBudget)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20000"
                      max="200000"
                      step="5000"
                      value={marketBudget}
                      onChange={(e) => setMarketBudget(parseInt(e.target.value))}
                      className="flex-1 accent-[#863bff] h-1"
                    />
                  </div>
                </div>

                {/* Category tags */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-4">
                  {["All", "Video", "Writing", "Design", "Development", "Marketing"].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setMarketCat(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                        marketCat === cat
                          ? "bg-[#863bff] text-white shadow-md shadow-purple-500/10"
                          : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Market Gigs Listing */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketGigs
                  .filter(gig => {
                    const matchesSearch = gig.title.toLowerCase().includes(marketSearch.toLowerCase()) || 
                                          gig.brand.toLowerCase().includes(marketSearch.toLowerCase()) ||
                                          gig.desc.toLowerCase().includes(marketSearch.toLowerCase());
                    const matchesCat = marketCat === "All" || gig.category === marketCat;
                    const matchesBudget = gig.budget <= marketBudget;
                    return matchesSearch && matchesCat && matchesBudget;
                  })
                  .map(gig => (
                    <div 
                      key={gig.id} 
                      className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden group"
                    >
                      <div>
                        {/* Header row */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-sm ${gig.logoBg}`}>
                              {gig.logoLetter}
                            </div>
                            <div className="text-left">
                              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">{gig.brand}</h4>
                              <span className="text-[9px] bg-slate-100 text-slate-500 font-extrabold px-2 py-0.5 rounded-full mt-1.5 inline-block uppercase tracking-wider">{gig.category}</span>
                            </div>
                          </div>
                          
                          {/* Budget badge */}
                          <div className="text-right">
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Budget</span>
                            <p className="text-sm font-extrabold text-slate-800 font-mono mt-0.5">
                              {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(gig.budget)}
                            </p>
                          </div>
                        </div>

                        {/* Title & Desc */}
                        <div className="text-left mb-6 mt-2">
                          <h3 className="text-base font-extrabold text-slate-800 leading-snug group-hover:text-[#863bff] transition-colors">{gig.title}</h3>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2.5 line-clamp-3">
                            {gig.desc}
                          </p>
                        </div>
                      </div>

                      {/* Footer row (Action / Applied details) */}
                      <div className="border-t border-slate-100 pt-4 flex justify-between items-center mt-auto">
                        <div className="text-left">
                          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Duration</span>
                          <p className="text-xs font-bold text-slate-700 mt-0.5">{gig.duration}</p>
                        </div>

                        {gig.applied ? (
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-extrabold px-3.5 py-2 rounded-full border ${
                              gig.status === "Selected"
                                ? "bg-green-50 text-green-600 border-green-200"
                                : "bg-purple-50 text-[#863bff] border-purple-200 animate-pulse"
                            }`}>
                              {gig.status === "Selected" ? "🎉 Selected & Escrowed" : `Applied (${gig.appliedRequests} requests)`}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setApplyGig(gig);
                              setApplyProposedBudget(gig.budget.toString());
                              setApplyModalOpen(true);
                            }}
                            className="px-5 py-2.5 rounded-full font-bold text-xs bg-[#863bff] text-white hover:bg-purple-700 shadow-md shadow-purple-500/10 active:scale-95 transition-all"
                          >
                            Apply & Pitch
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                {marketGigs.filter(gig => {
                  const matchesSearch = gig.title.toLowerCase().includes(marketSearch.toLowerCase()) || 
                                        gig.brand.toLowerCase().includes(marketSearch.toLowerCase()) ||
                                        gig.desc.toLowerCase().includes(marketSearch.toLowerCase());
                  const matchesCat = marketCat === "All" || gig.category === marketCat;
                  const matchesBudget = gig.budget <= marketBudget;
                  return matchesSearch && matchesCat && matchesBudget;
                }).length === 0 && (
                  <div className="col-span-full py-12 text-center bg-white border border-slate-200 rounded-3xl">
                    <p className="text-sm text-slate-400 font-bold">No brand campaigns match your active search filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Mobile Sticky Navigation (bottom bar) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <button 
          onClick={() => setActiveTab("overview")}
          className={`flex flex-col items-center justify-center gap-1 ${activeTab === "overview" ? "text-[#863bff]" : "text-slate-400"}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[9px] font-bold">Overview</span>
        </button>

        {userRole === "talent" && (
          <button 
            onClick={() => setActiveTab("explore_gigs")}
            className={`flex flex-col items-center justify-center gap-1 ${activeTab === "explore_gigs" ? "text-[#863bff]" : "text-slate-400"}`}
          >
            <Globe className="w-5 h-5" />
            <span className="text-[9px] font-bold">Explore</span>
          </button>
        )}

        <button 
          onClick={() => setActiveTab("projects")}
          className={`flex flex-col items-center justify-center gap-1 ${activeTab === "projects" ? "text-[#863bff]" : "text-slate-400"}`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-[9px] font-bold">{userRole === "talent" ? "Gigs" : "Campaigns"}</span>
        </button>

        <button 
          onClick={() => setActiveTab("inbox")}
          className={`flex flex-col items-center justify-center gap-1 relative ${activeTab === "inbox" ? "text-[#863bff]" : "text-slate-400"}`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[9px] font-bold">Inbox</span>
          <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-pink-500 rounded-full"></span>
        </button>

        <button 
          onClick={() => setActiveTab("wallet")}
          className={`flex flex-col items-center justify-center gap-1 ${activeTab === "wallet" ? "text-[#863bff]" : "text-slate-400"}`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[9px] font-bold">Wallet</span>
        </button>

        <button 
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center justify-center gap-1 ${activeTab === "settings" ? "text-[#863bff]" : "text-slate-400"}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[9px] font-bold">Settings</span>
        </button>
      </div>

      {/* ===================================================================
          MODAL: ADD GIG / POST CAMPAIGN
          =================================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-[28px] shadow-2xl p-6 relative text-left animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-outfit font-extrabold text-xl text-slate-850 mb-2">
              {userRole === "talent" ? "Create Custom Gig Offer" : "Publish Brand Campaign"}
            </h3>
            <p className="text-xs text-slate-400 font-semibold mb-6">
              Fill in the specifics below to add an item locally to your active tracking board.
            </p>

            <form onSubmit={handleAddNewItem} className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                  {userRole === "talent" ? "Project / Deliverable Name" : "Campaign Focus Title"}
                </label>
                <input 
                  type="text" 
                  required
                  placeholder={userRole === "talent" ? "e.g., Sponsored TikTok review for boAt" : "e.g., Tech Creators summer drive"}
                  value={newGigForm.title}
                  onChange={(e) => setNewGigForm({ ...newGigForm, title: e.target.value })}
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#863bff]"
                />
              </div>

              {userRole === "talent" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                    Brand Partner Name
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g., boAt Lifestyle, Swiggy, Uber"
                    value={newGigForm.secondary}
                    onChange={(e) => setNewGigForm({ ...newGigForm, secondary: e.target.value })}
                    className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#863bff]"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                    {userRole === "talent" ? "Payout Value (₹)" : "Budget (₹)"}
                  </label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g., 25000"
                    value={newGigForm.value}
                    onChange={(e) => setNewGigForm({ ...newGigForm, value: e.target.value })}
                    className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#863bff]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                    Target Deadline
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g., 30 Jul 2026"
                    value={newGigForm.deadline}
                    onChange={(e) => setNewGigForm({ ...newGigForm, deadline: e.target.value })}
                    className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#863bff]"
                  />
                </div>

              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-[#863bff] hover:bg-purple-700 text-white rounded-full text-xs font-bold shadow-md shadow-purple-500/20 active:scale-95 transition-all"
                >
                  Add Project
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: APPLY TO MARKET GIG ── */}
      {applyModalOpen && applyGig && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-[28px] shadow-2xl p-6 relative text-left animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-outfit font-extrabold text-xl text-slate-800 pr-8">
              Pitch for "{applyGig.title}"
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Campaign Host: <span className="text-slate-600 font-bold">{applyGig.brand}</span>
            </p>

            <form onSubmit={handleApplyGig} className="flex flex-col gap-4 mt-6">
              {/* Proposed Budget */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Your Proposed Payout (INR)</label>
                <input
                  type="number"
                  placeholder={applyGig.budget.toString()}
                  value={applyProposedBudget}
                  onChange={(e) => setApplyProposedBudget(e.target.value)}
                  className="w-full text-xs font-bold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#863bff] focus:ring-2 focus:ring-[#863bff]/10"
                />
              </div>

              {/* Number of Requests */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase flex justify-between">
                  <span>Number of Requests / Proposals</span>
                  <span className="text-purple-600 font-mono">1-5 requests</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={applyRequests}
                  onChange={(e) => setApplyRequests(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
                  className="w-full text-xs font-bold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#863bff] focus:ring-2 focus:ring-[#863bff]/10"
                />
                <p className="text-[10px] text-slate-400 font-medium">
                  Submitting more requests increases brand visibility and priority queue rank.
                </p>
              </div>

              {/* Pitch Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Why you are a perfect fit</label>
                <textarea
                  rows="3"
                  placeholder="Describe your creative vision, link to past reels, or ask questions about the project deliverables..."
                  value={applyPitch}
                  onChange={(e) => setApplyPitch(e.target.value)}
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#863bff] focus:ring-2 focus:ring-[#863bff]/10"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full font-bold text-xs bg-[#863bff] text-white hover:bg-purple-700 shadow-md shadow-purple-500/10 mt-2 active:scale-95 transition-all"
              >
                Submit Bid Proposal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── DEPOSIT FUNDS MODAL ── */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-left relative">
            <button 
              onClick={() => setShowDepositModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-purple-50 text-[#863bff] rounded-2xl">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-outfit font-extrabold text-lg text-slate-850">Deposit / Add Funds</h3>
                <p className="text-xs text-slate-500 font-medium">Add local funds to your BridgeNow wallet balance</p>
              </div>
            </div>

            <form onSubmit={handleDeposit} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Amount (₹)</label>
                <input 
                  type="number"
                  min="100"
                  max="1000000"
                  required
                  placeholder="e.g. 25000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#863bff] focus:bg-white rounded-2xl text-sm font-bold text-slate-800 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Payment Method</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#863bff] focus:bg-white rounded-2xl text-xs font-bold text-slate-800 outline-none transition-all"
                >
                  <option value="UPI / GPay">UPI / GPay ({profile.upiId})</option>
                  <option value="NetBanking">NetBanking ({profile.bankName})</option>
                  <option value="Debit Card">Debit / Credit Card</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#7c3aed] to-[#c084fc] text-white font-bold text-xs rounded-2xl shadow-lg hover:shadow-xl transition-all transform active:scale-95 mt-2"
              >
                Confirm Deposit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── WITHDRAW FUNDS MODAL ── */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-left relative">
            <button 
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-outfit font-extrabold text-lg text-slate-850">Withdraw to Bank</h3>
                <p className="text-xs text-slate-500 font-medium">Transfer wallet balance to your bank account</p>
              </div>
            </div>

            <form onSubmit={handleWithdraw} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Amount (₹)</label>
                <input 
                  type="number"
                  min="100"
                  max={walletBalance}
                  required
                  placeholder={`Max available: ₹${walletBalance.toLocaleString('en-IN')}`}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#863bff] focus:bg-white rounded-2xl text-sm font-bold text-slate-800 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Destination Account</label>
                <input 
                  type="text"
                  readOnly
                  value={`${profile.bankName} (${profile.upiId})`}
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-slate-900 text-white font-bold text-xs rounded-2xl shadow-lg hover:bg-slate-800 transition-all transform active:scale-95 mt-2"
              >
                Confirm Withdrawal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── TOAST MESSAGE ── */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-2.5 font-bold text-xs animate-in slide-in-from-bottom duration-300 z-50 ${
          toastMessage.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
            : "bg-purple-50 border-purple-200 text-[#863bff]"
        }`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{toastMessage.text}</span>
        </div>
      )}

    </div>
  );
}
