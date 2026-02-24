# HacMieu Support

HacMieu Support is a modern, AI-powered customer service platform built with a scalable monorepo architecture. It provides a centralized administrative dashboard for managing support interactions and an embeddable real-time chat widget for seamless integration into external websites.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router), React 19
- **Monorepo**: Turborepo
- **Styling**: Tailwind CSS v4, Radix UI (Shadcn-like components)
- **Backend & Database**: Convex (Serverless, Real-time)
- **AI Integration**: Vercel AI SDK, `@convex-dev/agent`, `@convex-dev/rag` (Google & Groq Models)
- **State Management**: Jotai
- **Authentication**: Clerk
- **Validation**: Zod, TypeScript
- **Webhooks**: Svix

## 📁 Repository Structure

This project uses [Turborepo](https://turbo.build/repo/docs) for managing multiple applications and shared packages.

```
hacmieu-support/
├── apps/
│   ├── web/           # Next.js application for the admin dashboard
│   └── widget/        # Next.js application for the embeddable chat widget
├── packages/
│   ├── backend/       # Convex backend (schema, queries, mutations, actions)
│   ├── ui/            # Shared UI components (Tailwind, Radix)
│   ├── eslint-config/ # Shared ESLint configurations
│   └── typescript-config/ # Shared TypeScript configurations
```

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 10.4.1 (preferred package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repository-url>
   cd hacmieu-support
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables based on `.env.example` in both `apps/web` and `apps/widget`.

### Running the Project Locally

To start the development servers for all applications and packages, run:

```bash
pnpm run dev
```

This command will concurrently start:

- The **Admin Web Dashboard** (`apps/web`) on `http://localhost:3000`
- The **Chat Widget frontend** (`apps/widget`) on `http://localhost:3001`
- The **Convex Backend** development server

## 📦 Apps & Packages

### `apps/web`

The main administrative dashboard where support agents can monitor conversations, manage settings, and view analytics. It communicates securely with the Convex backend.

### `apps/widget`

The frontend for the chat widget. It is designed to be lightweight and responsive, providing an intuitive interface for end-users to interact with the AI support agent.

### `packages/backend`

Contains all backend logic powered by Convex. This includes database schemas, real-time queries, data mutations, and complex AI actions using the Vercel AI SDK and Convex's RAG capabilities.

### `packages/ui`

A shared component library built with Tailwind CSS and Radix UI primitives. It ensures a consistent design system across both the `web` and `widget` applications.

## 🤖 AI Features (Core Engine)

The platform leverages advanced AI to automate support tasks:

- **Intelligent Routing**: Automatically categorizing and routing support tickets.
- **Context-Aware Responses**: Utilizing RAG (Retrieval-Augmented Generation) to reference company documentation and past interactions to provide accurate answers.
- **Multi-Model Support**: Integrated with multiple LLM providers (Google, Groq) to ensure reliability and optimal performance.

## 🛡️ Authentication & Security

- **Clerk**: Handles seamless user authentication and organization-based multi-tenancy.
- **Convex Auth**: integrated with Clerk to secure database access and API endpoints.

## 📝 Scripts

- `pnpm build`: Build all apps and packages for production.
- `pnpm dev`: Start all apps and packages in development mode.
- `pnpm lint`: Run ESLint across the workspace.
- `pnpm format`: Format code using Prettier.
