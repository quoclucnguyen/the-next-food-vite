# Tech Context

## Technologies and Frameworks Used

### Frontend Stack

- **React 18.2.0**: Core UI library with concurrent features and improved performance
- **TypeScript 5.0+**: Static type checking for better development experience and code reliability
- **Vite 4.4+**: Fast build tool and development server with hot module replacement
- **React Router DOM 6.15+**: Client-side routing with modern hooks-based API

### UI and Styling

- **Tailwind CSS 3.3+**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: High-quality, accessible React components built on Radix UI
- **Radix UI**: Unstyled, accessible components for building design systems
- **Lucide React**: Beautiful and consistent icon library
- **class-variance-authority (CVA)**: For creating variant-based component APIs

### State Management

- **@tanstack/react-query 4.32+**: Server state management with caching, synchronization, and background updates
- **React Context API**: Global client state management for user preferences and UI state
- **React Hook Form**: Form state management with validation
- **Zod**: TypeScript-first schema validation

### Backend and Database

- **Supabase 2.33+**: Backend-as-a-Service providing authentication, database, and real-time features
- **PostgreSQL**: Relational database with advanced features (via Supabase)
- **Row Level Security (RLS)**: Database-level authorization and data isolation

### AI Integration

- **Google Gemini API**: AI-powered recipe suggestions and meal planning assistance
- **Custom AI Client**: Wrapper around Gemini API for consistent error handling and response formatting

### Development Tools

- **ESLint**: Code linting with React, TypeScript, and accessibility rules
- **Prettier**: Code formatting for consistent style
- **Vitest**: Fast unit testing framework built on Vite
- **@testing-library/react**: Testing utilities for React components
- **TypeScript**: Static type checking and IntelliSense

## Development Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or pnpm package manager
- Git for version control
- Modern code editor (VS Code recommended)

### Environment Configuration

```bash
# Required environment variables
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run linting
npm run lint

# Format code
npm run format
```

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layouts/        # Layout components
│   └── demo/           # Demo/example components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
├── views/              # Page components
│   ├── inventory/      # Inventory management pages
│   ├── recipes/        # Recipe management pages
│   ├── meal-planning/  # Meal planning pages
│   ├── shopping-list/  # Shopping list pages
│   └── settings/       # Settings pages
└── test/               # Test utilities and setup
```

## Technical Constraints

### Performance Constraints

- **Bundle Size**: Target < 1MB initial bundle size
- **First Contentful Paint**: Target < 2 seconds on 3G networks
- **Time to Interactive**: Target < 4 seconds on mobile devices
- **Core Web Vitals**: Maintain good scores for LCP, FID, and CLS

### Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **No Internet Explorer**: Modern features require ES2020+ support

### Device Constraints

- **Mobile-First**: Optimized for mobile devices with responsive design
- **Touch-Friendly**: All interactions work well on touch devices
- **Offline Capability**: Core features work offline with service worker caching
- **Low-End Devices**: Performant on devices with 2GB RAM

### API Limitations

- **Supabase**: Rate limits based on plan (free tier: 500 requests/minute)
- **Gemini API**: Rate limits and quota restrictions apply
- **Image Storage**: File size limits for uploaded images (10MB max)
- **Database**: Row limits based on Supabase plan

## Dependencies and Tool Configurations

### Package.json Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.2",
    "@tanstack/react-query": "^4.32.6",
    "@supabase/supabase-js": "^2.33.1",
    "react-router-dom": "^6.15.0",
    "react-hook-form": "^7.45.4",
    "zod": "^3.22.2",
    "tailwindcss": "^3.3.3",
    "@radix-ui/react-dialog": "^1.0.4",
    "@radix-ui/react-dropdown-menu": "^2.0.5",
    "lucide-react": "^0.263.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "prettier": "^3.0.0",
    "vite": "^4.4.5",
    "vitest": "^0.34.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5"
  }
}
```

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
});
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // ... other color definitions
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### ESLint Configuration

```javascript
// eslint.config.js
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
};
```

## Database Schema and Relationships

### Core Tables

```sql
-- Users (managed by Supabase Auth)
-- auth.users table is automatically created

-- Inventory Items
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  quantity INTEGER DEFAULT 1,
  unit TEXT,
  expiration_date DATE,
  purchase_date DATE DEFAULT CURRENT_DATE,
  barcode TEXT,
  image_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipes
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT[],
  prep_time INTEGER, -- in minutes
  cook_time INTEGER, -- in minutes
  servings INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipe Ingredients
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity DECIMAL,
  unit TEXT,
  notes TEXT
);

-- Meal Plans
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shopping Lists
CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Shopping List',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shopping List Items
CREATE TABLE shopping_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopping_list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit TEXT,
  category TEXT,
  is_purchased BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security Policies

```sql
-- Enable RLS on all tables
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;

-- Policies for inventory_items
CREATE POLICY "Users can view their own inventory items" ON inventory_items
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own inventory items" ON inventory_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own inventory items" ON inventory_items
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own inventory items" ON inventory_items
  FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for other tables...
```

## Deployment and Infrastructure

### Build Process

- **Development**: Vite dev server with hot module replacement
- **Production**: Static build with optimized bundles and assets
- **CI/CD**: Automated testing and deployment pipeline
- **Environment Variables**: Secure handling of API keys and configuration

### Hosting and CDN

- **Static Hosting**: Vercel, Netlify, or similar JAMstack platform
- **CDN**: Global content delivery for fast loading times
- **SSL/TLS**: HTTPS encryption for all traffic
- **Custom Domain**: Professional domain with proper DNS configuration

### Monitoring and Analytics

- **Error Tracking**: Sentry or similar for error monitoring
- **Performance Monitoring**: Web Vitals tracking
- **User Analytics**: Privacy-focused analytics solution
- **Uptime Monitoring**: Service availability tracking
