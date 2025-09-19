# User Manual — The Next Food

## 1. Getting Started
1. Launch the application.
2. Sign up or log in with your Supabase-backed credentials.
3. Complete onboarding: set household name, preferred language, timezone.

## 2. Home Dashboard
- **Expiring Soon**: Highlights items nearing expiration; tap to view details or mark as used.
- **Upcoming Meals**: Shows next planned meals from meal planner.
- **AI Spotlight**: Gemini-generated suggestions tailored to your inventory.

## 3. Inventory Management
The Inventory hub now exposes four parallel modules so you can track food, date-driven household consumables, cosmetics, and durable assets without crossing data. Food inventory is live today; consumables, cosmetics, and assets progressively roll out per household flag. Use the tabs at the top of the Inventory page (when enabled) to switch modules—each module remembers its own filters and sorting.

### Food Inventory (Existing)
1. Open the `Food` tab inside Inventory.
2. Tap `+` (mobile) or `Add Item` (desktop) to create a record.
3. Scan a barcode (coming soon) or fill in name, quantity, unit, storage location, and expiration date.
4. Upload a photo if desired, then save to update the list instantly.
5. To edit or consume an item, open its card and use `Edit` or `Consume` as before.

### Household Consumables (Date-tracked)
1. Switch to the `Consumables` tab once the feature flag is enabled for your household.
2. Use `Add Consumable` to capture supplies such as filters, medication, or cleaning chemicals.
3. Provide quantity/unit when relevant and set a `Replacement Date` plus optional reminder lead time.
4. Attach label photos or receipts so the AI helper can prefill fields on future entries.
5. Items move to the "Attention" filter automatically as their replacement date approaches.

### Cosmetics Management (PAO-tracked)
1. Open the `Cosmetics` tab to track skincare, makeup, haircare, and other personal-care products.
2. When adding a product, record the brand, category, size, purchase date, and either manufacturer expiry or PAO value.
3. Mark the product as opened to start the PAO countdown; the app calculates a discard date using the sooner of PAO or printed expiry.
4. Use quick actions to log usage notes, duplicate similar items, or mark products as discarded/replenished.
5. Reminders surface within the list and dashboard when a product is due within 14 days or already expired; snooze or mark as handled from the notification chip.

### Household Assets (Non-date)
1. Switch to the `Assets` tab once available.
2. Click `Add Asset` to register durable goods (appliances, tools, electronics, furniture, hobby gear).
3. Record location, owner, purchase info, serial number, and any warranty notes.
4. Upload manuals or receipts so the asset card becomes a one-stop reference.
5. Use the `Archive` action when an asset leaves the household; history remains for reports.

### Filters & Search
- Each module supports search by name and module-specific filters (category, location, upcoming replacements, owner).
- Saved filter sets will be stored per module so you can jump between food, consumables, and assets without losing context as the rollout completes.

## 4. Recipes
### Saved Recipes
- View recipes you added or saved from AI suggestions.
- Tap to view ingredients, instructions, and notes.

### AI Suggestions
1. Open `Recipes` → `Suggested`.
2. Click `Get Suggestions` to request new ideas.
3. Review AI cards; tap `Save` to add to your collection.

### Import/Manual Entry
- Use `New Recipe` to add manual recipes with ingredients and steps.
- Link ingredients to inventory items for tracking.

## 5. Meal Planning
1. Navigate to `Meal Plan` tab.
2. Choose weekly calendar view.
3. Drag recipes into breakfast/lunch/dinner/snack slots.
4. Use `Plan for me` to let AI propose a balanced plan.
5. Adjust servings; plan auto-updates shopping list suggestions.

## 6. Shopping Lists
### Generate List
1. From Meal Plan summary, click `Generate Shopping List`.
2. Review suggested items; adjust quantities.

### Manage List
- Mark items as purchased; progress indicator updates.
- Add custom items (e.g., household goods) manually.
- Future: share list via link or invite household members.

## 7. Notifications & Alerts
- Expiration alerts appear on dashboard and notification center.
- Configure alert lead time in Settings (default: 3 days).
- Email/push notifications planned for future release.

## 8. Settings
- Update profile info, language, and measurement units.
- Manage household members (invite via email, set roles).
- Configure AI preferences (tone, dietary restrictions, allergens).
- Manage connected devices (future barcode scanners, smart fridges).

## 9. Tips & Best Practices
- Review inventory weekly to keep data accurate.
- Rate AI recipes to improve future recommendations.
- Tag recipes by cuisine or dietary needs for faster filtering.
- Use notes on items to track brand or store preferences.

## 10. Support & Feedback
- Visit `Help & Feedback` in Settings to submit ideas or report issues.
- Attach screenshots or logs where applicable.
- Check `docs/user-guide/troubleshooting.md` for quick fixes.

## 11. Roadmap Preview
- Barcode scanning support with camera-based detection.
- Collaborative real-time shopping list updates.
- Nutritional insights and dynamic meal adjustments.
- Integration with calendar apps and grocery delivery services.

## 12. References
- `docs/user-guide/installation.md`
- `docs/user-guide/troubleshooting.md`
- `docs/SRS.md`
