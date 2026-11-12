#!/bin/bash

echo ""
echo "🔥 Commander – Iniciando sistema de comandas"
echo "============================================="
echo ""

# Instalar dependencias si es la primera vez
if [ ! -d "backend/node_modules" ]; then
  echo "📦 Instalando dependencias del backend..."
  cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "📦 Instalando dependencias del frontend..."
  cd frontend && npm install && cd ..
fi

echo "🚀 Arrancando backend en :3001 ..."
cd backend && npm start &
BACKEND_PID=$!

sleep 2

echo "🌐 Arrancando frontend en :3000 ..."
cd ../frontend && npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Commander corriendo:"
echo "   Camarero/Cocina/Barra → http://localhost:3000"
echo "   API                   → http://localhost:3001/api"
echo ""
echo "   Para otros dispositivos en la misma red:"
echo "   → Sustituye 'localhost' por la IP de este equipo"
echo ""
echo "   Ctrl+C para parar todo"
echo ""

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Commander detenido.'" EXIT
wait
