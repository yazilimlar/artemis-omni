"""ArtPlex logo v2, draft 1: a clean geometric redraw of the owner's concept sheet.

Mark: drafting compass (knurled handle, ring, hinge disc with A, two legs, gear on a
crossbar, ruler 0-5, foot knobs, needle points, gold arc). Wordmark: Cormorant
Garamond Bold; tagline and credit: Montserrat. All text converted to outlines.

Run (dev tooling only, not part of the site build):
  pip install fonttools uharfbuzz
  mkdir -p scripts/brand/fonts && cd scripts/brand/fonts
  curl -LO "https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf"
  curl -LO "https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/Montserrat%5Bwght%5D.ttf"
  (rename to CormorantGaramond[wght].ttf and Montserrat[wght].ttf), then
  python3 scripts/brand/build_artplex_logo.py public/brand/artplex
Fonts are SIL Open Font License; only their outlines end up in the SVGs.
"""
import math, os, sys
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "out")
os.makedirs(OUT, exist_ok=True)

NAVY, GOLD, SILVER, CREAM = "#0B1F3B", "#D4A017", "#B0B7C3", "#F5F1E6"

# ---------------------------------------------------------------- text outlines
_fonts = {}


def font(name, wght):
    key = (name, wght)
    if key not in _fonts:
        path = os.path.join(HERE, "fonts", name)
        tt = instancer.instantiateVariableFont(TTFont(path), {"wght": wght})
        tmp = os.path.join(HERE, "fonts", f"_{name}_{wght}.ttf")
        tt.save(tmp)
        data = open(tmp, "rb").read()
        _fonts[key] = (TTFont(tmp), hb.Font(hb.Face(data)))
    return _fonts[key]


def text_path(s, name, wght, size, x, y, anchor="middle", tracking=0.0):
    """Outline path for `s`, baseline at y. tracking in em. Returns (d, width)."""
    tt, hbf = font(name, wght)
    upem = tt["head"].unitsPerEm
    buf = hb.Buffer(); buf.add_str(s); buf.guess_segment_properties()
    hb.shape(hbf, buf, {"kern": True, "liga": True})
    gs = tt.getGlyphSet(); order = tt.getGlyphOrder()
    sc = size / upem
    adv = [p.x_advance + tracking * upem for p in buf.glyph_positions]
    width = (sum(adv) - (tracking * upem if s else 0)) * sc
    x0 = x - width / 2 if anchor == "middle" else (x - width if anchor == "end" else x)
    pen = SVGPathPen(gs, ntos=lambda v: f"{v:.1f}")
    cx = 0.0
    for info, pos, a in zip(buf.glyph_infos, buf.glyph_positions, adv):
        g = order[info.codepoint]
        tp = TransformPen(pen, (sc, 0, 0, -sc, x0 + (cx + pos.x_offset) * sc, y - pos.y_offset * sc))
        gs[g].draw(tp)
        cx += a
    return pen.getCommands(), width


# ---------------------------------------------------------------- mark geometry
CX = 256.0
HINGE = (CX, 192.0)
FEET = [(150.0, 420.0), (362.0, 420.0)]


def leg_poly(foot, w_top=13.0, w_bot=9.0):
    hx, hy = HINGE; fx, fy = foot
    dx, dy = fx - hx, fy - hy; L = math.hypot(dx, dy); nx, ny = -dy / L, dx / L
    return [(hx + nx * w_top, hy + ny * w_top), (fx + nx * w_bot, fy + ny * w_bot),
            (fx - nx * w_bot, fy - ny * w_bot), (hx - nx * w_top, hy - ny * w_top)]


def leg_x_at(foot, y):
    hx, hy = HINGE; fx, fy = foot
    return hx + (fx - hx) * (y - hy) / (fy - hy)


def needle(foot):
    hx, hy = HINGE; fx, fy = foot
    dx, dy = fx - hx, fy - hy; L = math.hypot(dx, dy); ux, uy = dx / L, dy / L; nx, ny = -uy, ux
    tip = (fx + ux * 66, fy + uy * 66); b1 = (fx + ux * 14 + nx * 7, fy + uy * 14 + ny * 7)
    b2 = (fx + ux * 14 - nx * 7, fy + uy * 14 - ny * 7)
    return [b1, tip, b2]


def pts(p):
    return " ".join(f"{x:.1f},{y:.1f}" for x, y in p)


def gear_path(cx, cy, r_out, r_in, teeth):
    d = []
    for i in range(teeth):
        a0 = 2 * math.pi * i / teeth
        step = 2 * math.pi / teeth
        for frac, r in ((0.0, r_in), (0.18, r_out), (0.5, r_out), (0.68, r_in)):
            a = a0 + frac * step
            d.append(f"{cx + r * math.cos(a):.1f},{cy + r * math.sin(a):.1f}")
    return "M" + " L".join(d) + " Z"


def A_glyph(cx, cy, size, fill):
    d, _ = text_path("A", "CormorantGaramond[wght].ttf", 700, size, cx, cy + size * 0.33)
    return f'<path fill="{fill}" d="{d}"/>'


def mark(style="line", detail=True):
    """style: 'line' (navy strokes on cream, gold accents), 'solid' (single colour fill on
    transparent, for icons and mono), with colour passed in."""
    s = []
    if style == "line":
        ink, fill, accent, sw = NAVY, CREAM, GOLD, 5
    else:
        ink, fill, accent, sw = style, style, style, 0
    stroke = f'stroke="{ink}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round"' if sw else ""
    solid = sw == 0
    hole = "var(--hole, #0B1F3B)" if solid else CREAM  # inner cut-outs on solid marks

    # crossbar with pointed pins
    bar = [(112, 300), (128, 294), (384, 294), (400, 300), (384, 306), (128, 306)]
    s.append(f'<polygon points="{pts(bar)}" fill="{fill}" {stroke}/>')
    # legs
    for f in FEET:
        s.append(f'<polygon points="{pts(leg_poly(f))}" fill="{fill}" {stroke}/>')
    # bolts where the crossbar crosses the legs
    for f in FEET:
        x = leg_x_at(f, 300)
        s.append(f'<circle cx="{x:.1f}" cy="300" r="7" fill="{fill if not solid else hole}" {stroke if not solid else ""}/>')
    if detail:  # ruler, 13 units, drawn in front of the legs so every number reads
        U = 13; x0, x1 = 124.0, 388.0; step = (x1 - x0) / U
        rfill = hole if solid else fill
        s.append(f'<rect x="110" y="342" width="292" height="36" rx="4" fill="{rfill}" stroke="{ink}" stroke-width="{sw if sw else 5}"/>')
        ticks = []
        for i in range(U * 2 + 1):
            x = x0 + i * step / 2
            h = 11 if i % 2 == 0 else 6
            ticks.append(f"M{x:.1f},342 v{h}")
        s.append(f'<path d="{" ".join(ticks)}" stroke="{ink}" stroke-width="{1.6 if not solid else 2.2}"/>')
        for n in range(U + 1):
            d, _ = text_path(str(n), "Montserrat[wght].ttf", 600, 11, x0 + n * step, 372)
            s.append(f'<path fill="{ink}" d="{d}"/>')
    # gear
    gear = gear_path(CX, 300, 33, 28, 22)
    if solid:
        s.append(f'<path d="{gear}" fill="{fill}"/>')
    else:
        s.append(f'<path d="{gear}" fill="{fill}"/>')
        s.append(f'<path d="{gear}" fill="{accent}" fill-opacity="0.25" stroke="{ink}" stroke-width="3" stroke-linejoin="round"/>')
    s.append(f'<circle cx="{CX}" cy="300" r="19" fill="none" stroke="{hole if solid else ink}" stroke-width="{3 if not solid else 4}"/>')
    s.append(f'<path d="M{CX - 19},300 H{CX + 19} M{CX},{300 - 19} V{300 + 19}" stroke="{hole if solid else ink}" stroke-width="{3 if not solid else 4}"/>')
    s.append(f'<circle cx="{CX}" cy="300" r="6" fill="{hole if solid else accent}" {"" if solid else f"stroke={chr(34)}{ink}{chr(34)} stroke-width={chr(34)}2.5{chr(34)}"}/>')
    # ring
    s.append(f'<circle cx="{CX}" cy="146" r="50" fill="none" stroke="{ink}" stroke-width="{sw if sw else 11}"/>')
    # handle + neck
    s.append(f'<rect x="{CX - 8}" y="76" width="16" height="22" fill="{fill}" {stroke}/>')
    if detail and not solid:
        s.append(f'<path d="M{CX - 8},82 h16 M{CX - 8},88 h16 M{CX - 8},94 h16" stroke="{ink}" stroke-width="2"/>')
    s.append(f'<rect x="{CX - 17}" y="22" width="34" height="56" rx="7" fill="{fill}" {stroke}/>')
    if detail and not solid:
        s.append(f'<path d="{" ".join(f"M{CX - 10 + i * 5},30 v40" for i in range(5))}" stroke="{ink}" stroke-width="2"/>')
    # hinge disc with A
    s.append(f'<circle cx="{HINGE[0]}" cy="{HINGE[1]}" r="30" fill="{fill}" {stroke}/>')
    s.append(A_glyph(HINGE[0], HINGE[1], 40, hole if solid else ink))
    # feet knobs + needles
    for i, f in enumerate(FEET):
        s.append(f'<polygon points="{pts(needle(f))}" fill="{fill if not solid else ink}" {stroke}/>')
        s.append(f'<circle cx="{f[0]}" cy="{f[1]}" r="17" fill="{fill}" {stroke}/>')
    if detail:  # side thumbscrew on the right foot
        s.append(f'<rect x="374" y="402" width="12" height="26" rx="3" fill="{fill if not solid else ink}" {stroke if not solid else ""}/>')
    return "\n  ".join(s)


def svg(vb, body, label, bg=None, extra_style=""):
    bgr = f'<rect x="{vb[0]}" y="{vb[1]}" width="{vb[2]}" height="{vb[3]}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{" ".join(map(str, vb))}" role="img" aria-label="{label}"{extra_style}>\n'
            f'  <title>{label}</title>\n  {bgr}\n  {body}\n</svg>\n')


def wordmark_block(y0, ink, accent, sub_ink, w=900):
    out = []
    d, wd = text_path("ArtPlex", "CormorantGaramond[wght].ttf", 700, 190, w / 2, y0 + 150)
    out.append(f'<path fill="{ink}" d="{d}"/>')
    tg, _ = text_path("ESTIMATION PLATFORM", "Montserrat[wght].ttf", 600, 30, w / 2, y0 + 212, tracking=0.24)
    out.append(f'<path fill="{sub_ink}" d="{tg}"/>')
    out.append(f'<rect x="{w / 2 - 250}" y="{y0 + 240}" width="500" height="2" fill="{accent}"/>')
    by, _ = text_path("by ARTEMIS Construction", "Montserrat[wght].ttf", 500, 30, w / 2, y0 + 292, tracking=0.02)
    out.append(f'<path fill="{sub_ink}" d="{by}"/>')
    return "\n  ".join(out)


def lockup(theme):
    if theme == "light":
        bg, ink, sub, m = CREAM, NAVY, NAVY, mark("line")
    else:
        bg, ink, sub = NAVY, CREAM, SILVER
        m = mark(GOLD, detail=True)
    body = f'<g transform="translate(194,0) scale(1)">\n  {m}\n  </g>\n  ' + wordmark_block(500, ink, GOLD, sub)
    style = ' style="--hole:#0B1F3B"' if theme == "dark" else ""
    return svg((0, 0, 900, 830), body, "ArtPlex — Estimation Platform, by ARTEMIS Construction", bg, style)


def app_icon():
    body = (f'<rect x="0" y="0" width="512" height="512" rx="112" fill="{NAVY}"/>\n'
            f'  <rect x="10" y="10" width="492" height="492" rx="104" fill="none" stroke="{GOLD}" stroke-opacity=".55" stroke-width="4"/>\n'
            f'  <g transform="translate(36,26) scale(0.86)">\n  {mark(GOLD, detail=False)}\n  </g>')
    return svg((0, 0, 512, 512), body, "ArtPlex", None, ' style="--hole:#0B1F3B"')


def mono(color, hole, bg=None):
    body = f'<g>\n  {mark(color, detail=False)}\n  </g>'
    return svg((60, 0, 392, 512), body, "ArtPlex", bg, f' style="--hole:{hole}"')


def hero():
    W, H = 1600, 900
    g = [f'<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#10294d"/><stop offset="1" stop-color="{NAVY}"/></linearGradient>'
         f'<radialGradient id="glow" cx=".5" cy=".36" r=".42"><stop offset="0" stop-color="{GOLD}" stop-opacity=".22"/><stop offset="1" stop-color="{GOLD}" stop-opacity="0"/></radialGradient></defs>',
         f'<rect width="{W}" height="{H}" fill="url(#sky)"/>',
         f'<rect width="{W}" height="{H}" fill="url(#glow)"/>']
    grid = " ".join([f"M{x},0 V{H}" for x in range(0, W + 1, 40)] + [f"M0,{y} H{W}" for y in range(0, H + 1, 40)])
    g.append(f'<path d="{grid}" stroke="#3B82F6" stroke-opacity=".07" stroke-width="1"/>')
    g.append(f'<g transform="translate(556.8,60) scale(0.95)" style="--hole:{NAVY}">{mark(GOLD, detail=True)}</g>')
    d, _ = text_path("ArtPlex", "CormorantGaramond[wght].ttf", 700, 150, W / 2, 760)
    g.append(f'<path fill="{CREAM}" d="{d}"/>')
    tg, _ = text_path("ESTIMATION PLATFORM", "Montserrat[wght].ttf", 600, 24, W / 2, 812, tracking=0.3)
    g.append(f'<path fill="{SILVER}" d="{tg}"/>')
    g.append(f'<rect x="{W / 2 - 200}" y="832" width="400" height="1.5" fill="{GOLD}"/>')
    by, _ = text_path("by ARTEMIS Construction", "Montserrat[wght].ttf", 500, 22, W / 2, 870, tracking=0.03)
    g.append(f'<path fill="{SILVER}" d="{by}"/>')
    return svg((0, 0, W, H), "\n  ".join(g), "ArtPlex — Estimation Platform, by ARTEMIS Construction")


if __name__ == "__main__":
    files = {
        "artplex-lockup-light.svg": lockup("light"),
        "artplex-lockup-dark.svg": lockup("dark"),
        "artplex-mark.svg": svg((0, 0, 512, 512), mark("line"), "ArtPlex", CREAM),
        "artplex-app-icon.svg": app_icon(),
        "artplex-mark-navy.svg": mono(NAVY, CREAM),
        "artplex-mark-white.svg": mono("#FFFFFF", NAVY),
        "artplex-mark-gold.svg": mono(GOLD, CREAM),
        "artplex-hero.svg": hero(),
    }
    for name, content in files.items():
        open(os.path.join(OUT, name), "w").write(content)
        print(name, len(content))
