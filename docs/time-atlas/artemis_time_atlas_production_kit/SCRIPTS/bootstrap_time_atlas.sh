#!/usr/bin/env bash
set -euo pipefail

echo "Bootstrapping Artemis Time Atlas V1 folders..."

mkdir -p docs/time-atlas/ENGINEERING/ADR
mkdir -p docs/time-atlas/ENGINEERING/STANDARDS
mkdir -p docs/time-atlas/PROMPTS
mkdir -p docs/time-atlas/RESEARCH/TROY/{HISTORY,TOPOGRAPHY,SATELLITE,ARCHAEOLOGY,SOURCES,KML,DEM}
mkdir -p docs/time-atlas/ASSETS/{MODELS,TEXTURES,UI,FONTS}

mkdir -p app/time-atlas/troy
mkdir -p components/time-atlas/troy
mkdir -p data/troy
mkdir -p types/time-atlas

echo "Installing V1 dependencies..."
npm install three @types/three @react-three/fiber @react-three/drei
npm install gsap zustand framer-motion

echo "Bootstrap complete."
