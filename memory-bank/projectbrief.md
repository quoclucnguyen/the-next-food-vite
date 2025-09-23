# The Next Food - Project Brief

## Project Overview

The Next Food is a comprehensive household inventory and meal planning web application built with React, TypeScript, and Vite. It started as a food-focused tool and is now expanding to manage all household items (food, date-tracked consumables, and durable assets) alongside recipes, meal planning, and shopping lists.

## Core Purpose

This application addresses the common challenges of household inventory chaos, food waste, and planning inefficiencies by providing an integrated platform that connects multi-module inventory tracking with meal planning, AI-assisted recipes, and shopping.

## Key Features

- **Inventory Management**: Track food items, dated consumables, and durable assets with categories, locations, and lifecycle data
- **Recipe Management**: Store, organize, and discover recipes with AI-powered suggestions
- **Meal Planning**: Plan meals based on available inventory and dietary preferences
- **Shopping Lists**: Generate smart shopping lists based on meal plans and inventory gaps
- **AI Integration**: Leverage Gemini AI for recipe suggestions and meal planning assistance
- **Barcode Scanning**: Quick item entry through barcode scanning functionality (high priority)
- **Multi-language Support**: Vietnamese language support with proper formatting

## Target Users

- Home cooks who want to reduce food waste
- Families looking to streamline meal planning, grocery shopping, and household upkeep
- Individuals interested in better household inventory management beyond the kitchen
- Users who want AI-assisted cooking suggestions and smart reminders for consumables/assets

## Technical Foundation

- **Frontend**: React (v19.x) with TypeScript and Vite
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Backend**: Supabase for authentication and data storage
- **AI Integration**: Google Gemini API for intelligent suggestions
- **State Management**: React Query (v5.x) for server state management
- **Routing**: React Router
- **Testing**: Vitest for unit testing

## Success Metrics

- Reduced food waste through better food inventory tracking
- Decreased missed replacement dates for consumables (filters, medication, safety gear)
- Improved visibility into household assets (location, owner, warranty status)
- Enhanced meal planning efficiency and grocery shopping accuracy
- Increased user engagement with AI-powered features across all inventory modules
- Seamless multi-device synchronization

## Current Status (refreshed)

- Repository up-to-date at commit: `812f7281c0ed8b0add7bde18b1dbfb1c20c964c1` (2025-09-23).
- Core features in production: Supabase auth, food inventory CRUD + filtering, recipe management, meal planning calendar, shopping list generation, restaurant tracker, and the cosmetics inventory module with AI-assisted intake and reminder scheduling.
- Cosmetics workflows live under `src/views/cosmetics/`; the add page is modularised with AI analysis (`components/CosmeticAIAnalysisCard`), lifecycle summaries, and reminder configuration tied to Supabase hooks.
- Gemini integration backed by `src/lib/gemini/*` powers cosmetic image analysis; recipe generation remains a stub until the Gemini client implements `generateCompleteRecipe`.
- Documentation and Memory Bank remain the canonical sources for cross-session context and are being actively refreshed.

## Immediate Priorities

1. Surface cosmetics reminders beyond the intake page (dashboard widgets, notifications) and introduce automated reminder status updates.
2. Seed and govern cosmetics category taxonomy + feature flag toggles for staged rollout across households.
3. Deliver cosmetics detail/timeline views that expose `cosmetic_events` logs and quick note capture.
4. Kick off consumables inventory module (schema, hooks, list/intake UX) using cosmetics architecture as the template.
5. Implement robust Gemini recipe generation + error handling so AI flows extend beyond cosmetics image analysis.

## Notes

This file was refreshed automatically to reflect the current repository state and open work (2025-09-23 11:35 UTC+7).
