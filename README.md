# woof-firmware

Source for the NOKILL Pedal Co **W.O.O.F.** browser firmware flasher, published
via GitHub Pages at <https://nokill-pedal-co.github.io/woof-firmware/>.

- `index.html` — the WebUSB/DfuSe flasher and the `FIRMWARE_DATA` registry.
- `controls.html` + `controls-<effect>.html` — per-effect control references.
- `firmware/` — the raw `.bin` files served to the browser and flashed to the pedal.

Pushing to `main` redeploys the live site automatically (no build step).

**To add a new effect to the flasher, see [ADD_EFFECT.md](ADD_EFFECT.md).**
