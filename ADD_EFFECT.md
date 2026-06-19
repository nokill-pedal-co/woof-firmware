# Adding a WOOF effect to the flasher

This repo **is** the live flasher: it's published via GitHub Pages from
`origin/main` (https://github.com/nokill-pedal-co/woof-firmware) and served at
<https://nokill-pedal-co.github.io/woof-firmware/>. Push to `main` and the site
redeploys automatically in ~30–60 s. There is no build step — the HTML is hand
-authored and the `.bin` files are served raw from `firmware/`.

> ⚠️ This is the **manual** version of the WOOF Workshop "flasher handoff"
> (gap G8). When that's automated, this checklist is what it will reproduce.

## File naming convention

Firmware binaries live in `firmware/` and are named by effect + platform:

| Platform        | File suffix             | Registry key suffix | `platform` value |
|-----------------|-------------------------|---------------------|------------------|
| Terrarium       | `<effect>.bin`          | `<effect>`          | (omit; default)  |
| FunBox (guitar) | `<effect>_funbox.bin`   | `<effect>_funbox`   | `funbox`         |
| Hothouse        | `<effect>_hothouse.bin` | `<effect>_hothouse` | `hothouse`       |
| FunBox (synth)  | `<effect>_synth_funbox.bin` | `<effect>_synth` | `funbox` + `signal: 'synth'` |

The registry key suffix drives the controls-page deep link via
`controlsAnchor()` in `index.html`: key `foo_funbox` → `controls-foo.html#funbox`.

`.bin` size must stay under **131072 bytes (128 KB)** — the flasher erases and
writes a single 128 KB sector at `0x08000000`. All current effects are ~85–103 KB.

## Steps to add an effect (e.g. `faint_vox`, FunBox)

1. **Build the firmware** (in the `Digital` repo, e.g.
   `FunBox/faint_vox/`): `make`, producing `build/faint_vox.bin`.

2. **Copy the bin** into this repo, renamed to the platform convention:
   ```
   cp .../FunBox/faint_vox/build/faint_vox.bin  firmware/faint_vox_funbox.bin
   ```

3. **Register it** in `index.html` → the `FIRMWARE_DATA` object. Add an entry
   keyed `faint_vox_funbox` with: `name`, `file`, `platform`, **`official: true`**,
   `desc`, and a `controls: [...]` array (last line `'See full controls reference at /controls.html'`
   makes the info panel render the deep link). For a synth build also add
   `signal: 'synth'`.

4. **Create the controls page** `controls-<effect>.html` (slug uses hyphens:
   `controls-faint-vox.html`). Copy an existing one (e.g.
   `controls-great-dane.html`) and keep the `<style>`, header, footer, and the
   `<script>` toggle as-is. Include only the `.platform-toggle` tabs / `.pedal`
   sections for platforms you actually shipped — a tab with no matching panel
   shows a blank page.

5. **Add a card** to `controls.html` (the index grid): an `<a class="effect-card">`
   with the badges for the platforms you shipped (`T` / `FB` / `HH` / `Synth`).

6. **Commit and push** to `main`:
   ```
   git add firmware/faint_vox_funbox.bin index.html controls-faint-vox.html controls.html
   git commit -m "Add Faint Vox FunBox effect to flasher"
   git push origin main
   ```
   GitHub Pages redeploys automatically. Hard-refresh the live URL to verify.

## Trust flag (official vs community)

`index.html` shows a trust badge in the firmware info panel:

- **Official** (green "✓ Official · built & tested by NOKILL"): the default.
  Entries are treated as official unless they explicitly set `official: false`.
  Mark NOKILL/Alex-built effects with `official: true` for clarity.
- **Community** (amber "⚠ Community · user-generated, untested"): set
  `official: false`. Reserved for future user-generated effects (WOOF Workshop).
  These are the *untrusted* path — only safe to expose once the firmware safety
  rails (sanitizer/limiter, watchdog, DFU escape) are enforced template-side.
