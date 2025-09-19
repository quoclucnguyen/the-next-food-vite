# Deployment Diagram — The Next Food

```mermaid
flowchart LR
    subgraph Client Devices
        Browser[Web Browser]
        PWA[Installed PWA (future)]
    end

    subgraph Hosting
        CDN[Static Hosting CDN]
        EdgeConfig[Edge Routing / CDN Cache]
    end

    subgraph Supabase Cloud
        Auth[Auth Service]
        PgDB[(PostgreSQL)]
        Storage[Storage Bucket]
        EdgeFns[Edge Functions]
    end

    subgraph Google Cloud
        Gemini[Gemini AI API]
    end

    Browser -->|HTTPS| CDN
    PWA -->|HTTPS| CDN
    CDN -->|Serve SPA| Browser
    Browser -->|API Requests| Auth
    Browser -->|REST/RPC| PgDB
    Browser -->|Storage Uploads| Storage
    EdgeFns --> PgDB
    Browser -->|AI Requests| Gemini

    subgraph Monitoring
        Sentry[Sentry / Error Tracking]
        Uptime[Uptime Monitor]
    end

    Browser -.->|Telemetry| Sentry
    CDN -.->|Health| Uptime
    Supabase -.->|Metrics| Uptime
```

## Notes
- Static assets deployed via CDN; Supabase handles backend services.
- Gemini called directly from client; consider proxy if stricter key control required.
- Monitoring stack collects telemetry from client and infrastructure.
