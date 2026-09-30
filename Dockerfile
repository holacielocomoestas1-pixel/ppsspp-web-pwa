FROM python:3.12-slim
WORKDIR /app
COPY . .
# Render inyecta $PORT; serve.py lo lee y emite las cabeceras COOP/COEP
# que exige el runtime WASM de PPSSPP (SharedArrayBuffer).
CMD ["sh", "-c", "HOST=0.0.0.0 python3 serve.py"]
