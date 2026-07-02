# Artemis Time Atlas V1 — Production Start Kit

Date: 2026-07-02

## Purpose

This kit is the production-control package for building **Artemis Time Atlas V1: Troy / Ilion c. 600 BC** as a vertical, mobile-first, museum-quality interactive 3D diorama.

The goal is not to build the full world engine yet. The goal is to create one polished, emotionally powerful demo masterpiece:

> Fixed terrain. Changing civilization.

## Recommended Usage

Drop this package into the root of the existing Artemis/Next.js repository, preferably under:

```txt
docs/time-atlas/
```

Then give Claude Code Fable the prompts in order.

## Agent Roles

### Claude Code Fable
Primary builder.

Responsibilities:
- scaffold the route
- implement the React Three Fiber scene
- create the UI components
- wire local data
- improve visual polish
- run lint/build
- commit on a feature branch

### Codex
Independent reviewer and hardening agent.

Responsibilities:
- check TypeScript/build correctness
- identify React Three Fiber anti-patterns
- check performance risks
- check secrets/security
- improve route isolation
- run final QA

## Production Principle

Do not ask one AI agent to invent everything.

Use this production kit to give the agents:
- architecture
- standards
- prompts
- data shape
- route boundaries
- visual direction
- QA criteria

Then let them implement.
