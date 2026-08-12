'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, ChevronDown, ExternalLink, Leaf, MapPin, MoonStar, Waves, Wind } from 'lucide-react';

const airbnbUrl = 'https://www.airbnb.com/rooms/36961615';
const camperUrl = 'https://www.airbnb.com/rooms/1094948156007516926';

const features = [
  { icon: Leaf, label: 'Forest edge', text: 'A quiet green setting in Çamlı, surrounded by the Gökova landscape.' },
  { icon: Waves, label: 'Pool & sea', text: 'A cared-for pool on site, with the coast approximately 1 km away.' },
  { icon: MoonStar, label: 'Slow living', text: 'Space for yoga, meditation, long breakfasts and unhurried evenings.' },
  { icon: Wind, label: 'Gökova air', text: 'Open-air living close to hiking, İncekum and the region’s kiteboarding corridor.' },
];

const distances = [
  ['SEA', '≈ 1 KM'],
  ['CLEOPATRA / SEDIR ISLAND', '≈ 2 KM'],
  ['İNCEKUM BEACH', '≈ 4 KM'],
  ['KITEBOARDING', '≈ 8 KM'],
  ['MARMARİS CENTER', '≈ 15 KM'],
];

export default function PinarEvleriPage() {
  const [pointer, setPointer] = useState({ x: 50, y: 38 });
  const [scrolled, setScrolled] = useState(false);
  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      setPointer({ x: (event.clientX / window.innerWidth) * 100, y: (event.clientY / window.innerHeight) * 100 });
    };
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <main className="site" style={{ '--mx': `${pointer.x}%`, '--my': `${pointer.y}%` } as React.CSSProperties}>
      <div className="noise" />
      <nav className={scrolled ? 'nav navScrolled' : 'nav'}>
        <a href="#top" className="brand" aria-label="Pınar Evleri home">
          <span className="brandMark">P</span>
          <span><b>PINAR EVLERİ</b><small>MARMARİS · ÇAMLI</small></span>
        </a>
        <div className="navLinks">
          <a href="#experience">Experience</a>
          <a href="#location">Location</a>
          <a href={airbnbUrl} target="_blank" rel="noreferrer" className="book">Stay here <ArrowUpRight size={15} /></a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="orb orbOne" />
        <div className="orb orbTwo" />
        <div className="terrain terrainA" />
        <div className="terrain terrainB" />
        <div className="heroGrid" />

        <div className="heroCopy">
          <div className="eyebrow"><span /> A SMALL RETREAT IN THE GÖKOVA LANDSCAPE</div>
          <h1>Stay close<br />to <em>nature.</em></h1>
          <p>
            Pınar Evleri is a collection of intimate holiday homes in Çamlı — a quieter side of Marmaris where forest, pool, village life and the sea sit within easy reach.
          </p>
          <div className="heroActions">
            <a href={airbnbUrl} target="_blank" rel="noreferrer" className="primary">Explore the stay <ArrowUpRight size={18} /></a>
            <a href="#experience" className="secondary">Discover <ChevronDown size={18} /></a>
          </div>
        </div>

        <div className="heroCard">
          <div className="cardVisual">
            <span className="visualLabel">ÇAMLI / MARMARİS</span>
            <div className="sun" />
            <div className="ridge ridge1" />
            <div className="ridge ridge2" />
            <div className="poolPlane" />
            <div className="villaShape v1" /><div className="villaShape v2" />
          </div>
          <div className="cardMeta">
            <span>FOREST · POOL · SEA</span>
            <span>36° / 28° <small>GÖKOVA MOOD</small></span>
          </div>
        </div>

        <div className="scrollTag">SCROLL TO WANDER <span /></div>
      </section>

      <section className="manifesto" id="experience">
        <div className="sectionNo">01</div>
        <div className="manifestoText">
          <span className="kicker">THE EXPERIENCE</span>
          <h2>Not a resort.<br /><em>A place to exhale.</em></h2>
          <p>
            Wake to birds, step into the garden, swim before breakfast, follow the forest edge in the afternoon and come back for a long table under the evening sky. The character is simple: privacy, greenery and room to slow down.
          </p>
        </div>
        <div className="rings" aria-hidden="true"><i /><i /><i /><i /></div>
      </section>

      <section className="featureGrid">
        {features.map(({ icon: Icon, label, text }, index) => (
          <article className="feature" key={label}>
            <span className="featureNo">0{index + 1}</span>
            <Icon size={24} strokeWidth={1.4} />
            <h3>{label}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="photoStage">
        <div className="photoGhost photoGhostOne"><span>ORIGINAL PHOTOGRAPHY</span></div>
        <div className="photoGhost photoGhostTwo"><span>GARDEN / POOL / VILLAS</span></div>
        <div className="photoCopy">
          <span className="kicker">YOUR VIEW, YOUR TEMPO</span>
          <h2>A village base<br />for the <em>whole coast.</em></h2>
          <p>Built for a demonstration today, this image system is ready for Pınar Evleri’s original photographs without changing the layout or motion language.</p>
        </div>
      </section>

      <section className="location" id="location">
        <div className="locationIntro">
          <div className="sectionNo">02</div>
          <span className="kicker">LOCATION</span>
          <h2>Çamlı,<br /><em>Marmaris.</em></h2>
          <p>
            A strategic pocket between the forested Gökova hinterland and Marmaris. Close enough for beaches and town; distant enough to feel genuinely removed from the urban rhythm.
          </p>
          <a href="https://www.google.com/maps/search/?api=1&query=%C3%87aml%C4%B1%20Marmaris%20Mu%C4%9Fla" target="_blank" rel="noreferrer" className="mapLink">
            Open Çamlı in Google Maps <ExternalLink size={16} />
          </a>
        </div>
        <div className="distancePanel">
          <div className="mapOrb"><MapPin size={28} /><span>PINAR<br />EVLERİ</span></div>
          {distances.map(([place, distance]) => (
            <div className="distanceRow" key={place}><span>{place}</span><b>{distance}</b></div>
          ))}
        </div>
      </section>

      <section className="stay">
        <div className="stayPanel">
          <span className="kicker">STAY</span>
          <h2>Pick your<br /><em>kind of quiet.</em></h2>
          <p>Holiday homes for up to five guests are currently listed alongside a smaller camper option. Follow the booking links for live availability, house rules and current pricing.</p>
          <div className="stayActions">
            <a href={airbnbUrl} target="_blank" rel="noreferrer" className="primary">View homes on Airbnb <ArrowUpRight size={18} /></a>
            <a href={camperUrl} target="_blank" rel="noreferrer" className="secondary dark">View camper <ArrowUpRight size={18} /></a>
          </div>
        </div>
        <div className="stayArt">
          <div className="staySun" />
          <div className="stayHill h1" /><div className="stayHill h2" /><div className="stayHill h3" />
          <div className="stayHouse"><i /><i /><i /></div>
          <span>36.967° N<br />28.242° E</span>
        </div>
      </section>

      <footer>
        <div className="brand footerBrand"><span className="brandMark">P</span><span><b>PINAR EVLERİ</b><small>MARMARİS · ÇAMLI</small></span></div>
        <p>Independent demonstration concept · Public listing information should be verified with the property before final publication.</p>
        <span>© {year} · Concept by aGOraXai / Artemis</span>
      </footer>

      <style jsx>{`
        :global(html){scroll-behavior:smooth;background:#0d1712} :global(body){margin:0;background:#0d1712;color:#f3efe5} :global(*){box-sizing:border-box}
        .site{--cream:#f0e7d4;--ink:#0e1812;--moss:#20392a;--sage:#95aa85;--lime:#d6e8a6;--sand:#c6a86c;position:relative;overflow:hidden;background:var(--ink);font-family:Arial,Helvetica,sans-serif;color:var(--cream)}
        .noise{position:fixed;inset:0;pointer-events:none;z-index:90;opacity:.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.9'/%3E%3C/svg%3E")}
        .nav{position:fixed;z-index:80;top:0;left:0;right:0;height:88px;padding:0 5vw;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(240,231,212,.12);transition:.3s;background:linear-gradient(to bottom,rgba(8,15,10,.45),transparent)}
        .navScrolled{height:72px;background:rgba(13,23,18,.86);backdrop-filter:blur(18px)}
        .brand{display:flex;align-items:center;gap:12px;color:inherit;text-decoration:none}.brandMark{width:35px;height:35px;border:1px solid rgba(240,231,212,.55);border-radius:50%;display:grid;place-items:center;font-family:Georgia,serif;font-style:italic;font-size:21px}.brand b{font-size:12px;letter-spacing:.18em;display:block}.brand small{font-size:8px;letter-spacing:.22em;opacity:.55;display:block;margin-top:4px}.navLinks{display:flex;gap:26px;align-items:center}.navLinks a{color:inherit;text-decoration:none;font-size:11px;letter-spacing:.1em}.book{border:1px solid rgba(240,231,212,.3);border-radius:99px;padding:11px 15px!important;display:flex;gap:8px;align-items:center}
        .hero{min-height:100vh;position:relative;display:flex;align-items:center;padding:130px 7vw 80px;isolation:isolate;background:radial-gradient(circle at var(--mx) var(--my),rgba(132,168,107,.16),transparent 30%),linear-gradient(140deg,#0c1710 0%,#14261a 55%,#0b120e 100%)}
        .heroGrid{position:absolute;inset:0;z-index:-3;opacity:.16;background-image:linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px);background-size:6vw 6vw;mask-image:linear-gradient(to bottom,black,transparent 80%)}
        .orb{position:absolute;border-radius:50%;filter:blur(1px);z-index:-2}.orbOne{width:38vw;height:38vw;right:5vw;top:10vh;background:radial-gradient(circle at 40% 35%,rgba(221,239,169,.23),rgba(112,147,93,.04) 60%,transparent 72%);border:1px solid rgba(210,235,176,.09)}.orbTwo{width:20vw;height:20vw;left:-8vw;bottom:-4vw;border:1px solid rgba(210,235,176,.16)}
        .terrain{position:absolute;left:-5%;right:-5%;height:35vh;border-radius:50% 50% 0 0;z-index:-1;transform-origin:center bottom}.terrainA{bottom:-24vh;background:#1d3425;transform:rotate(-3deg)}.terrainB{bottom:-29vh;background:#31503a;transform:rotate(4deg);opacity:.8}
        .heroCopy{width:min(700px,55vw);position:relative;z-index:2}.eyebrow,.kicker{font-size:10px;letter-spacing:.28em;color:#b9c7a4}.eyebrow{display:flex;gap:10px;align-items:center}.eyebrow span{width:30px;height:1px;background:#b9c7a4}.hero h1,.manifesto h2,.photoCopy h2,.location h2,.stay h2{font-family:Georgia,'Times New Roman',serif;font-weight:400;line-height:.88;margin:22px 0}.hero h1{font-size:clamp(72px,10vw,150px);letter-spacing:-.06em}.hero em,.manifesto em,.photoCopy em,.location em,.stay em{font-weight:400;color:var(--lime)}.hero p{max-width:600px;font-size:16px;line-height:1.75;color:rgba(240,231,212,.66)}
        .heroActions,.stayActions{display:flex;gap:12px;margin-top:34px;flex-wrap:wrap}.primary,.secondary{display:inline-flex;align-items:center;gap:12px;text-decoration:none;border-radius:99px;padding:14px 18px;font-size:11px;letter-spacing:.08em}.primary{background:var(--lime);color:#111a12}.secondary{border:1px solid rgba(240,231,212,.26);color:var(--cream)}
        .heroCard{position:absolute;right:6vw;top:20vh;width:29vw;min-width:330px;aspect-ratio:.78;border:1px solid rgba(240,231,212,.18);padding:10px;background:rgba(255,255,255,.035);backdrop-filter:blur(4px);transform:perspective(1200px) rotateY(-7deg) rotateX(2deg);box-shadow:-30px 50px 100px rgba(0,0,0,.28)}.cardVisual{position:relative;height:86%;overflow:hidden;background:linear-gradient(#9eb79e 0 38%,#6e8d6f 39% 59%,#243a2b 60%);isolation:isolate}.visualLabel{position:absolute;z-index:8;top:18px;left:18px;color:#142017;font-size:9px;letter-spacing:.2em}.sun{position:absolute;width:110px;height:110px;background:#e8dba8;border-radius:50%;right:18%;top:14%;box-shadow:0 0 80px rgba(246,222,156,.22)}.ridge{position:absolute;left:-10%;width:120%;border-radius:50% 50% 0 0}.ridge1{height:42%;bottom:24%;background:#58785e;transform:rotate(-5deg)}.ridge2{height:36%;bottom:8%;background:#294833;transform:rotate(5deg)}.poolPlane{position:absolute;left:8%;right:6%;bottom:7%;height:24%;background:linear-gradient(160deg,#a5c5b5,#456f68);clip-path:polygon(0 37%,75% 0,100% 44%,25% 100%);box-shadow:inset 0 0 0 2px rgba(255,255,255,.13)}.villaShape{position:absolute;background:#d8cbb1;bottom:24%;height:15%;box-shadow:0 13px 25px rgba(0,0,0,.15)}.villaShape:after{content:'';position:absolute;background:#233027;left:15%;right:20%;height:45%;bottom:0}.v1{width:32%;right:14%;transform:skewY(-5deg)}.v2{width:26%;left:10%;bottom:30%;transform:skewY(6deg)}.cardMeta{height:14%;display:flex;justify-content:space-between;align-items:center;font-size:8px;letter-spacing:.16em;color:rgba(240,231,212,.6)}.cardMeta span:last-child{text-align:right;font-size:16px;color:var(--cream);letter-spacing:0}.cardMeta small{display:block;font-size:7px;letter-spacing:.12em;opacity:.55;margin-top:3px}.scrollTag{position:absolute;bottom:30px;left:7vw;font-size:8px;letter-spacing:.22em;opacity:.45;display:flex;gap:12px;align-items:center}.scrollTag span{width:50px;height:1px;background:currentColor}
        .manifesto{position:relative;min-height:780px;padding:130px 8vw;background:#ece4d2;color:var(--ink);display:grid;grid-template-columns:80px 1fr 36%;gap:6vw;align-items:center;overflow:hidden}.sectionNo{font-size:10px;letter-spacing:.2em;opacity:.45;align-self:start;padding-top:10px}.manifestoText{max-width:760px}.manifesto .kicker,.location .kicker{color:#557054}.manifesto h2,.photoCopy h2,.location h2,.stay h2{font-size:clamp(56px,7vw,108px);letter-spacing:-.055em}.manifesto em,.location em{color:#52704f}.manifesto p,.location p,.stay p,.photoCopy p{font-size:16px;line-height:1.8;max-width:600px;color:rgba(14,24,18,.68)}.rings{position:relative;width:32vw;aspect-ratio:1;opacity:.55}.rings i{position:absolute;border:1px solid #7b9270;border-radius:50%;inset:0}.rings i:nth-child(2){inset:12%}.rings i:nth-child(3){inset:24%}.rings i:nth-child(4){inset:36%;background:#91a983;box-shadow:0 0 60px rgba(70,105,68,.18)}
        .featureGrid{display:grid;grid-template-columns:repeat(4,1fr);background:#ece4d2;color:var(--ink);border-top:1px solid rgba(14,24,18,.14);border-bottom:1px solid rgba(14,24,18,.14)}.feature{min-height:330px;padding:42px 32px;border-right:1px solid rgba(14,24,18,.14);position:relative}.feature:last-child{border-right:0}.featureNo{display:block;font-size:9px;letter-spacing:.14em;opacity:.35;margin-bottom:62px}.feature svg{color:#587353}.feature h3{font-family:Georgia,serif;font-size:30px;font-weight:400;margin:18px 0 12px}.feature p{font-size:12px;line-height:1.7;color:rgba(14,24,18,.58)}
        .photoStage{min-height:900px;position:relative;background:#101b14;padding:120px 7vw;display:flex;align-items:flex-end;overflow:hidden}.photoGhost{position:absolute;border:1px solid rgba(233,238,218,.16);overflow:hidden;background:linear-gradient(145deg,#304b35,#16261c);box-shadow:0 40px 70px rgba(0,0,0,.25)}.photoGhost:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 65% 20%,rgba(226,219,157,.25),transparent 21%),linear-gradient(25deg,transparent 47%,rgba(151,178,133,.22) 48% 52%,transparent 53%);}.photoGhost span{position:absolute;bottom:14px;left:16px;font-size:8px;letter-spacing:.2em;opacity:.45}.photoGhostOne{width:42vw;height:62vh;right:7vw;top:90px;transform:rotate(2deg)}.photoGhostTwo{width:31vw;height:45vh;left:17vw;top:160px;transform:rotate(-4deg);opacity:.58}.photoCopy{position:relative;z-index:4;width:52%;background:rgba(13,23,18,.88);backdrop-filter:blur(12px);padding:50px 50px 55px;border:1px solid rgba(240,231,212,.12)}.photoCopy h2{font-size:clamp(52px,6.5vw,96px)}.photoCopy p{color:rgba(240,231,212,.62)}
        .location{min-height:850px;background:#d7d5b6;color:var(--ink);display:grid;grid-template-columns:1fr 1fr}.locationIntro{padding:120px 8vw;position:relative}.locationIntro .sectionNo{position:absolute;top:120px;right:7vw}.mapLink{display:inline-flex;gap:10px;align-items:center;color:#28442e;text-decoration:none;margin-top:20px;border-bottom:1px solid #789071;padding-bottom:5px;font-size:11px;letter-spacing:.08em}.distancePanel{position:relative;padding:120px 7vw;display:flex;flex-direction:column;justify-content:center;background:#1d3325;color:var(--cream);overflow:hidden}.distancePanel:before{content:'';position:absolute;width:650px;height:650px;border-radius:50%;border:1px solid rgba(207,230,176,.12);right:-250px;top:-190px;box-shadow:0 0 0 70px rgba(200,230,170,.03),0 0 0 140px rgba(200,230,170,.025)}.mapOrb{width:145px;height:145px;border-radius:50%;border:1px solid rgba(215,232,190,.25);display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:60px;background:radial-gradient(circle,#344f38,#203526);box-shadow:0 0 0 14px rgba(210,230,185,.025)}.mapOrb span{font-size:9px;line-height:1.5;letter-spacing:.14em}.distanceRow{display:flex;justify-content:space-between;align-items:center;padding:20px 0;border-top:1px solid rgba(240,231,212,.12);font-size:9px;letter-spacing:.16em}.distanceRow:last-child{border-bottom:1px solid rgba(240,231,212,.12)}.distanceRow b{font-size:12px;color:var(--lime)}
        .stay{display:grid;grid-template-columns:58% 42%;min-height:760px;background:#ede5d4;color:var(--ink)}.stayPanel{padding:110px 8vw}.stay .kicker{color:#506b4e}.stay em{color:#506b4e}.stayActions .primary{background:#263f2d;color:#f4eddc}.secondary.dark{border-color:rgba(14,24,18,.25);color:#172019}.stayArt{position:relative;overflow:hidden;background:linear-gradient(#b6c5a5,#779276 43%,#294a34 44%);isolation:isolate}.staySun{position:absolute;width:190px;height:190px;border-radius:50%;background:#e8dba8;right:14%;top:14%;box-shadow:0 0 100px rgba(239,219,158,.32);z-index:-2}.stayHill{position:absolute;width:120%;left:-10%;border-radius:50% 50% 0 0;z-index:-1}.h1{height:42%;bottom:30%;background:#668466;transform:rotate(-4deg)}.h2{height:38%;bottom:13%;background:#496b50;transform:rotate(5deg)}.h3{height:31%;bottom:-9%;background:#1e3a28}.stayHouse{position:absolute;bottom:24%;left:24%;width:50%;height:20%;background:#d9ccb0;transform:perspective(600px) rotateY(-10deg);box-shadow:20px 28px 40px rgba(16,30,20,.25)}.stayHouse:before{content:'';position:absolute;left:-8%;right:-5%;top:-12%;height:16%;background:#25362b;transform:skewX(-25deg)}.stayHouse i{position:absolute;bottom:0;background:#17241b;width:18%;height:58%}.stayHouse i:nth-child(1){left:10%}.stayHouse i:nth-child(2){left:40%;width:23%}.stayHouse i:nth-child(3){right:8%}.stayArt>span{position:absolute;bottom:35px;right:35px;color:rgba(240,231,212,.6);font-size:9px;letter-spacing:.18em;text-align:right;line-height:1.6}
        footer{min-height:240px;padding:65px 7vw;background:#0b130e;display:grid;grid-template-columns:1fr 1fr 1fr;gap:5vw;align-items:end;border-top:1px solid rgba(240,231,212,.1)}footer p,footer>span{font-size:9px;line-height:1.7;letter-spacing:.08em;color:rgba(240,231,212,.4)}footer>span{text-align:right}
        @media(max-width:1000px){.hero{padding-top:120px;align-items:flex-start}.heroCopy{width:75vw}.heroCard{opacity:.42;right:-12vw;top:38vh}.featureGrid{grid-template-columns:1fr 1fr}.feature:nth-child(2){border-right:0}.location,.stay{grid-template-columns:1fr}.photoCopy{width:75%}.photoGhostOne{width:65vw}.navLinks a:not(.book){display:none}}
        @media(max-width:650px){.nav{height:70px;padding:0 18px}.hero{padding:125px 22px 80px;min-height:900px}.heroCopy{width:100%}.hero h1{font-size:70px}.hero p{font-size:14px}.heroCard{width:72vw;min-width:0;right:-12vw;top:520px;opacity:.48}.scrollTag{left:22px}.manifesto{padding:90px 24px;display:block;min-height:auto}.manifesto .sectionNo{margin-bottom:40px}.manifesto h2,.photoCopy h2,.location h2,.stay h2{font-size:54px}.rings{width:70vw;margin:50px auto 0}.featureGrid{grid-template-columns:1fr}.feature{min-height:250px;border-right:0;border-bottom:1px solid rgba(14,24,18,.14)}.featureNo{margin-bottom:34px}.photoStage{min-height:800px;padding:70px 20px}.photoGhostOne{width:86vw;height:48vh;right:-8vw;top:70px}.photoGhostTwo{width:65vw;height:34vh;left:-15vw;top:170px}.photoCopy{width:100%;padding:32px 25px}.locationIntro,.distancePanel,.stayPanel{padding:85px 24px}.locationIntro .sectionNo{top:86px;right:24px}.stay{display:block}.stayArt{height:580px}footer{grid-template-columns:1fr;padding:50px 24px;gap:28px}footer>span{text-align:left}.heroActions,.stayActions{align-items:flex-start}.primary,.secondary{width:100%;justify-content:space-between}}
      `}</style>
    </main>
  );
}
