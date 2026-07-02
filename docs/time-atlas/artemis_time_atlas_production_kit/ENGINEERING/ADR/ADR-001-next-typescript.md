# ADR-001 — Use Next.js + TypeScript

## Status
Accepted

## Decision
Artemis Time Atlas V1 will be implemented inside the existing Next.js + TypeScript application.

## Rationale
Next.js supports Vercel deployment, app routes, metadata, code splitting, and the existing Artemis web architecture. TypeScript enforces data and component correctness.

## Consequences
- The V1 route will be `/time-atlas/troy`.
- Client-only 3D components must use dynamic import or `"use client"`.
- Heavy 3D logic should be isolated from non-3D pages.
