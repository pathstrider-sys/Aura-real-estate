import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, MapPin, BedDouble, Bath, Square, ArrowRight, Menu, X, 
  CheckCircle2, Star, Heart, Calculator, Mail, Phone, Instagram, 
  Linkedin, Twitter, ChevronRight, Home
} from 'lucide-react';

// --- MOCK DATA ---
const CATEGORIES = ['All', 'Villas', 'Penthouses', 'Estates', 'Apartments'];

const PROPERTIES = [
  {
    id: 1,
    title: 'Modern Glass Villa',
    location: 'Beverly Hills, CA',
    price: 4250000,
    priceStr: '$4,250,000',
    beds: 4,
    baths: 5,
    sqft: '4,500',
    type: 'Villas',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80',
    featured: true,
  },
  {
    id: 2,
    title: 'Minimalist Desert Home',
    location: 'Scottsdale, AZ',
    price: 2100000,
    priceStr: '$2,100,000',
    beds: 3,
    baths: 3,
    sqft: '3,200',
    type: 'Estates',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    featured: false,
  },
  {
    id: 3,
    title: 'Urban Penthouse',
    location: 'Manhattan, NY',
    price: 8500000,
    priceStr: '$8,500,000',
    beds: 3,
    baths: 4,
    sqft: '3,800',
    type: 'Penthouses',
    image: 'https://images.unsplash.com/photo-1600607687931-cebf0746e50e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    featured: true,
  },
  {
    id: 4,
    title: 'Coastal Cliff Estate',
    location: 'Malibu, CA',
    price: 12500000,
    priceStr: '$12,500,000',
    beds: 6,
    baths: 7,
    sqft: '8,200',
    type: 'Estates',
    image: 'https://images.unsplash.com/photo-1613490908592-5d4edafc234b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    featured: false,
  },
  {
    id: 5,
    title: 'Skyline Apartment',
    location: 'Chicago, IL',
    price: 1850000,
    priceStr: '$1,850,000',
    beds: 2,
    baths: 2,
    sqft: '1,800',
    type: 'Apartments',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    featured: false,
  },
  {
    id: 6,
    title: 'Tropical Oasis Villa',
    location: 'Miami, FL',
    price: 5900000,
    priceStr: '$5,900,000',
    beds: 5,
    baths: 6,
    sqft: '6,100',
    type: 'Villas',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    featured: false,
  }
];

const SERVICES = [
  {
    title: 'Property Valuation',
    description: 'Get an accurate, data-driven estimate of your property\'s current market value using our proprietary AI models.',
  },
  {
    title: 'Buying & Selling',
    description: 'Seamless end-to-end support whether you are acquiring a new home, selling yours, or relocating internationally.',
  },
  {
    title: 'Investment Advisory',
    description: 'Strategic insights to help you build and manage a profitable real estate portfolio with high ROI.',
  },
  {
    title: 'Property Management',
    description: 'Comprehensive management services for your luxury rentals, ensuring peace of mind and steady income.',
  }
];

const AGENTS = [
  {
    name: 'Elena Rodriguez',
    role: 'Luxury Property Specialist',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=688&q=80',
    sales: '$120M+',
  },
  {
    name: 'Marcus Chen',
    role: 'Commercial & Investment Lead',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
    sales: '$250M+',
  },
  {
    name: 'Sarah Jenkins',
    role: 'Residential Director',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=761&q=80',
    sales: '$95M+',
  }
];

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [savedProperties, setSavedProperties] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Mortgage Calculator State
  const [homePrice, setHomePrice] = useState(2500000);
  const [downPayment, setDownPayment] = useState(500000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);

  // Filter properties based on category and search
  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter(prop => {
      const matchesCategory = activeCategory === 'All' || prop.type === activeCategory;
      const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            prop.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Toggle saved property
  const toggleSave = (id: number) => {
    setSavedProperties(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  // Calculate Mortgage
  const monthlyPayment = useMemo(() => {
    const principal = homePrice - downPayment;
    const monthlyInterest = (interestRate / 100) / 12;
    const numberOfPayments = loanTerm * 12;
    
    if (monthlyInterest === 0) return principal / numberOfPayments;
    
    const payment = principal * (monthlyInterest * Math.pow(1 + monthlyInterest, numberOfPayments)) / (Math.pow(1 + monthlyInterest, numberOfPayments) - 1);
    return isNaN(payment) || payment < 0 ? 0 : payment;
  }, [homePrice, downPayment, interestRate, loanTerm]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-zinc-50/90 backdrop-blur-md border-b border-zinc-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <Home className="w-6 h-6" />
            AURA.
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#properties" className="hover:text-zinc-500 transition-colors">Properties</a>
            <a href="#services" className="hover:text-zinc-500 transition-colors">Services</a>
            <a href="#agents" className="hover:text-zinc-500 transition-colors">Agents</a>
            <a href="#calculator" className="hover:text-zinc-500 transition-colors">Calculator</a>
            
            <div className="flex items-center gap-4 border-l border-zinc-200 pl-8">
              <button className="flex items-center gap-2 hover:text-red-500 transition-colors relative">
                <Heart size={20} className={savedProperties.length > 0 ? "fill-red-500 text-red-500" : ""} />
                {savedProperties.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {savedProperties.length}
                  </span>
                )}
              </button>
              <button className="bg-zinc-900 text-white px-6 py-2.5 rounded-full hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20">
                Contact Agent
              </button>
            </div>
          </div>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-20 left-0 w-full bg-zinc-50 border-b border-zinc-200 p-6 flex flex-col space-y-4 overflow-hidden"
            >
              <a href="#properties" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>Properties</a>
              <a href="#services" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
              <a href="#agents" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>Agents</a>
              <a href="#calculator" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>Calculator</a>
              <div className="flex items-center gap-2 text-lg font-medium text-zinc-600">
                <Heart size={20} /> Saved ({savedProperties.length})
              </div>
              <button className="bg-zinc-900 text-white px-6 py-3 rounded-full w-full mt-4">
                Contact Agent
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 min-h-[95vh] flex flex-col justify-center relative">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-zinc-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-zinc-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              New properties added today
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.05]">
              Find your <br />
              <span className="text-zinc-400">perfect</span> space.
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 max-w-md leading-relaxed">
              Discover exceptional properties in the world's most desirable locations. Bold design, uncompromising quality.
            </p>
            
            {/* Search Bar */}
            <div className="bg-white p-2 rounded-full shadow-xl shadow-zinc-200/50 border border-zinc-100 flex items-center max-w-xl transition-all focus-within:ring-2 focus-within:ring-zinc-900 focus-within:border-transparent">
              <div className="flex-1 flex items-center px-4 border-r border-zinc-200">
                <MapPin size={20} className="text-zinc-400 mr-2 shrink-0" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by location or name..." 
                  className="w-full bg-transparent outline-none text-zinc-900 placeholder:text-zinc-400"
                />
              </div>
              <button 
                onClick={() => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-zinc-900 text-white p-4 rounded-full hover:bg-zinc-800 transition-colors flex items-center justify-center shrink-0"
              >
                <Search size={20} />
              </button>
            </div>
            
            <div className="flex items-center space-x-8 pt-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <div className="text-3xl font-bold tracking-tight">2.5k+</div>
                <div className="text-sm text-zinc-500 mt-1">Properties Sold</div>
              </motion.div>
              <div className="w-px h-12 bg-zinc-200"></div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <div className="text-3xl font-bold tracking-tight">$4B+</div>
                <div className="text-sm text-zinc-500 mt-1">Sales Volume</div>
              </motion.div>
              <div className="w-px h-12 bg-zinc-200"></div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <div className="text-3xl font-bold tracking-tight">15+</div>
                <div className="text-sm text-zinc-500 mt-1">Years Experience</div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-zinc-300/50 group"
          >
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" 
              alt="Modern Home" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent"></div>
            
            {/* Floating Badge */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Available Now
            </motion.div>

            <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-6 rounded-3xl flex justify-between items-center shadow-xl transform translate-y-0 transition-transform duration-500">
              <div>
                <div className="text-sm font-semibold text-zinc-500 mb-1 uppercase tracking-wider">Featured Property</div>
                <div className="text-xl font-bold">The Glass House</div>
                <div className="flex items-center text-zinc-500 text-sm mt-1">
                  <MapPin size={14} className="mr-1" /> Beverly Hills, CA
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">$5.2M</div>
                <button className="text-sm font-medium underline underline-offset-4 mt-1 hover:text-zinc-600">View Details</button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties with Filters */}
      <section id="properties" className="py-24 px-6 bg-white border-t border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Discover Properties</h2>
              <p className="text-lg text-zinc-600">Curated properties that define modern luxury living.</p>
            </div>
            
            {/* Categories */}
            <div className="mt-8 md:mt-0 flex flex-wrap gap-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category 
                      ? 'bg-zinc-900 text-white shadow-md' 
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-dashed border-zinc-300">
              <Search size={48} className="mx-auto text-zinc-300 mb-4" />
              <h3 className="text-xl font-bold mb-2">No properties found</h3>
              <p className="text-zinc-500">Try adjusting your search or filters.</p>
              <button 
                onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
                className="mt-6 text-sm font-medium underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProperties.map((property, index) => (
                  <motion.div 
                    layout
                    key={property.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group cursor-pointer bg-white rounded-3xl border border-zinc-100 p-3 hover:shadow-xl hover:shadow-zinc-200/50 transition-all"
                  >
                    <div className="relative h-[300px] rounded-2xl overflow-hidden mb-5">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                        {property.priceStr}
                      </div>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleSave(property.id); }}
                        className="absolute top-4 right-4 p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform"
                      >
                        <Heart size={18} className={savedProperties.includes(property.id) ? "fill-red-500 text-red-500" : "text-zinc-600"} />
                      </button>

                      {property.featured && (
                        <div className="absolute bottom-4 left-4 bg-zinc-900 text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider">
                          Featured
                        </div>
                      )}
                    </div>
                    
                    <div className="px-2 pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold tracking-tight group-hover:text-zinc-600 transition-colors">{property.title}</h3>
                      </div>
                      <div className="flex items-center tex
