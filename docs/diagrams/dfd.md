# Data Flow Diagrams — The Next Food

## Level 0 (Context Diagram)
```mermaid
flowchart LR
    subgraph User Devices
        U[Household User]
    end
    U -->|HTTPS| APP[The Next Food SPA]
    APP -->|REST| SUPA[Supabase Services]
    APP -->|API| GEM[Google Gemini API]
    SUPA -->|JSON| APP
    GEM -->|AI Suggestions| APP
```

## Level 1 — Inventory & Meal Planning
```mermaid
flowchart LR
    U[User]
    subgraph SPA
        INV[Inventory Module]
        REC[Recipe Module]
        MPL[Meal Planner]
        SHP[Shopping List]
    end
    SUPA[(Supabase DB)]
    GEM[Gemini AI]

    U --> INV
    INV -->|CRUD| SUPA
    SUPA -->|Inventory Data| INV

    INV -->|Inventory Snapshot| REC
    REC -->|Prompt| GEM
    GEM -->|Recipes| REC

    REC -->|Select Recipes| MPL
    MPL -->|Meal Plans| SUPA
    MPL --> SHP
    SHP -->|List Items| SUPA
    U --> SHP

    SUPA -->|Events| MPL
    SUPA -->|List Updates| SHP
```

## Level 2 — Shopping List Generation Detail
```mermaid
flowchart TB
    subgraph SPA
        MPL[Meal Planner]
        DELTA[Delta Calculator]
        SHP[Shopping List UI]
    end
    INV[(Inventory Table)]
    MPI[(Meal Plan Entries)]
    SLI[(Shopping List Items)]

    MPL -->|Fetch Plan| MPI
    MPL -->|Fetch Inventory| INV
    MPL --> DELTA
    DELTA -->|Shortages| SHP
    SHP -->|Persist| SLI
    SLI --> SHP
```

## Notes
- DFD focuses on data movement; control flow described in `docs/design/process-flows.md`.
- Supabase Edge Functions (future) will introduce additional processes (notifications, barcode lookups).
