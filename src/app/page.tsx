"use client";

import { useState, useEffect, useRef } from "react";

// Types
type Point = { x: number; y: number };

// The Confetti Component!
const Confetti = () => {
    return (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
            {[...Array(120)].map((_, i) => {
                // Fire half from the left bottom corner, half from the right
                const isLeft = i % 2 === 0;

                // Horizontal flight distance
                const drift = 10 + Math.random() * 70;
                const tx = isLeft ? `${drift}vw` : `-${drift}vw`;

                const animDuration = 2 + Math.random() * 1.5;
                const animDelay = Math.random() * 0.4;

                const colors = [
                    'bg-rose-400', 'bg-pink-300', 'bg-orange-300',
                    'bg-amber-200', 'bg-red-300', 'bg-fuchsia-300', 'bg-white'
                ];
                const color = colors[Math.floor(Math.random() * colors.length)];
                const shape = Math.random() > 0.5 ? 'rounded-full' : 'rounded-sm';

                return (
                    <div
                        key={i}
                        className={`absolute bottom-[-5%] ${isLeft ? 'left-[-5%]' : 'right-[-5%]'} w-3 h-3 md:w-4 md:h-4 ${color} ${shape} animate-explode origin-center`}
                        style={{
                            '--tx': tx,
                            '--dur': `${animDuration}s`,
                            animationDelay: `${animDelay}s`,
                        } as React.CSSProperties}
                    />
                );
            })}
        </div>
    );
};

export default function BirthdayPage() {
    const [started, setStarted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // Audio State
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);


    const images = [
        "/images/5a217d47563f3526f6738fa1e28c8519.jpg",
        "/images/IMG-20241104-WA0025.jpg",
        "/images/IMG-20241210-WA0041.jpg",
        "/images/IMG-20250929-WA0170.jpg",
        "/images/IMG-20251006-WA0046.jpg",
        "/images/IMG-20251006-WA0049.jpg",
        "/images/IMG-20251118-WA0015.jpg",
        "/images/IMG-20251118-WA0016.jpg",
        "/images/IMG-20251130-WA0058.jpg",
        "/images/IMG-20251130-WA0074.jpg",
        "/images/IMG-20251130-WA0075.jpg",
        "/images/IMG-20251205-WA0001.jpg",
        "/images/IMG-20251205-WA0004.jpg",
        "/images/IMG-20260126-WA0048.jpg",
        "/images/IMG-20260207-WA0009.jpg",
        "/images/IMG20251021075330.jpg",
        "/images/IMG20251021075415.jpg",
        "/images/IMG_20240629_211605137.jpg",
        "/images/IMG_20240707_154028458.jpg",
        "/images/IMG_20241006_020538307.jpg",
        "/images/IMG_20241026_135853435.jpg",
        "/images/IMG_20241103_141726607.jpg",
        "/images/IMG_20241205_141142088.jpg",
        "/images/IMG_20241205_141501429.jpg",
        "/images/IMG_20241205_141659258.jpg",
        "/images/IMG_20241215_121345211.jpg",
        "/images/IMG_20250115_183305660.jpg",
        "/images/IMG_20250202_151354735.jpg",
        "/images/IMG_20250314_220133849.jpg",
        "/images/IMG_20250928_005224760.jpg",
        "/images/IMG_20250928_232858389.jpg",
        "/images/IMG_20250928_233041980.jpg",
        "/images/IMG_20250928_233216576.jpg",
        "/images/IMG_20250930_004656363.jpg",
        "/images/IMG_20250930_004732269.jpg",
        "/images/IMG_20251021_112530411.jpg",
        "/images/IMG_20251021_134213841.jpg",
        "/images/IMG_20260115_160433563.jpg",
        "/images/IMG_20260115_183202146.jpg",
        "/images/IMG_20260115_185145153.jpg",
        "/images/Screenshot_20241106-221359.png"
    ];

    // Coverflow State
    const [activeIndex, setActiveIndex] = useState(0);
    const [dragStart, setDragStart] = useState<number | null>(null);
    const [dragOffset, setDragOffset] = useState<number>(0);
    const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });

    // Lightbox & Dynamic view state
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const isDraggingRef = useRef(false);

    const numImages = images.length;

    // Fallback if device isn't touched (desktop parallax)
    useEffect(() => {
        if (typeof window === "undefined") return;
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const nextImage = () => setActiveIndex((i) => Math.min(i + 1, numImages - 1));
    const prevImage = () => setActiveIndex((i) => Math.max(i - 1, 0)); // keep max boundary positive

    const handlePointerDown = (e: React.PointerEvent) => {
        setDragStart(e.clientX);
        isDraggingRef.current = false;
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (dragStart === null) return;
        const diff = e.clientX - dragStart;
        if (Math.abs(diff) > 5) {
            isDraggingRef.current = true;
        }
        // Negative diff means drag left -> next image -> index increases
        setDragOffset(-(diff / 130));
    };

    const handlePointerUp = () => {
        if (dragStart === null) return;

        let nextIndex = activeIndex + Math.round(dragOffset);
        if (nextIndex < 0) nextIndex = 0;
        if (nextIndex >= numImages) nextIndex = numImages - 1;

        setActiveIndex(nextIndex);
        setDragStart(null);
        setDragOffset(0);
    };

    const handleOpenGift = () => {
        setShowConfetti(true);
        setStarted(true);

        if (audioRef.current) {
            audioRef.current.volume = 0.4;
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.log("Audio play blocked by browser:", e));
        }

        setTimeout(() => setShowConfetti(false), 6000);
    };

    return (
        <div
            className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-50 via-rose-50 to-white text-stone-800 font-sans selection:bg-rose-200"
        >

            {showConfetti && <Confetti />}

            {/* Hidden Audio Element */}
            <audio ref={audioRef} src="/music.mp3" loop />

            {/* Light Immersive Floating Particles */}
            <div className="absolute inset-0 top-[100%] z-0 overflow-visible pointer-events-none opacity-60">
                {[...Array(35)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-particle absolute animate-float-complex opacity-0"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${25 + Math.random() * 25}s`,
                            animationDelay: `-${Math.random() * 20}s`,
                            filter: `blur(${Math.random() * 1.5}px)`,
                            transform: `scale(${0.4 + Math.random() * 0.8})`,
                            fontSize: `${1 + Math.random() * 1.5}rem`,
                        }}
                    >
                        {i % 4 === 0 ? "🤍" : i % 3 === 0 ? "🕊️" : i % 2 === 0 ? "🌸" : "✨"}
                    </div>
                ))}
            </div>

            {(!started) ? (
                // Elegant Intro Screen
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-white/30 backdrop-blur-xl transition-opacity duration-1000">
                    <div
                        className="group relative cursor-pointer w-full max-w-sm"
                        onClick={handleOpenGift}
                    >
                        {/* Soft glowing pastel shadow behind the button */}
                        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-rose-200 via-pink-200 to-red-100 opacity-60 blur-xl transition-all duration-1000 group-hover:opacity-100 group-hover:duration-200 animate-pulse"></div>

                        <button className="relative w-full flex flex-col items-center gap-5 rounded-2xl bg-white/80 border border-white px-4 py-12 transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-pink-100/50 overflow-hidden">
                            <span className="text-6xl drop-shadow-sm z-10 transition-transform group-hover:-translate-y-1">🎁</span>
                            <span className="text-xl md:text-2xl font-semibold tracking-wide text-center text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500 z-10 leading-snug">
                                Tap to Unlock Your Present
                            </span>
                        </button>
                    </div>
                </div>
            ) : (
                // Main Interactive 3D Experience 
                <div
                    className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8 overflow-hidden touch-none"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    style={{ cursor: dragStart !== null ? 'grabbing' : 'grab' }}
                >

                    {/* Greeting */}
                    <div
                        className="text-center absolute top-12 left-0 right-0 z-20 pointer-events-none transition-transform duration-700 ease-out"
                        style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }}
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-2 text-stone-700 drop-shadow-sm">
                            Happy Birthday, <br className="md:hidden" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500 font-serif italic pr-2 font-medium">
                                My Beautiful
                            </span>
                        </h1>
                        <p className="text-stone-500 font-handwriting text-2xl md:text-3xl mt-4 opacity-90 tracking-wide px-4 drop-shadow-sm scale-110">
                            "Every picture tells a story, but my favorite story is the one I'm writing with you."
                        </p>
                    </div>

                    {/* Wrapper to perfectly center the Coverflow vertically */}
                    <div className="flex-1 w-full flex items-center justify-center pt-28 pb-8">
                        {/* Coverflow Stage */}
                        <div
                            className="relative w-full max-w-[240px] sm:max-w-[280px] aspect-[3/4] select-none mx-auto"
                            style={{ perspective: '1200px' }}
                        >
                            {images.map((src, idx) => {
                                const currentIndex = activeIndex + dragOffset;
                                const diff = idx - currentIndex;
                                const absDiff = Math.abs(diff);

                                if (absDiff > 4) return null; // Optimization: only render visible

                                // Coverflow math properties
                                const translateX = diff * 50;
                                const translateZ = absDiff * -120;
                                const rotateY = diff * -35;
                                const opacity = Math.max(1 - (absDiff * 0.25), 0);
                                const zIndex = 100 - Math.round(absDiff * 10);

                                return (
                                    <div
                                        key={idx}
                                        className={`absolute inset-0 bg-white p-3 md:p-4 pb-14 md:pb-16 rounded-sm shadow-[0_15px_35px_rgba(0,0,0,0.08)] border border-neutral-100 cursor-pointer cursor-grab active:cursor-grabbing hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] ${dragStart !== null ? 'transition-none' : 'transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]'}`}
                                        style={{
                                            transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
                                            zIndex,
                                            opacity,
                                        }}
                                        onClick={(e) => {
                                            if (isDraggingRef.current) return;
                                            // Bring card to front if it isn't centered
                                            if (Math.abs(diff) > 0.1) {
                                                setActiveIndex(idx);
                                                return;
                                            }
                                            setActiveImage(src);
                                        }}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={src}
                                            alt={`Memory ${idx + 1}`}
                                            className="w-full h-full object-cover rounded-sm pointer-events-none shadow-inner bg-stone-100"
                                            draggable={false}
                                        />

                                        {/* Handwritten Caption */}
                                        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none flex justify-center items-center">
                                            <p className="text-stone-700 font-handwriting text-2xl md:text-3xl font-medium opacity-90 tracking-wide">
                                                Memory {idx + 1}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-12 z-20 pb-8 md:pb-12 mt-auto">
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="p-5 rounded-full bg-white/80 border border-pink-100 text-rose-400 hover:bg-white hover:border-pink-300 hover:scale-110 active:scale-95 shadow-lg shadow-pink-100/50 backdrop-blur-md transition-all duration-300"
                            aria-label="Previous image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="p-5 rounded-full bg-white/80 border border-pink-100 text-rose-400 hover:bg-white hover:border-pink-300 hover:scale-110 active:scale-95 shadow-lg shadow-pink-100/50 backdrop-blur-md transition-all duration-300"
                            aria-label="Next image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                    </div>

                </div>
            )}

            {/* Fullscreen Lightbox Overlay */}
            {activeImage && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-xl animate-[fade-in_0.3s_ease-out_forwards]"
                    onClick={() => setActiveImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 p-3 rounded-full backdrop-blur-md transition-all z-50 hover:scale-110 active:scale-95"
                        onClick={(e) => { e.stopPropagation(); setActiveImage(null); }}
                        aria-label="Close fullscreen"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>

                    <div className="relative w-full max-w-5xl h-full max-h-[85vh] flex items-center justify-center p-2 opacity-0 animate-[scale-up_0.4s_cubic-bezier(0.16,1,0.3,1)_0.1s_forwards]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={activeImage}
                            alt="Full Screen Memory"
                            className="max-w-full max-h-full object-contain rounded-md shadow-2xl drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                            draggable={false}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
