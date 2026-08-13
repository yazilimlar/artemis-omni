'use client';

import { pinarHouses } from '@/lib/pinarevleri/houses';

export default function SitePlan() {
  const goToHouse = (id: string) => {
    document.getElementById(`house-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="plan" aria-label="Conceptual Pınar Evleri site plan">
      <div className="terrain" />
      <div className="pool"><span>POOL</span></div>
      {pinarHouses.map((house) => (
        <button
          key={house.id}
          className={`node ${house.category}`}
          style={{ left: `${house.map.x}%`, top: `${house.map.y}%` }}
          onClick={() => goToHouse(house.id)}
          aria-label={`Go to ${house.name}`}
        >
          <span className="dot" />
          <b>{house.name}</b>
          <small>{house.englishName}</small>
        </button>
      ))}
      <div className="legend"><span><i className="familyDot"/> Family prefab</span><span><i className="tinyDot"/> Smart tiny house</span></div>
      <div className="note">Conceptual orientation · exact positions to be survey-verified</div>
      <style jsx>{`
        .plan{position:relative;min-height:580px;border:1px solid rgba(255,255,255,.14);border-radius:30px;overflow:hidden;background:radial-gradient(circle at 50% 50%,rgba(95,135,92,.26),transparent 28%),linear-gradient(145deg,#14251a,#09130e);box-shadow:inset 0 0 80px rgba(0,0,0,.35)}
        .terrain{position:absolute;inset:-15%;opacity:.18;background:repeating-radial-gradient(ellipse at 50% 50%,transparent 0 38px,rgba(220,233,172,.4) 39px 40px,transparent 41px 75px);transform:rotate(-8deg) scale(1.15)}
        .pool{position:absolute;left:38%;top:35%;width:24%;height:30%;border-radius:38%;border:1px solid rgba(164,220,232,.8);background:linear-gradient(145deg,rgba(89,188,212,.82),rgba(38,124,157,.62));display:grid;place-items:center;box-shadow:0 20px 50px rgba(0,0,0,.25),inset 0 0 30px rgba(255,255,255,.22);transform:perspective(700px) rotateX(57deg) rotateZ(-6deg)}
        .pool span{font-size:9px;letter-spacing:.24em;color:#e8fbff;transform:rotateZ(6deg)}
        .node{position:absolute;transform:translate(-50%,-50%);border:0;background:rgba(9,19,14,.76);color:#f2eee4;padding:10px 12px 10px 28px;border-radius:14px;text-align:left;cursor:pointer;backdrop-filter:blur(12px);box-shadow:0 10px 30px rgba(0,0,0,.22);transition:transform .28s,background .28s;z-index:3}
        .node:hover,.node:focus-visible{transform:translate(-50%,-50%) scale(1.07);background:rgba(20,42,28,.95);outline:1px solid rgba(220,233,172,.6)}
        .node b{display:block;font-family:Georgia,serif;font-size:16px;font-weight:400}.node small{display:block;font-size:8px;opacity:.58;margin-top:2px}.dot{position:absolute;left:11px;top:50%;width:9px;height:9px;border-radius:50%;transform:translateY(-50%);background:#dce9ac;box-shadow:0 0 16px rgba(220,233,172,.65)}
        .node.tiny .dot,.tinyDot{background:#e3bd7f}.legend{position:absolute;left:22px;bottom:22px;display:flex;gap:16px;font-size:9px;opacity:.72}.legend span{display:flex;align-items:center;gap:6px}.legend i{display:block;width:7px;height:7px;border-radius:50%}.familyDot{background:#dce9ac}.note{position:absolute;right:22px;bottom:22px;font-size:8px;letter-spacing:.08em;opacity:.38}
        @media(max-width:700px){.plan{min-height:470px}.node{padding:8px 9px 8px 22px}.node b{font-size:12px}.node small{display:none}.dot{left:8px}.legend{left:14px;bottom:14px;flex-direction:column;gap:5px}.note{right:14px;bottom:14px;max-width:150px;text-align:right}}
      `}</style>
    </div>
  );
}
