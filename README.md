# PPSSPP Web — Track A del proyecto emulador

PWA completa con **PPSSPP** (emulador de PSP) compilado a **WebAssembly**,
lista para instalar en móvil y escritorio. El usuario carga sus propios
juegos (ISO/CSO/CHD/PBP) desde archivos locales de su dispositivo.

> **Regla dura del proyecto:** aquí NO hay, ni habrá, ROMs comerciales, BIOS
> ni juegos enlazados. La app solo trae el emulador; cada usuario aporta sus
> propios dumps legales.

## Licencia

El núcleo del emulador y el shell web son obra de
[root-hunter/ppsspp-web](https://github.com/root-hunter/ppsspp-web)
(núcleo WASM: [root-hunter/ppsspp-wasm](https://github.com/root-hunter/ppsspp-wasm),
upstream [hrydgard/ppsspp](https://github.com/hrydgard/ppsspp)) bajo
**GPL-2.0-or-later**. El texto completo está en `LICENSE.TXT` y hay un aviso
visible y descartable en la UI (esquina inferior izquierda). Ver `SOURCE.md`
para URLs, commits y SHA-256 de cada archivo vendeado.

Los archivos propios de este track (`manifest.json`, `sw.js`, `serve.py`,
iconos, este README) se ofrecen bajo la misma licencia GPL-2.0-or-later
para mantener la compatibilidad con el código vendeado.

## Estructura

```
index.html              shell (adaptado: manifiesto propio, SW, aviso GPL)
main-MIIWU7DR.js        shell Angular vendeado (prístino)
styles-SL6FIHK4.css     estilos vendeados (prístinos)
ppsspp-runtime.js       cargador del runtime WASM vendeado (prístino)
build-wasm/             PPSSPPSDL.{data,js,wasm} vendeados (~37 MB)
manifest.json           manifiesto PWA propio (iconos generados localmente)
sw.js                   service worker propio
serve.py                servidor de desarrollo (stdlib) con COOP/COEP
_headers.example        ejemplo de cabeceras para Cloudflare Pages
icons/                  iconos PNG generados localmente + capturas de verificación
LICENSE.TXT             GPL-2.0-or-later (copia del repo original)
SOURCE.md               origen, commits y checksums de lo vendeado
verificacion/           capturas del boot verificado
```

## Correr en local

```bash
cd ~/workspace/emulador/psp
python3 serve.py        # http://127.0.0.1:8080
```

Abrir esa URL, pulsar **Start PPSSPP** y luego **Open Game** para elegir un
archivo local `.iso/.cso/.chd/.pbp` del propio dispositivo.

### Requisito innegociable: cabeceras COOP/COEP

El WASM usa `SharedArrayBuffer`, que el navegador solo habilita si **todas**
las respuestas traen:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

`serve.py` ya las envía. Sin ellas verás `SharedArrayBuffer is not defined`
y el emulador no arranca.

## Desplegar

- **GitHub Pages NO sirve**: no permite cabeceras personalizadas.
- **Cloudflare Pages SÍ**: copia `_headers.example` como `_headers` en la raíz.
- **Render**: un *Static Site* no garantiza estas cabeceras vía API; la vía
  verificada es un **Web Service** (tier gratuito) que ejecute `serve.py`,
  que las emite él mismo:
  - Build Command: *(vacío)*
  - Start Command: `python3 serve.py` (lee el puerto de `$PORT`)
  - Repo con el contenido de este directorio en la raíz.

## Guardados

El shell guarda en **OPFS** (Origin Private File System) del navegador:
`PSP/SAVEDATA/<juego>/…` y `PSP/PPSSPP_STATE/…`. Persisten entre sesiones
del mismo origen/navegador. Verificado con prueba automatizada (escribir →
recargar → leer, 2026-09-30).

El service worker (`sw.js`) cachea **solo el shell** (HTML/JS/CSS/WASM/
iconos/manifiesto). Nunca cachea contenido del usuario: los juegos se cargan
por `<input type=file>` local y no pasan por la caché.

## Verificado el 2026-09-30 (sin juegos, solo boot al menú)

- Servidor local con COOP/COEP → `crossOriginIsolated === true`,
  `SharedArrayBuffer` disponible, WebGL2 vía SwiftShader.
- Click real en **Start PPSSPP** (Chromium real vía CDP): el runtime WASM
  compila y PPSSPP **1.20.4-wasm** arranca hasta su menú principal
  (pestañas Recent/Games/Homebrew & Demos, Settings, About).
- Capturas:
  - `verificacion/boot-desktop-1280x800.png` (menú PPSSPP, 1280×800)
  - `verificacion/boot-mobile-390x844.png` (menú PPSSPP, 390×844)
- Iconos 192/512 (+maskable, +apple-touch-icon) generados localmente con PIL.
- Sin errores JS que impidan el arranque (consola limpia salvo avisos menores
  del shell).
- **Límite honesto:** en headless el render es por software (SwiftShader,
  ~1–3 FPS); en un dispositivo real con GPU el menú y los juegos van a
  velocidad normal. No se probó con ningún juego (prohibido por las reglas).
