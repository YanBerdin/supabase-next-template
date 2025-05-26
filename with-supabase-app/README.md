Certainly! Below is the complete Markdown file that combines all the sections in the order they were transcribed:

```markdown
# Project Overview

The repository is a monorepo containing a Next.js application (`with-supabase-app`) and GitHub-specific configurations (`.github/`). The Next.js application leverages the App Router, Server Components, Client Components, Server Actions, and Middleware for a modern web development experience. Supabase is integrated for authentication, database storage, and real-time capabilities. Styling is handled by Tailwind CSS with UI components from shadcn/ui.

## Key Features Demonstrated:

- **Full-stack Next.js**: Utilizes the latest Next.js features for both client and server-side logic.
- **Supabase Integration**: Seamless integration with Supabase for:
  - Authentication (including email/password, OAuth callbacks, password reset).
  - Database interactions (PostgreSQL).
  - Server-Side Rendering (SSR) with Supabase Auth cookies.
- **UI Components**: Styled with Tailwind CSS and uses shadcn/ui for pre-built, customizable components.
- **Database Management**: Includes SQL scripts for database schema setup and migrations.
- **Development Experience**:
  - VS Code MCP (Multi-Cloud Platform) server integration for Supabase.
  - Environment variable management (`.env.local`).
  - Supabase connection testing utility.
- **Application Features (for "Réveil Basket Is sur Tille")**:
  - User authentication and a protected member area.
  - Content pages (About, Contact).
  - Interactive calendar using `react-big-calendar`.
  - Dynamic display of news, events, and team information.

# .github Directory

This directory contains configurations and workflows related to GitHub, such as CI/CD, issue templates, or other repository management tools.

## .github/copilot-instructions.md

This file outlines the project requirements and functional specifications for the "Réveil Basket Is sur Tille" website. It serves as a guide for development, detailing features to be implemented, technical requirements, and database structure.

### Key Sections:

- **Supabase Integration**: Requirements for connecting to Supabase, defining types, implementing database functions, authentication, and MCP Server connection.
- **Page-Specific Features**:
  - **Homepage**: Dynamic banner, news, events, social media links.
  - **Content Pages**: "Who we are" (history, values, team), Teams (details, schedule, results), News & Events (CMS, comments, social sharing), Media (gallery), Contact & Adhesion (forms).
- **Technical Requirements**: CMS integration, choice of database (Supabase PostgreSQL is used), security (HTTPS, XSS, CSRF, SQL injection protection, GDPR).
- **Interactive Calendar**: Details for a `react-big-calendar` implementation with various views, filtering, and export options.
- **Member Area**: Authentication, dashboard, profile management, document access, notification settings.
- **Database Structure**: Defines tables like users, teams, events, news, media, matches.
- **Supabase Connection Test Page** (`/test-connection`): Specifications for a page to verify Supabase connectivity, environment variables, table existence, and data retrieval functions. Includes instructions for users if tables are missing.

## .github/workflows/ping-supabase.yml

This GitHub Actions workflow is designed to periodically ping the Supabase project. This is often used for free-tier Supabase projects to prevent them from being paused due to inactivity or to serve as a basic health check.

### Workflow Details:

- **Name**: Ping Supabase
- **Triggers**:
  - **Scheduled**: Runs every 12 hours (at midnight and noon UTC) via cron: `0 0,12 * * *`.
  - **Manual**: Can be triggered manually via `workflow_dispatch`.
- **Job**: ping
  - **Runs on**: `ubuntu-latest`.
  - **Steps**:
    1. **Check Supabase health**:
       - Uses `SUPABASE_URL` and `SUPABASE_ANON_KEY` from GitHub secrets.
       - **Primary Check**: Attempts to call a custom RPC function `get_current_timestamp` on the Supabase instance. If successful (response contains a date), the job exits with success.
       - **Fallback Check**: If the RPC call fails, it attempts to make a GET request to the Supabase Auth endpoint (`$SUPABASE_URL/auth/v1/user`). If this endpoint responds (even with a 401 Unauthorized error, which indicates the service is up), the job exits with success.
       - **Failure**: If both checks fail, the job exits with an error code (1) and logs the last response.

### Purpose:

- Ensures the Supabase instance remains active, particularly relevant for free-tier projects that might be paused after periods of inactivity.
- Provides a basic health check for the Supabase services (RPC and Auth).

# with-supabase-app Directory

This is the main Next.js application directory.

## Root Files

- **.env.local.example**:
  - An example file for setting up local environment variables.
  - Developers should copy this to `.env.local` and fill in their Supabase project URL and anon key.
  ```text
  NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
  NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
  ```

- **.gitignore**:
  - Specifies intentionally untracked files that Git should ignore. Includes common Node.js, Next.js, Vercel, and local environment files.

- **README.md**:
  - Provides an overview of the Next.js and Supabase Starter Kit.
  - Highlights features, links to a demo, and gives instructions for deployment to Vercel and local setup.
  - Crucial for new users to understand the project and get started.

- **check-connection.sql**:
  - A simple SQL script to create an RPC function `get_project_ref()`.
  - This function is intended to be used as a basic test of Supabase connectivity, typically by attempting to retrieve the project's reference ID.
  ```sql
  CREATE OR REPLACE FUNCTION get_project_ref()
  RETURNS text
  LANGUAGE sql
  SECURITY DEFINER
  AS $$
    SELECT current_setting('request.jwt.claim.iss')::text;
  $$;
  ```
  - The `copilot-instructions.md` mentions this script should be run before `database-setup.sql` when setting up the `/test-connection` page.

- **components.json**:
  - Configuration file for shadcn/ui.
  - Defines the UI style (default), component paths (`@/components`), utility paths (`@/lib/utils`), and Tailwind CSS configuration details.

- **middleware.ts**:
  - Next.js middleware that runs for specified request paths.
  - Utilizes `updateSession` from `@/utils/supabase/middleware` to manage user sessions by refreshing them if necessary. This is crucial for Supabase SSR and ensuring authentication state is consistent across client and server components.
  - The `config.matcher` specifies paths where the middleware should run, excluding static assets, images, and favicon.
  - Redirects unauthenticated users from `/protected` routes to `/sign-in`.
  - Redirects authenticated users from `/` to `/protected`.

- **next.config.ts**:
  - Basic Next.js configuration file. In this template, it's minimal, indicating that default Next.js settings are largely sufficient.

- **package.json**:
  - Defines project metadata, scripts (dev, build, start), and dependencies.
  - Key dependencies include:
    - `next`: The Next.js framework.
    - `react`, `react-dom`: React library.
    - `@supabase/ssr`, `@supabase/supabase-js`: Supabase client libraries for server-side rendering and JavaScript interactions.
    - `tailwindcss`, `autoprefixer`, `postcss`: For Tailwind CSS.
    - `shadcn/ui` related packages (`@radix-ui/`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate`).
    - `moment`, `react-big-calendar`: For the calendar feature.
    - `next-themes`: For theme (dark/light mode) management.

- **pnpm-lock.yaml**:
  - Lockfile for pnpm package manager, ensuring reproducible dependency installations.

- **postcss.config.js**:
  - Configuration for PostCSS, typically used with Tailwind CSS for processing CSS.

- **tailwind.config.ts**:
  - Configuration file for Tailwind CSS.
  - Sets up dark mode (class), content paths, theme extensions (colors, border radius, keyframes, animations) according to shadcn/ui conventions.

- **tsconfig.json**:
  - TypeScript configuration file.
  - Defines compiler options, paths aliases (`@/`), and included/excluded files for the project.

## .vscode/mcp.json

This file configures the Visual Studio Code MCP (Multi-Cloud Platform) server for Supabase. MCP allows developers to interact with cloud services like Supabase directly from within VS Code.

- **inputs**: Defines an input prompt for the Supabase personal access token.
  - `id`: "supabase-access-token"
  - `description`: "Supabase personal access token"
  - `password`: true (to hide the token input)

- **servers**: Configures the Supabase server.
  - `command`: "pnpm"
  - `args`: `["dlx", "@supabase/mcp-server-supabase@latest"]` (uses pnpm to execute the latest MCP server package for Supabase)
  - `env`: `{ "SUPABASE_ACCESS_TOKEN": "${input:supabase-access-token}" }` (passes the entered access token as an environment variable to the server process)

### Purpose:

To streamline Supabase development within VS Code by providing a local server that connects to the Supabase API, enabling actions like schema exploration, SQL execution, and resource management directly from the editor. The `mcp-info.md` file in `app/doc/` provides context on how this was intended to be used and debugged.

## app/ Directory (Next.js App Router)

This directory implements the Next.js App Router structure.

### app/layout.tsx

This is the root layout for the entire application. It wraps all pages and defines the global HTML structure.

- **Metadata**: Sets the default URL, title ("Réveil Basket Is sur Tille"), and description.
- **Font**: Uses Inter font from `next/font/google`.
- **Theme Provider**: Wraps children with `ThemeProvider` from `next-themes` to enable light/dark mode switching.
- **Structure**:
  - A main `min-h-screen` flex container.
  - **Navigation Bar**: A top navigation bar that includes:
    - Links (commented out in the provided code, but intended for navigation).
    - A `DeployButton` component (commented out).
    - An `EnvVarWarning` component if environment variables are missing, otherwise `HeaderAuth` for sign-in/sign-up/sign-out actions.
  - **Main Content Area**: Renders the children (page content).
  - **Footer**: Includes a "Powered by Supabase" link and a `ThemeSwitcher` component.
  - **Global CSS**: Imports `app/globals.css`.
  - **Environment Variable Check**: Uses `hasEnvVars` to conditionally render UI elements based on the presence of Supabase environment variables.

### app/page.tsx (Homepage)

This is the main landing page of the application, designed for the "Réveil Basket Is sur Tille" club. It's a client component ("use client") to fetch and display dynamic content.

- **State**:
  - `news`: Stores an array of news articles, fetched using `getNews` server action.
- **Effect**:
  - `useEffect` hook fetches the latest news (limited to 3 articles) on component mount.
- **Content Sections**:
  - **Banner**: A large hero image with the club name, tagline, and call-to-action buttons ("Nos équipes", "Nous rejoindre").
  - **Actualités & Événements**: Displays the latest news articles in card format with images, titles, dates, descriptions, and "Lire la suite" buttons. Includes a link to view all news.
  - **Notre club (Presentation)**: A section with a description of the club, key stats (number of members, regional titles), an image, and a button to "En savoir plus" (linking to `/about`).
  - **Nos partenaires (Partners)**: Displays placeholder partner logos and a button to "Devenir partenaire" (linking to `/contact`).
  - **Rejoignez l'aventure (CTA)**: A call-to-action section encouraging users to join the club, with a button to "S'inscrire maintenant" (linking to `/contact`).
- **Components Used**:
  - `Image` from `next/image` for optimized images.
  - `Button`, `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` from shadcn/ui.
  - `Link` from `next/link` for navigation.
  - Icons from `lucide-react`.

### app/actions.ts (Server Actions)

This file defines server-side actions that can be called from client components, typically for form submissions or mutations. These actions interact with Supabase for authentication.

- **signUpAction(formData: FormData)**:
  - Handles user registration.
  - Retrieves email and password from `formData`.
  - Validates input.
  - Calls `supabase.auth.signUp` with an email redirect to `/auth/callback`.
  - Redirects with a success or error message.

- **signInAction(formData: FormData)**:
  - Handles user login.
  - Retrieves email and password from `formData`.
  - Calls `supabase.auth.signInWithPassword`.
  - Redirects to `/protected` on success or back to `/sign-in` with an error message.

- **forgotPasswordAction(formData: FormData)**:
  - Handles the "forgot password" request.
  - Retrieves email from `formData`.
  - Calls `supabase.auth.resetPasswordForEmail` with a redirect link to `/protected/reset-password` via `/auth/callback`.
  - Redirects with a success or error message.

- **resetPasswordAction(formData: FormData)**:
  - Handles the actual password reset after the user clicks the email link.
  - Retrieves new password and confirmation from `formData`.
  - Validates passwords.
  - Calls `supabase.auth.updateUser` to set the new password.
  - Redirects with a success or error message.

- **signOutAction()**:
  - Handles user logout.
  - Calls `supabase.auth.signOut`.
  - Redirects to `/sign-in`.

- **Utility**: Uses `encodedRedirect` from `@/utils/utils` to pass messages via URL query parameters.

### app/(auth-pages)/ Directory

This route group contains pages related to user authentication. It uses a shared `layout.tsx`.

- **app/(auth-pages)/layout.tsx**:
  - A simple layout component that wraps the authentication pages, providing a consistent structure (e.g., max-width and centering).

- **app/(auth-pages)/forgot-password/page.tsx**:
  - Page for users to request a password reset link.
  - Renders a form with an email input.
  - Uses the `forgotPasswordAction` server action.
  - Displays `FormMessage` for success/error feedback.
  - Includes `SmtpMessage` component to inform users about email rate limits.

- **app/(auth-pages)/sign-in/page.tsx**:
  - Page for users to sign in.
  - Renders a form with email and password inputs.
  - Links to "Sign up" and "Forgot Password".
  - Uses the `signInAction` server action.
  - Displays `FormMessage` for feedback.

- **app/(auth-pages)/sign-up/page.tsx**:
  - Page for new users to register.
  - Renders a form with email and password inputs.
  - Links to "Sign in".
  - Uses the `signUpAction` server action.
  - Displays `FormMessage` for feedback, potentially showing only the message if signup was successful and requires email verification.
  - Includes `SmtpMessage` component.

- **app/(auth-pages)/smtp-message.tsx**:
  - A client component displaying a message about email rate limits for Supabase Auth and a link to learn more about custom SMTP setup.
  - Used in `forgot-password` and `sign-up` pages.

### app/about/page.tsx

This page provides information about the "Réveil Basket Is sur Tille" club.

- **Content Sections**:
  - **Notre histoire (Our History)**: Text describing the club's history with a placeholder image.
  - **Nos valeurs (Our Values)**: Displays club values (Excellence, Esprit d'équipe, Respect, Engagement) in `Card` components with icons.
  - **Notre équipe dirigeante (Our Management Team)**: Shows profiles of team members (President, Vice-president, etc.) with placeholder images, names, roles, and bios in `Card` components.
  - **Notre palmarès (Our Achievements)**: Lists achievements for senior and youth teams.
- **Components Used**: `Image`, `Card`, `CardHeader`, `CardTitle`, `CardContent`, and icons from `lucide-react`.
- **Styling** is done using Tailwind CSS classes.

### app/api/ Directory

Contains API route handlers.

- **app/api/auth/me/route.ts**:
  - A GET API route to fetch the currently authenticated user's details.
  - Uses `createClient` from `@/utils/supabase/server` to interact with Supabase.
  - Calls `supabase.auth.getUser()` to retrieve user data.
  - Returns the user object in a JSON response.
  - Includes error handling.

- **app/api/profile/route.ts**:
  - A GET API route to fetch a user's profile information.
  - Expects a `userId` query parameter.
  - Uses `getUserProfile` from `@/lib/database` to fetch profile data.
  - Returns the profile data in a JSON response.
  - Includes error handling for missing `userId` or database errors.

### app/auth/callback/route.ts

This GET API route is essential for Supabase's server-side authentication flow.

- **Purpose**: Handles the callback from Supabase after a user signs up (email verification) or initiates a password reset. It exchanges an authorization code for a user session.
- **Logic**:
  1. Extracts the `code` and `redirectTo` query parameters from the request URL.
  2. If a `code` is present, it creates a Supabase server client and calls `supabase.auth.exchangeCodeForSession(code)` to establish the user's session.
  3. If `redirectTo` is present (e.g., for password reset flow to navigate to `/protected/reset-password`), it redirects the user to that path within the application.
  4. Otherwise, it redirects the user to `/protected` (the default page after successful authentication).

### app/calendar/ Directory

Contains files related to the interactive calendar feature.

- **app/calendar/actions.ts (Server Actions)**:
  - Defines server actions for interacting with events, teams, and news data in Supabase.
  - **Types**: Defines `Event`, `Team`, and `News` TypeScript types.
  - **Event Functions**:
    - `getEvents(): Promise`: Fetches all events, ordered by start time. Includes data validation (required fields, valid dates, valid categories).
    - `getEvent(id: string): Promise`: Fetches a single event by ID, with validation.
    - `createEvent(event: Event): Promise`: Creates a new event.
    - `updateEvent(event: Event): Promise`: Updates an existing event.
    - `deleteEvent(id: string): Promise`: Deletes an event.
  - **Team Functions**: `getTeams`, `getTeam`, `createTeam`, `updateTeam`, `deleteTeam` (similar CRUD operations for teams).
  - **News Functions**: `getNews`, `getNewsById`, `createNews`, `updateNews`, `deleteNews`, `getNewsByCategory` (CRUD operations for news, with some data mapping for description, image, date).
  - All functions use `createClient` from `@/utils/supabase/server` and include error logging.

- **app/calendar/page.tsx ("use client")**:
  - Implements the interactive calendar page using `react-big-calendar`.
  - **Localization**: Configures `moment` for French locale.
  - **State**: Manages events, view (month, week, day, agenda), date, selected category, and loading status.
  - **Data Fetching**: Uses `useEffect` to call the `getEvents` server action to fetch event data.
  - **Event Formatting**: `formatEvents` function transforms fetched events into the format required by `react-big-calendar`.
  - **Filtering**: Filters events based on the selected category.
  - **UI**:
    - Displays a main calendar view.
    - Allows users to switch between different views (Month, Week, Day, Agenda) and filter by category using `Select` components.
    - Shows a list of "Événements à venir" (upcoming events) in a `Card`.
    - Provides "Exporter le calendrier" (Export Calendar) options (Google Calendar, iCalendar).
    - Includes a `Tabs` section to display events in a table, filterable by type (All, Matches, Tournaments, Club Events).
  - **Components**: Uses `Calendar` from `react-big-calendar`, and various shadcn/ui components (`Card`, `Button`, `Select`, `Tabs`).
  - **Custom Components**: `EventAgendaItem` for custom rendering in the agenda view.

### app/contact/page.tsx ("use client")

This page provides contact information and an adhesion (membership registration) form for the club.

- **State**:
  - `formSubmitted`: Tracks if the contact form has been submitted to show a confirmation message.
- **Structure**: Uses `Tabs` to switch between "Contact" and "Adhésion" sections.
- **Contact Tab**:
  - **Nous contacter (Contact Us Form)**:
    - A form for general inquiries with fields for Prénom, Nom, Email, Sujet (Subject - dropdown), and Message.
    - Includes a privacy policy checkbox.
    - On submit (`handleContactSubmit`), simulates form submission and shows a toast notification. Displays a success message if `formSubmitted` is true.
  - **Nos coordonnées (Our Contact Details)**:
    - Displays address, phone, email, and secretariat hours in `Card` components.
    - Includes a placeholder for a map.
- **Adhésion Tab (Membership)**:
  - **Rejoindre le club (Join the Club Form)**:
    - A pre-registration form with fields for Prénom, Nom, Date de naissance, Genre (Gender - radio buttons), Email, Téléphone, Adresse, Catégorie souhaitée (Desired Category - dropdown), Expérience en basket (Basketball Experience - dropdown), and Commentaires.
    - Includes a privacy policy checkbox.
    - On submit (`handleRegistrationSubmit`), simulates form submission and shows a toast notification.
  - **Informations sur l'adhésion (Membership Information)**:
    - Displays membership fees (Tarifs), required documents (Documents à fournir), and information on discounts/aid (Réductions et aides) in `Card` components.
    - Includes a button to download the registration file.
- **Components Used**: `Button`, `Card`, `Input`, `Label`, `RadioGroup`, `Select`, `Tabs`, `Textarea` from shadcn/ui, and `toast` from `@/hooks/use-toast`.

### app/doc/ Directory

Contains documentation-related files, primarily SQL scripts.

- **app/doc/deleted/**: This subdirectory seems to contain older or superseded SQL scripts.
  - `00001_create_profiles_table.sql`: SQL script to create the profiles table, set up RLS policies, and create triggers for `updated_at` and handling new user sign-ups. This table extends `auth.users`.
  - `00002_create_teams_table.sql`: SQL script to create the teams table with RLS policies and an `updated_at` trigger.
- **app/doc/mcp-info.md**:
  - A markdown file containing a conversational exchange (likely with GitHub Copilot) about setting up and troubleshooting the Supabase MCP (Multi-Cloud Platform) server connection in VS Code.
  - It covers:
    - Obtaining a Supabase personal access token.
    - Launching the MCP server via VS Code commands or directly in the terminal.
    - Diagnosing connection issues, including problems with `pnpm` vs `npx`, environment variables not being loaded correctly, and VS Code workspace scope.
    - Verifying package versions for `@supabase/ssr` and `@supabase/supabase-js`.
    - Listing Supabase projects using the Supabase CLI.
    - Troubleshooting why MCP tools might not appear in the Copilot chat window.
  - This file is valuable for understanding the intended developer workflow with MCP and potential debugging steps.
- **app/doc/v1_migration.sql**:
  - A comprehensive SQL script that appears to be a more current or complete version for setting up the database schema for the "Réveil Basket Is sur Tille" application.
  - **Table Creations**:
    - `profiles`: Extends `auth.users` with `first_name`, `last_name`, `role`, and timestamps. Includes an `updated_at` trigger.
    - `teams`: For team information (name, category, coach, etc.).
    - `news`: For club news articles (title, content, summary, image, category, etc.).
    - `events`: For club events (title, description, location, times, category, team association).
    - `media`: For photos and videos (title, description, URL, type, category).
    - `matches`: For match details (team, opponent, location, date, scores).
  - **Data Insertion**: Includes `INSERT INTO` statements to populate the tables with sample/demonstration data for teams, events, news, matches, and media.
  - **Row Level Security (RLS)**: Enables RLS for all created tables and defines various policies:
    - `profiles`: Users can view/update their own profile. Admins can view/update all profiles. Authenticated users can view all profiles.
    - `teams`, `news`, `events`, `media`, `matches`: Publicly readable by anonymous and authenticated users. Insert, update, and delete operations are restricted to users with the 'admin' role in their `profiles` record.
  - **Triggers & Functions** for `auth.users` synchronization:
    - `handle_new_user()`: A trigger function that automatically creates a corresponding record in `public.profiles` when a new user is added to `auth.users`. It attempts to pull `first_name`, `last_name`, and `role` from `NEW.raw_user_meta_data`.
    - `handle_user_deletion()`: A trigger function that deletes the corresponding profile from `public.profiles` when a user is deleted from `auth.users`.
    - `handle_user_update()`: A trigger function that updates the corresponding profile in `public.profiles` when a user's `raw_user_meta_data` is updated in `auth.users`.
  - This script is crucial for setting up the application's database structure and initial content.

### Static Assets in app/

- **app/favicon.ico**: The favicon for the application.
- **app/globals.css**: Global stylesheet, primarily setting up Tailwind CSS base, components, and utilities. Defines CSS variables for light and dark themes (colors, radius) used by shadcn/ui.
- **app/opengraph-image.png**: Image used for Open Graph meta tags (e.g., when sharing links on social media).
- **app/twitter-image.png**: Image used for Twitter card meta tags.

### app/protected/ Directory

This route group contains pages and layouts that require user authentication. Access is controlled by the `middleware.ts`.

- **app/protected/layout.tsx**: (Not explicitly provided, but common to have a layout for protected sections. If not present, it uses the root layout).
- **app/protected/page.tsx**:
  - A generic protected page displayed after successful login if no other specific protected route is targeted.
  - Fetches the authenticated user's data using `supabase.auth.getUser()` on the server.
  - If no user is found, redirects to `/sign-in`.
  - Displays a message indicating it's a protected page.
  - Shows the authenticated user's details (JSON stringified).
  - Includes component, likely part of a tutorial or next steps guide.
- **app/protected/member-area/**: A sub-section within protected routes, specifically for the member area.
  - **app/protected/member-area/loading.tsx**: A loading UI for this specific route segment. Currently returns `null`, meaning no specific loading spinner/skeleton will be shown here by default, relying on parent suspense boundaries or page-level loading states.
  - **app/protected/member-area/page.tsx ("use client")**:
    - The main page for the member's area.
    - **State**: `user`, `userProfile`, `isLoading`.
    - **Authentication & Profile Fetching**:
      - In `useEffect`, it fetches the current user via `/api/auth/me`. If no user, redirects to `/sign-in`.
      - Then, fetches the user's profile details via `/api/profile?userId=`.
      - Handles loading states and potential errors with toast notifications.
      - Uses `isMounted` ref to prevent state updates on unmounted components.
    - **UI**:
      - Displays a welcome message with the user's first name or email prefix.
      - Uses `Tabs` for navigation: "Tableau de bord" (Dashboard), "Mon profil" (My Profile), "Documents", "Paramètres" (Settings).
      - **Dashboard Tab**: Shows cards for "Prochains événements" (Upcoming Events), "Dernières actualités" (Latest News), "Documents importants" (Important Documents), and "Messages de l'équipe" (Team Messages). Content is currently placeholder.
      - **Profile Tab**: Displays user's personal information (name, email, role) and team assignment (placeholder). Provides buttons to "Modifier mes informations" (Edit My Information) and "Changer mon mot de passe" (Change My Password).
      - **Documents Tab**: Lists various club documents categorized into administrative, sports, and forms, with placeholder links.
      - **Settings Tab**: Allows users to configure notification preferences (email, news, events) and profile visibility. Includes a "Supprimer mon compte" (Delete My Account) button.
- **app/protected/reset-password/page.tsx**:
  - Page for users to set a new password after clicking the link from the password reset email.
  - Renders a form with "New password" and "Confirm password" inputs.
  - Uses the `resetPasswordAction` server action.
  - Displays `FormMessage` for feedback.

### app/test-connection/page.tsx ("use client")

This page is designed to test the connection to Supabase and verify data retrieval, as specified in `copilot-instructions.md`.

- **State**:
  - `connectionStatus`: Tracks the status ("loading", "success", "error", "tables-missing").
  - `teams`, `events`, `news`: Store fetched data.
  - `errorMessage`: Stores error messages.
  - `isLoading`: General loading state for the page.
- **Supabase Client**: Initializes a client-side Supabase client using `createClient()`.
- **Connection Testing Logic** (`checkSupabaseConnection`, `testConnection`):
  - `checkSupabaseConnection`: Attempts to verify Supabase connection using multiple methods:
    1. Custom RPC function `get_current_timestamp`.
    2. Health check query (`pg_stat_statements`).
    3. Auth session check.
  - `testConnection`:
    1. Calls `checkSupabaseConnection`.
    2. If connected, attempts to select a count from the "teams" table.
    3. If the "teams" table (or other project tables) doesn't exist (error message contains "relation does not exist"), sets `connectionStatus` to "tables-missing" and provides instructions to the user.
    4. If tables exist, fetches data using `getTeams`, `getEvents`, `getNews` server actions.
    5. Updates `connectionStatus` and `errorMessage` accordingly.
- **useEffect**: Calls `testConnection` on component mount.
- **UI**:
  - Displays the page title and a "Tester à nouveau" (Test Again) button.
  - Shows different `Alert` messages based on `connectionStatus`:
    - Loading: "Test de connexion en cours..."
    - Success: "Connexion réussie."
    - Tables Missing: "Tables manquantes." with detailed instructions on how to run the SQL setup script in the Supabase dashboard.
    - Error: "Erreur de connexion." with the error message and troubleshooting tips (check env vars, project status, network).
  - If `connectionStatus` is "success":
    - Displays fetched data (teams, events, news) in `Tabs` and `Card` components.
    - Shows connection info (Supabase URL, anon key prefix, counts of fetched items).
  - **Alert Fallback**: Includes simple local `Alert`, `AlertTitle`, `AlertDescription` components, likely as a fallback if `@/components/ui/alert` wasn't fully set up or available when this page was created.

### components/ Directory

Contains reusable React components.

- **components/deploy-button.tsx**:
  - A button that links to Vercel's "Deploy" page, pre-configured to clone and deploy this Next.js/Supabase starter template.
  - Uses `Link` from `next/link` and `Button` from `@/components/ui/button`.

- **components/env-var-checker.tsx ("use client")**:
  - A diagnostic component (likely for development/demo purposes) to check and display the status of Supabase environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
  - Shows whether each variable is defined.
  - Allows toggling the display of the actual variable values (anon key is partially masked).
  - Displays a warning if variables are missing.

- **components/env-var-warning.tsx**:
  - Displays a warning message and disabled Sign In/Sign Up buttons when Supabase environment variables are not set up.
  - Used in `app/layout.tsx` in the header.

- **components/form-message.tsx**:
  - A component to display success or error messages, typically used with forms.
  - Accepts a `message` prop which can be `{ success: string }`, `{ error: string }`, or `{ message: string }`.
  - Conditionally styles the message based on its type.

- **components/header-auth.tsx (Server Component)**:
  - Displays authentication-related buttons/info in the header.
  - If Supabase environment variables are not set (`!hasEnvVars`), shows a warning and disabled auth buttons.
  - If a user is authenticated (checked via `supabase.auth.getUser()`), displays a greeting ("Hey, user.email!") and a "Sign out" button (which uses `signOutAction`).
  - If no user is authenticated, displays "Sign in" and "Sign up" buttons linking to the respective pages.

- **components/hero.tsx**:
  - A component likely intended for the initial starter template's homepage (before customization for the basketball club).
  - Displays Supabase and Next.js logos and a title "The fastest way to build apps with Supabase and Next.js".

- **components/next-logo.tsx & components/supabase-logo.tsx**:
  - SVG components for Next.js and Supabase logos respectively.

- **components/submit-button.tsx ("use client")**:
  - A wrapper around the `Button` component, designed for use in forms with Server Actions.
  - Uses the `useFormStatus` hook from `react-dom` to detect if the form submission is pending.
  - Displays `pendingText` (default: "Submitting...") when pending is true, otherwise displays children.
  - Automatically sets `type="submit"` and `aria-disabled={pending}`.

- **components/theme-switcher.tsx ("use client")**:
  - Provides a dropdown menu to switch between light, dark, and system themes.
  - Uses `useTheme` from `next-themes`.
  - Displays an icon (Sun, Moon, Laptop) corresponding to the current theme.
  - Uses `DropdownMenu` components from shadcn/ui.

- **components/tutorial/ Directory**: Contains components used for the tutorial/onboarding steps often found in starter templates.
  - **code-block.tsx ("use client")**: Displays a block of code with a copy button.
  - **connect-supabase-steps.tsx**: A list of steps (using `TutorialStep`) guiding the user on how to connect their Supabase project (create project, set env vars, restart server).
  - **fetch-data-steps.tsx**: A list of steps guiding the user on creating tables in Supabase and querying data from Next.js (both Server and Client Components). Includes example SQL and code snippets using `CodeBlock`.
  - **sign-up-user-steps.tsx**: A list of steps for setting up user authentication, including configuring redirect URLs on Vercel and signing up the first user.
  - **tutorial-step.tsx**: A component that renders a single tutorial step with a checkbox (for users to mark as complete), title, and description.

- **components/typography/inline-code.tsx**:
  - A simple component to style text as inline code, matching shadcn/ui's visual style.

- **components/ui/ Directory**:
  - This directory contains UI primitive components, typically generated or provided by shadcn/ui. Each file generally exports a React component built using Radix UI primitives and styled with Tailwind CSS.
  - Examples: `alert.tsx`, `badge.tsx`, `button.tsx`, `card.tsx`, `checkbox.tsx`, `dropdown-menu.tsx`, `input.tsx`, `label.tsx`, `radio-group.tsx`, `select.tsx`, `tabs.tsx`, `textarea.tsx`, `toast.tsx`, `toaster.tsx`.
  - The `deploy-button.tsx` file in this directory is commented out, suggesting the primary `DeployButton` is at `components/deploy-button.tsx`.

### hooks/ Directory

- **hooks/use-toast.ts ("use client")**:
  - A custom hook for managing and displaying toast notifications, inspired by `react-hot-toast`.
  - Provides a `toast` function to trigger notifications and a `dismiss` function.
  - Manages an array of toasts in state, with a limit (`TOAST_LIMIT`) and automatic removal delay.
  - Used in conjunction with `components/ui/toast.tsx` and `components/ui/toaster.tsx`.

### lib/ Directory

Contains library/utility code.

- **lib/database.ts**:
  - Provides functions for interacting with the profiles table in the Supabase database.
  - **Type Profile**: Defines the structure of a user profile.
  - **checkSupabaseConnection()**: An internal utility to perform a basic connection check to Supabase by querying a system table.
  - **getUserProfile(userId: string): Promise**:
    - Fetches a user's profile from the profiles table by `userId`.
    - Includes the `checkSupabaseConnection` call.
    - Returns a default profile structure if the connection fails or the profile is not found, to prevent application errors. The `id` in profiles table is expected to match `auth.users(id)`.
  - **updateUserProfile(userId: string, profileData: Partial): Promise**: Updates a user's profile.
  - **inspectProfilesTable()**: A diagnostic function to fetch a sample of profiles and log their structure, useful for debugging.

- **lib/utils.ts**:
  - Exports a utility function `cn` which combines `clsx` and `tailwind-merge`. This is a standard utility from shadcn/ui for conditionally joining class names and resolving Tailwind CSS class conflicts.

### migrations/ Directory

Contains SQL migration scripts for database schema management.

- **migrations/connection-test.sql**:
  - Creates an RPC function `get_current_timestamp()` that returns the current timestamp.
  - Grants execute permission to the `anon` role.
  - This function is used by the `ping-supabase.yml` GitHub workflow as one way to check if the Supabase instance is responsive.

- **migrations/database-setup.sql**:
  - This is a comprehensive SQL script identical to `app/doc/v1_migration.sql`.
  - It defines the schema for profiles, teams, news, events, media, and matches tables.
  - Includes `INSERT INTO` statements for seeding these tables with initial data.
  - Sets up Row Level Security (RLS) policies for these tables, generally making data publicly readable but restricting write operations to 'admin' users.
  - Defines trigger functions (`handle_new_user`, `handle_user_deletion`, `handle_user_update`) to synchronize the `public.profiles` table with `auth.users`.
  - This script is intended to be run in the Supabase SQL Editor to set up the necessary database structure for the application.

### utils/ Directory

Contains various utility modules, particularly for Supabase client creation.

- **utils/supabase/check-env-vars.ts**:
  - A simple utility that exports a boolean constant `hasEnvVars`.
  - `hasEnvVars` is true if both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables are present.
  - Used throughout the application (e.g., in `app/layout.tsx`, `components/header-auth.tsx`) to conditionally render UI or behavior based on whether Supabase is configured.

- **utils/supabase/client.ts**:
  - Exports a function `createClient()` that creates and returns a Supabase client instance for use in client-side components (browser).
  - Uses `createBrowserClient` from `@supabase/ssr`.
  - Reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from `process.env`.

- **utils/supabase/middleware.ts**:
  - Exports a function `updateSession(request: NextRequest)` designed for use in Next.js middleware (`middleware.ts`).
  - **Purpose**: To manage and refresh user sessions, ensuring authentication state is correctly handled, especially for Server Components.
  - **Logic**:
    1. Creates a Supabase server client using `createServerClient` from `@supabase/ssr`. It's configured to read and write cookies from the request and response.
    2. Calls `supabase.auth.getUser()` to refresh the session if it's expired.
    3. **Route Protection**:
       - If the request path starts with `/protected` and there's no authenticated user (or an error fetching the user), it redirects to `/sign-in`.
       - If the request path is `/` (homepage) and a user is authenticated, it redirects to `/protected`.
    4. Returns the response (potentially modified with new session cookies).
    5. Includes a try/catch block, noting that if a Supabase client cannot be created, it's likely due to missing environment variables.

- **utils/supabase/server.ts**:
  - Exports an async function `createClient()` that creates and returns a Supabase client instance for use in server-side contexts (Server Components, Route Handlers, Server Actions).
  - Uses `createServerClient` from `@supabase/ssr`.
  - Accesses cookies using `cookies()` from `next/headers`.
  - Configures the client with cookie handlers (`getAll`, `setAll`) to read from and write to the Next.js cookie store.
  - Includes a try/catch in `setAll` to handle cases where `set` might be called from a Server Component (which is generally okay if middleware handles session refreshing).

- **utils/utils.ts**:
  - Exports a utility function `encodedRedirect(type: "error" | "success", path: string, message: string)`.
  - This function is used by Server Actions (`app/actions.ts`) to redirect the user to a specified path while passing a message (either success or error) as a URL query parameter. The message is URI encoded.

# Setup and Configuration

## Environment Variables

1. Copy `.env.local.example` to `.env.local`.
2. Populate `.env.local` with your Supabase Project URL and Anon Key:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```
   These can be found in your Supabase project's API settings.

## Database Setup

1. **Connection Test Function** (Optional but recommended for ping-supabase workflow):
   - Execute the content of `migrations/connection-test.sql` or `check-connection.sql` in your Supabase SQL Editor. This creates the `get_current_timestamp()` RPC function.

2. **Main Database Schema and Data**:
   - Execute the content of `migrations/database-setup.sql` (or `app/doc/v1_migration.sql`) in your Supabase SQL Editor. This will:
     - Create all necessary tables (profiles, teams, events, news, media, matches).
     - Insert sample data into these tables.
     - Set up Row Level Security policies.
     - Create triggers to synchronize the profiles table with `auth.users`.

## Running Locally

1. Install dependencies:
   ```bash
   pnpm install
   # or npm install or yarn install
   ```

2. Run the development server:
   ```bash
   pnpm dev
   # or npm run dev or yarn dev
   ```
   The application will be available at `http://localhost:3000`.

## Supabase MCP Server (Optional for VS Code Integration)

1. Obtain a Supabase Personal Access Token from `app.supabase.com` (Account -> Access Tokens).
2. In VS Code, open the command palette (Ctrl+Shift+P or Cmd+Shift+P).
3. Type "MCP: Start Server" and select it.
4. Choose "supabase" from the list.
5. When prompted, enter your Supabase Personal Access Token.
   - This uses the configuration in `.vscode/mcp.json`.
   - Refer to `app/doc/mcp-info.md` for troubleshooting.

# Extending and Customizing

## Adding New Pages/Features

- Create new route segments within the `app/` directory following Next.js App Router conventions.
- For data-driven features, define new tables in Supabase (and corresponding SQL migration scripts).
- Create Server Actions in `app/actions.ts` or new `actions.ts` files within specific route groups for data mutations.
- Fetch data in Server Components or Client Components using the Supabase client.

## Modifying UI

- Adjust Tailwind CSS classes in `.tsx` components.
- Customize or add new shadcn/ui components via the CLI (`pnpm dlx shadcn-ui@latest add [component-name]`).
- Modify `tailwind.config.ts` for theme-wide changes.

## Database Schema Changes

- Create new SQL migration scripts in the `migrations/` directory.
- Update RLS policies as needed.
- Update TypeScript types (e.g., in `app/calendar/actions.ts` or `lib/database.ts`) to reflect schema changes.

## Authentication

- Supabase Auth is highly configurable. You can add more OAuth providers, customize email templates, or adjust security settings in your Supabase project dashboard.

# Architectural Patterns and Trade-offs

- **Next.js App Router**: Offers improved routing, layouts, and support for Server Components. This can lead to better performance and developer experience but has a learning curve compared to the Pages Router.

- **Server Components vs. Client Components**:
  - **Server Components** are used for pages/layouts that can be rendered on the server, reducing client-side JavaScript. Good for static content or data fetching directly on the server (e.g., `app/protected/page.tsx`).
  - **Client Components** ("use client") are necessary for interactivity, state, and browser-specific APIs (e.g., `app/calendar/page.tsx`, `app/test-connection/page.tsx`).

- **Server Actions**: Used for form submissions and data mutations from the client to the server without needing to create separate API routes. Simplifies data handling for forms (e.g., `app/actions.ts`).

- **Supabase SSR**: The `@supabase/ssr` package is used to ensure authentication state is correctly managed between server and client, allowing secure data fetching in Server Components and consistent UX. Middleware plays a key role here.

- **Shadcn/UI**: Provides unstyled, accessible components that you copy into your project. This gives full control over styling and code, but means updates to components aren't automatic (you own the code).

- **Centralized vs. Co-located Server Actions**:
  - Auth actions are centralized in `app/actions.ts`.
  - Calendar-related data actions are in `app/calendar/actions.ts`, co-located with the feature. This improves modularity.

- **Environment Variable Handling**: The explicit check for `hasEnvVars` and conditional UI rendering is good for a starter template to guide users but might be removed or simplified in a production application once setup is complete.

This documentation should serve as a solid foundation for understanding and working with the Supabase Next.js Template.

# Business Logic

## User Account & Profile Management

1. **Component Name**: User Account & Profile Management

2. **Purpose**:
   - Solves the business problem of controlling access to club-specific information and member-only features by providing a secure way for users to create accounts, log in, and manage their credentials.
   - Represents the domain concepts of User Identity, Authentication, and Authorization within the club's digital platform. It also covers basic user profile data linked to their authentication identity.

3. **Key Responsibilities**:
   - **User Registration**: Allows new users to sign up for an account using email and password. Requires email verification to activate the account.
   - **User Sign-In**: Enables registered users to access their accounts and protected areas of the application.
   - **User Sign-Out**: Allows authenticated users to securely end their session.
   - **Password Recovery (Forgot Password)**: Provides a flow for users who have forgotten their password to reset it via an email link.
   - **Password Reset**: Allows users to set a new password after following the recovery link.
   - **Session Management**: Maintains user sessions securely using cookies, making the user's session available across client and server components, middleware, and API routes.
   - **Access Control**: Ensures that only authenticated users can access protected routes (e.g., `/protected`, `/protected/member-area`).
   - **Profile Data Retrieval**: Fetches basic profile information (first name, last name, role, email) for authenticated users.

4. **Workflows / Use Cases**:
   - **New User Registration**:
     - **Trigger**: User navigates to the `/sign-up` page and submits the registration form.
     - **Steps**:
       1. Collect email and password.
       2. Validate inputs.
       3. Call Supabase Auth to create a new user.
       4. Send a verification email to the user.
       5. Redirect user with a success message to check their email.
       6. Upon clicking the verification link, the user's session is created via `/auth/callback`.
     - **Outcome**: A new user account is created (pending email verification), and a basic profile record is automatically generated in the profiles table.
   - **User Login**:
     - **Trigger**: User navigates to the `/sign-in` page and submits the login form.
     - **Steps**:
       1. Collect email and password.
       2. Call Supabase Auth to authenticate the user.
       3. If successful, establish a session.
     - **Outcome**: User is logged in and redirected to the protected area (`/protected`).
   - **Password Reset Request**:
     - **Trigger**: User navigates to `/forgot-password` and submits their email.
     - **Steps**:
       1. Collect email.
       2. Call Supabase Auth to send a password reset email.
       3. Redirect user with a success message.
     - **Outcome**: User receives an email with a link to reset their password.
   - **Actual Password Reset**:
     - **Trigger**: User clicks the reset link in the email, is redirected to `/protected/reset-password` (via `/auth/callback`).
     - **Steps**:
       1. User enters and confirms a new password.
       2. Validate passwords match and meet complexity requirements (min length 6 for sign-up).
       3. Call Supabase Auth to update the user's password.
     - **Outcome**: User's password is updated. User is informed of success/failure.
   - **Accessing Protected Content**:
     - **Trigger**: User attempts to access a route starting with `/protected`.
     - **Steps**: Middleware checks for an active session.
     - **Outcome**: If authenticated, access is granted. If not, user is redirected to `/sign-in`.
   - **Fetching User Details** (e.g., for Member Area):
     - **Trigger**: A protected page or API route needs current user data.
     - **Steps**:
       1. Call `/api/auth/me` or use server-side Supabase client to get user auth data.
       2. Optionally, call `/api/profile?userId=` or `lib/database.getUserProfile` to get associated profile data from the profiles table.
     - **Outcome**: User's authentication details and/or profile information are returned.

5. **Inputs and Outputs**:
   - **Inputs**:
     - User credentials (email, password).
     - Form data for registration, login, password reset.
     - HTTP request (for session management in middleware).
     - User ID (for profile fetching).
   - **Outputs**:
     - User session (cookies).
     - Redirections to appropriate pages.
     - Status messages (success/error) to the UI.
     - User object (auth details, profile data).
     - Affects `auth.users` table (Supabase internal) and `public.profiles` table.

6. **Dependencies**:
   - **Supabase Auth**: Core dependency for all authentication operations.
   - **Supabase Database**: For storing user profiles in the profiles table (linked to `auth.users`).
   - **Next.js Routing & Middleware**: For page navigation, redirects, and route protection.
   - **@supabase/ssr**: For server-side rendering authentication and cookie management.
   - **utils/supabase/server.ts**, **utils/supabase/client.ts**, **utils/supabase/middleware.ts**: Internal Supabase client initializers.
   - **lib/database.ts**: For `getUserProfile` and `updateUserProfile`.
   - **Database schema**: `profiles` table as defined in `migrations/database-setup.sql`.

7. **Business Rules & Constraints**:
   - Email and password are required for sign-up and sign-in.
   - Password must be at least 6 characters long (enforced at sign-up UI).
   - Users must verify their email address after sign-up to activate their account.
   - Only authenticated users can access routes under `/protected`.
   - A `profiles` record is automatically created for a new user upon signup (via `handle_new_user` trigger in `database-setup.sql`).
   - User roles (admin, member, coach) are defined in the profiles table.
   - Authenticated users can view and update their own profile. Admins can view/update all profiles (as per RLS policies in `database-setup.sql`).
   - Email rate limiting is a factor (noted in `SmtpMessage.tsx`); custom SMTP is recommended for higher limits.

8. **Design Considerations**:
   - Uses Supabase's built-in authentication, which handles much of the security complexity (e.g., password hashing, token management).
   - Leverages Next.js Server Actions for form submissions, keeping logic on the server.
   - `middleware.ts` is crucial for session validation and protecting routes.
   - The `encodedRedirect` utility standardizes how messages are passed to UI after actions.
   - The `lib/database.ts` `getUserProfile` function includes a fallback to return a default profile structure if Supabase connection fails or a profile isn't found, enhancing resilience for the UI.
   - Database triggers (`handle_new_user`, `handle_user_deletion`, `handle_user_update` in `database-setup.sql`) automate profile synchronization with `auth.users` table modifications.

# Club Information Management

1. **Component Name**: Club Information Management

2. **Purpose**:
   - Manages the core data entities of the basketball club: Teams, Events, and News articles. This system allows authorized administrators to create, read, update, and delete club-related information, which is then displayed across the website.
   - Represents the domain concepts of Team Rosters, Club Calendar/Schedule, and Club Announcements/Communication.

3. **Key Responsibilities**:
   - **Team Management**:
     - Allows creation, retrieval, update, and deletion of team records.
     - Team data includes name, category, coach, championship, schedule, description, and image URL.
   - **Event Management**:
     - Allows creation, retrieval, update, and deletion of club events.
     - Event data includes title, description, location, start/end times, category (match, training, tournament, meeting, other), and associated team.
     - Ensures data integrity for events (e.g., required fields, valid dates, valid categories).
   - **News Management**:
     - Allows creation, retrieval, update, and deletion of news articles.
     - News data includes title, content, summary, image URL, category, publication date, and author.
     - Retrieves news sorted by publication date (descending).
   - **Data Validation**: Performs basic validation on event data before database operations (e.g., required fields, start time before end time, valid categories).

4. **Workflows / Use Cases**:
   - **Administrator Adds a New Team**:
     - **Trigger**: Admin uses a (hypothetical) CMS interface to add a new team.
     - **Steps**:
       1. Admin provides team details.
       2. `createTeam` action is called with team data.
       3. Data is inserted into the teams table.
     - **Outcome**: New team record is created and can be displayed on the website.
   - **Administrator Updates an Event**:
     - **Trigger**: Admin edits an existing event through a CMS.
     - **Steps**:
       1. Admin modifies event details.
       2. `updateEvent` action is called with updated event data.
       3. Data is validated (e.g. start/end times, category).
       4. The corresponding record in the events table is updated.
     - **Outcome**: Event details are updated on the website's calendar.
   - **Website Fetches Latest News for Homepage**:
     - **Trigger**: Homepage (`app/page.tsx`) loads.
     - **Steps**: `getNews` action is called.
     - **Outcome**: A list of recent news articles is retrieved from the news table and displayed.
   - **Calendar Page Fetches All Events**:
     - **Trigger**: Calendar page (`app/calendar/page.tsx`) loads.
     - **Steps**: `getEvents` action is called.
     - **Outcome**: A list of all events is retrieved from the events table, validated, and displayed.

5. **Inputs and Outputs**:
   - **Inputs**:
     - Data for new or updated teams, events, or news articles (typically Team, Event, News objects).
     - IDs for specific records to be fetched, updated, or deleted.
     - Category for filtering news (e.g., `getNewsByCategory`).
   - **Outputs**:
     - Arrays of Team, Event, or News objects (for get functions).
     - Single Team, Event, or News object (for `getById`, `create`, `update` functions).
     - Boolean success status (for delete functions).
     - Affects teams, events, news tables in the database.
     - Error messages logged to console if operations fail or data is invalid.

6. **Dependencies**:
   - **Supabase Database**: Core dependency for storing and retrieving all club information.
   - **utils/supabase/server.ts**: To create a Supabase client for server-side data access.
   - **Database schema**: teams, events, news tables as defined in `migrations/database-setup.sql`.
   - **events table** has a foreign key to teams.
   - **news table** has an optional foreign key to `auth.users` (for author).

7. **Business Rules & Constraints**:
   - **Event Categories**: Must be one of 'match', 'training', 'tournament', 'meeting', 'other'.
   - **Event Timing**: Event `start_time` must be before `end_time`.
   - **Required Fields for Events**: `id`, `title`, `description`, `location`, `start_time`, `end_time`, `category` are validated as present in `getEvents` and `getEvent`.
   - **News Ordering**: News articles are generally fetched in reverse chronological order of `published_at`.
   - **Team Ordering**: Teams are generally fetched ordered by name.
   - **Event Ordering**: Events are generally fetched ordered by `start_time`.
   - **Access Control (Database Level)**: RLS policies in `database-setup.sql` define that:
     - Teams, events, news, media, matches are publicly viewable.
     - Only users with the 'admin' role (in profiles table) can create, update, or delete these records.
   - **(Note**: While media and matches tables exist in SQL, `app/calendar/actions.ts` does not currently implement CRUD for them).

8. **Design Considerations**:
   - All data access functions are async and designed to be used as Server Actions or in server-side components/routes.
   - Error handling primarily involves logging errors to the console and returning empty arrays or null for get operations, or null/false for CUD operations on failure. This might require more robust error propagation to the UI in a production system.
   - The `getEvents` and `getEvent` functions include runtime data validation beyond basic type checking, enhancing data integrity.
   - The PRD mentions a "CMS interface for managing articles and events". This component (`app/calendar/actions.ts`) provides the backend logic for such an interface.

# Interactive Club Calendar

1. **Component Name**: Interactive Club Calendar

2. **Purpose**:
   - Provides club members and visitors with a comprehensive, interactive view of all club-related events, such as matches, training sessions, tournaments, and meetings.
   - Solves the business problem of centralizing event information and making it easily accessible and filterable. Represents the domain concept of a dynamic Club Schedule.

3. **Key Responsibilities**:
   - **Display Events**: Fetches and displays club events on a calendar interface.
   - **Multiple Views**: Supports different calendar views (Month, Week, Day, Agenda).
   - **Event Filtering**: Allows users to filter events by category (e.g., Match, Training, Tournament).
   - **Upcoming Events List**: Shows a summarized list of the next few upcoming events.
   - **Event Details**: Displays details for each event, including title, date, time, location, and description (via tooltips or agenda view).
   - **Calendar Export (Placeholder)**: Indicates functionality for users to export the calendar (e.g., to Google Calendar, iCalendar), though implementation of actual export is not present in the provided backend logic.

4. **Workflows / Use Cases**:
   - **Viewing the Calendar**:
     - **Trigger**: User navigates to the `/calendar` page.
     - **Steps**:
       1. `getEvents` action is called to fetch all event data from Supabase.
       2. Events are formatted for the `react-big-calendar` component.
       3. Calendar is rendered with the events.
     - **Outcome**: User sees a calendar populated with club events.
   - **Changing Calendar View**:
     - **Trigger**: User selects a different view (Month, Week, Day, Agenda) from the UI.
     - **Steps**: The `react-big-calendar` component re-renders to display events in the selected view format.
     - **Outcome**: Calendar display updates to the chosen view.
   - **Filtering Events by Category**:
     - **Trigger**: User selects an event category from a dropdown.
     - **Steps**:
       1. The list of fetched events is filtered client-side based on the selected category.
       2. The calendar re-renders with only the filtered events.
     - **Outcome**: Calendar displays only events matching the selected category.
   - **Viewing Upcoming Events**:
     - **Trigger**: User views the "Événements à venir" section on the calendar page.
     - **Steps**:
       1. Fetched events are filtered to include only future events.
       2. Events are sorted by start time.
       3. The top 5 upcoming events are displayed.
     - **Outcome**: User sees a list of the next five scheduled events.

5. **Inputs and Outputs**:
   - **Inputs**:
     - User interactions (selecting view, date navigation, category filter).
     - (Indirectly) Event data from the events table via `getEvents` action.
   - **Outputs**:
     - Visual representation of the club's event schedule.
     - Filtered lists of events based on user criteria.
     - Formatted event details (title, time, location, description).

6. **Dependencies**:
   - **app/calendar/actions.ts**: Specifically the `getEvents` function to fetch event data.
   - **react-big-calendar**: UI library for rendering the calendar.
   - **moment.js**: For date/time localization and formatting.
   - **Supabase (indirectly, via getEvents)**: For the underlying event data.

7. **Business Rules & Constraints**:
   - Events are fetched and then filtered client-side for categories and upcoming views.
   - Upcoming events list is limited to the next 5 events.
   - Event categories for filtering are predefined: "Tous les événements", "Matchs", "Entraînements", "Tournois", "Réunions", "Autres".
   - Calendar is localized to French (`moment.locale("fr")`).
   - A loading state is displayed while events are being fetched.

8. **Design Considerations**:
   - The calendar is a client-side component ("use client") that fetches data using a Server Action (`getEvents`).
   - Filtering is performed on the client after all events are fetched. For very large datasets, server-side filtering might be more performant.
   - The component relies on `react-big-calendar` for the core calendar rendering and interaction logic.
   - Placeholder UI elements for calendar export suggest planned future functionality.
   - Tabular display of events below the main calendar provides an alternative, list-based view, also filterable.

# Public Website Content & Navigation

1. **Component Name**: Public Website Content & Navigation

2. **Purpose**:
   - Provides the public-facing informational content of the "Réveil Basket Is sur Tille" website, including the homepage, about page, and contact/membership inquiry page. It aims to inform visitors about the club, its activities, and how to get in touch or join.
   - Represents the club's online presence, brand, and initial point of contact for potential members, supporters, and the general public.

3. **Key Responsibilities**:
   - **Homepage Display**:
     - Presents a dynamic banner and introductory information.
     - Displays recent news articles (limited to the latest 3).
     - Showcases a brief club presentation and links to partners.
     - Includes a Call to Action (CTA) to join the club.
   - **About Page Display**:
     - Presents the club's history, values, and leadership team (with placeholder images and bio).
     - Lists the club's achievements (palmarès).
   - **Contact Form Submission**:
     - Allows users to send inquiries to the club.
     - Includes fields for name, email, subject, and message.
     - Requires consent to privacy policy.
     - Simulates form submission and shows a success message.
   - **Membership Pre-registration**:
     - Allows prospective members to submit a pre-registration form.
     - Collects personal details, contact information, desired category, and basketball experience.
     - Provides information on membership fees, required documents, and available financial aid.
     - Requires consent to privacy policy.
     - Simulates form submission and shows a success message.
   - **Display Club Contact Information**: Shows club's address, phone, email, and secretariat hours.

4. **Workflows / Use Cases**:
   - **Visitor Browses Homepage**:
     - **Trigger**: User navigates to the root URL (`/`).
     - **Steps**:
       1. Page fetches the latest 3 news articles using `getNews` action.
       2. Page renders the banner, news snippets, club intro, partner logos (placeholders), and CTA.
     - **Outcome**: User gets an overview of the club and recent activities.
   - **Visitor Learns About the Club**:
     - **Trigger**: User navigates to `/about`.
     - **Steps**: Page renders pre-defined content about club history, values, team, and achievements.
     - **Outcome**: User gains deeper insight into the club's identity and background.
   - **Visitor Submits a Contact Inquiry**:
     - **Trigger**: User fills and submits the contact form on `/contact`.
     - **Steps**:
       1. Form data is collected.
       2. Client-side validation (simulated, actual server validation would occur if not a simulation).
       3. Form submission is simulated (no actual backend endpoint hit in the provided code for this specific form).
       4. A success toast message is displayed.
     - **Outcome**: User believes their message has been sent.
   - **Prospective Member Submits Pre-registration Form**:
     - **Trigger**: User fills and submits the membership pre-registration form on `/contact` (Adhésion tab).
     - **Steps**: Similar to contact form submission, data is collected and submission is simulated.
     - **Outcome**: User believes their pre-registration request has been sent.

5. **Inputs and Outputs**:
   - **Inputs**:
     - User navigation to pages.
     - Contact form data (name, email, subject, message).
     - Membership pre-registration form data (name, birthdate, gender, email, phone, address, category, experience, comments).
     - (For Homepage) Data from `getNews` action.
   - **Outputs**:
     - Rendered HTML pages with club information.
     - UI feedback for form submissions (toast messages).
     - (Potentially) Submitted form data to a backend (though current forms are simulated client-side).

6. **Dependencies**:
   - **app/calendar/actions.ts**: For `getNews` function used on the homepage.
   - **React components** for UI structure (Cards, Buttons, Forms, Tabs, etc.).
   - **useToast hook** for displaying form submission feedback.
   - **Static content** and placeholder data hardcoded within the page components (e.g., team members on About page, pricing on Contact page).

7. **Business Rules & Constraints**:
   - Homepage displays a maximum of 3 news articles.
   - Contact and pre-registration forms require privacy policy consent.
   - Membership pricing and required documents are displayed as static information.
   - Form submissions on the `/contact` page are currently client-side simulations (i.e., data is not actually sent to a backend for processing via these specific forms).
   - Partner logos on the homepage are placeholders.
   - Map on the contact page is a placeholder.

8. **Design Considerations**:
   - The About page and parts of the Contact page rely heavily on static, hardcoded content. A CMS or database integration would be needed for dynamic updates of this information (e.g., leadership team, palmarès, membership fees).
   - The contact and pre-registration form submissions are simulated. For a functional system, these would need to be connected to backend actions (e.g., sending an email, storing data in Supabase).
   - The use of UI components (Tabs, Cards) helps structure information clearly.
   - The design assumes a need for distinct "Contact" and "Adhésion" (Membership) sections, handled via tabs on a single page.

# Member-Specific Portal & Services

1. **Component Name**: Member-Specific Portal & Services

2. **Purpose**:
   - Provides authenticated club members with a personalized and secure area to access club-specific information, manage their profile, and view relevant updates.
   - Solves the business problem of delivering tailored content and services to registered members, enhancing their engagement and experience with the club. Represents the "Espace membres" or Member Area.

3. **Key Responsibilities**:
   - **Personalized Welcome**: Greets the logged-in member by their name or email.
   - **Dashboard Overview**: Displays a summary of relevant information, such as upcoming events for their team (placeholder), latest club news (placeholder), and quick access to important documents.
   - **Profile Management Display**: Shows the member's current profile information (name, email, role). Provides a (placeholder) button to modify information and change password.
   - **Document Access (Placeholder)**: Lists categories of club documents (administrative, sporting, forms) with links (placeholders) for members to access.
   - **Settings Management (Placeholder)**: Offers options to manage notification preferences (email, news, events) and profile visibility (placeholders). Includes a (placeholder) option to delete their account.
   - **Authentication Check**: Ensures only authenticated users can access this area.

4. **Workflows / Use Cases**:
   - **Member Accesses Their Portal**:
     - **Trigger**: Authenticated user navigates to `/protected/member-area` (or `/protected` which may redirect here or show basic auth user info).
     - **Steps**:
       1. Page fetches the current authenticated user's auth data (`/api/auth/me`).
       2. Page fetches the user's profile data from the profiles table using their ID (`/api/profile?userId=`).
       3. Displays a personalized welcome and the dashboard.
     - **Outcome**: Member views their personalized portal with relevant information.
   - **Member Views Their Profile**:
     - **Trigger**: Member clicks on the "Mon profil" tab.
     - **Steps**: The profile section displays the fetched user and profile data.
     - **Outcome**: Member can see their stored personal information and role.
   - **Member Checks for Club Documents (Conceptual)**:
     - **Trigger**: Member clicks on the "Documents" tab.
     - **Steps**: A list of available document links (currently placeholders) is displayed.
     - **Outcome**: Member can see the types of documents available for download/viewing.
   - **Member Adjusts Settings (Conceptual)**:
     - **Trigger**: Member clicks on the "Paramètres" tab.
     - **Steps**: UI for notification and privacy settings (currently placeholders) is displayed.
     - **Outcome**: Member can see options to customize their experience.

5. **Inputs and Outputs**:
   - **Inputs**:
     - Authenticated user's session.
     - User ID (derived from session for API calls).
     - User interactions (tab selections).
   - **Outputs**:
     - Rendered HTML page displaying personalized member data and club information.
     - (Potentially, if implemented) Updates to user profile, settings, or password.

6. **Dependencies**:
   - **User Account & Profile Management Component**: For authentication and fetching user/profile data (`/api/auth/me`, `/api/profile`, `lib/database.getUserProfile`).
   - **Supabase (indirectly via API calls)**.
   - **React UI components** (Tabs, Cards, Buttons).
   - **useToast hook** (for potential future actions like profile updates).
   - **next/navigation** (`useRouter`) for redirection if user is not authenticated.

7. **Business Rules & Constraints**:
   - Access to `/protected/member-area` is restricted to authenticated users.
   - The displayed name prioritizes `first_name` from profile, then user's email part, then "Membre".
   - Many features within the member area (editing profile, document links, settings changes, team-specific events/messages) are currently placeholders and would require further backend implementation.
   - The `protected/page.tsx` acts as a generic authenticated landing page, displaying raw user JSON and "Next steps" tutorial information, while `protected/member-area/page.tsx` is the more specific club member portal.

8. **Design Considerations**:
   - The component is client-side rendered ("use client") and fetches user data via API calls on mount.
   - Graceful loading state is implemented while fetching user data.
   - Uses a `useRef` for `isMounted` to prevent state updates on unmounted components, which is good practice but less critical with modern React StrictMode behaviors.
   - The structure heavily relies on tabs to organize different sections of the member portal.
   - Significant parts of the described functionality in the PRD (e.g., document access, personalized dashboard elements beyond basic profile info) are not yet fully implemented in the backend logic connected to this page.

# System Health & Supabase Integration Management

1. **Component Name**: System Health & Supabase Integration Management

2. **Purpose**:
   - To ensure and verify the operational status of the Supabase backend, including basic connectivity, the existence of necessary database tables, and the ability to retrieve data. This is crucial for both development and ongoing maintenance of the application.
   - Represents the technical requirement of maintaining a reliable connection to the backend data store and providing diagnostic tools for troubleshooting.

3. **Key Responsibilities**:
   - **Supabase Connection Check (Manual)**: Provides a dedicated page (`/test-connection`) for developers/administrators to manually trigger a connection test to Supabase.
   - **Table Existence Check**: Verifies if essential project tables (e.g., teams) exist in the Supabase database.
   - **Data Retrieval Test**: Attempts to fetch sample data from teams, events, and news tables to confirm read operations are working.
   - **Clear User Feedback**: Displays status messages (loading, success, error, tables-missing) and detailed instructions if tables are missing, guiding the user on how to run migration scripts.
   - **Automated Supabase Health Ping (Scheduled)**: Periodically checks the health of the Supabase instance via a GitHub Actions workflow (`ping-supabase.yml`).
   - **Multiple Health Check Methods**: The automated ping attempts to verify Supabase health using a custom RPC function (`get_current_timestamp`) and falls back to checking the auth service.

4. **Workflows / Use Cases**:
   - **Developer Verifies Initial Supabase Setup**:
     - **Trigger**: Developer navigates to `/test-connection` after setting up the project.
     - **Steps**:
       1. Page automatically attempts to connect to Supabase and fetch data.
       2. Checks for basic connectivity (e.g., using `get_current_timestamp` RPC or other methods).
       3. Checks if core tables like teams exist.
       4. If tables exist, fetches sample data.
     - **Outcome**: Developer sees a success message with sample data, an error message with diagnostics, or a "Tables Missing" message with instructions to run SQL migrations.
   - **Administrator Troubleshoots Data Issues**:
     - **Trigger**: Users report issues with data not appearing on the site.
     - **Steps**: Admin navigates to `/test-connection` and clicks "Tester à nouveau".
     - **Outcome**: Admin can quickly assess if the issue is related to Supabase connectivity or missing tables.
   - **Automated System Monitoring**:
     - **Trigger**: Scheduled GitHub Action (cron: '0 0,12 ') or manual dispatch.
     - **Steps**:
       1. Workflow attempts to call the `get_current_timestamp` RPC function on Supabase.
       2. If RPC fails, it attempts to query the Supabase `/auth/v1/user` endpoint.
     - **Outcome**: Workflow succeeds if either check indicates Supabase is responsive, fails otherwise, potentially alerting maintainers.

5. **Inputs and Outputs**:
   - **Inputs (Test Page)**:
     - User action (page load, "Tester à nouveau" button click).
     - Supabase environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
   - **Inputs (GitHub Workflow)**:
     - Supabase URL and Anon Key from GitHub Secrets.
     - Schedule or manual trigger.
   - **Outputs (Test Page)**:
     - UI displaying connection status (loading, success, error, tables-missing).
     - Error messages and diagnostic information.
     - Instructions for resolving missing tables.
     - Sample data from teams, events, news if successful.
   - **Outputs (GitHub Workflow)**:
     - Workflow status (success/failure).
     - Log messages indicating check results.

6. **Dependencies**:
   - **Supabase Client Libraries**: `@supabase/supabase-js`, `@supabase/ssr`.
   - **app/calendar/actions.ts**: For `getTeams`, `getEvents`, `getNews` used in the test page.
   - **check-connection.sql / migrations/connection-test.sql**: Defines the `get_current_timestamp` RPC function used by `ping-supabase.yml` and potentially by `test-connection/page.tsx`'s `checkSupabaseConnection` utility.
   - **migrations/database-setup.sql**: The script users are guided to run if tables are missing.
   - **GitHub Actions environment** (for the scheduled ping).

7. **Business Rules & Constraints**:
   - The `/test-connection` page first checks basic connectivity, then table existence, then data retrieval.
   - Specific error message ("relation ... does not exist") is used to detect missing tables.
   - The automated ping runs twice daily.
   - The PRD states that `check-connection.sql` (to create `get_project_ref` or `get_current_timestamp`) should be run before `database-setup.sql`.
   - The test connection page attempts multiple methods to verify Supabase connection if the primary RPC check fails.

8. **Design Considerations**:
   - The `/test-connection` page is client-side ("use client") for interactive testing.
   - The `checkSupabaseConnection` utility in `test-connection/page.tsx` tries multiple methods to ascertain connectivity, making it more robust.
   - The guidance provided for missing tables is user-friendly, including steps to use the Supabase SQL Editor.
   - The GitHub Actions workflow provides a proactive way to monitor Supabase health outside of user-initiated tests.
   - The `check-connection.sql` script defines a simple RPC function (`get_current_timestamp`) specifically for a lightweight health check. The PRD also mentions `get_project_ref()`, implying a similar purpose.
   - Fallback alert components are defined in `test-connection/page.tsx` in case the main UI library's Alert components are unavailable or not working.
```