# Household Inventory Modules

## Overview
The inventory domain now spans three parallel modules so food-specific workflows remain stable while the product grows to cover the rest of the household:
- **Food Inventory (existing)** continues to manage edible items and beverages with quantity, unit, and expiration tracking.
- **Household Consumables (date-tracked)** covers non-food supplies that ship with a manufacturer best-before, replacement, or inspection date (filters, medication, cleaning chemicals, safety gear).
- **Household Assets (non-date)** catalogs durable goods that do not expire but still need organization, location tracking, and maintenance context (appliances, tools, furniture, electronics).

Cosmetics, clothing, and clothing-related accessories are intentionally out of scope for every module per product decision.

## Module Breakdown
### Food Inventory (Existing)
- Reuse current `inventory_items` schema and UI.
- Continue to power meal planning, recipe suggestions, and consumption analytics.
- Shares category taxonomy with the other modules for cross-module filtering in future dashboards.

### Household Consumables (Date-tracked)
- New table scoped to consumables with fields: `name`, `quantity`, `unit`, `category_id`, `location_id`, `replacement_date`, `reminder_lead_days`, `notes`, `image_url`, `attachment_url`.
- Planned features: calendar reminders for replacement dates, AI-assisted intake that parses labels/receipts, and quick restock suggestions.
- Integrates with shared settings for alert lead times and language localization.

### Household Assets (Non-date)
- New table focused on durable goods with fields: `name`, `category_id`, `location_id`, `owner_id`, `purchase_date`, `purchase_price`, `serial_number`, `warranty_end`, `notes`, `attachments`.
- Planned features: advanced search facets (owner, room, asset type), maintenance log entries, manual/receipt uploads, and quick actions (assign, retire, archive).
- Shares the same AI analysis hook to preload fields from photos or invoices (model prompt tuned for asset descriptors instead of food labels).

## Item Coverage Reference
Household items are grouped by whether they rely on explicit dates for management. The lists below inform category seeding, AI prompts, and UX copy. They are designed to be broad but not exhaustive, and they purposely omit cosmetics and clothing.

### Items With Lifecycle Dates
- Fresh produce, meat, seafood, deli items, and prepared meals
- Dairy, eggs, yogurt, cheese, and refrigerated beverages
- Frozen foods and long-term pantry staples (canned goods, grains, sauces, baking ingredients)
- Baby food, infant formula, and toddler snacks
- Pet food, treats, and pet supplements
- Prescription medication, over-the-counter medicine, vitamins, and dietary supplements
- First-aid supplies (antiseptics, ointments, bandages, sterile pads)
- Cleaning and laundry chemicals (disinfectant, bleach, descalers, detergents, dishwasher tablets)
- Water, HVAC, and air purifier filters or cartridges
- Humidifier wicks, dehumidifier filters, and reverse-osmosis cartridges
- Fire extinguishers, smoke/CO detector sensors, emergency lighting batteries
- Single-use and rechargeable batteries with manufacturer shelf lives
- Pest control, garden fertilizers, weed killers, and pool chemicals
- Propane tanks, fuel canisters, and camping stove gas with recertification dates
- Vehicle and household safety kits (flares, emergency rations, first-aid packs)
- Documents that expire (passports, driver's licenses, vehicle registration, insurance papers)

### Items Without Lifecycle Dates
- Major appliances (refrigerator, washer, dryer) and small kitchen appliances (blender, toaster, air fryer)
- Cookware, bakeware, knives, utensils, cutting boards, and reusable storage containers
- Furniture (sofa, dining table, shelving units, desks) and home décor (lamps, mirrors, artwork)
- Consumer electronics (TV, laptop, tablets, smart speakers, gaming consoles)
- Home office equipment (printer, router, modem, UPS) and networking accessories
- Hand tools, power tools, hardware assortments, toolboxes, and workbenches
- Outdoor and garden equipment (lawn mower, hedge trimmer, grill, patio furniture, hoses)
- Sports, fitness, and recreational gear (bicycles, free weights, yoga mats, skateboards, board games)
- Musical instruments, audio equipment, microphones, and recording accessories
- Baby gear (crib, stroller, car seat, monitors) and pet accessories (carriers, leashes, feeders, aquariums)
- Cleaning equipment (vacuum, steam mop, broom, dusters), storage bins, and organizers
- Books, reference binders, craft supplies, hobby kits, and seasonal décor

## Next Steps
- Finalize Supabase schema drafts for the consumables and assets tables.
- Extend React hooks (`use-consumables`, `use-assets`) mirroring `use-food-items` conventions.
- Update navigation and routing once the new modules are ready for QA.
- Sync this document with future AI prompt updates to ensure coverage stays aligned.
