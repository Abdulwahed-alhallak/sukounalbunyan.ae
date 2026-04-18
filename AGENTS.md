# DIONAGENT — Universal Project Intelligence Layer

## Purpose

This repository uses `.dionagent/` as the main source of truth for agent behavior, project discovery, implementation planning, verification, and delivery.

Agents must treat this system as a practical execution layer for:
- greenfield projects started from scratch
- brownfield projects that already exist and must be detected before modification
- hybrid repositories containing Laravel, React, Vite, Next.js, APIs, static assets, automation, or deployment files

## Operating Principle

Discovery comes before implementation.

Do not modify architecture, runtime, database, or deployment assumptions until repository evidence has been inspected.

## Platform Defaults

Unless strong repository evidence says otherwise, use these defaults:
- Backend default: Laravel
- Local database default: MySQL on XAMPP
- Frontend default: multilingual React + Vite or Next.js
- Git hosting default: GitHub
- CI/CD default: GitHub Actions
- Production hosting default: Hostinger

These are default operating assumptions, not hard locks.

Always prefer repository evidence over defaults.

Always classify runtime and deployment shape before changing architecture.

## Required Entry Behavior

When an agent enters the project, it must:
1. Read `.dionagent/core/manifest.md`
2. Read `.dionagent/core/operating-model.md`
3. Run the discovery logic defined in `.dionagent/bootstrap/discover-project.md`
4. Produce project outputs before implementation if they do not already exist
5. Select the correct workflow from `.dionagent/workflows/`

## Non-Negotiable Rules

- Do not implement before discovery is complete.
- Do not infer the stack from a single file.
- Do not replace Laravel, MySQL, React, Vite, or Next.js without explicit instruction or strong repository evidence.
- Do not assume static hosting for apps that require a Node runtime.
- Do not collapse split frontend/backend architectures into a monolith unless explicitly instructed.
- Do not introduce a second i18n system if one already exists.
- Do not change deployment assumptions without inspecting GitHub workflows, build configs, and runtime requirements.

## Required Outputs

Before implementation, maintain these artifacts under `.dionagent/outputs/`:
- `detected-project-profile.md`
- `detected-architecture-map.md`
- `detected-runtime-model.md`
- `detected-deployment-shape.md`
- `active-implementation-plan.md`
- `verification-status.md`

## Truth Hierarchy

Use this order of truth:
1. Explicit repository evidence
2. Existing project architecture
3. Existing deployment and runtime configuration
4. `.dionagent` defaults
5. Conservative fallback heuristics

## Delivery Standard

All work must finish with:
- implementation summary
- changed surface summary
- risk notes
- verification result
- next safe step
