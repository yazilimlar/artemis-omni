'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Leaf, MapPin,
  Maximize2, MoonStar, Smartphone, Sparkles, Waves, Wifi, X
} from 'lucide-react';

const airbnbUrl = 'https://www.airbnb.com/rooms/36961615';
const camperUrl = 'https://www.airbnb.com/rooms/1094948156007516926';

const photos = [
  { src: '/images/pinarevleri/pool-mountain.webp', alt: 'Pınar Evleri swimming pool and forested mountain landscape', label: 'Pool & forest' },
  { src: '/images/pinarevleri/garden-pool-wide.webp', alt: 'Wide garden view across Pınar Evleri pool and mature trees', label: 'Garden room' },
  { src: '/images/pinarevleri/pool-garden.webp', alt: 'Pınar Evleri pool framed by lawn and trees', label: 'Open-air living' },
  { src: '/images/pinarevleri/pool-sunset.webp', alt: 'Pınar Evleri swimming pool in warm golden-hour light', label: 'Golden hour' },
  { src: '/images/pinarevleri/pool-villa.webp', alt: 'Pool and villa garden at Pınar Evleri', label: 'Poolside' },
  { src: '/images/pinarevleri/entrance-garden.webp', alt: 'Stone garden entrance and lush planting at Pınar Evleri', label: 'Garden arrival' },
];

const houses = [
  { name: 'Ceviz Ev', english: 'Walnut House', type: 'Prefab', category: 'family', focus: 'Deep shade, grounding comfort and quiet focus.', vibe: 'An earthy, serene family sanctuary framed by mature trees.', accent: 'CEVİZ' },
  { name: 'Biberiye Ev', english: 'Rosemary House', type: 'Prefab', category: 'family', focus: 'Fresh coastal airflow, solar efficiency and culinary herbal living.', vibe: 'A breezy stay with an outdoor herb nook for self-catered meals.', accent: 'BİBERİYE' },
  { name: 'Nar Ev', english: 'Pomegranate House', type: 'Prefab', category: 'family', focus: 'Warm Aegean tones, abundant natural light and indoor-outdoor living.', vibe: 'Vibrant and spacious for family gatherings or romantic golden-hour evenings.', accent: 'NAR' },
  { name: 'Elma Ev', english: 'Apple House', type: 'Prefab', category: 'family', focus: 'Clean lines, orchard integration and bright minimalist comfort.', vibe: 'A welcoming, light-filled base for easy indoor-outdoor family living.', accent: 'ELMA' },
  { name: 'Hurma Ev', english: 'Date House', type: 'Tiny House', category: 'tiny', focus: 'Ultra-compact smart micro-living, maximum utility and cozy sanctuary design.', vibe: 'The intimate flagship capsule for couples seeking secluded Mediterranean quiet.', accent: 'HURMA' },
];

const distances = [
  ['Sedir Island boat pier', '≈ 5–10 min'],
  ['İncekum Beach', '≈ 10 min'],
  ['Gökova kiteboarding', '≈ 15–20 min'],
  ['Marmaris center', '≈ 20–25 min'],
];

const pillars = [
  { icon: Sparkles, title: 'Legendary proximity', text: 'Use Çamlı as a quiet launch point for Sedir Island, İncekum and the wider Gökova coast — with Cleopatra Island presented through the region’s enduring romantic legend.' },
  { icon: Leaf, title: 'Family + nature', text: 'A central pool, expansive lawns, mature planting and self-contained homes create an easy multi-generational setting close to nature.' },
  { icon: Smartphone, title: 'Autonomous living', text: 'Independent stays are designed around keyless arrival, compact self-catering, fast connectivity and simple climate control.' },
];

export default function PinarEvleriPage() {
  const [scrollY, setScrollY] = useState(0);
  const [pointer, setPointer] = useState({ x: 50, y: 38 });
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'family' | 'tiny'>('all');
  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    const onPointer = (e: PointerEvent) => setPointer({ x: e.clientX / window.innerWidth * 100, y: e.clientY / window.innerHeight * 100 });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    onScroll();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('pointermove', onPointer); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = activePhoto === null ? '' : 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePhoto(null);
      if (activePhoto !== null && e.key === 'ArrowRight') setActivePhoto((activePhoto + 1) % photos.length);
      if (activePhoto !== null && e.key === 'ArrowLeft') setActivePhoto((activePhoto - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [activePhoto]);

  const visibleHouses = houses.filter(h => filter === 'all' || h.category === filter);
  const heroShift = Math.min(scrollY * .08, 84);

  return (
    <main className="site" style={{ '--mx': `${pointer.x}%`, '--my': `${pointer.y}%` } as React.CSSProperties}>
      <div className="noise" />
      <nav className={scrollY > 40 ? 'nav scrolled' : 'nav'}>
        <a href="#top" className="brand"><span className="mark">P</span><span><b>PINAR EVLERİ</b><small>ÇAMLI · MARMARİS · GÖKOVA</small></span></a>
        <div className="navLinks"><a href="#story">Story</a><a href="#collection">Houses</a><a href="#gallery">Gallery</a><a href="#location">Location</a><a href={airbnbUrl} target="_blank" rel="noreferrer" className="pill">Book <ArrowUpRight size={14}/></a></div>
      </nav>

      <section id="top" className="hero">
        <div className="heroImage" style={{ transform: `translate3d(${(pointer.x - 50) * -.13}px, ${heroShift}px,0) scale(1.1)` }}><Image src="/images/pinarevleri/pool-mountain.webp" alt="Pınar Evleri pool and forest setting" fill priority sizes="100vw" /></div>
        <div className="heroShade"/><div className="heroGlow"/>
        <div className="heroCopy" style={{ transform: `translateY(${scrollY * -.03}px)` }}>
          <span className="eyebrow">PINAR EVLERİ · ÇAMLI, MARMARİS</span>
          <h1>Where ancient legend meets <em>autonomous living.</em></h1>
          <p>Nestled in the pine-framed landscape of Çamlı, Pınar Evleri brings together Mediterranean calm, self-catered micro-living and easy access to the shores of Gökova Bay.</p>
          <div className="actions"><a href="#collection" className="primary">Explore the houses</a><a href="#story" className="secondary">Discover the story</a></div>
        </div>
        <button className="heroCard" onClick={() => setActivePhoto(3)}><Image src="/images/pinarevleri/pool-sunset.webp" alt="Pınar Evleri pool at golden hour" fill sizes="28vw"/><span>GOLDEN HOUR <Maximize2 size={14}/></span></button>
      </section>

      <section id="story" className="story section">
        <div className="sectionNo">01</div>
        <div className="storyCopy">
          <span className="kicker">THE OVERARCHING NARRATIVE</span>
          <h2>Legend outside.<br/><em>Freedom inside.</em></h2>
          <p>Pınar Evleri sits near the Gökova coast and Sedir Island — widely known as Cleopatra Island. Local tradition links the island’s golden sands with the legendary romance of Cleopatra and Mark Antony, giving the surrounding landscape a rare blend of history, myth and Mediterranean intimacy.</p>
          <p>That sense of escape continues at the estate: couples can retreat into a compact private sanctuary, while families can spread into the garden, gather around the pool and live independently in self-contained homes.</p>
        </div>
        <div className="storyPhoto"><Image src="/images/pinarevleri/pool-sunset.webp" alt="Golden-hour garden at Pınar Evleri" fill sizes="42vw"/></div>
      </section>

      <section className="pillars section">
        {pillars.map(({icon:Icon,title,text}) => <article key={title}><Icon size={23}/><h3>{title}</h3><p>{text}</p></article>)}
      </section>

      <section id="collection" className="collection section">
        <div className="collectionHead"><div><span className="sectionNo">02</span><span className="kicker">BOTANICAL HOUSE COLLECTION</span><h2>Five houses.<br/><em>Five botanical identities.</em></h2></div><p>Each unit is positioned as a distinct living experience while sharing the same garden, pool and Gökova setting.</p></div>
        <div className="filters">
          <button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>All</button>
          <button className={filter==='family'?'active':''} onClick={()=>setFilter('family')}>Family Prefabs</button>
          <button className={filter==='tiny'?'active':''} onClick={()=>setFilter('tiny')}>Smart Tiny House</button>
        </div>
        <div className="houseGrid">
          {visibleHouses.map((house,index)=><article className="house" key={house.name}>
            <div className="houseTop"><span>0{index+1}</span><b>{house.type}</b></div>
            <div className="botanical">{house.accent}</div>
            <h3>{house.name}</h3><small>{house.english}</small>
            <h4>{house.focus}</h4><p>{house.vibe}</p>
          </article>)}
        </div>
      </section>

      <section className="smart section">
        <div className="smartPhoto"><Image src="/images/pinarevleri/entrance-garden.webp" alt="Garden arrival at Pınar Evleri" fill sizes="48vw"/></div>
        <div className="smartCopy"><span className="sectionNo">03</span><span className="kicker">AUTONOMOUS MICRO-LIVING</span><h2>Arrive.<br/><em>Unlock. Exhale.</em></h2><p>The concept is built around low-friction independence: guests arrive on their own schedule, settle in quickly and live comfortably without the formalities of a conventional resort.</p>
          <div className="smartList"><span><Smartphone size={18}/> Keyless mobile check-in</span><span><Wifi size={18}/> High-speed Wi-Fi</span><span><Sparkles size={18}/> Compact high-end kitchenettes</span><span><MoonStar size={18}/> Pre-programmed climate comfort</span></div>
        </div>
      </section>

      <section id="gallery" className="gallery section">
        <div className="galleryHead"><span className="sectionNo">04</span><span className="kicker">THE PROPERTY</span><h2>Garden, water,<br/><em>forest, light.</em></h2></div>
        <div className="galleryGrid">{photos.map((photo,index)=><button key={photo.src} className={`g g${index+1}`} onClick={()=>setActivePhoto(index)} style={{ transform:`translateY(${Math.max(-24,Math.min(32,(scrollY-1800)*(0.008+index*.0015)))}px)` }}><Image src={photo.src} alt={photo.alt} fill sizes="(max-width:800px) 100vw, 40vw"/><span>{photo.label}<Maximize2 size={13}/></span></button>)}</div>
      </section>

      <section id="location" className="location section">
        <div><span className="sectionNo">05</span><span className="kicker">LEGENDARY PROXIMITY</span><h2>Between pine forest<br/>and <em>Gökova Bay.</em></h2><p>Çamlı makes a strategic base for Sedir Island, İncekum Beach, the Gökova kiteboarding corridor and Marmaris itself.</p><a className="mapLink" target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=%C3%87aml%C4%B1%20Marmaris%20Mu%C4%9Fla">Open Çamlı in Google Maps <ExternalLink size={15}/></a></div>
        <div className="distanceCard"><div className="mapOrb"><MapPin/><span>PINAR<br/>EVLERİ</span></div>{distances.map(([place,time])=><div className="distanceRow" key={place}><span>{place}</span><b>{time}</b></div>)}</div>
      </section>

      <section className="closing section"><div><span className="kicker">FOR TWO. FOR FAMILY. FOR FREEDOM.</span><h2>Choose your<br/><em>kind of quiet.</em></h2><p>From a shaded family prefab to a compact smart tiny house, Pınar Evleri is designed around private, independent stays in one shared botanical setting.</p><div className="actions"><a href={airbnbUrl} target="_blank" rel="noreferrer" className="primary">View homes on Airbnb <ArrowUpRight size={16}/></a><a href={camperUrl} target="_blank" rel="noreferrer" className="secondary">View compact stay</a></div></div></section>

      <footer><div className="brand"><span className="mark">P</span><span><b>PINAR EVLERİ</b><small>ÇAMLI · MARMARİS</small></span></div><p>Independent demonstration concept. Amenity, travel-time and property details should be verified before final publication.</p><span>© {year} · aGOraXai / Artemis</span></footer>

      {activePhoto !== null && <div className="lightbox" role="dialog" aria-modal="true" onClick={()=>setActivePhoto(null)}><button className="close" onClick={()=>setActivePhoto(null)}><X/></button><button className="prev" onClick={e=>{e.stopPropagation();setActivePhoto((activePhoto-1+photos.length)%photos.length)}}><ChevronLeft/></button><div className="lightboxImage" onClick={e=>e.stopPropagation()}><Image src={photos[activePhoto].src} alt={photos[activePhoto].alt} fill priority sizes="96vw"/></div><button className="next" onClick={e=>{e.stopPropagation();setActivePhoto((activePhoto+1)%photos.length)}}><ChevronRight/></button><div className="lightboxMeta">0{activePhoto+1} / 0{photos.length} · {photos[activePhoto].label}</div></div>}

      <style jsx>{`
        :global(html){scroll-behavior:smooth;background:#0b1510}:global(body){margin:0;background:#0b1510;color:#f3eee3}:global(*){box-sizing:border-box}.site{--cream:#f3eee3;--ink:#0b1510;--moss:#1f3427;--sage:#91a886;--lime:#d8e9a8;position:relative;overflow:hidden;background:var(--ink);font-family:Arial,Helvetica,sans-serif}.noise{position:fixed;inset:0;z-index:99;pointer-events:none;opacity:.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}.nav{position:fixed;z-index:80;top:0;left:0;right:0;height:86px;padding:0 5vw;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ffffff1f;background:linear-gradient(#08110db3,transparent);transition:.3s}.nav.scrolled{height:70px;background:#0b1510e8;backdrop-filter:blur(16px)}.brand{display:flex;gap:11px;align-items:center;color:inherit;text-decoration:none}.mark{width:34px;height:34px;border:1px solid #ffffff70;border-radius:50%;display:grid;place-items:center;font:italic 21px Georgia}.brand b{display:block;font-size:11px;letter-spacing:.19em}.brand small{display:block;font-size:8px;letter-spacing:.2em;opacity:.55;margin-top:4px}.navLinks{display:flex;gap:23px;align-items:center}.navLinks a{color:inherit;text-decoration:none;font-size:10px;letter-spacing:.1em}.pill{border:1px solid #ffffff45;border-radius:99px;padding:10px 14px;display:flex;gap:7px;align-items:center}.hero{min-height:100vh;position:relative;display:flex;align-items:center;padding:140px 7vw 90px;isolation:isolate}.heroImage{position:absolute;inset:-7%;z-index:-4}.heroImage :global(img),.storyPhoto :global(img),.smartPhoto :global(img),.galleryGrid :global(img),.heroCard :global(img),.lightboxImage :global(img){object-fit:cover}.heroShade{position:absolute;inset:0;z-index:-3;background:linear-gradient(90deg,#08110de8 0%,#0b1510b8 44%,#0b151046 72%,#0b1510a8 100%),linear-gradient(0deg,#0b1510 0%,transparent 38%)}.heroGlow{position:absolute;inset:0;z-index:-2;background:radial-gradient(circle at var(--mx) var(--my),#d8e9a826,transparent 28%)}.heroCopy{max-width:800px}.eyebrow,.kicker{font-size:10px;letter-spacing:.26em;color:#c6d3ad}.hero h1,.section h2,.closing h2{font:400 clamp(58px,8.6vw,132px)/.92 Georgia,serif;letter-spacing:-.055em;margin:22px 0}.hero h1{max-width:980px}.hero em,.section em,.closing em{font-weight:400;color:var(--lime)}.hero p,.storyCopy p,.collectionHead p,.smartCopy p,.location p,.closing p{max-width:680px;color:#f3eee3b3;line-height:1.75;font-size:15px}.actions{display:flex;gap:11px;flex-wrap:wrap;margin-top:30px}.primary,.secondary,.mapLink{display:inline-flex;align-items:center;gap:9px;text-decoration:none;border-radius:99px;padding:14px 18px;font-size:11px;letter-spacing:.06em}.primary{background:var(--lime);color:#10180f}.secondary,.mapLink{border:1px solid #ffffff39;color:var(--cream)}.heroCard{position:absolute;right:6vw;bottom:12vh;width:25vw;min-width:280px;aspect-ratio:1.2;border:1px solid #ffffff3b;background:#ffffff0d;padding:0;overflow:hidden;box-shadow:0 28px 80px #0008;transform:perspective(900px) rotateY(-6deg)}.heroCard:after{content:'';position:absolute;inset:0;background:linear-gradient(transparent,#0009)}.heroCard span{position:absolute;z-index:2;bottom:16px;left:16px;color:white;font-size:9px;letter-spacing:.18em;display:flex;gap:8px;align-items:center}.section{padding:120px 7vw}.sectionNo{display:block;color:#d8e9a870;font-size:10px;letter-spacing:.2em;margin-bottom:14px}.story{display:grid;grid-template-columns:1.05fr .8fr;gap:7vw;align-items:center}.story h2,.collection h2,.smart h2,.gallery h2,.location h2{font-size:clamp(52px,7vw,102px)}.storyPhoto,.smartPhoto{position:relative;min-height:600px;border-radius:2px;overflow:hidden;box-shadow:0 40px 90px #0007}.pillars{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#ffffff1c;padding-top:0;padding-bottom:0}.pillars article{background:#122219;padding:55px 38px}.pillars h3{font:400 28px Georgia;margin:25px 0 12px}.pillars p{color:#ffffff9f;line-height:1.65;font-size:13px}.collection{background:#efe8da;color:#172219}.collection .kicker,.collection .sectionNo{color:#61745b}.collectionHead{display:grid;grid-template-columns:1.1fr .7fr;gap:8vw;align-items:end}.collectionHead p{color:#172219a8}.filters{display:flex;gap:8px;flex-wrap:wrap;margin:45px 0 30px}.filters button{border:1px solid #17221938;background:transparent;border-radius:99px;padding:11px 15px;color:#172219;cursor:pointer}.filters button.active{background:#172219;color:#efe8da}.houseGrid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}.house{min-height:430px;border:1px solid #17221926;padding:22px;display:flex;flex-direction:column;position:relative;overflow:hidden;background:#f7f1e7}.house:before{content:'';position:absolute;width:210px;height:210px;border-radius:50%;background:#d7e2bf;right:-90px;top:-80px;opacity:.7}.houseTop{display:flex;justify-content:space-between;font-size:9px;letter-spacing:.14em}.houseTop b{font-weight:500}.botanical{margin-top:auto;font-size:10px;letter-spacing:.28em;color:#6c8066}.house h3{font:400 34px Georgia;margin:9px 0 2px}.house small{opacity:.55}.house h4{font-size:13px;line-height:1.5;margin:24px 0 8px}.house p{font-size:12px;line-height:1.55;opacity:.68}.smart{display:grid;grid-template-columns:.9fr 1fr;gap:8vw;align-items:center}.smartList{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:30px}.smartList span{display:flex;gap:10px;align-items:center;border:1px solid #ffffff23;padding:14px;font-size:12px}.gallery{background:#101e16}.galleryGrid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px;margin-top:45px}.g{position:relative;border:0;padding:0;overflow:hidden;background:#223;min-height:350px;cursor:zoom-in;transition:.35s}.g:hover{transform:translateY(-5px)!important}.g:after{content:'';position:absolute;inset:0;background:radial-gradient(circle at var(--mx) var(--my),#d8e9a833,transparent 30%),linear-gradient(transparent,#0008)}.g span{position:absolute;z-index:2;left:15px;bottom:15px;color:white;font-size:10px;letter-spacing:.14em;display:flex;align-items:center;gap:8px}.g1,.g4{grid-column:span 7}.g2,.g3,.g5,.g6{grid-column:span 5}.g1,.g2{min-height:500px}.location{display:grid;grid-template-columns:1fr .85fr;gap:8vw;align-items:center}.distanceCard{border:1px solid #ffffff26;padding:28px;background:#ffffff08}.mapOrb{width:150px;height:150px;border-radius:50%;border:1px solid #d8e9a85c;margin:0 auto 30px;display:grid;place-items:center;text-align:center}.mapOrb span{font-size:9px;letter-spacing:.18em}.distanceRow{display:flex;justify-content:space-between;gap:20px;padding:15px 0;border-top:1px solid #ffffff1e;font-size:12px}.distanceRow b{font-weight:500;color:var(--lime)}.closing{min-height:70vh;display:flex;align-items:center;background:linear-gradient(#0b1510d9,#0b1510f2),url('/images/pinarevleri/garden-pool-wide.webp') center/cover}.closing>div{max-width:850px}footer{padding:40px 5vw;border-top:1px solid #ffffff18;display:grid;grid-template-columns:1fr 1.5fr 1fr;align-items:center;gap:30px;font-size:10px;color:#ffffff70}footer>span{text-align:right}.lightbox{position:fixed;inset:0;z-index:120;background:#050806f2;display:grid;place-items:center}.lightboxImage{position:relative;width:min(92vw,1500px);height:86vh}.close,.prev,.next{position:absolute;z-index:3;border:1px solid #ffffff3a;background:#101712bb;color:white;width:48px;height:48px;border-radius:50%;display:grid;place-items:center;cursor:pointer}.close{right:25px;top:25px}.prev{left:25px;top:50%}.next{right:25px;top:50%}.lightboxMeta{position:absolute;bottom:20px;font-size:10px;letter-spacing:.14em;color:#ffffffa8}@media(max-width:1000px){.navLinks a:not(.pill){display:none}.heroCard{width:36vw}.story,.smart,.location,.collectionHead{grid-template-columns:1fr}.houseGrid{grid-template-columns:repeat(2,1fr)}.storyPhoto,.smartPhoto{min-height:460px}.pillars{grid-template-columns:1fr}.g1,.g2,.g3,.g4,.g5,.g6{grid-column:span 6}footer{grid-template-columns:1fr;text-align:left}footer>span{text-align:left}}@media(max-width:700px){.nav{padding:0 20px}.hero{padding:130px 24px 80px;align-items:flex-end}.hero h1{font-size:58px}.heroCard{display:none}.section{padding:88px 24px}.section h2,.closing h2{font-size:52px}.houseGrid{grid-template-columns:1fr}.smartList{grid-template-columns:1fr}.g1,.g2,.g3,.g4,.g5,.g6{grid-column:span 12;min-height:330px}.storyPhoto,.smartPhoto{min-height:360px}.lightboxImage{width:100vw;height:72vh}.prev{left:10px}.next{right:10px}.close{right:12px;top:12px}}
      `}</style>
    </main>
  );
}
