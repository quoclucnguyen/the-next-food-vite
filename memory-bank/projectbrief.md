# The Next Food - Project Brief

## Project Overview

The Next Food is a comprehensive food management web application built with React, TypeScript, and Vite. It serves as an all-in-one solution for inventory management, meal planning, recipe organization, and shopping list management.

## Core Purpose

This application addresses the common challenges of food waste, meal planning inefficiency, and grocery shopping disorganization by providing an integrated platform that connects inventory tracking with meal planning and shopping.

## Key Features

- **Inventory Management**: Track food items with expiration dates, quantities, and categories
- **Recipe Management**: Store, organize, and discover recipes with AI-powered suggestions
- **Meal Planning**: Plan meals based on available inventory and dietary preferences
- **Shopping Lists**: Generate smart shopping lists based on meal plans and inventory gaps
- **AI Integration**: Leverage Gemini AI for recipe suggestions and meal planning assistance
- **Barcode Scanning**: Quick item entry through barcode scanning functionality (high priority)
- **Multi-language Support**: Vietnamese language support with proper formatting

## Target Users

- Home cooks who want to reduce food waste
- Families looking to streamline meal planning and grocery shopping
- Individuals interested in better food inventory management
- Users who want AI-assisted cooking suggestions

## Technical Foundation

- **Frontend**: React (v19.x) with TypeScript and Vite
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Backend**: Supabase for authentication and data storage
- **AI Integration**: Google Gemini API for intelligent suggestions
- **State Management**: React Query (v5.x) for server state management
- **Routing**: React Router
- **Testing**: Vitest for unit testing

## Success Metrics

- Reduced food waste through better inventory tracking
- Improved meal planning efficiency
- Enhanced grocery shopping experience
- User engagement with AI-powered features
- Seamless multi-device synchronization

## Current Status (refreshed)

- Repository up-to-date at commit: `9c885c6031b7137163acaa1dd97d80f19f61b893` (2025-08-20).
- Core features implemented: authentication, inventory CRUD, recipe storage, basic meal planning, partial Gemini AI integration.
- Active work visible in the codebase: inventory add flow (src/views/inventory/add/page.tsx), Inventory listing (src/views/inventory/page.tsx), and layout/navigation tweaks (src/components/layouts/AppLayout.tsx, src/components/bottom-nav.tsx).
- Memory Bank documentation system present and being maintained.

## Immediate Priorities

1. Stabilize Gemini AI responses and parsing for recipe suggestions.
2. Implement barcode scanning and expiration alerts.
3. Polish inventory add/edit UX and quantity/unit handling.
4. Improve test coverage and consistent loading/error states.

## Notes

This file was refreshed automatically to reflect the current repository state and open work (2025-08-20 20:27 UTC+7).
