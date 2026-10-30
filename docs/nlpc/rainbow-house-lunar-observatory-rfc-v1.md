# Rainbow House Lunar Observatory — Long-Lived Product Architecture
Status: design RFC, no production behavior changed. Date: 2026-10-25.

## Product intent
An elegant, trustworthy, location-aware lunar and sky companion to the Rainbow House guest experience, reusable for other Artemis client environments. The product must distinguish **scientific measurements** from **editorial visualizations** and **artistic interpretations**.

## Design principles
1. **Truth before spectacle.** No fictitious moon sizes, phases, rise/set times, azimuths, or colors presented as observational facts.
2. **Place before cliché.** The actual Marlboro/Hudson Valley horizon replaces Stonehenge in the guest product. Stonehenge belongs only in an explicitly separate educational scene.
3. **Timeless restraint.** Ink/navy, warm ivory, muted brass, subtle glass. Editorial serif display + accessible sans for data. No perpetual glowing gradients or excessive motion.
4. **One focal point.** The selected moon/day card expands; all other days stay quiet.
5. **Graceful offline and low-end operation.** Static poster and cached ephemeris first, optional animations later.
6. **Accessibility by design.** Keyboard/touch navigation, visible focus, semantic labels, reduced motion, contrast and readable numerical data.
7. **Maintainability.** Astronomical calculations, asset pipelines, rendering and state management are independent modules.

## Target UI
- Hero: real landscape image/video with properly marked time, season and source; overlay physically plausible moon at correct relative sky position when simulation is enabled. **Never** imply an illustrative composite is an unaltered photograph.
- Calendar: horizontal compact cards; active card scales modestly (not the whole carousel), expands details in a dedicated panel. Mobile: 1 active card + partial adjacent cards, swipe and buttons.
- Modes: `photographic` (NASA texture with phase mask), `diagram` (flat educational rendering), `artistic` (explicitly labeled). Prefer names over ambiguous `realistic`.
- Date modes: day, week, month. Timezone: America/New_York; location explicit Marlboro NY with user permission for precise property coordinates.
- Selected date controls the detail panel, trajectory visualization and lunar phase. Data source and calculation timestamp accessible.

## State and renderer lifecycle
Single authoritative state: `{dateISO, mode, view, location, selectedIndex}`. Persist only non-sensitive preferences; do not duplicate renderer-specific mode flags. A mode change must be reversible and idempotent:
- calculate date/location data once, independently of mode;
- retain selected date and scroll position;
- cancel old transitions/animation frames and release unused textures;
- swap only presentation layer;
- return to photographic mode with exactly the same data and image as before;
- avoid animation side effects during hydration.
Do not bind visual appearance to astronomy calculations.

## Astronomy contract
Use a validated astronomical library or JPL/NASA ephemerides for moon phase angle, illuminated fraction, topocentric altitude/azimuth, rise/set and civil/nautical/astronomical twilight. Unit-test timezones, daylight-saving transitions, near-horizon cases, polar/no-event cases, month boundaries, leap years and southern hemisphere illumination orientation. Dates in image references are illustrative and **must not** be copied as verified data. A 'blue moon' may mean calendar-month or seasonal definition; state which definition. Named full moons are cultural/editorial labels, not physical lunar colors. Never imply Strawberry Moon is inherently pink.

## Media and licensing
- Real Moon: NASA Scientific Visualization Studio or other documented lunar imagery, preserve source URL, credit, capture date, license and processing record. A lunar texture plus shading is a visualization, not a current live photograph.
- Landscape: approved Rainbow House source footage, with consent checks; source master kept private, derivative WebP/AVIF posters and short muted MP4/WebM loops. Avoid public use of family/child images without explicit guardian consent.
- Photographic hero must use actual property footage or a labeled composite. No third-party stock location mislabeled as Rainbow House.
- Build manifest for each asset: `id,source,license,attribution,consent,transform,dimensions,bytes,checksum`.

## Performance budget (initial targets, subject to measurement)
- Mobile LCP <= 2.5s at p75 under representative connection; CLS <= 0.1; INP <= 200ms.
- Initial critical hero poster <= 250KB where visually acceptable; no auto-playing video on data saver/reduced-motion.
- Calendar interactions respond immediately; target <= 100ms JS work and <= 300ms nonessential animation.
- Lazy load nonvisible lunar textures, neighboring dates only. Memoize ephemeris by date/location/timezone. Precompute stable daily results server-side if needed.
- Animate transform and opacity; avoid repeated canvas redraws/layout thrashing. Use performance profiling before choosing Canvas/WebGL over CSS/SVG.

## Verification gates
A. Reproduction: switch photographic -> diagram -> photographic 20 times, assert same moon texture, selected date, numeric values, no missing texture, no growing event listeners.
B. Truth: compare phase, illumination and rise/set against trusted ephemeris on representative dates and DST boundaries; specify numerical tolerances after choosing engine.
C. Responsive: iPhone small/large, tablet, desktop; portrait and landscape; touch, keyboard and screen reader.
D. Media: correct property provenance and consent; clear labeling of composites; graceful image fallback.
E. Quality: Lighthouse and real-device profiling; no console errors, hydration warnings, broken links, accessibility blockers.
F. Release: isolated feature branch -> preview READY -> route HTTP 200 -> owner approval -> merge -> production READY -> rollback link documented.

## Sequenced delivery
P0: locate current moon calendar source and reproduce toggle failure with automated test; capture baseline performance.
P1: extract data model, deterministic mode reducer and test suite; fix reversible mode switching.
P2: integrate NASA-derived moon texture and correct phase-mask/lighting with credits; retain diagram mode.
P3: integrate approved Hudson Valley media and responsive expanding-card design; verify on iPhone.
P4: astronomical rise/set/azimuth/twilight integration with independent validation.
P5: performance/accessibility regression suite, observability and reusable Artemis component packaging.

## Boundaries
This RFC is not the existing calendar implementation. Do not claim the mode-switch bug is fixed until the exact source is located, patched and tested. Do not merge the open Rainbow House media-story PR automatically. No live booking, payment, CRM or guest PII is part of this work.
