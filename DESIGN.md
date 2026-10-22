# Design system

Doctrine for how each level's visuals should look, so future levels match instead of
each reinventing a style. Applied first to the Baseball level; carry it forward as the
other levels get the same treatment.

## Visual language: Art Deco

Chosen after a 3D (three.js + a real CC0 character model) pass still read as amateur —
a textured figure standing in an untextured primitive world, no shadows, approximate
prop attachment. Art Deco turns the actual constraint (flat shapes, no textures) into
the style itself, and plays directly to the game's real hook: a kid learning about
genuinely distinctive Seattle venues (T-Mobile Park's roofline, Climate Pledge Arena's
real preserved 1962 World's Fair structure).

- **Medium**: plain SVG + CSS, matching Football/Soccer/Basketball. No canvas, no
  WebGL — a textured 3D figure next to flat 3D geometry is what we're moving away
  from, so don't reintroduce a fidelity gap by mixing mediums again.
- **Motifs**: stepped/ziggurat frame borders, thin hairlines, a sunburst fan of
  triangular rays, figures built from faceted geometric polygons rather than organic
  curves.
- **Palette**: Deco is a *treatment*, not one fixed palette — each stadium keeps its
  own identity color from `STADIUM_DATA` (`src/stadiums.jsx`) as the accent/hairline
  color against a dark navy-family ground. Husky Stadium's purple/gold should read as
  Deco just as T-Mobile Park's navy/gold does.
- **Type pairing**: `Poiret One` (`FONT_DECO` in `src/theme.js`) for small
  label/accent text — team name, stadium name, decorative tags. Keep `Bebas
  Neue`/`Oswald` (`FONT_DISPLAY`) for big bold numerals and headlines; don't replace
  it, layer the Deco face in alongside it.

## Other standing rules

- **Asset budget**: keep a single level's extra payload small and lazy-load it only
  when that level mounts if it ever does need a real asset — see the pattern in
  `src/App.jsx` where each level component is imported directly (cheap, all SVG/CSS;
  revisit lazy-loading only if a level adds something heavy again).
- **Attribution**: credit any third-party asset pack used, in `README.md`.
