'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, ExternalLink,
  Leaf, MapPin, MoonStar, Waves, Wind, X, Maximize2
} from 'lucide-react';

const airbnbUrl = 'https://www.airbnb.com/rooms/36961615';
const camperUrl = 'https://www.airbnb.com/rooms/1094948156007516926';

const photos = [
  { src: '/images/pinarevleri/pool-mountain.webp', alt: 'Pınar Evleri swimming pool, lawn and forested mountain landscape', label: 'Pool & forest' },
  { src: '/images/pinarevleri/garden-pool-wide.webp', alt: 'Wide garden view across the Pınar Evleri pool and mature trees', label: 'Garden room' },
  { src: '/images/pinarevleri/pool-garden.webp', alt: 'Pınar Evleri pool framed by lawn and trees', label: 'Open-air living' },
  { src: '/images/pinarevleri/pool-sunset.webp', alt: 'Pınar Evleri swimming pool in warm golden-hour light', label: 'Golden hour' },
  { src: '/images/pinarevleri/pool-villa.webp', alt: 'Pool and villa garden at Pınar Evleri', label: 'Poolside' },
  { src: '/images/pinarevleri/entrance-garden.webp', alt: 'Stone garden entrance and lush planting at Pınar Evleri', label: 'Garden arrival' },
];

const features = [
  { icon: Leaf, label: 'Forest edge', text: 'A quiet green setting in Çamlı, surrounded by the Gökova landscape.' },
  { icon: Waves, label: 'Pool & sea', text: 'A cared-for pool on site, with the coast approximately 1 km away.' },
  { icon: MoonStar, label: 'Slow living', text: 'Space for yoga, meditation, long breakfasts and unhurried evenings.' },
  { icon: Wind, label: 'Gökova air', text: 'Open-air living close to hiking, İncekum and the region’s kiteboarding corridor.' },
];

const distances = [
  ['SEA', '≈ 1 KM'], ['CLEOPATRA / SEDIR ISLAND', '≈ 2 KM'],
  ['İNCEKUM BEACH', '≈ 4 KM'], ['KITEBOARDING', '≈ 8 KM'],
  ['MARMARİS CENTER', '≈ 15 KM'],
];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export default function PinarEvleriPage() {
  const [pointer, setPointer] = useState({ x: 50, y: 38 });
  const [scrollY, setScrollY] = useState(0);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const year = useMemo(() => new Date().getFullYear(), []);
  const scrolled = scrollY > 40;

  useEffect(() => {
    let ticking = false;
    const onMove = (event: PointerEvent) => {
      setPointer({ x: (event.clientX / window.innerWidth) * 100, y: (event.clientY / window.innerHeight) * 100 });
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { setScrollY(window.scrollY); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = activePhoto === null ? '' : 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePhoto(null);
      if (activePhoto !== null && event.key === 'ArrowRight') setActivePhoto((activePhoto + 1) % photos.length);
      if (activePhoto !== null && event.key === 'ArrowLeft') setActivePhoto((activePhoto - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [activePhoto]);

  const heroShift = clamp(scrollY * 0.08, 0, 72);

  return (
    <main className="site" style={{ '--mx': `${pointer.x}%`, '--my': `${pointer.y}%` } as React.CSSProperties}>
      <div className="noise" />
      <nav className={scrolled ? 'nav navScrolled' : 'nav'}>
        <a href="#top" className="brand" aria-label="Pınar Evleri home">
          <span className="brandMark">P</span><span><b>PINAR EVLERİ</b><small>MARMARİS · ÇAMLI</small></span>
        </a>
        <div className="navLinks">
          <a href="#experience">Experience</a><a href="#gallery">Gallery</a><a href="#location">Location</a>
          <a href={airbnbUrl} target="_blank" rel="noreferrer" className="book">Stay here <ArrowUpRight size={15} /></a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="heroImage" style={{ transform: `translate3d(${(pointer.x - 50) * -0.12}px, ${heroShift}px, 0) scale(1.09)` }}>
          <Image src="/images/pinarevleri/pool-mountain.webp" alt="Pınar Evleri pool and Gökova forest landscape" fill priority sizes="100vw" />
        </div>
        <div className="heroShade" /><div className="heroGrid" /><div className="heroGlow" />
        <div className="heroCopy" style={{ transform: `translate3d(0, ${scrollY * -0.035}px, 0)` }}>
          <div className="eyebrow"><span /> A SMALL RETREAT IN THE GÖKOVA LANDSCAPE</div>
          <h1>Stay close<br />to <em>nature.</em></h1>
          <p>Pınar Evleri is a collection of intimate holiday homes in Çamlı — a quieter side of Marmaris where forest, pool, village life and the sea sit within easy reach.</p>
          <div className="heroActions">
            <a href={airbnbUrl} target="_blank" rel="noreferrer" className="primary">Explore the stay <ArrowUpRight size={18} /></a>
            <a href="#gallery" className="secondary">See the property <ChevronDown size={18} /></a>
          </div>
        </div>
        <button className="heroCard" onClick={() => setActivePhoto(3)} aria-label="Open golden-hour pool photograph">
          <Image src="/images/pinarevleri/pool-sunset.webp" alt="Pınar Evleri pool at golden hour" fill sizes="(max-width: 800px) 55vw, 28vw" />
          <span className="heroCardLabel">GOLDEN HOUR · ÇAMLI <Maximize2 size={14} /></span>
        </button>
        <div className="scrollTag">SCROLL TO WANDER <span /></div>
      </section>

      <section className="manifesto" id="experience">
        <div className="sectionNo">01</div>
        <div className="manifestoText">
          <span className="kicker">THE EXPERIENCE</span>
          <h2>Not a resort.<br /><em>A place to exhale.</em></h2>
          <p>Wake to birds, step into the garden, swim before breakfast, follow the forest edge in the afternoon and come back for a long table under the evening sky. The character is simple: privacy, greenery and room to slow down.</p>
        </div>
        <div className="rings" aria-hidden="true"><i /><i /><i /><i /></div>
      </section>

      <section className="featureGrid">
        {features.map(({ icon: Icon, label, text }, index) => (
          <article className="feature" key={label}>
            <span className="featureNo">0{index + 1}</span><Icon size={24} strokeWidth={1.4} /><h3>{label}</h3><p>{text}</p>
          </article>
        ))}
      </section>

      <section className="gallerySection" id="gallery">
        <div className="galleryIntro">
          <span className="sectionNo">02</span><span className="kicker">ORIGINAL PHOTOGRAPHY</span>
          <h2>The garden is<br /><em>the architecture.</em></h2>
          <p>Six views from the property — the pool, mature planting, lawns and forest edge — are now the visual core of the experience.</p>
        </div>
        <div className="galleryGrid">
          {photos.map((photo, index) => {
            const offset = clamp((scrollY - 980) * (0.012 + index * 0.002), -28, 34);
            return (
              <button
                className={`galleryItem item${index + 1}`}
                key={photo.src}
                onClick={() => setActivePhoto(index)}
                style={{ transform: `translate3d(0, ${offset}px, 0)` }}
                aria-label={`Open ${photo.label} photograph`}
              >
                <Image src={photo.src} alt={photo.alt} fill sizes={index < 2 ? '(max-width: 800px) 100vw, 58vw' : '(max-width: 800px) 100vw, 33vw'} />
                <span className="photoLabel"><b>0{index + 1}</b>{photo.label}<Maximize2 size={14} /></span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="location" id="location">
        <div className="locationIntro">
          <div className="sectionNo">03</div><span className="kicker">LOCATION</span>
          <h2>Çamlı,<br /><em>Marmaris.</em></h2>
          <p>A strategic pocket between the forested Gökova hinterland and Marmaris. Close enough for beaches and town; distant enough to feel genuinely removed from the urban rhythm.</p>
          <a href="https://www.google.com/maps/search/?api=1&query=%C3%87aml%C4%B1%20Marmaris%20Mu%C4%9Fla" target="_blank" rel="noreferrer" className="mapLink">
            Open Çamlı in Google Maps <ExternalLink size={16} />
          </a>
        </div>
        <div className="distancePanel">
          <div className="mapOrb"><MapPin size={28} /><span>PINAR<br />EVLERİ</span></div>
          {distances.map(([place, distance]) => <div className="distanceRow" key={place}><span>{place}</span><b>{distance}</b></div>)}
        </div>
      </section>

      <section className="stay">
        <div className="stayPanel">
          <span className="kicker">STAY</span><h2>Pick your<br /><em>kind of quiet.</em></h2>
          <p>Holiday homes for up to five guests are currently listed alongside a smaller camper option. Follow the booking links for live availability, house rules and current pricing.</p>
          <div className="stayActions">
            <a href={airbnbUrl} target="_blank" rel="noreferrer" className="primary">View homes on Airbnb <ArrowUpRight size={18} /></a>
            <a href={camperUrl} target="_blank" rel="noreferrer" className="secondary dark">View camper <ArrowUpRight size={18} /></a>
          </div>
        </div>
        <button className="stayPhoto" onClick={() => setActivePhoto(5)} aria-label="Open garden arrival photograph">
          <Image src="/images/pinarevleri/entrance-garden.webp" alt="Stone garden entrance and greenery at Pınar Evleri" fill sizes="(max-width: 800px) 100vw, 48vw" />
          <span>ARRIVAL THROUGH THE GARDEN <Maximize2 size={14} /></span>
        </button>
      </section>

      <footer>
        <div className="brand footerBrand"><span className="brandMark">P</span><span><b>PINAR EVLERİ</b><small>MARMARİS · ÇAMLI</small></span></div>
        <p>Independent demonstration concept · Public listing information should be verified with the property before final publication.</p>
        <span>© {year} · Concept by aGOraXai / Artemis</span>
      </footer>

      {activePhoto !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Pınar Evleri photo viewer" onClick={() => setActivePhoto(null)}>
          <button className="lightboxClose" onClick={() => setActivePhoto(null)} aria-label="Close photo"><X /></button>
          <button className="lightboxNav prev" onClick={(e) => { e.stopPropagation(); setActivePhoto((activePhoto - 1 + photos.length) % photos.length); }} aria-label="Previous photo"><ChevronLeft /></button>
          <div className="lightboxImage" onClick={(e) => e.stopPropagation()}>
            <Image src={photos[activePhoto].src} alt={photos[activePhoto].alt} fill priority sizes="96vw" />
          </div>
          <button className="lightboxNav next" onClick={(e) => { e.stopPropagation(); setActivePhoto((activePhoto + 1) % photos.length); }} aria-label="Next photo"><ChevronRight /></button>
          <div className="lightboxMeta">0{activePhoto + 1} / 0{photos.length} · {photos[activePhoto].label}</div>
        </div>
      )}

      <style jsx>{`
        :global(html){scroll-behavior:smooth;background:#0d1712} :global(body){margin:0;background:#0d1712;color:#f3efe5} :global(*){box-sizing:border-box}
        .site{--cream:#f0e7d4;--ink:#0e1812;--moss:#20392a;--sage:#95aa85;--lime:#d6e8a6;--sand:#c6a86c;position:relative;overflow:hidden;background:var(--ink);font-family:Arial,Helvetica,sans-serif;color:var(--cream)}
        .noise{position:fixed;inset:0;pointer-events:none;z-index:90;opacity:.028;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.9'/%3E%3C/svg%3E")}
        .nav{position:fixed;z-index:80;top:0;left:0;right:0;height:88px;padding:0 5vw;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(240,231,212,.14);transition:.3s;background:linear-gradient(to bottom,rgba(8,15,10,.58),transparent)}
        .navScrolled{height:72px;background:rgba(13,23,18,.86);backdrop-filter:blur(18px)}
        .brand{display:flex;align-items:center;gap:12px;color:inherit;text-decoration:none}.brandMark{width:35px;height:35px;border:1px solid rgba(240,231,212,.55);border-radius:50%;display:grid;place-items:center;font-family:Georgia,serif;font-style:italic;font-size:21px}.brand b{font-size:12px;letter-spacing:.18em;display:block}.brand small{font-size:8px;letter-spacing:.22em;opacity:.55;display:block;margin-top:4px}.navLinks{display:flex;gap:26px;align-items:center}.navLinks a{color:inherit;text-decoration:none;font-size:11px;letter-spacing:.1em}.book{border:1px solid rgba(240,231,212,.3);border-radius:99px;padding:11px 15px!important;display:flex;gap:8px;align-items:center}
        .hero{min-height:100vh;position:relative;display:flex;align-items:center;padding:130px 7vw 80px;isolation:isolate;background:#0c1710}.heroImage{position:absolute;inset:-8%;z-index:-4;transition:transform .08s linear}.heroImage :global(img){object-fit:cover}.heroShade{position:absolute;inset:0;z-index:-3;background:linear-gradient(90deg,rgba(7,13,9,.88) 0%,rgba(8,15,10,.62) 47%,rgba(8,15,10,.2) 76%),linear-gradient(0deg,rgba(8,15,10,.78),transparent 48%)}.heroGrid{position:absolute;inset:0;z-index:-2;opacity:.12;background-image:linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px);background-size:6vw 6vw;mask-image:linear-gradient(to bottom,black,transparent 88%)}.heroGlow{position:absolute;inset:0;z-index:-1;background:radial-gradient(circle at var(--mx) var(--my),rgba(202,235,157,.13),transparent 26%);pointer-events:none}
        .heroCopy{width:min(710px,58vw);position:relative;z-index:2;will-change:transform}.eyebrow,.kicker{font-size:10px;letter-spacing:.28em;color:#d2dfbd}.eyebrow{display:flex;gap:10px;align-items:center}.eyebrow span{width:30px;height:1px;background:#d2dfbd}.hero h1,.manifesto h2,.galleryIntro h2,.location h2,.stay h2{font-family:Georgia,'Times New Roman',serif;font-weight:400;line-height:.88;margin:22px 0}.hero h1{font-size:clamp(72px,10vw,150px);letter-spacing:-.06em;text-shadow:0 8px 40px rgba(0,0,0,.28)}.hero em,.manifesto em,.galleryIntro em,.location em,.stay em{font-weight:400;color:var(--lime)}.hero p{max-width:600px;font-size:16px;line-height:1.75;color:rgba(240,231,212,.78)}
        .heroActions,.stayActions{display:flex;gap:12px;margin-top:34px;flex-wrap:wrap}.primary,.secondary{display:inline-flex;align-items:center;gap:12px;text-decoration:none;border-radius:99px;padding:14px 18px;font-size:11px;letter-spacing:.08em}.primary{background:var(--lime);color:#111a12}.secondary{border:1px solid rgba(240,231,212,.32);color:var(--cream);backdrop-filter:blur(8px)}
        .heroCard{position:absolute;right:6vw;top:22vh;width:27vw;min-width:310px;aspect-ratio:.8;border:1px solid rgba(240,231,212,.24);padding:8px;background:rgba(255,255,255,.05);overflow:hidden;cursor:zoom-in;transform:perspective(1200px) rotateY(-7deg) rotateX(2deg);box-shadow:-30px 50px 100px rgba(0,0,0,.33);transition:.5s}.heroCard:hover{transform:perspective(1200px) rotateY(-2deg) rotateX(0) translateY(-8px)}.heroCard :global(img){object-fit:cover;transition:transform .7s}.heroCard:hover :global(img){transform:scale(1.04)}.heroCard:after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 55%,rgba(6,12,8,.74))}.heroCardLabel{position:absolute;z-index:2;bottom:18px;left:18px;right:18px;display:flex;justify-content:space-between;align-items:center;color:#fff;font-size:9px;letter-spacing:.18em}
        .scrollTag{position:absolute;bottom:30px;left:7vw;font-size:9px;letter-spacing:.22em;color:rgba(255,255,255,.62);display:flex;gap:12px;align-items:center}.scrollTag span{width:70px;height:1px;background:rgba(255,255,255,.4)}
        .manifesto{min-height:660px;padding:120px 8vw;display:grid;grid-template-columns:80px 1fr 36%;gap:5vw;align-items:center;position:relative;background:#101d15}.sectionNo{font-size:10px;letter-spacing:.2em;color:#889b80}.manifestoText h2,.galleryIntro h2,.location h2,.stay h2{font-size:clamp(48px,6vw,92px);letter-spacing:-.045em}.manifestoText p,.galleryIntro p,.locationIntro p,.stayPanel p{max-width:640px;line-height:1.8;color:rgba(240,231,212,.62);font-size:15px}.rings{height:390px;position:relative}.rings i{position:absolute;inset:50% auto auto 50%;border:1px solid rgba(214,232,166,.18);border-radius:50%;transform:translate(-50%,-50%)}.rings i:nth-child(1){width:110px;height:110px}.rings i:nth-child(2){width:190px;height:190px}.rings i:nth-child(3){width:280px;height:280px}.rings i:nth-child(4){width:370px;height:370px}
        .featureGrid{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid rgba(240,231,212,.12);border-bottom:1px solid rgba(240,231,212,.12)}.feature{padding:58px 3vw;min-height:290px;border-right:1px solid rgba(240,231,212,.12);position:relative}.feature:last-child{border-right:0}.featureNo{position:absolute;right:24px;top:22px;font-size:9px;opacity:.35}.feature h3{font-family:Georgia,serif;font-size:25px;font-weight:400;margin:28px 0 12px}.feature p{font-size:13px;line-height:1.7;color:rgba(240,231,212,.55)}
        .gallerySection{padding:130px 6vw 160px;background:#0b1510;position:relative}.galleryIntro{display:grid;grid-template-columns:60px minmax(130px,.35fr) 1.1fr .8fr;gap:3vw;align-items:start;margin-bottom:80px}.galleryIntro h2{margin:0}.galleryIntro p{margin-top:10px}.galleryGrid{display:grid;grid-template-columns:1.35fr .9fr .9fr;grid-auto-rows:250px;gap:14px}.galleryItem{border:0;padding:0;position:relative;overflow:hidden;background:#17261c;cursor:zoom-in;will-change:transform;transition:box-shadow .35s}.galleryItem:before{content:"";position:absolute;z-index:2;inset:0;background:radial-gradient(circle at var(--mx) var(--my),rgba(211,236,168,.18),transparent 42%);opacity:0;transition:.35s;pointer-events:none}.galleryItem:hover:before{opacity:1}.galleryItem:hover{box-shadow:0 28px 90px rgba(0,0,0,.38),0 0 45px rgba(153,190,119,.12);z-index:3}.galleryItem :global(img){object-fit:cover;transition:transform .8s cubic-bezier(.2,.7,.2,1),filter .5s}.galleryItem:hover :global(img){transform:scale(1.055);filter:saturate(1.06)}.item1{grid-row:span 2}.item2{grid-column:span 2}.item6{grid-column:span 2}.photoLabel{position:absolute;z-index:4;left:0;right:0;bottom:0;padding:34px 18px 16px;background:linear-gradient(transparent,rgba(5,10,7,.72));display:flex;align-items:center;gap:12px;color:#fff;font-size:10px;letter-spacing:.14em;text-transform:uppercase}.photoLabel b{opacity:.55;font-weight:400}.photoLabel :global(svg){margin-left:auto}
        .location{padding:130px 8vw;display:grid;grid-template-columns:1fr 1fr;gap:8vw;background:#14241a}.mapLink{display:inline-flex;align-items:center;gap:10px;color:var(--lime);text-decoration:none;margin-top:24px;font-size:11px;letter-spacing:.09em}.distancePanel{position:relative;padding-top:120px}.mapOrb{position:absolute;right:0;top:0;width:110px;height:110px;border:1px solid rgba(214,232,166,.25);border-radius:50%;display:flex;align-items:center;justify-content:center;gap:8px;color:var(--lime)}.mapOrb span{font-size:9px;line-height:1.2;letter-spacing:.12em}.distanceRow{display:flex;justify-content:space-between;padding:20px 0;border-bottom:1px solid rgba(240,231,212,.13);font-size:11px;letter-spacing:.09em}.distanceRow b{font-weight:400;color:var(--lime)}
        .stay{display:grid;grid-template-columns:1fr 1fr;min-height:720px;background:#e9e1cf;color:#142018}.stayPanel{padding:110px 8vw;display:flex;flex-direction:column;justify-content:center}.stayPanel .kicker{color:#65765f}.stayPanel h2 em{color:#526b4d}.stayPanel p{color:rgba(20,32,24,.64)}.dark{border-color:rgba(20,32,24,.25);color:#142018}.stayPhoto{position:relative;border:0;padding:0;overflow:hidden;cursor:zoom-in;min-height:600px}.stayPhoto :global(img){object-fit:cover;transition:transform .8s}.stayPhoto:hover :global(img){transform:scale(1.035)}.stayPhoto:after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 60%,rgba(4,9,6,.6))}.stayPhoto span{position:absolute;z-index:2;left:28px;right:28px;bottom:28px;color:#fff;display:flex;justify-content:space-between;align-items:center;font-size:9px;letter-spacing:.18em}
        footer{min-height:180px;padding:45px 6vw;display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:30px;align-items:center;background:#08110c;color:rgba(240,231,212,.55);font-size:10px;line-height:1.6}footer>span{text-align:right}
        .lightbox{position:fixed;inset:0;z-index:120;background:rgba(4,9,6,.95);backdrop-filter:blur(20px);display:grid;place-items:center;animation:fade .22s ease}.lightboxImage{position:relative;width:min(92vw,1500px);height:86vh}.lightboxImage :global(img){object-fit:contain}.lightboxClose,.lightboxNav{position:absolute;z-index:5;border:1px solid rgba(255,255,255,.22);background:rgba(10,18,13,.46);color:white;border-radius:50%;display:grid;place-items:center;cursor:pointer;backdrop-filter:blur(8px)}.lightboxClose{right:28px;top:24px;width:46px;height:46px}.lightboxNav{top:50%;width:52px;height:52px;transform:translateY(-50%)}.prev{left:25px}.next{right:25px}.lightboxMeta{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font-size:9px;letter-spacing:.18em;color:rgba(255,255,255,.7);text-transform:uppercase}@keyframes fade{from{opacity:0;transform:scale(.985)}to{opacity:1;transform:scale(1)}}
        @media(max-width:900px){.nav{padding:0 20px}.navLinks>a:not(.book){display:none}.hero{padding:120px 24px 80px;align-items:flex-end}.heroCopy{width:100%}.hero h1{font-size:clamp(64px,19vw,100px)}.heroCard{top:15vh;right:20px;width:42vw;min-width:0;opacity:.88}.manifesto{grid-template-columns:40px 1fr;padding:90px 25px}.rings{display:none}.featureGrid{grid-template-columns:1fr 1fr}.gallerySection{padding:90px 18px 120px}.galleryIntro{grid-template-columns:40px 1fr;gap:16px}.galleryIntro .kicker{grid-column:2}.galleryIntro h2,.galleryIntro p{grid-column:2}.galleryGrid{grid-template-columns:1fr 1fr;grid-auto-rows:220px}.item1{grid-row:span 2}.item2,.item6{grid-column:span 1}.location,.stay{grid-template-columns:1fr}.location{padding:90px 25px}.distancePanel{padding-top:130px}.stayPanel{padding:90px 25px}.stayPhoto{min-height:500px}footer{grid-template-columns:1fr;gap:20px}footer>span{text-align:left}.lightboxNav{width:44px;height:44px}.prev{left:10px}.next{right:10px}}
        @media(max-width:560px){.heroCard{display:none}.featureGrid{grid-template-columns:1fr}.feature{border-right:0;border-bottom:1px solid rgba(240,231,212,.12)}.galleryGrid{display:flex;flex-direction:column}.galleryItem{height:310px;transform:none!important}.galleryIntro{display:block}.galleryIntro .sectionNo{display:block;margin-bottom:18px}.galleryIntro h2{font-size:52px}.lightboxImage{width:100vw;height:78vh}.lightboxMeta{width:70%;text-align:center}}
        @media(prefers-reduced-motion:reduce){:global(html){scroll-behavior:auto}.heroImage,.heroCopy,.galleryItem{transform:none!important}.heroCard,.heroCard :global(img),.galleryItem :global(img),.stayPhoto :global(img){transition:none}}
      `}</style>
    </main>
  );
}
