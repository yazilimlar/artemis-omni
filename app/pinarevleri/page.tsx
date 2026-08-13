'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Leaf, MapPin, Maximize2, MoonStar, Smartphone, Sparkles, Wifi, X } from 'lucide-react';

const airbnbUrl = 'https://www.airbnb.com/rooms/36961615';
const youtubeUrl = 'https://youtu.be/VTUh4Odo7yw';
const youtubeEmbedUrl = 'https://www.youtube-nocookie.com/embed/VTUh4Odo7yw?rel=0&modestbranding=1';

const propertyPhotos = [
  { src:'/images/pinarevleri/pool-mountain.webp', alt:'Pınar Evleri swimming pool and forested mountain landscape', label:'Pool & forest' },
  { src:'/images/pinarevleri/garden-pool-wide.webp', alt:'Wide garden view across Pınar Evleri pool and mature trees', label:'Garden room' },
  { src:'/images/pinarevleri/pool-garden.webp', alt:'Pınar Evleri pool framed by lawn and trees', label:'Open-air living' },
  { src:'/images/pinarevleri/pool-sunset.webp', alt:'Pınar Evleri swimming pool in golden-hour light', label:'Golden hour' },
  { src:'/images/pinarevleri/pool-villa.webp', alt:'Pool and villa garden at Pınar Evleri', label:'Poolside' },
  { src:'/images/pinarevleri/entrance-garden.webp', alt:'Stone garden entrance and lush planting at Pınar Evleri', label:'Garden arrival' },
];

const houses = [
  { name:'Ceviz Ev', en:'Walnut House', type:'Prefab', cat:'family', focus:'Deep shade, grounding comfort and quiet focus.' },
  { name:'Biberiye Ev', en:'Rosemary House', type:'Prefab', cat:'family', focus:'Coastal airflow, solar efficiency and culinary herbal living.' },
  { name:'Nar Ev', en:'Pomegranate House', type:'Prefab', cat:'family', focus:'Warm Aegean tones, abundant light and indoor-outdoor living.' },
  { name:'Elma Ev', en:'Apple House', type:'Prefab', cat:'family', focus:'Clean lines, orchard integration and bright minimalist comfort.' },
  { name:'Hurma Ev', en:'Date House', type:'Tiny House', cat:'tiny', focus:'Ultra-compact smart micro-living and intimate sanctuary design.' },
];

const distances = [
  ['Sedir Island boat pier','≈ 5–10 min'],['İncekum Beach','≈ 10 min'],
  ['Gökova kiteboarding','≈ 15–20 min'],['Marmaris center','≈ 20–25 min'],
];

export default function PinarEvleriPage(){
  const [scrollY,setScrollY]=useState(0);
  const [filter,setFilter]=useState<'all'|'family'|'tiny'>('all');
  const [active,setActive]=useState<number|null>(null);
  const year=useMemo(()=>new Date().getFullYear(),[]);
  const photos=propertyPhotos;

  useEffect(()=>{
    const onScroll=()=>setScrollY(window.scrollY);
    window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
    return()=>window.removeEventListener('scroll',onScroll);
  },[]);
  useEffect(()=>{
    document.body.style.overflow=active===null?'':'hidden';
    const key=(e:KeyboardEvent)=>{
      if(e.key==='Escape')setActive(null);
      if(active!==null&&e.key==='ArrowRight')setActive((active+1)%photos.length);
      if(active!==null&&e.key==='ArrowLeft')setActive((active-1+photos.length)%photos.length);
    };
    window.addEventListener('keydown',key);
    return()=>{document.body.style.overflow='';window.removeEventListener('keydown',key)};
  },[active,photos.length]);

  const visible=houses.filter(h=>filter==='all'||h.cat===filter);

  return <main className="site">
    <nav className={scrollY>40?'nav scrolled':'nav'}>
      <a href="#top" className="brand">
        <span className="logo"><Image src="/images/pinarevleri/pinar-evleri-logo.webp" alt="Pınar Evleri logo" fill sizes="54px"/></span>
        <span><b>PINAR EVLERİ</b><small>GÖKOVA · ÇAMLI · MARMARİS</small></span>
      </a>
      <div className="navlinks"><a href="#story">Story</a><a href="#collection">Houses</a><a href="#vision">Vision</a><a href="#film">Film</a><a href="#gallery">Gallery</a><a href="#location">Location</a></div>
    </nav>

    <section id="top" className="hero">
      <Image src="/images/pinarevleri/pool-mountain.webp" alt="Pınar Evleri pool and forest setting" fill priority sizes="100vw" className="heroimg"/>
      <div className="shade"/>
      <div className="herocopy">
        <span className="eyebrow">PINAR EVLERİ · ÇAMLI, MARMARİS</span>
        <h1>Where ancient legend meets <em>autonomous living.</em></h1>
        <p>A botanical micro-retreat between pine forest and Gökova Bay — designed for couples, families and independent stays.</p>
        <div className="actions"><a className="primary" href="#collection">Explore the houses</a><a className="secondary" href={airbnbUrl} target="_blank" rel="noreferrer">Stay here <ArrowUpRight size={16}/></a></div>
      </div>
      <div className="herologo"><Image src="/images/pinarevleri/pinar-evleri-logo.webp" alt="Pınar Evleri crest" fill sizes="240px"/></div>
    </section>

    <section id="story" className="section story">
      <div><span className="num">01</span><span className="kicker">THE STORY</span><h2>Legend outside.<br/><em>Freedom inside.</em></h2></div>
      <div className="copy"><p>Pınar Evleri sits near the Gökova coast and Sedir Island, widely known as Cleopatra Island. Regional tradition links the island’s sands with the legendary romance of Cleopatra and Mark Antony, giving this landscape an enduring sense of Mediterranean mythology.</p><p>At the estate, that romance becomes contemporary: private garden living for two, relaxed family stays, a central pool and self-contained homes designed around independence.</p></div>
    </section>

    <section id="collection" className="section">
      <div className="head"><div><span className="num">02</span><span className="kicker">BOTANICAL HOUSE COLLECTION</span><h2>Five houses.<br/><em>Five botanical identities.</em></h2></div></div>
      <div className="filters"><button onClick={()=>setFilter('all')} className={filter==='all'?'on':''}>All</button><button onClick={()=>setFilter('family')} className={filter==='family'?'on':''}>Family Prefabs</button><button onClick={()=>setFilter('tiny')} className={filter==='tiny'?'on':''}>Smart Tiny House</button></div>
      <div className="houses">{visible.map((h,i)=><article key={h.name}><div className="housemeta"><span>0{i+1}</span><b>{h.type}</b></div><h3>{h.name}</h3><small>{h.en}</small><p>{h.focus}</p></article>)}</div>
    </section>

    <section className="section smart">
      <div className="smartimg"><Image src="/images/pinarevleri/entrance-garden.webp" alt="Garden entrance at Pınar Evleri" fill sizes="48vw"/></div>
      <div><span className="num">03</span><span className="kicker">AUTONOMOUS MICRO-LIVING</span><h2>Arrive.<br/><em>Unlock. Exhale.</em></h2><p>Low-friction stays built around self-catering and independent arrival.</p><div className="smartgrid"><span><Smartphone size={18}/> Keyless mobile check-in</span><span><Wifi size={18}/> High-speed Wi-Fi</span><span><Sparkles size={18}/> Compact kitchens</span><span><MoonStar size={18}/> Climate comfort</span></div></div>
    </section>

    <section id="vision" className="vision">
      <div className="visioncopy"><span className="num">04</span><span className="kicker">ATMOSPHERE · DESIGN DIRECTION</span><h2>The garden,<br/><em>elevated.</em></h2><p>A visual design study inspired by the existing Pınar Evleri pool, orchard and surrounding Mediterranean landscape. These scenes express a future-facing atmosphere rather than documentary photography of current conditions.</p></div>
      <div className="triptych"><Image src="/images/pinarevleri/vision-triptych.webp" alt="Three enhanced design visions for Pınar Evleri pool and garden at golden hour" fill sizes="100vw"/></div>
      <div className="visionlabels"><span>GOLDEN-HOUR GARDEN</span><span>POOL LOUNGE</span><span>MEDITERRANEAN TERRACE</span></div>
    </section>

    <section id="film" className="film section">
      <div className="filmcopy"><span className="num">05</span><span className="kicker">PINAR EVLERİ · FILM</span><h2>See the place<br/><em>in motion.</em></h2><p>Step beyond the still photographs and experience the atmosphere of Pınar Evleri through film — the garden, pool, surrounding landscape and the slower rhythm of Çamlı.</p><a className="watch" href={youtubeUrl} target="_blank" rel="noreferrer">Watch on YouTube <ArrowUpRight size={15}/></a></div>
      <div className="videoFrame">
        <iframe src={youtubeEmbedUrl} title="Pınar Evleri video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        <div className="videoGlow" aria-hidden="true"/>
      </div>
    </section>

    <section id="gallery" className="section gallery">
      <div className="head"><span className="num">06</span><span className="kicker">ORIGINAL PROPERTY PHOTOGRAPHY</span><h2>Garden, water,<br/><em>forest, light.</em></h2></div>
      <div className="grid">{photos.map((p,i)=><button key={p.src} onClick={()=>setActive(i)}><Image src={p.src} alt={p.alt} fill sizes="(max-width:800px) 100vw, 40vw"/><span>{p.label}<Maximize2 size={13}/></span></button>)}</div>
    </section>

    <section id="location" className="section location">
      <div><span className="num">07</span><span className="kicker">LEGENDARY PROXIMITY</span><h2>Between pine forest<br/>and <em>Gökova Bay.</em></h2><p>Çamlı offers quick access to Sedir Island, İncekum Beach, kiteboarding spots and Marmaris.</p><a className="map" href="https://www.google.com/maps/search/?api=1&query=%C3%87aml%C4%B1%20Marmaris%20Mu%C4%9Fla" target="_blank" rel="noreferrer">Open in Google Maps <ExternalLink size={15}/></a></div>
      <div className="distance"><div className="pin"><MapPin/><b>PINAR EVLERİ</b></div>{distances.map(([p,t])=><div className="row" key={p}><span>{p}</span><b>{t}</b></div>)}</div>
    </section>

    <footer>
      <div className="footbrand"><span className="footlogo"><Image src="/images/pinarevleri/pinar-evleri-logo.webp" alt="Pınar Evleri logo" fill sizes="90px"/></span><div><b>PINAR EVLERİ</b><small>GÖKOVA · ÇAMLI</small></div></div>
      <p>Independent demonstration concept. Vision imagery is illustrative; amenity and travel-time details should be verified before final publication.</p>
      <span>© {year} · aGOraXai / Artemis</span>
    </footer>

    {active!==null&&<div className="lightbox" onClick={()=>setActive(null)}><button className="close" onClick={()=>setActive(null)}><X/></button><button className="prev" onClick={e=>{e.stopPropagation();setActive((active-1+photos.length)%photos.length)}}><ChevronLeft/></button><div className="lightimg" onClick={e=>e.stopPropagation()}><Image src={photos[active].src} alt={photos[active].alt} fill priority sizes="96vw"/></div><button className="next" onClick={e=>{e.stopPropagation();setActive((active+1)%photos.length)}}><ChevronRight/></button></div>}

    <style jsx>{`
      :global(html){scroll-behavior:smooth;background:#09130e}:global(body){margin:0;background:#09130e;color:#f2eee4}:global(*){box-sizing:border-box}
      .site{--cream:#f2eee4;--ink:#09130e;--lime:#dce9ac;--glass:rgba(255,255,255,.08);background:var(--ink);color:var(--cream);font-family:Arial,Helvetica,sans-serif;overflow:hidden}
      .nav{position:fixed;z-index:80;top:0;left:0;right:0;height:86px;padding:0 5vw;display:flex;align-items:center;justify-content:space-between;transition:.3s;background:linear-gradient(rgba(5,10,7,.62),transparent)}
      .nav.scrolled{height:68px;background:rgba(9,19,14,.88);backdrop-filter:blur(18px)}
      .brand{display:flex;align-items:center;gap:11px;color:inherit;text-decoration:none}.logo{position:relative;width:52px;height:52px;border-radius:50%;overflow:hidden;background:#fff}.brand b{display:block;font-size:12px;letter-spacing:.17em}.brand small{display:block;margin-top:4px;font-size:8px;letter-spacing:.18em;opacity:.58}
      .navlinks{display:flex;gap:22px}.navlinks a{color:inherit;text-decoration:none;font-size:10px;letter-spacing:.12em}
      .hero{position:relative;min-height:100vh;display:flex;align-items:center;padding:120px 7vw;isolation:isolate}.heroimg{object-fit:cover;z-index:-3}.shade{position:absolute;inset:0;z-index:-2;background:linear-gradient(90deg,rgba(5,12,7,.9) 0%,rgba(5,12,7,.55) 50%,rgba(5,12,7,.15)),linear-gradient(0deg,rgba(5,12,7,.55),transparent 50%)}
      .herocopy{max-width:760px}.eyebrow,.kicker{display:block;color:#ced9aa;font-size:10px;letter-spacing:.23em}.hero h1,h2{font-family:Georgia,serif;font-weight:400;letter-spacing:-.045em}.hero h1{font-size:clamp(60px,8vw,128px);line-height:.9;margin:22px 0}.hero em,h2 em{color:var(--lime);font-weight:400}.hero p,.copy p,.vision p,.smart p,.location p,.film p{font-size:16px;line-height:1.75;color:rgba(242,238,228,.72);max-width:680px}
      .actions{display:flex;gap:12px;margin-top:28px}.actions a,.map,.watch{display:inline-flex;align-items:center;gap:8px;padding:13px 17px;border-radius:99px;text-decoration:none;font-size:11px}.primary{background:var(--lime);color:#122016}.secondary,.map,.watch{border:1px solid rgba(255,255,255,.28);color:var(--cream)}
      .herologo{position:absolute;right:7vw;bottom:8vh;width:min(260px,22vw);aspect-ratio:1;border-radius:50%;overflow:hidden;background:white;box-shadow:0 30px 80px rgba(0,0,0,.38)}
      .section{padding:110px 7vw}.story,.smart,.location,.film{display:grid;grid-template-columns:1fr 1fr;gap:8vw;align-items:center}.num{display:block;font-size:11px;opacity:.38;margin-bottom:22px}h2{font-size:clamp(46px,6vw,90px);line-height:.94;margin:18px 0 28px}
      .filters{display:flex;gap:8px;flex-wrap:wrap;margin:34px 0}.filters button{border:1px solid rgba(255,255,255,.2);color:var(--cream);background:transparent;padding:10px 15px;border-radius:99px;cursor:pointer}.filters .on{background:var(--lime);color:#102016;border-color:var(--lime)}
      .houses{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.houses article{min-height:310px;padding:25px;background:linear-gradient(160deg,rgba(255,255,255,.09),rgba(255,255,255,.025));border:1px solid rgba(255,255,255,.11);border-radius:22px}.housemeta{display:flex;justify-content:space-between;font-size:10px;opacity:.55}.houses h3{font-family:Georgia,serif;font-size:30px;margin:62px 0 5px}.houses small{opacity:.55}.houses p{line-height:1.6;color:rgba(242,238,228,.66)}
      .smart{background:#112218}.smartimg{position:relative;min-height:580px;border-radius:28px;overflow:hidden}.smartimg :global(img){object-fit:cover}.smartgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:28px}.smartgrid span{display:flex;align-items:center;gap:9px;padding:14px;border:1px solid rgba(255,255,255,.13);border-radius:14px}
      .vision{padding:110px 0 100px;background:#e7dfcd;color:#102016}.visioncopy{padding:0 7vw}.vision .kicker{color:#49634f}.vision p{color:#405246}.triptych{position:relative;width:100%;aspect-ratio:4/1;margin-top:48px}.triptych :global(img){object-fit:cover}.visionlabels{display:grid;grid-template-columns:repeat(3,1fr);padding:15px 7vw 0;font-size:9px;letter-spacing:.14em;color:#526454}
      .film{position:relative;background:radial-gradient(circle at 70% 45%,rgba(220,233,172,.08),transparent 30%),#0a1710}.filmcopy{max-width:560px}.watch{margin-top:14px}.videoFrame{position:relative;aspect-ratio:16/9;border:1px solid rgba(255,255,255,.14);border-radius:28px;overflow:hidden;background:#020503;box-shadow:0 40px 100px rgba(0,0,0,.45)}.videoFrame iframe{position:absolute;inset:0;width:100%;height:100%;border:0;z-index:2}.videoGlow{position:absolute;inset:-18%;background:radial-gradient(circle,rgba(220,233,172,.13),transparent 58%);filter:blur(20px);pointer-events:none}
      .gallery{background:#0c1711}.grid{display:grid;grid-template-columns:repeat(12,1fr);gap:12px}.grid button{position:relative;border:0;padding:0;min-height:360px;overflow:hidden;background:#1d2b21;cursor:pointer}.grid button:nth-child(1),.grid button:nth-child(4){grid-column:span 7}.grid button:nth-child(2),.grid button:nth-child(3){grid-column:span 5}.grid button:nth-child(5),.grid button:nth-child(6){grid-column:span 6}.grid :global(img){object-fit:cover;transition:transform .6s}.grid button:hover :global(img){transform:scale(1.035)}.grid button span{position:absolute;left:15px;bottom:15px;color:white;background:rgba(0,0,0,.42);backdrop-filter:blur(10px);padding:9px 12px;border-radius:99px;display:flex;gap:8px;align-items:center}
      .distance{padding:28px;border:1px solid rgba(255,255,255,.14);border-radius:24px;background:var(--glass)}.pin{display:flex;gap:10px;align-items:center;margin-bottom:24px}.row{display:flex;justify-content:space-between;padding:16px 0;border-top:1px solid rgba(255,255,255,.1)}.row b{color:var(--lime)}
      footer{padding:45px 6vw;display:grid;grid-template-columns:1.2fr 2fr 1fr;gap:30px;align-items:center;border-top:1px solid rgba(255,255,255,.12);font-size:10px;color:rgba(242,238,228,.55)}.footbrand{display:flex;align-items:center;gap:12px}.footbrand b,.footbrand small{display:block}.footlogo{position:relative;width:72px;height:72px;border-radius:50%;overflow:hidden;background:white}
      .lightbox{position:fixed;inset:0;z-index:200;background:rgba(3,8,5,.95);display:grid;place-items:center}.lightimg{position:relative;width:86vw;height:82vh}.lightimg :global(img){object-fit:contain}.lightbox button{position:absolute;z-index:3;border:0;background:rgba(255,255,255,.1);color:white;width:48px;height:48px;border-radius:50%}.close{right:25px;top:25px}.prev{left:25px}.next{right:25px}
      @media(max-width:900px){.navlinks a:not(:last-child){display:none}.herologo{width:130px;right:5vw;bottom:6vh}.story,.smart,.location,.film{grid-template-columns:1fr}.houses{grid-template-columns:1fr 1fr}.smartimg{min-height:420px}.triptych{aspect-ratio:2.2/1}.grid button{grid-column:span 12!important;min-height:300px}footer{grid-template-columns:1fr}.section{padding:80px 6vw}.film{gap:40px}.videoFrame{border-radius:20px}}
      @media(max-width:600px){.hero{padding:120px 6vw 90px;align-items:flex-start}.hero h1{font-size:58px;margin-top:70px}.herologo{top:95px;right:6vw;bottom:auto;width:96px}.houses{grid-template-columns:1fr}.smartgrid{grid-template-columns:1fr}.visionlabels{font-size:7px}.triptych{aspect-ratio:1.7/1}.nav{padding:0 4vw}.logo{width:44px;height:44px}.videoFrame{border-radius:16px}}
    `}</style>
  </main>
}