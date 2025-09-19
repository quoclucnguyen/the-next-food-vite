# Activity Diagram — Meal Planning with AI Assistance

```mermaid
stateDiagram-v2
    [*] --> SelectRange
    SelectRange --> ChooseMode
    ChooseMode --> ManualEntry: User selects manual
    ManualEntry --> PickRecipe
    PickRecipe --> AssignSlot
    AssignSlot --> UpdatePlan
    UpdatePlan --> SuggestShopping
    SuggestShopping --> [*]

    ChooseMode --> AIPlan: User selects AI
    AIPlan --> BuildPrompt
    BuildPrompt --> CallGemini
    CallGemini --> ParseResponse
    ParseResponse --> ReviewPlan
    ReviewPlan --> AcceptPlan: User approves
    ReviewPlan --> ManualEntry: User edits manually
    AcceptPlan --> UpdatePlan

    UpdatePlan --> ComputeDeltas
    ComputeDeltas --> SuggestShopping
```

## Notes
- `BuildPrompt` compiles inventory, dietary preferences, and timeframe into Gemini prompt.
- `ParseResponse` handles fallback if AI output invalid.
- `ComputeDeltas` calculates ingredient shortages used for shopping list suggestions.
