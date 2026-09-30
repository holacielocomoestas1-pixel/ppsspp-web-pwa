# SOURCE.md — Origen de los artefactos vendeados (track psp)

**Fuente elegida:** demo publicada de `root-hunter/ppsspp-web`
(la fuente viva más nueva; el snapshot de `pathipat11/web-emulator` es anterior).

- Demo: https://root-hunter.github.io/ppsspp-web/
- Repo shell: https://github.com/root-hunter/ppsspp-web
- Repo núcleo WASM: https://github.com/root-hunter/ppsspp-wasm
- Upstream PPSSPP: https://github.com/hrydgard/ppsspp
- Licencia: **GPL-2.0-or-later** (commit `57121017f82f411f96ca0481dbd0c9d609e9cc0b`
  del 2026-09-10 cambió el identificador SPDX de `GPL-2.0-only` a `GPL-2.0-or-later`).
  Texto completo en `LICENSE.TXT` (copia del repo).
- Descarga: 2026-09-30 (archivos publicados servidos por GitHub Pages).
- Último push del repo shell: 2026-09-10T10:25:00Z (commit `57121017`).
- Último commit del núcleo ppsspp-wasm: `0dbfaca62a8a924abc2c5dd5dd0733b668e5e68a` (2026-06-02).

## Checksums SHA-256 de los archivos vendeados (prístinos, tal como se publicaron)

```
6937e525d96f32e9bada10e59e25ab9bede91321d1b079bc8db22cf5e5b4f442  index.html (prístino)
39ada8f306a32817de1eaace7723e99fe3697b8c2c262eaf9f22b7783678fca5  main-MIIWU7DR.js
ef94552b51d71a3b90ad526547ab62b26b815fd0a3fe18e84d13ad5e053d8ec0  styles-SL6FIHK4.css
ef51087a9c4a15bc1b26bf4611d64a5e0eb68ca66ae1bd5ea42234e7cbad92bf  ppsspp-runtime.js
7adbc0f70a5d97622b668846c0891d8c0eff4e87881b56b31c4c0bedcb188dea  manifest.webmanifest (original publicado; se usa manifest.json)
ff265754cbb2e0d3b674f90a79ef5bbaa1f7f1075aec9f5e241524520e5049fa  LICENSE.TXT
881e5472ccb56513e5e8fa0e95214e7827c66ccbdac2912e78d572584e687e0b  build-wasm/PPSSPPSDL.data (22.417.304 bytes)
c2850de1dfa601439b69cc28a83b0ed11ebb1312ed54fa711edd672d21eddd2f  build-wasm/PPSSPPSDL.js (354.611 bytes)
01d1538937e27ab56cb73f149fda2434053a0a619df260cf8280e7263d2ec964  build-wasm/PPSSPPSDL.wasm (14.272.087 bytes)
```

Los tamaños descargados coinciden byte a byte con el `Content-Length` servido.

## Adaptaciones locales (archivos propios, no vendeados)

- `index.html` (sha256 actual `a7e1430c…`): apunta a `manifest.json` (no al
  `.webmanifest` original), registra `sw.js`, usa `icons/apple-touch-icon.png`
  y añade un chip visible y descartable con el aviso GPL-2.0-or-later.
- `manifest.json`, `sw.js`, `serve.py`, `icons/*.png`, `_headers.example`,
  `README.md`: creados localmente para este proyecto.
- Iconos PNG generados localmente con PIL (el shell original traía los suyos;
  se sustituyeron por iconos propios del proyecto).

## Qué NO se vendeó

Ningún juego, ROM, BIOS ni contenido comercial. La verificación se hace
arrancando PPSSPP hasta su menú, sin cargar ningún juego.
