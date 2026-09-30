#!/usr/bin/env python3
"""Servidor de desarrollo para PPSSPP Web (track psp).

El runtime de PPSSPP en WebAssembly EXIGE estas cabeceras para funcionar:
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
Sin ellas, SharedArrayBuffer está deshabilitado y el emulador no arranca.

Uso:
  python3 serve.py            # sirve en http://127.0.0.1:8080
  python3 serve.py 9000       # puerto personalizado

Solo stdlib. No usar en producción.
"""
import sys
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else int(os.environ.get("PORT", 8080))
HOST = os.environ.get("HOST", "127.0.0.1")  # en Render: HOST=0.0.0.0

class Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        '.wasm': 'application/wasm',
        '.data': 'application/octet-stream',
        '.webmanifest': 'application/manifest+json',
        '.json': 'application/json',
    }

    def end_headers(self):
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        # El service worker no debe quedar cacheado en desarrollo
        if self.path.rstrip('/').endswith('/sw.js'):
            self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, *args):
        pass

if __name__ == '__main__':
    srv = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f'PPSSPP Web en http://{HOST}:{PORT}/  (COOP/COEP activas)')
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
