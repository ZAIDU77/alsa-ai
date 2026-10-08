# Project Overview & File Tree Guide

This document provides a breakdown of the folder structure and file responsibilities for the ALSA AI project.

---

## 📁 Root Configuration Files

- **`.env`**: Stores environment variables (API keys, Supabase credentials, backend URLs).
- **`.gitignore`**: Specifies files and directories that Git should ignore.
- **`README.md`**: Main documentation file explaining project setup, features, and usage.
- **`SECURITY.md`**: Security guidelines, vulnerability reporting, and best practices.
- **`bun.lock` / `bun.lockb`**: Bun package manager lockfiles ensuring consistent dependency versions.
- **`package.json` / `package-lock.json`**: Tracks NPM dependencies, scripts, and package versions.
- **`components.json`**: Configuration file for shadcn/ui component library integration.
- **`eslint.config.js`**: ESLint configuration for code linting and code quality standards.
- **`postcss.config.js`**: PostCSS setup for processing Tailwind CSS styles.
- **`tailwind.config.ts`**: Custom styling rules, animations, theme colors, and plugins for Tailwind CSS.
- **`tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json`**: TypeScript compiler options and build configurations.
- **`vite.config.ts`**: Vite bundler settings, aliases, and development server settings.
- **`vercel.json`**: Deployment settings and routing rules for Vercel hosting.
- **`index.html`**: HTML entry point for the React application.

---

## 📁 `public/` (Static Assets & Downloads)

Stores public static files served directly by Vite.

- **`Alsa-Ai-Logo.png`**: Project logo image.
- **`favicon.ico`**: Browser tab favicon icon.
- **`largeImage.png` / `placeholder.svg`**: General asset and fallback placeholder graphics.
- **`robots.txt` / `sitemap.xml` / `site.xml`**: SEO files to control search engine indexing.
- **`_redirects`**: Redirect configuration file for platforms like Netlify/Vercel.

### 📂 `public/bridges/`
Contains downloadable bridge drivers and client scripts for controlling local PCs/Phones from the web interface.
- **`alsa-ai-bridge.apk`**: Android bridge application for device automation.
- **`phone-bridge.py`**: Python script for linking and controlling mobile devices.
- **`freetier-pc-bridge.py`**: Lightweight PC bridge script for Free Tier users.
- **`pro-pc-bridge.py`**: Advanced PC bridge script for Pro plan features.
- **`elite-pc-bridge.py`**: Full-featured PC bridge script for Elite plan users.

### 📂 `public/sounds/`
- **`alarm.wav`**: Audio file used for reminder alarms and notifications.

---

## 📁 `src/` (Main Frontend Application Code)

- **`main.tsx`**: Entry point where React mounts to the DOM (`index.html`).
- **`App.tsx`**: Top-level application component containing routes and global state providers.
- **`App.css` / `index.css`**: Global CSS styles, Tailwind imports, and custom utility classes.
- **`vite-env.d.ts`**: TypeScript type definitions for Vite environment variables.

---

### 📂 `src/assets/`
Contains static images and media used directly inside React components.
- **`mira-avatar.jpg`**: Avatar image for the Mira AI assistant.
- **`mira-mouth-closed.webp` / `mira-mouth-half.webp` / `mira-mouth-open.webp`**: Lip-sync state frames for animated voice output.
- **`mira-silent.gif` / `mira-speaking.gif`**: Animated state icons for Mira's voice assistant.
- **`ex.txt`**: Sample/example text file.

---

### 📂 `src/components/`
React UI components powering the feature workflow.

- **`ApiKeyOnboarding.tsx`**: Modal/screen for setting up custom AI API keys.
- **`AddressBookSettings.tsx`**: Interface to view and manage user contacts.
- **`ChatComposer.tsx`**: Message input bar with file attachment, voice, and submit handlers.
- **`ChatMessage.tsx` / `MessageBubble.tsx`**: Chat message bubble components rendering text, markdown, and code blocks.
- **`CircularSiriWave.tsx` / `CircularSiriWaveV2.tsx` / `SiriWave.tsx`**: Animated Siri-like audio visualizers for speech input/output.
- **`CodingCanvas.tsx`**: Integrated code editor and preview panel for AI-generated code.
- **`CommandExamples.tsx`**: Displays sample prompt suggestions for users.
- **`ConversationSidebar.tsx` / `Sidebar.tsx`**: Navigation and chat session history sidebars.
- **`DocumentGenerator.tsx`**: Interface for creating structured documents/PDFs using AI.
- **`FaceAuth.tsx` / `FaceAuthGate.tsx`**: Face recognition authentication UI and route protection gate.
- **`FileUpload.tsx`**: Drag-and-drop file upload interface.
- **`GameLauncher.tsx`**: Interactive launcher module for mini-games.
- **`MemoryManager.tsx`**: Interface to view, edit, and clear stored AI user memory.
- **`MusicPlayer.tsx`**: Mini music player widget for local/streaming playback.
- **`NotificationMenu.tsx`**: Dropdown menu displaying user notifications and updates.
- **`ProtectedRoute.tsx`**: Wrapper component ensuring routes require authentication.
- **`QuickActions.tsx` / `QuickLinks.tsx`**: Short-cut buttons for quick AI tasks and external tools.
- **`ReminderNotification.tsx`**: Pop-up banner for trigger alerts and scheduled reminders.
- **`RightPanel.tsx`**: Collapsible right sidebar for contextual settings, system info, and widgets.
- **`ScheduledMessageChecker.tsx`**: Background worker component monitoring pending scheduled messages.
- **`SignupWizard.tsx`**: Step-by-step onboarding flow for new users.
- **`SystemSuggestions.tsx`**: Smart contextual recommendations widget.
- **`TemplateSelector.tsx`**: Prompt template selector interface.
- **`TranscriptionFeedback.tsx`**: Speech-to-text transcript verification indicator.
- **`VoiceOrb.tsx`**: Interactive voice orb component for full-duplex voice chat.
- **`WikipediaResult.tsx`**: Formatted web/Wikipedia reference search result card.

#### 📂 `src/components/ui/`
Reusable UI primitives (built with shadcn/ui and Radix UI primitives):
- Accordion, Alert, Badge, Button, Calendar, Card, Carousel, Chart, Checkbox, Dialog, Drawer, Dropdown, Form, Input, Modal, Pagination, Popover, Progress, Select, Sidebar, Slider, Table, Tabs, Toast, Tooltip, etc.

---

### 📂 `src/hooks/`
Custom React hooks for state management, events, and API integrations.

- **`useAuth.tsx`**: Authentication state management (login, signup, session context).
- **`useSpeechRecognition.ts`**: Browser Web Speech API hook for voice input.
- **`useTextToSpeech.ts`**: Speech synthesis hook for voice responses.
- **`useSubscription.ts`**: Hook to query and verify tier subscriptions (Free, Pro, Elite).
- **`useTheme.ts`**: Dark/Light mode theme toggle hook.
- **`useWakeVoice.ts` / `useWakeKeyboard.ts` / `useWakeAnimation.ts`**: Voice hotword wake triggers and hotkey listeners.
- **`use-mobile.tsx`**: Responsive breakpoint detection hook.
- **`use-toast.ts`**: Toast notification trigger hook.

---

### 📂 `src/pages/`
Router pages rendering specific application views.

- **`Landing.tsx`**: Main promotional homepage.
- **`Auth.tsx`**: Authentication page (Sign in / Sign up / Forgot password).
- **`Chat.tsx`**: Primary conversational AI chat interface.
- **`AvatarChat.tsx`**: Voice and animated avatar interaction interface.
- **`Vibecoding.tsx`**: AI-assisted code generation workbench page.
- **`BridgeSetup.tsx` / `BridgeFeatures.tsx`**: PC/Phone bridge download and setup guide.
- **`Admin.tsx`**: Administrative management dashboard.
- **`Analytics.tsx`**: Usage statistics, token metrics, and platform analytics.
- **`Pricing.tsx`**: Subscription pricing plans and feature comparison table.
- **`Profile.tsx`**: User account profile settings.
- **`Settings.tsx`**: Platform settings (API keys, themes, preferences).
- **`History.tsx`**: Past conversation history log page.
- **`SharedConversation.tsx`**: Public shareable chat view page.
- **`Ratings.tsx`**: User feedback and rating page.
- **`FAQ.tsx` / `Terms.tsx` / `Privacy.tsx` / `Contact.tsx`**: Standard legal and information pages.
- **`UpdateHistory.tsx`**: Changelog and release notes page.
- **`NotFound.tsx`**: 404 page for invalid URL paths.

---

### 📂 `src/utils/`
Utility modules, helper libraries, and local storage managers.

- **`pcBridge.ts` / `phoneBridge.ts`**: WebSocket / API client logic communicating with device bridge agents.
- **`naturalLanguageParser.ts`**: Command parsing engine for natural language intent extraction.
- **`memoryManager.ts` / `conversationMemory.ts`**: Logic for managing long-term and context window memory.
- **`reminderManager.ts` / `scheduledMessageManager.ts`**: Alarm and future task execution utilities.
- **`customCommands.ts` / `createCommand.ts`**: Custom user-defined trigger command engine.
- **`faceAuth.ts`**: Browser facial recognition processing helper.
- **`localMusic.ts`**: Audio file scanner and local web audio player helper.
- **`screenRecording.ts`**: Browser Screen Capture API recording helper.
- **`contactsStore.ts`**: Local contact storage management logic.
- **`teamAccounts.ts`**: Multi-account and workspace permission logic.
- **`adminConfig.ts`**: Admin portal default settings and keys.
- **`sanitize.ts`**: Input sanitization helper to protect against XSS injection.
- **`test-client.ts`**: Helper module for API integration testing.

---

### 📂 `src/integrations/supabase/`
Supabase backend client configuration.
- **`client.ts`**: Initialized Supabase client instance using environment URL/Keys.
- **`types.ts`**: Auto-generated TypeScript database schema types.

### 📂 `src/lib/`
- **`utils.ts`**: Global utility functions (e.g., `cn` helper for merging Tailwind classes).

### 📂 `src/styles/`
- **`wake.css`**: CSS animations specifically designed for wake-word indicators and pulsing effects.

---

## 📁 `supabase/` (Backend Serverless Infrastructure)

Contains database migrations and Edge Functions for serverless backend tasks.

- **`config.toml`**: Local Supabase CLI configuration file.
- **`.env.supabase`**: Environment configuration for Supabase deployment.

### 📂 `supabase/functions/` (Serverless Edge Functions)
- **`chat/`**: Main serverless handler for LLM chat interactions.
- **`avatar-chat/`**: Backend handler for avatar voice & lip-sync routines.
- **`mobile-chat/`**: Optimized API endpoint for mobile clients.
- **`image-chat/`**: Multimodal backend processing image inputs.
- **`vibe-coder/`**: Code generation processing pipeline.
- **`vibe-github-push/`**: Git integration service pushing AI code directly to GitHub.
- **`mira-tts/`**: Text-to-Speech audio generation endpoint.
- **`speech-to-text/` / `transcribe/`**: Audio transcription and Whisper API endpoints.
- **`verify-bridge-token/`**: Token validation logic for secure PC/Phone bridge communication.
- **`analyze-conversation/`**: Conversation summary and sentiment analysis task.
- **`create-razorpay-order/` / `verify-razorpay-payment/`**: Razorpay payment integration functions.
- **`admin-*/`**: Admin management edge functions (`admin-verify`, `admin-get-contacts`, `admin-send-notification`, `admin-update-subscription`, `admin-mark-read`).
- **`_shared/cors.ts`**: Shared CORS headers helper for all edge functions.