'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  User,
  ArrowRight,
  Calendar,
  Sparkles,
  Search,
  Tag,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Chronic Wellness',
    'Skin Care',
    'Pediatric Health',
    'Stress & Sleep',
    'Respiratory Care',
  ];

  const articles = [
    {
      id: 'understanding-constitutional-homeopathy',
      title: 'Understanding Constitutional Homeopathy: Care Tailored to You',
      category: 'Chronic Wellness',
      readTime: '5 min read',
      date: 'November 18, 2026',
      author: 'Dr. S. Kale, BHMS',
      excerpt:
        'Constitutional homeopathy focuses on evaluating the whole individual rather than isolated symptoms. Learn how personalized assessments guide lasting healing.',
      highlights: [
        'How physical, mental, and emotional factors intersect',
        'The role of individualized remedy selection',
        'What to expect during an initial constitutional intake',
      ],
    },
    {
      id: 'homeopathic-approach-to-eczema-and-allergies',
      title: 'Managing Chronic Eczema & Skin Allergies Naturally',
      category: 'Skin Care',
      readTime: '6 min read',
      date: 'November 12, 2026',
      author: 'Clinical Advisory Team',
      excerpt:
        'Skin conditions often reflect internal imbalances. Discover how homeopathic consultations address inflammatory triggers gently without suppressing natural defenses.',
      highlights: [
        'Identifying environmental and dietary triggers',
        'Gentle non-drowsy relief for flare-ups',
        'Long-term skin barrier and immune support',
      ],
    },
    {
      id: 'gentle-pediatric-care-remedies-for-children',
      title: 'A Gentle Approach to Children’s Health & Immunity',
      category: 'Pediatric Health',
      readTime: '4 min read',
      date: 'November 05, 2026',
      author: 'Dr. S. Kale, BHMS',
      excerpt:
        'Safe, pleasant-tasting, and non-invasive homeopathic solutions for recurring seasonal colds, dentition discomfort, and childhood digestive sensitivities.',
      highlights: [
        'Child-friendly dosing and safe administration',
        'Strengthening natural immune resilience',
        'When to seek urgent allopathic pediatric care',
      ],
    },
    {
      id: 'restful-sleep-and-stress-management',
      title: 'Restoring Natural Sleep Rhythms and Calming Nervous Tension',
      category: 'Stress & Sleep',
      readTime: '5 min read',
      date: 'October 28, 2026',
      author: 'Clinical Advisory Team',
      excerpt:
        'Chronic stress depletes vital energy and disrupts circadian cycles. Explore gentle homeopathic formulations designed to calm restless minds without dependency.',
      highlights: [
        'Breaking the cycle of nighttime restlessness',
        'Non-habit forming natural support',
        'Daily lifestyle rituals for emotional balance',
      ],
    },
    {
      id: 'seasonal-allergies-and-sinus-relief',
      title: 'Seasonal Allergic Rhinitis & Sinusitis: A Long-Term Strategy',
      category: 'Respiratory Care',
      readTime: '5 min read',
      date: 'October 20, 2026',
      author: 'Dr. S. Kale, BHMS',
      excerpt:
        'Sneezing, nasal congestion, and sinus headaches can be managed systematically. Discover how homeopathy treats root hypersensitivities before peak pollen seasons.',
      highlights: [
        'Pre-seasonal preventative protocols',
        'Reducing nasal mucus hyper-reactivity',
        'Safe combination with prescribed antihistamines',
      ],
    },
    {
      id: 'digestive-health-and-ibs-guidance',
      title: 'Holistic Support for Irritable Bowel Syndrome & Gut Dysbiosis',
      category: 'Chronic Wellness',
      readTime: '6 min read',
      date: 'October 14, 2026',
      author: 'Clinical Advisory Team',
      excerpt:
        'The gut-brain axis plays a decisive role in recurrent bloating, acidity, and irregular bowel habits. How individualized care fosters sustained digestive comfort.',
      highlights: [
        'The connection between stress and gut motility',
        'Individualized digestive remedies',
        'Nutritional alignment for sensitive systems',
      ],
    },
  ];

  // Filtering
  const filteredArticles = articles.filter((art) => {
    const matchesCategory =
      selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-canvas min-h-screen transition-colors duration-200">
      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section className="relative pt-16 pb-14 md:pt-24 md:pb-20 overflow-hidden bg-gradient-to-b from-canvas via-canvas-subtle to-canvas">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 md:space-y-8">
          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold text-txt-heading tracking-tight leading-[1.15] md:leading-[1.12]">
            Health Insights &{' '}
            <span className="text-accent font-serif font-normal italic">
              Homeopathic Guidance.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-txt-body leading-relaxed max-w-3xl mx-auto">
            Explore evidence-informed articles, clinical perspectives, and patient guidance on holistic well-being from qualified homeopathic practitioners.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-txt-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by health topic, remedy, or condition..."
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-card border border-card-border text-sm text-txt-heading placeholder:text-txt-faint focus:outline-none focus:ring-2 focus:ring-accent/40 shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-xs font-semibold text-txt-muted hover:text-txt-heading"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                    isSelected
                      ? 'bg-btn-primary-bg text-btn-primary-text font-semibold shadow-sm'
                      : 'bg-card border border-card-border text-txt-body hover:border-accent hover:text-accent'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. ARTICLES GRID                                             */}
      {/* ============================================================ */}
      <section className="py-12 md:py-20 bg-canvas-subtle border-t border-borderline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredArticles.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-txt-muted mx-auto stroke-1" />
              <h3 className="text-lg font-bold text-txt-heading">No articles found</h3>
              <p className="text-sm text-txt-muted">
                Try searching with different keywords or switch back to "All" topics.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-2 inline-flex items-center text-xs font-semibold text-accent hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="rounded-3xl bg-card border border-card-border hover:border-card-border-hover p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    {/* Metadata Header */}
                    <div className="flex items-center justify-between text-xs text-txt-muted">
                      <span className="font-semibold px-3 py-1 rounded-full bg-accent-soft text-accent text-[11px]">
                        {article.category}
                      </span>
                      <span className="inline-flex items-center space-x-1 text-[11px]">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {article.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-base sm:text-lg font-bold text-txt-heading group-hover:text-accent transition-colors leading-snug">
                      {article.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-txt-body leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Key Discussion Points */}
                    <div className="pt-2 border-t border-borderline/60 space-y-1.5">
                      {article.highlights.map((hl, i) => (
                        <div
                          key={i}
                          className="flex items-start space-x-2 text-[11px] sm:text-xs text-txt-muted"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Author & Read Action */}
                  <div className="pt-5 mt-5 border-t border-borderline flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-accent-soft text-accent flex items-center justify-center font-bold text-xs">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <span className="block text-[11px] font-semibold text-txt-heading">
                          {article.author}
                        </span>
                        <span className="block text-[10px] text-txt-faint">
                          {article.date}
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/book"
                      className="inline-flex items-center text-xs font-semibold text-accent hover:text-accent-hover transition-colors group-hover:translate-x-0.5"
                    >
                      <span>Discuss in Care</span>
                      <ChevronRight className="w-4 h-4 ml-0.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. PRACTITIONER CONSULTATION BANNER                         */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24 bg-canvas border-t border-borderline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-[var(--banner-from)] to-[var(--banner-to)] text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-xl text-center space-y-6 border border-borderline">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--banner-glow)] rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white !text-white">
                Have Questions About Your Health Concerns?
              </h2>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl mx-auto">
                Articles provide general education, but true healing begins with an individualized health discussion. Connect with a qualified homeopathic practitioner for dedicated guidance.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/book"
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-white hover:bg-accent-soft text-btn-primary-bg font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Consultation</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
