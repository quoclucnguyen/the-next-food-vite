# System Architecture Diagram — The Next Food

```mermaid
flowchart TB
    subgraph Client
        SPA[React SPA]
        Hooks[Custom Hooks & React Query]
        UI[shadcn/ui Components]
    end

    subgraph Backend
        subgraph Supabase
            Auth[Auth Service]
            DB[(PostgreSQL + RLS)]
            Storage[Storage Bucket]
            Edge[Edge Functions]
        end
        Gemini[Google Gemini API]
    end

    SPA --> Hooks
    Hooks -->|HTTP| Auth
    Hooks -->|RPC/REST| DB
    Hooks -->|Upload| Storage
    Hooks -->|Call| Gemini
    Edge --> DB
    Edge -->|Events| Hooks

    subgraph External
        Email[Email Provider]
        BrowserPush[Push Service]
    end

    Auth --> Email
    Edge --> BrowserPush
```

## Notes
- Client communicates directly with Supabase and Gemini; no custom backend server currently.
- Edge Functions planned for background tasks (notifications, barcode lookup).
- Observability (Sentry, analytics) to be integrated as part of cross-cutting concerns.
