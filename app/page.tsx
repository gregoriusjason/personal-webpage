"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function smoothScrollTo(id, container) {
  if (!container) return;
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  history.replaceState(null, '', `#${id}`);
}

export default function Home() {
  const [showHeader, setShowHeader] = useState(false);
  const mainScrollRef = useRef(null);

  // Projects carousel hooks & helpers
  const carouselTrackRef = useRef(null);
  const [currentProjIndex, setcurrentProjIndex] = useState(0);
  const [activeProject, setActiveProject] = useState(null);

  const handleProjectScroll = (direction) => {
    const track = carouselTrackRef.current;
    if (!track) return;
    const card = track.querySelector('[data-card]');
    const scrollAmount = card ? card.offsetWidth + 24 /* gap */ : Math.min(600, Math.max(320, Math.floor(track.clientWidth * 0.9)));
    track.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  useEffect(() => {
    const track = carouselTrackRef.current;
    if (!track) return;
    let animFrame = 0;
    const updateIndex = () => {
      cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(() => {
        const cards = Array.from(track.querySelectorAll('[data-card]'));
        if (!cards.length) return;
        const center = track.scrollLeft + track.clientWidth / 2;
        let bestMatch = 0;
        let closestDist = Infinity;
        cards.forEach((c, i) => {
          const mid = c.offsetLeft + c.offsetWidth / 2;
          const distance = Math.abs(mid - center);
          if (distance < closestDist) { 
            closestDist = distance; 
            bestMatch = i; 
          }
        });
        setcurrentProjIndex(bestMatch);
      });
    };
    track.addEventListener('scroll', updateIndex, { passive: true });
    updateIndex();
    return () => { 
      track.removeEventListener('scroll', updateIndex); 
      cancelAnimationFrame(animFrame); 
    };
  }, []);

  useEffect(() => {
    const mainEl = mainScrollRef.current;
    if (!mainEl) return;
    
    // Lock window/body scroll; only <main> should scroll
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    const prevHtmlOverflow = htmlEl.style.overflow;
    const prevBodyOverflow = bodyEl.style.overflow;
    const prevHtmlHeight = htmlEl.style.height;
    const prevBodyHeight = bodyEl.style.height;
    
    htmlEl.style.height = '100%';
    bodyEl.style.height = '100%';
    htmlEl.style.overflow = 'hidden';
    bodyEl.style.overflow = 'hidden';

    const onMainScroll = () => {
      setShowHeader(mainEl.scrollTop > 24);
    };
    onMainScroll();
    mainEl.addEventListener("scroll", onMainScroll);
    
    return () => {
      mainEl.removeEventListener("scroll", onMainScroll);
      htmlEl.style.overflow = prevHtmlOverflow;
      bodyEl.style.overflow = prevBodyOverflow;
      htmlEl.style.height = prevHtmlHeight;
      bodyEl.style.height = prevBodyHeight;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setActiveProject(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Handle hash-based navigation
  useEffect(() => {
    const handleHashScroll = () => {
      const id = window.location.hash?.replace('#', '');
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, []);
  
  return (
    <div className="fixed inset-0 w-full h-full bg-[#f7f8fb] relative overflow-hidden select-none">
      {/* Keyframes + helpers (kept lightweight) */}

      {/* Background accents (very subtle) */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[36rem] w-[36rem] rounded-full bg-[#0077ff]/10 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-indigo-300/10 blur-3xl animate-blob" />

      {/* Header / Nav */}
      <header className={`fixed top-0 left-0 right-0 z-40 w-full backdrop-blur-md bg-white/70 border-b border-black/5 transition-all duration-500 ${showHeader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"}`}>
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <h1 className="font-semibold text-xl tracking-wide text-black">GREGORIUS JASON</h1>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" onClick={(e) => { e.preventDefault(); smoothScrollTo('about', mainScrollRef.current); }} className="text-sm font-medium text-[#0077ff] hover:opacity-80 transition-opacity">ABOUT ME</a>
            <a href="#resume" onClick={(e) => { e.preventDefault(); smoothScrollTo('resume', mainScrollRef.current); }} className="text-sm font-medium text-black hover:text-[#0077ff] transition-colors">RESUME</a>
            <a href="#projects" onClick={(e) => { e.preventDefault(); smoothScrollTo('projects', mainScrollRef.current); }} className="text-sm font-medium text-black hover:text-[#0077ff] transition-colors">PROJECTS</a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main ref={mainScrollRef} className="absolute inset-0 mx-auto max-w-6xl px-6 pt-20 pb-24 snap-y snap-mandatory overflow-y-auto scrollbar-hide">
        <section id="about" className="relative min-h-[calc(100dvh-176px)] grid place-items-center py-0 snap-start scroll-mt-24 md:scroll-mt-28">
          <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-black/10 bg-[#eaf2ff] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-5 sm:p-8 md:p-10 animate-fade-in hover:shadow-[0_16px_44px_rgba(0,0,0,0.08)] transition-shadow">
            {/* Decorative Double-H Background */}
            <div aria-hidden="true" className="pointer-events-none absolute -inset-6 -z-10">
              {/* H #1 */}
              <div className="absolute left-[58%] top-[-6%] rotate-[28deg]">
                {/* verticals */}
                <div className="h-[26rem] w-6 rounded-md bg-[#2a6dfd]/15 shadow-[0_10px_30px_rgba(42,109,253,0.25)]" />
                <div className="absolute left-24 top-0 h-[26rem] w-6 rounded-md bg-[#2a6dfd]/15 shadow-[0_10px_30px_rgba(42,109,253,0.25)]" />
                {/* crossbar */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[11rem] rounded-md bg-[#2a6dfd]/15 shadow-[0_8px_24px_rgba(42,109,253,0.18)]" />
              </div>
              {/* H #2 (lighter, offset) */}
              <div className="absolute right-[8%] bottom-[-10%] rotate-[28deg] scale-125">
                <div className="h-[28rem] w-5 rounded-md bg-[#2a6dfd]/10 shadow-[0_10px_30px_rgba(42,109,253,0.18)]" />
                <div className="absolute left-20 top-0 h-[28rem] w-5 rounded-md bg-[#2a6dfd]/10 shadow-[0_10px_30px_rgba(42,109,253,0.18)]" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[9rem] rounded-md bg-[#2a6dfd]/10 shadow-[0_8px_24px_rgba(42,109,253,0.14)]" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

              {/* LEFT: Avatar Panel */}
              <div className="w-full">
                <div className="relative rounded-[1.5rem] bg-[#dfe8ff] p-6 md:p-8 shadow-inner animate-fade-in delay-100">
                  {/* Avatar */}
                  <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-full bg-white shadow-lg">
                    <svg className="h-28 w-28 text-slate-300" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                      <path d="M12 12a4 4 0 1 0-4-4 4.004 4.004 0 0 0 4 4Zm0 2c-3.2 0-8 1.6-8 4v2h16v-2c0-2.4-4.8-4-8-4Z"/>
                    </svg>
                  </div>

                  {/* Email chip + socials bar */}
                  <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    {/* Email chip */}
                    <a
                      href="mailto:gregoriusjason@outlook.com"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow hover:bg-slate-50 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                        <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v.4l-10 6.25L2 6.4V6Zm0 2.9V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.9l-9.38 5.87a2 2 0 0 1-2.24 0L2 8.9Z"/>
                      </svg>
                      gregoriusjason@outlook.com
                    </a>

                    {/* Socials */}
                    <div className="flex items-center gap-4">
                      {/* <a href="#" className="group p-2 rounded-full border border-black/10 hover:border-[#E1306C]/40 hover:bg-[#E1306C]/5 transition-all" aria-label="Instagram">
                        <svg className="h-5 w-5 text-black group-hover:text-[#E1306C] transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Zm5.75-.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Z"/></svg>
                      </a> */}
                      <a href="#" className="group p-2 rounded-full border border-black/10 hover:border-black/40 hover:bg-black/5 transition-all" aria-label="GitHub">
                        <svg className="h-5 w-5 text-black group-hover:opacity-80 transition-opacity" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.74c-2.78.6-3.37-1.17-3.37-1.17a2.65 2.65 0 0 0-1.1-1.46c-.9-.61.07-.6.07-.6a2.1 2.1 0 0 1 1.53 1.03 2.12 2.12 0 0 0 2.9.83 2.13 2.13 0 0 1 .63-1.32c-2.22-.26-4.56-1.11-4.56-4.93A3.86 3.86 0 0 1 6.86 7s.84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0C16.52 6.73 17.36 7 17.36 7a3.86 3.86 0 0 1 .11 2.85c0 3.83-2.34 4.66-4.57 4.91a2.38 2.38 0 0 1 .68 1.84v2.72c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>
                      </a>
                      <a href="#" className="group p-2 rounded-full border border-black/10 hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/5 transition-all" aria-label="LinkedIn">
                        <svg className="h-5 w-5 text-black group-hover:text-[#0A66C2] transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 0 0 5.001 2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.65h.05a4.17 4.17 0 0 1 3.75-2.06C21.18 8.59 22 11.06 22 14.46V21H18v-5.6c0-1.34-.02-3.06-1.87-3.06-1.88 0-2.17 1.46-2.17 2.96V21H10V9Z"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Intro copy */}
              <div className="animate-fade-in delay-200">
                <p className="text-5xl md:text-6xl font-extrabold leading-none text-[#2a6dfd] mb-3">Hi..</p>

                <p className="text-lg md:text-xl text-slate-900 mb-1">
                  My name is <span className="font-extrabold">Gregorius Jason</span>
                </p>
                <p className="text-slate-800 mb-5">
                  I’m a second year <span className="font-semibold">Computer Science</span> student<br className="hidden sm:block" />
                  at the <span className="font-semibold">University of Edinburgh</span>.
                </p>

                <div className="flex items-center gap-3 mb-6 animate-fade-in delay-400">
                  <a
                    href="#resume"
                    onClick={(e) => { e.preventDefault(); smoothScrollTo('resume', mainScrollRef.current); }}
                    className="inline-flex items-center gap-2 rounded-full bg-[#2a6dfd] px-5 py-2 text-white text-sm font-semibold shadow hover:bg-[#1f5ae0] active:scale-[0.98] transition-all"
                  >
                    RESUME
                  </a>
                  <a
                    href="#projects"
                    onClick={(e) => { e.preventDefault(); smoothScrollTo('projects', mainScrollRef.current); }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-400/60 bg-transparent px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-white/60 active:scale-[0.98] transition-all"
                  >
                    PROJECTS
                  </a>
                </div>
                

                <p className="max-w-xl text-base md:text-[17px] leading-relaxed text-slate-800">
                  I am an innovative, disciplined, and analytical Computer Science student with a strong
                  fascination for artificial intelligence. My ambition is to become a Software Engineer
                  who applies AI to create meaningful societal impact—designing technology that
                  simplifies tasks, enhances efficiency, and solves real-world problems.
                </p>
              </div>
            </div>
          </div>
          <a href="#resume" onClick={(e) => { e.preventDefault(); smoothScrollTo('resume', mainScrollRef.current); }} className="hidden sm:flex absolute bottom-3 left-1/2 -translate-x-1/2 items-center gap-2 text-slate-600/70 hover:text-slate-900 transition-colors">
            <span className="text-sm">Scroll</span>
            <svg className="h-5 w-5 animate-bounce" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 16a1 1 0 0 1-.7-.29l-6-6 1.4-1.42L12 13.6l5.3-5.31 1.4 1.42-6 6c-.18.18-.43.29-.7.29Z"/>
            </svg>
          </a>
        </section>

        {/* Resume */}
        <section id="resume" className="py-12 md:py-16 snap-start scroll-mt-24 md:scroll-mt-28">
          <div className="rounded-xl border border-black/10 bg-white/80 backdrop-blur-md p-6 md:p-8 shadow-sm">
            <h3 className="text-2xl font-bold mb-3 text-slate-900">Resume</h3>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#2a6dfd] bg-[#2a6dfd]/10 px-4 py-2 text-sm font-semibold text-[#2a6dfd] hover:bg-[#2a6dfd]/20 hover:text-[#1f5ae0] transition-all"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M6 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.828A2 2 0 0 0 15.414 7L13 4.586A2 2 0 0 0 11.586 4H6Z" />
              </svg>
              View my Resume (PDF)
            </a>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="pb-24 snap-start scroll-mt-24 md:scroll-mt-28">
          <div className="rounded-xl border border-black/10 bg-white/80 backdrop-blur-md p-6 md:p-8 shadow-sm">
            <h3 className="text-2xl font-bold mb-3 text-slate-900">Projects</h3>
            <p className="text-slate-700 mb-4">A few things I’ve built recently.</p>

            <div className="relative">
              {/* Edge fades */}
              <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
              <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />

              {/* Track */}
              <div
                ref={carouselTrackRef}
                role="region"
                aria-label="Projects carousel"
                tabIndex={0}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-6 px-1 py-3 scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {/* CARD 1 */}
                <article data-card className="group relative snap-center shrink-0 w-[88%] sm:w-[64%] md:w-[52%] lg:w-[44%] xl:w-[38%] 2xl:w-[32%] rounded-2xl border border-black/10 bg-white/80 backdrop-blur shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-transform duration-300 will-change-transform hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_16px_44px_rgba(0,0,0,0.08)]">
                  <a href="#" className="block">
                    <figure className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
                      <img src="/portfoliopage.png" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </figure>
                    <div className="p-5 md:p-6">
                      <h4 className="text-lg font-semibold tracking-tight">Portfolio Page</h4>
                      <p className="mt-2 text-sm text-black/70">My portfolio page. Tech: Next.js, Tailwind.</p>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-black/5 px-3 py-1 text-xs">Next.js</span>
                        <span className="rounded-full bg-black/5 px-3 py-1 text-xs">Tailwind</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveProject(0)}
                        className="mt-5 inline-flex items-center gap-2 text-[#2a6dfd] font-semibold hover:underline"
                      >
                        <span>View details</span>
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10.293 3.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 1 1-1.414-1.414L14.586 11H3a1 1 0 1 1 0-2h11.586l-4.293-4.293a1 1 0 0 1 0-1.414Z"/></svg>
                      </button>
                    </div>
                  </a>
                </article>

                {/* CARD 2 */}
                <article data-card className="group relative snap-center shrink-0 w-[88%] sm:w-[64%] md:w-[52%] lg:w-[44%] xl:w-[38%] 2xl:w-[32%] rounded-2xl border border-black/10 bg-white/80 backdrop-blur shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-transform duration-300 will-change-transform hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_16px_44px_rgba(0,0,0,0.08)]">
                  <a href="#" className="block">
                    <figure className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
                      <img src="/" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </figure>
                    <div className="p-5 md:p-6">
                      <h4 className="text-lg font-semibold tracking-tight">Coming soon!</h4>
                      <button
                        type="button"
                        onClick={() => setActiveProject(1)}
                        className="mt-5 inline-flex items-center gap-2 text-[#2a6dfd] font-semibold hover:underline"
                      >
                        <span>View details</span>
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10.293 3.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 1 1-1.414-1.414L14.586 11H3a1 1 0 1 1 0-2h11.586l-4.293-4.293a1 1 0 0 1 0-1.414Z"/></svg>
                      </button>
                    </div>
                  </a>
                </article>

                {/* CARD 3 */}
                <article data-card className="group relative snap-center shrink-0 w-[88%] sm:w-[64%] md:w-[52%] lg:w-[44%] xl:w-[38%] 2xl:w-[32%] rounded-2xl border border-black/10 bg-white/80 backdrop-blur shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-transform duration-300 will-change-transform hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_16px_44px_rgba(0,0,0,0.08)]">
                  <a href="#" className="block">
                    <figure className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
                      <img src="/" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </figure>
                    <div className="p-5 md:p-6">
                      <h4 className="text-lg font-semibold tracking-tight">Coming soon!</h4>
                      <button
                        type="button"
                        onClick={() => setActiveProject(2)}
                        className="mt-5 inline-flex items-center gap-2 text-[#2a6dfd] font-semibold hover:underline"
                      >
                        <span>View details</span>
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10.293 3.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 1 1-1.414-1.414L14.586 11H3a1 1 0 1 1 0-2h11.586l-4.293-4.293a1 1 0 0 1 0-1.414Z"/></svg>
                      </button>
                    </div>
                  </a>
                </article>
              </div>

              {/* Controls */}
              <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-4">
                <button
                  type="button"
                  onClick={() => handleProjectScroll('left')}
                  className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 backdrop-blur shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-[#2a6dfd]"
                  aria-label="Previous"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M12.707 15.707a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 0-1.414l5-5a1 1 0 1 1 1.414 1.414L8.414 10l4.293 4.293a1 1 0 0 1 0 1.414Z"/></svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleProjectScroll('right')}
                  className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 backdrop-blur shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-[#2a6dfd]"
                  aria-label="Next"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M7.293 4.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 1 1-1.414-1.414L11.586 10 7.293 5.707a1 1 0 0 1 0-1.414Z"/></svg>
                </button>
              </div>

              {/* Dots */}

            </div>
          </div>
        </section>
      </main>

      {activeProject !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={(e) => { if (e.currentTarget === e.target) setActiveProject(null); }}>
          <div role="dialog" aria-modal="true" className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-3 right-3 rounded-full p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Close"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M6.225 4.811a1 1 0 0 0-1.414 1.414L8.586 10l-3.775 3.775a1 1 0 1 0 1.414 1.414L10 11.414l3.775 3.775a1 1 0 0 0 1.414-1.414L11.414 10l3.775-3.775a1 1 0 0 0-1.414-1.414L10 8.586 6.225 4.811Z"/></svg>
            </button>

            {activeProject === 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900">Portfolio Page</h3>
                <figure className="mt-4 overflow-hidden rounded-xl border border-black/10">
                  <img src="/portfoliopage.png" className="w-full h-64 object-cover" />
                </figure>
                <p className="mt-4 text-slate-700">
                  
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href="https://github.com/jasongregorius/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-black/10 transition"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.74c-2.78.6-3.37-1.17-3.37-1.17a2.65 2.65 0 0 0-1.1-1.46c-.9-.61.07-.6.07-.6a2.1 2.1 0 0 1 1.53 1.03 2.12 2.12 0 0 0 2.9.83 2.13 2.13 0 0 1 .63-1.32c-2.22-.26-4.56-1.11-4.56-4.93A3.86 3.86 0 0 1 6.86 7s.84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0C16.52 6.73 17.36 7 17.36 7a3.86 3.86 0 0 1 .11 2.85c0 3.83-2.34 4.66-4.57 4.91a2.38 2.38 0 0 1 .68 1.84v2.72c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>
                    GitHub
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 rounded-full border border-[#2a6dfd] bg-[#2a6dfd]/10 px-4 py-2 text-sm font-semibold text-[#2a6dfd] hover:bg-[#2a6dfd]/20 transition"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M3 10a1 1 0 0 1 1-1h8.586L9.293 5.707A1 1 0 0 1 10.707 4.293l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 1 1-1.414-1.414L12.586 11H4a1 1 0 0 1-1-1Z"/></svg>
                    Live demo
                  </a>
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-[#2a6dfd] text-white">
        <div className="mx-auto max-w-6xl px-6 py-4 text-center text-base">
          Gregorius Jason, 2025
        </div>
      </footer>
    </div>
  );
}