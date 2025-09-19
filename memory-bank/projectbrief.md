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

- Repository up-to-date at commit: `9c885c6031b7137163acaa1dd97d80f19f61b893` (2025-08-20).
- Core features implemented: authentication, food inventory CRUD, recipe storage, basic meal planning, partial Gemini AI integration.
- Documentation extended to outline upcoming household consumables and assets modules (`docs/design/household-inventory.md`).
- Active work visible in the codebase: inventory add flow (src/views/inventory/add/page.tsx), Inventory listing (src/views/inventory/page.tsx), and layout/navigation tweaks (src/components/layouts/AppLayout.tsx, src/components/bottom-nav.tsx).
- Memory Bank documentation system present and being maintained.

## Immediate Priorities

1. Stabilize Gemini AI responses and parsing for recipe suggestions.
2. Implement barcode scanning and expiration alerts for food inventory.
3. Finalize data model plans and feature flags for consumables and assets modules.
4. Polish inventory add/edit UX and quantity/unit handling.
5. Improve test coverage and consistent loading/error states.

## Notes

This file was refreshed automatically to reflect the current repository state and open work (2025-08-20 20:27 UTC+7).
