# Design system

Doctrine for how each level's visuals should look, so future levels match instead of
each reinventing a style. Applied first to the Baseball level; carry it forward as the
other levels get the same treatment.

- **Characters & props**: real CC0 low-poly assets where available — Kenney's "Mini"
  series (`kenney.nl`, chunky/rounded/toy-like) is the default source. Don't hand-code
  a character out of primitives when a real model exists for it.
- **Environments**: ground, stands, field markings stay procedural primitives
  (`MeshStandardMaterial`, no textures) in the team's own colors from `STADIUM_DATA`
  (`src/stadiums.jsx`). Procedural geometry is cheap, fast, and already
  palette-consistent — asset packs don't need to cover it.
- **Lighting**: one ambient + one directional key light per scene. Extra lights only
  for feedback moments (a celebration pulse, a dimmed "that one cost you" beat), never
  running continuously.
- **Asset budget**: keep a single level's extra payload (beyond the shared three.js
  chunk) under ~1MB, and lazy-load it only when that level mounts — see
  `lazy(() => import('./baseball3d/BaseballScene'))` in `src/levels/Baseball.jsx`.
- **Attribution**: credit Kenney in `README.md` for any asset pulled from their site
  (not required under CC0, but good practice).
