import { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import FlowingMenu from './FlowingMenu';
import CardSwap, { Card } from './CardSwap/CardSwap';

const DEFAULT_MONTH_ID = '2026-01';
const STORAGE_KEY = 'memories-active-month';
const MEMORIES_UNLOCK_STORAGE_KEY = 'memories-module-unlocked';
// Change this value to update the Memories lock passcode.
const MEMORIES_LOCK_CODE = '101224';
const MONTH_MEDIA_ROOT = 'memories/months';
const IMAGE_EXTENSIONS = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'];
const VIDEO_EXTENSIONS = [
  'mp4', 'MP4', 'webm', 'WEBM', 'mov', 'MOV',
  // Handles files like "vid-3.MP4.mp4" that exist in the media folders.
  'mp4.mp4', 'MP4.mp4', 'mov.mp4', 'MOV.mp4',
];
const IMAGE_SLOTS = Array.from({ length: 24 }, (_, idx) => idx + 1);
const VIDEO_SLOTS = Array.from({ length: 12 }, (_, idx) => idx + 1);
const assetCache = new Map();
const MONTH_FMT = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

// Personal notes for each month — add or edit messages here.
const MONTH_NOTES = {
  '2024-10': 'It all began with a late night ride and conversations that felt like therapy for the soul. We started as friends \u2014 just two people talking under city lights, not knowing that every laugh and every honest word was quietly pulling us closer. Feelings were already blooming; we just hadn\u2019t named them yet.',
  '2024-11': 'Then one random night, a certain someone finally gathered the courage to confess \u2014 and the other? Too stunned to speak\u2026 but eventually whispered her feelings right back. Happiest birthday to you, my love! I got to meet your world at university, and so began our VERY cuddly chapter. Araw ng patay, pero ako? Eto, nagsisimulang maging patay na patay sa\u2019yo~ (pagbigyan, okay?) Also the month I met Tita! So many iconic firsts packed into one month \u2014 the literal PEAK of how our love story began.',
  '2024-12': 'Our story kept writing itself, even through the first bump in the road. We hit our first real challenge this month \u2014 but look at us now, still here, still choosing each other. This month is proof of how far we\u2019ve come and how much we\u2019ve grown, together. Every rough patch only made our roots deeper. The very month I asked you out, if I can court you~',
  '2025-01': 'Back in Manila and every day felt like an adventure made for two. Random dates that turned into core memories, pamper sessions where we took care of each other, and our very first Dangwa trip \u2014 making flowers for each other like the hopeless romantics we are. A new year, but the same butterflies.',
  '2025-02': 'Our first steak date \u2014 because love deserves to be celebrated over good food. You watched Moana and I swear her little sister is literally you (don\u2019t argue with me on this). Then came the moment I introduced you to Valorant\u2026 and a gamer wife was born. We embraced every bit of our chaotic energy together, and yes \u2014 I proudly became your very first lab rat for phlebotomy practice. The things I do for love, literally.',
  '2025-03': 'Still getting poked by you for phlebotomy practice \u2014 have mercy on my arms, please. But I officially signed up as your personal \u201Cassler,\u201D and I wouldn\u2019t trade the job for anything. Let me carry everything for you, my princess~ Meanwhile, you\u2019ve started rage-quitting in Valorant and honestly? You\u2019re becoming my adorable mini me. Also: LOTS of cute TikToks together \u2014 our content era was in full bloom.',
  '2025-04': 'Four months in and our love didn\u2019t just survive \u2014 it thrived. No grand gestures needed, just the quiet certainty that we\u2019re each other\u2019s person. Every morning text, every late-night call, every comfortable silence proved that what we have is built to last. Still falling for you, and I don\u2019t plan on stopping.',
  '2025-05': 'I shared a steak dinner with your family and every moment felt so warm and full of love. Laughing with them, posing for family pictures, feeling their warmth wrap around me like I\u2019ve always been there\u2026 you gave me something I\u2019ll never forget. You didn\u2019t just let me into your life, love \u2014 you let me into your home, and my heart has never felt so full.',
  '2025-06': 'My birthday month \u2014 but the best gift wasn\u2019t wrapped. It was you, being there, making me feel so loved. This was also the month I first visited your home, and your family even let me sleep over on day one. Waking up knowing we were in the same room felt like the most peaceful morning of my life. You make every moment feel like a celebration, and I\u2019m so grateful my heart found yours. I love you more than any birthday wish could ever say.',
  '2025-07': 'Our love only grew stronger and bolder. More adventures, more spontaneous plans, more of those \u201Clet\u2019s just go\u201D moments that turn into the best memories. Every new experience with you feels like unwrapping a gift I didn\u2019t know I needed. Here\u2019s to falling deeper with every chapter we write together.',
  '2025-08': 'Same love, same energy, same butterflies from the very beginning \u2014 but somehow even better. We\u2019re still that cuddly, random, chaotic couple who can\u2019t keep their hands off each other. Nothing about us has faded; if anything, the warmth only burns brighter. You\u2019re my favorite constant in a world that never stops changing.',
  '2025-09': 'Before graduation, I flew to Boracay with my coworkers \u2014 and you were so nervous the whole time, worrying that something might happen to me. Even from miles away, you never stopped caring, never stopped checking in. That\u2019s how I know your love is real. Then came graduation day, and I couldn\u2019t have made it without you by my side through every late night and stressful week. The munchies gift, our graduation pictures, your smile next to me in my toga \u2014 I carry all of it in my heart. Thank you for believing in me, love. You are my greatest blessing.',
  '2025-10': 'Our goofy era reached new heights this month \u2014 and then a tiny furball named Skyler walked into our lives and made everything even softer. A kitten chose us, just like we chose each other. Between the chaotic energy and the little paws padding around, our little world started feeling even more like a home.',
  '2025-11': 'Happy birthday to the sweetest soul I know. Your special day was everything \u2014 soft, warm, and full of love, just like you. We played Valorant together, laughed at every round, and enjoyed every single moment side by side. With Skyler purring beside us, it felt like our own little paradise. I didn\u2019t need anything fancy \u2014 just you, your smile, and the sound of your laugh. Every day with you feels like a gift, but today was extra special. I love celebrating you, my love.',
  '2025-12': 'Baguio with you was everything I didn\u2019t know my heart was asking for. The cold air, the pine trees, your hand in mine \u2014 it all felt like a dream I never wanted to wake up from. Somewhere between the foggy mornings and warm coffee, I realized that happiness isn\u2019t a place \u2014 it\u2019s wherever you are. Our most memorable trip yet, and we\u2019re just getting started.',
  '2026-01': 'A brand new year, but the same love that started it all \u2014 only deeper, only stronger. Time didn\u2019t weaken us; it refined us. Every month behind us is proof that what we have is rare and real. Here\u2019s to another year of choosing each other, of growing together, and of writing a love story that only gets more beautiful with every page.',
};

function isValidMonthId(value) {
  return /^\d{4}-\d{2}$/.test(value);
}

function getMonthFromHash(hashValue) {
  const match = hashValue.match(/^#memories-(\d{4}-\d{2})$/);
  return match ? match[1] : null;
}

function resolveInitialState(validMonthIds) {
  const searchMonth = new URLSearchParams(window.location.search).get('memories');
  if (searchMonth && validMonthIds.has(searchMonth)) {
    return { monthId: searchMonth, viewMode: 'detail' };
  }

  const hashMonth = getMonthFromHash(window.location.hash);
  if (hashMonth && validMonthIds.has(hashMonth)) {
    return { monthId: hashMonth, viewMode: 'detail' };
  }

  const savedMonth = window.localStorage.getItem(STORAGE_KEY);
  if (savedMonth && validMonthIds.has(savedMonth)) {
    return { monthId: savedMonth, viewMode: 'menu' };
  }

  return { monthId: DEFAULT_MONTH_ID, viewMode: 'menu' };
}

function buildMonthItems() {
  const basePath = import.meta.env.BASE_URL;
  const items = [];
  const start = new Date(Date.UTC(2024, 9, 1)); // Oct 2024
  const end = new Date(Date.UTC(2026, 0, 1)); // Jan 2026

  for (let cursor = new Date(start); cursor <= end; cursor.setUTCMonth(cursor.getUTCMonth() + 1)) {
    const year = cursor.getUTCFullYear();
    const month = String(cursor.getUTCMonth() + 1).padStart(2, '0');
    const monthId = `${year}-${month}`;
    const dateLabel = MONTH_FMT.format(cursor);

    items.push({
      monthId,
      tabId: `memories-${monthId}`,
      text: dateLabel,
      link: `#memories-${monthId}`,
      // Placeholder — resolved asynchronously by useResolvedMonthImages
      image: `${basePath}${MONTH_MEDIA_ROOT}/${monthId}/image-1.jpg`,
      dateLabel,
    });
  }

  return items;
}

// Resolve the correct image extension for each month's preview thumbnail.
// Files may be .jpg, .JPG, .jpeg, .png, .PNG, .webp etc., so we probe
// for the first match using the same findFirstAsset helper.
function useResolvedMonthImages(monthItems) {
  const [resolved, setResolved] = useState(monthItems);

  useEffect(() => {
    let cancelled = false;
    const basePath = import.meta.env.BASE_URL;

    async function resolve() {
      const updated = await Promise.all(
        monthItems.map(async (item) => {
          const baseUrl = `${basePath}${MONTH_MEDIA_ROOT}/${item.monthId}/image-1`;
          const found = await findFirstAsset(baseUrl, IMAGE_EXTENSIONS);
          if (cancelled) return item;
          return found ? { ...item, image: found } : item;
        })
      );
      if (!cancelled) setResolved(updated);
    }

    resolve();
    return () => { cancelled = true; };
  }, [monthItems]);

  return resolved;
}

function getFlowMenuScrollbarConfig() {
  return {
    size: 16,
    radius: 999,
    gap: 2,
    trackColor: 'rgba(20, 20, 24, 0.5)',
    thumbColor: 'rgba(183, 110, 121, 0.72)',
    thumbHoverColor: 'rgba(212, 165, 172, 0.95)',
  };
}

const VALID_MEDIA_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/webp',
  'video/mp4', 'video/webm', 'video/quicktime',
]);

async function assetExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    if (!response.ok) {
      if (response.status === 405) {
        const fallback = await fetch(url, { method: 'GET', cache: 'no-store' });
        if (!fallback.ok) return false;
        const ct = (fallback.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
        return VALID_MEDIA_TYPES.has(ct);
      }
      return false;
    }
    const ct = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    return VALID_MEDIA_TYPES.has(ct);
  } catch {
    return false;
  }
}

async function findFirstAsset(baseUrl, extensions) {
  if (assetCache.has(baseUrl)) return assetCache.get(baseUrl);

  for (const ext of extensions) {
    const candidate = `${baseUrl}.${ext}`;
    const exists = await assetExists(candidate);
    if (exists) {
      assetCache.set(baseUrl, candidate);
      return candidate;
    }
  }
  assetCache.set(baseUrl, null);
  return null;
}

function MemoryCardMedia({ card }) {
  const [hasError, setHasError] = useState(false);
  const { setIsVideoPlaying } = useApp();

  if (hasError) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-charcoal-lighter to-charcoal flex items-center justify-center">
        <div className="text-center px-5">
          <p className="text-xs uppercase tracking-[0.2em] text-amethyst-light/70">{card.type}</p>
          <p className="mt-2 text-lg text-rose-gold-light/90 font-medium">{card.label}</p>
          <p className="mt-2 text-sm text-amethyst-light/55">Drop media file in the month folder to preview.</p>
        </div>
      </div>
    );
  }

  if (card.type === 'video') {
    return (
      <video
        key={card.src}
        src={card.src}
        className="w-full h-full object-cover"
        controls
        autoPlay={false}
        playsInline
        preload="metadata"
        onPlay={() => setIsVideoPlaying(true)}
        onPause={() => setIsVideoPlaying(false)}
        onEnded={() => setIsVideoPlaying(false)}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <img
      src={card.src}
      alt={card.label}
      className="w-full h-full object-cover"
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}

export default function MemoriesContent() {
  const monthItems = useMemo(() => buildMonthItems(), []);
  const resolvedMonthItems = useResolvedMonthImages(monthItems);
  const validMonthIds = useMemo(() => new Set(monthItems.map((item) => item.monthId)), [monthItems]);
  const initialState = useMemo(() => resolveInitialState(validMonthIds), [validMonthIds]);
  const [isUnlocked, setIsUnlocked] = useState(() => (
    typeof window !== 'undefined' && window.sessionStorage.getItem(MEMORIES_UNLOCK_STORAGE_KEY) === 'true'
  ));
  const [passcodeInput, setPasscodeInput] = useState('');
  const [lockError, setLockError] = useState('');
  const [shakeKey, setShakeKey] = useState(0);

  const [activeMonthId, setActiveMonthId] = useState(initialState.monthId);
  const [viewMode, setViewMode] = useState(initialState.viewMode);
  const [monthCards, setMonthCards] = useState([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [mediaFilter, setMediaFilter] = useState('all');
  const cardSwapRef = useRef(null);
  const flowMenuScrollbar = useMemo(() => getFlowMenuScrollbarConfig(), []);

  const basePath = import.meta.env.BASE_URL;

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, activeMonthId);
  }, [activeMonthId]);

  useEffect(() => {
    const targetHash = viewMode === 'detail' ? `#memories-${activeMonthId}` : '#memories';
    if (window.location.hash !== targetHash) {
      const url = new URL(window.location.href);
      url.hash = targetHash;
      window.history.replaceState(null, '', url.toString());
    }
  }, [viewMode, activeMonthId]);

  useEffect(() => {
    const onHashChange = () => {
      const hashMonth = getMonthFromHash(window.location.hash);
      if (hashMonth && validMonthIds.has(hashMonth)) {
        setActiveMonthId(hashMonth);
        setViewMode('detail');
        return;
      }

      if (window.location.hash === '#memories' || window.location.hash === '') {
        setViewMode('menu');
      }
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [validMonthIds]);

  useEffect(() => {
    if (viewMode !== 'detail' || !isValidMonthId(activeMonthId)) return;

    let isCancelled = false;

    const loadMonthCards = async () => {
      setIsLoadingCards(true);
      setMonthCards([]);

      const monthRoot = `${basePath}${MONTH_MEDIA_ROOT}/${activeMonthId}`;

      // Scan sequentially and stop after 2 consecutive misses (handles gaps)
      const scanSlots = async (slots, prefix, type, extensions) => {
        const results = [];
        let misses = 0;
        for (const index of slots) {
          if (isCancelled) break;
          const src = await findFirstAsset(`${monthRoot}/${prefix}-${index}`, extensions);
          if (src) {
            misses = 0;
            results.push({
              id: `${activeMonthId}-${prefix}-${index}`,
              type,
              src,
              label: `${prefix}-${index}`,
            });
          } else {
            misses += 1;
            if (misses >= 2) break;
          }
        }
        return results;
      };

      const [images, videos] = await Promise.all([
        scanSlots(IMAGE_SLOTS, 'image', 'image', IMAGE_EXTENSIONS),
        scanSlots(VIDEO_SLOTS, 'vid', 'video', VIDEO_EXTENSIONS),
      ]);

      if (!isCancelled) {
        setMonthCards([...images, ...videos]);
        setIsLoadingCards(false);
      }
    };

    loadMonthCards();

    return () => {
      isCancelled = true;
    };
  }, [activeMonthId, viewMode, basePath]);

  const activeItem = monthItems.find((item) => item.monthId === activeMonthId) ?? monthItems[monthItems.length - 1];
  const imageCount = monthCards.filter((card) => card.type === 'image').length;
  const videoCount = monthCards.filter((card) => card.type === 'video').length;
  const mediaSummary = `${imageCount} photo${imageCount === 1 ? '' : 's'} | ${videoCount} video${videoCount === 1 ? '' : 's'}`;
  const hasMultipleTypes = imageCount > 0 && videoCount > 0;
  const monthFolderProjectPath = `public/${MONTH_MEDIA_ROOT}/${activeItem.monthId}`;

  const filteredCards = useMemo(() => {
    if (mediaFilter === 'all') return monthCards;
    return monthCards.filter((card) => card.type === mediaFilter);
  }, [monthCards, mediaFilter]);

  useEffect(() => {
    if (!isUnlocked || viewMode !== 'detail' || filteredCards.length < 2) return undefined;

    const onKeyDown = (event) => {
      const tagName = event.target?.tagName;
      if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        cardSwapRef.current?.prev();
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        cardSwapRef.current?.next();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isUnlocked, viewMode, filteredCards.length]);

  const handleSelectMonth = useCallback((monthId) => {
    if (!validMonthIds.has(monthId)) return;
    setActiveMonthId(monthId);
    setMediaFilter('all');
    setViewMode('detail');
  }, [validMonthIds]);

  const { setIsVideoPlaying } = useApp();

  const handleCardChange = useCallback(() => {
    setIsVideoPlaying(false);
  }, [setIsVideoPlaying]);

  const handleBackToMenu = useCallback(() => {
    setIsVideoPlaying(false);
    setViewMode('menu');
  }, [setIsVideoPlaying]);

  const handleUnlockSubmit = useCallback((event) => {
    event.preventDefault();
    if (passcodeInput.trim() !== MEMORIES_LOCK_CODE) {
      setLockError('That\u2019s not right. Try again, my love.');
      setShakeKey((prev) => prev + 1);
      return;
    }

    setIsUnlocked(true);
    setLockError('');
    setPasscodeInput('');
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(MEMORIES_UNLOCK_STORAGE_KEY, 'true');
    }
  }, [passcodeInput]);

  return (
    <div className="min-h-screen p-6 pt-12">
      <div className={`${viewMode === 'detail' ? 'max-w-[1180px]' : 'max-w-6xl'} mx-auto`}>
        <div className="mb-8 text-center">
          <p className="text-amethyst-light/50 text-xs uppercase tracking-[0.28em] mb-2">
            Gallery
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gradient">Our Memories</h2>
          <p className="mt-3 text-rose-gold-light/60 max-w-md mx-auto">
            {viewMode === 'menu'
              ? 'Select a month to relive our story.'
              : 'Select a month to open its card swap gallery.'}
          </p>
          {viewMode === 'menu' && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-px w-12 bg-rose-gold/20" />
              <span className="text-rose-gold/30 text-xs">&#10084;</span>
              <div className="h-px w-12 bg-rose-gold/20" />
            </div>
          )}
        </div>

        {!isUnlocked && (
          <section className="mx-auto w-full max-w-md">
            <div
              key={shakeKey}
              className={`rounded-2xl border border-rose-gold/30 bg-charcoal-light/60 p-6 md:p-8 backdrop-blur-sm ${
                lockError ? 'messages-shake' : ''
              }`}
            >
              {/* Lock icon */}
              <motion.div
                className="text-5xl text-center mb-4"
                animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
              >
                &#128247;
              </motion.div>

              <h3 className="text-xl md:text-2xl font-semibold text-rose-gold-light text-center">
                Sealed Memories
              </h3>
              <p className="mt-2 text-sm text-amethyst-light/65 text-center">
                Enter the passcode to unlock our memories.
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleUnlockSubmit}>
                <label htmlFor="memories-passcode" className="block text-xs uppercase tracking-[0.18em] text-amethyst-light/60">
                  Unlock Code
                </label>
                <input
                  id="memories-passcode"
                  type="password"
                  value={passcodeInput}
                  onChange={(event) => {
                    setPasscodeInput(event.target.value);
                    if (lockError) setLockError('');
                  }}
                  className="w-full rounded-lg border border-rose-gold/35 bg-charcoal-lighter/80 px-4 py-3 text-rose-gold-light text-center text-lg tracking-[0.3em] outline-none transition-colors focus:border-rose-gold placeholder:text-rose-gold-light/30 placeholder:tracking-normal placeholder:text-sm"
                  autoComplete="off"
                  inputMode="numeric"
                  placeholder="Enter code"
                />

                <AnimatePresence>
                  {lockError && (
                    <motion.p
                      className="text-sm text-rose-300 text-center"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {lockError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-rose-gold to-amethyst px-4 py-3 text-white font-medium transition-opacity hover:opacity-95"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Unlock Memories
                </motion.button>
              </form>

              <p className="mt-4 text-xs text-amethyst-light/40 text-center italic">
                Hint: The day our love story began
              </p>
            </div>
          </section>
        )}

        {isUnlocked && viewMode === 'menu' && (
          <section className="glass-strong rounded-2xl border border-rose-gold/20 overflow-hidden h-[82vh] min-h-[560px] max-h-[920px]">
            <FlowingMenu
              items={resolvedMonthItems}
              activeId={activeMonthId}
              onItemSelect={handleSelectMonth}
              scrollbar={flowMenuScrollbar}
            />
          </section>
        )}

        {isUnlocked && viewMode === 'detail' && (
          <section className="min-h-[640px] md:min-h-[700px]">
            <div className="md:grid md:grid-cols-[300px_minmax(0,1fr)] md:gap-12 lg:gap-16 md:items-start">
              <aside className="relative z-30 mb-8 md:mb-0 flex flex-col items-start gap-4 text-left md:sticky md:top-24 memories-reveal">
                <button
                  type="button"
                  onClick={handleBackToMenu}
                  className="group w-fit px-5 py-2.5 rounded-xl border border-rose-gold/45 bg-gradient-to-r from-charcoal-light/85 to-charcoal-lighter/80 text-rose-gold-light/90 shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:border-rose-gold hover:shadow-[0_10px_28px_rgba(183,110,121,0.28)] hover:-translate-y-0.5 transition-all"
                >
                  <span className="inline-flex items-center gap-2 text-sm md:text-base font-medium">
                    <span className="transition-transform group-hover:-translate-x-0.5">{'<'}</span>
                    Back To Months
                  </span>
                </button>

                <div className="text-left max-w-sm">
                  <p className="text-amethyst-light/70 text-xs uppercase tracking-[0.22em]">Memories Gallery</p>
                  <h3 className="text-2xl md:text-3xl font-semibold text-rose-gold-light mt-2">
                    {activeItem.dateLabel}
                  </h3>
                  <p className="mt-2 text-sm text-rose-gold-light/65">{mediaSummary}</p>

                  {hasMultipleTypes && (
                    <div className="mt-3 flex items-center gap-1.5">
                      {[
                        { key: 'all', label: 'All' },
                        { key: 'image', label: 'Photos' },
                        { key: 'video', label: 'Videos' },
                      ].map(({ key, label }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setMediaFilter(key)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            mediaFilter === key
                              ? 'bg-gradient-to-r from-rose-gold to-amethyst text-white shadow-[0_4px_12px_rgba(183,110,121,0.3)]'
                              : 'border border-rose-gold/30 text-rose-gold-light/70 hover:border-rose-gold/50 hover:text-rose-gold-light/90'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="mt-3 text-xs text-amethyst-light/55">
                    Use arrow keys or buttons to browse the stack.
                  </p>
                </div>

                {MONTH_NOTES[activeItem.monthId] && (
                  <div className="mt-4 max-w-sm rounded-2xl border border-rose-gold/25 bg-charcoal-light/50 backdrop-blur-sm px-5 py-5">
                    <p className="text-amethyst-light/55 text-xs uppercase tracking-[0.22em] mb-3">Note</p>
                    <p className="text-base leading-[1.75] text-rose-gold-light/85 italic">
                      &ldquo;{MONTH_NOTES[activeItem.monthId]}&rdquo;
                    </p>
                  </div>
                )}
              </aside>

              <div className="min-w-0">
                {isLoadingCards && (
                  <div className="py-10 text-center text-rose-gold-light/70">
                    Loading month media...
                  </div>
                )}

                {!isLoadingCards && filteredCards.length === 0 && (
                  <div className="rounded-2xl border border-rose-gold/20 bg-charcoal-light/45 px-6 py-10 text-center md:text-left memories-reveal">
                    <p className="text-rose-gold-light/80 text-lg">No media detected for this month yet.</p>
                    <p className="mt-3 text-amethyst-light/60 text-sm">
                      Add files to {monthFolderProjectPath} and keep the naming as image-1, image-2, vid-1, vid-2, etc.
                    </p>
                  </div>
                )}

                {!isLoadingCards && filteredCards.length > 0 && (
                  <div className="relative z-10 h-[590px] sm:h-[640px] lg:h-[730px] overflow-visible memories-reveal">
                    <div className="pointer-events-none absolute inset-0">
                      <div
                        className="absolute inset-x-[6%] top-[8%] bottom-[10%] rounded-[32px]"
                        style={{
                          background: 'radial-gradient(circle at 45% 48%, rgba(183,110,121,0.16), rgba(153,102,204,0.11) 38%, rgba(10,10,12,0) 74%)',
                        }}
                      />
                      <div className="absolute inset-x-[8%] top-[12%] bottom-[12%] rounded-[28px] border border-rose-gold/16" />
                      <div className="memories-stage-grain absolute inset-x-[8%] top-[12%] bottom-[12%] rounded-[28px]" />
                    </div>
                    <CardSwap
                      ref={cardSwapRef}
                      width={380}
                      height={520}
                      cardDistance={30}
                      verticalDistance={30}
                      onCardChange={handleCardChange}
                      skewAmount={5}
                      easing="elastic"
                    >
                      {filteredCards.map((card) => (
                        <Card key={card.id} className="overflow-hidden cursor-pointer">
                          <MemoryCardMedia card={card} />
                        </Card>
                      ))}
                    </CardSwap>

                    <div className="absolute z-30 left-1/2 bottom-5 -translate-x-1/2 flex items-center gap-2.5 rounded-2xl border border-rose-gold/25 bg-charcoal-light/70 backdrop-blur-md p-2 shadow-[0_14px_34px_rgba(0,0,0,0.45)]">
                      <button
                        type="button"
                        onClick={() => cardSwapRef.current?.prev()}
                        className="px-4 py-2.5 rounded-lg border border-rose-gold/35 text-rose-gold-light/90 hover:bg-rose-gold/10 transition-colors"
                      >
                        {'<- Previous'}
                      </button>
                      <button
                        type="button"
                        onClick={() => cardSwapRef.current?.next()}
                        className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-rose-gold to-amethyst text-white hover:opacity-95 transition-opacity"
                      >
                        {'Next ->'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
