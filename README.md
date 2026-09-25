# Education Management Platform

A modern, full-stack SaaS application for managing educational content, classes, and resources. Built with Next.js, TypeScript, and MongoDB, featuring secure authentication, file management, and an intuitive user interface.

## Features

### 📚 Class Management

- Create and organize educational classes
- Manage class metadata and descriptions
- Role-based access control (Admin, User)

### 📁 Hierarchical Content Organization

- Nested folder structures within classes
- Drag-and-drop folder reordering with LexoRank
- File and video management within folders
- Automatic rank-based sorting

### 🎬 Multimedia Support

- YouTube videos (the video id is parsed and validated server-side)
- File uploads to Cloudflare R2 via short-lived presigned URLs
- Support for multiple file types

### 👤 User Management

- Secure authentication with NextAuth.js
- Password-based login with bcrypt hashing
- Session management
- User profile management
- Admin panel for user administration

### 🎨 Modern UI/UX

- Material-UI component library
- Dark/light theme support with next-themes
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Toast notifications for user feedback

### 🔐 Security

- Password reset functionality with token expiration
- Email verification
- Secure API endpoints
- CORS protection

## Tech Stack

### Frontend

- **Next.js 15.5** + **React 19** - React framework for production
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **next-themes** - Theme management

### Backend & Database

- **Next.js API Routes** - Backend endpoints
- **Prisma ORM** - Database management
- **MongoDB** - NoSQL database
- **NextAuth.js** - Authentication

### External Services

- **Cloudflare R2** - File storage (S3-compatible API)
- **YouTube** - Video hosting

### Developer Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## Getting Started

### Prerequisites

- Node.js >= 18.17.0
- npm or yarn
- MongoDB database
- Cloudflare R2 bucket and credentials (for file uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AsselAlAssel/edu-hub.git
   cd edu-hub
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` and fill in the values:

   ```env
   DATABASE_URL=your_mongodb_url
   SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_DOMAIN=https://www.mohammedsubuh.com
   R2_ACCESS_KEY_ID=your_r2_key
   R2_SECRET_ACCESS_KEY=your_r2_secret
   R2_BUCKET_NAME=your_bucket_name
   R2_ACCOUNT_ID=your_cloudflare_account_id
   NEXT_PUBLIC_FILES_URL=https://your-public-r2-url
   ADMIN_EMAIL=the_only_email_allowed_to_register
   ```

4. **Initialize the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed initial data (optional)**
   ```bash
   npx ts-node scripts/seed-ranks.ts
   ```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check-format` - Check code formatting
- `npm run check-lint` - Check for linting errors
- `npm run check-style` - Check formatting and linting
- `npm run format` - Format code with Prettier
- `npm run fix-lint` - Fix linting errors
- `npm run fix-style` - Fix formatting and linting
- `npm run test-build` - Run style checks and build
- `npm run test` - Unit/component/API tests (Vitest + Testing Library)
- `npm run test:e2e` - End-to-end tests (Playwright, against `next start`)

## Design System — Quantum Aurora

- **Tokens** live in `theme/tokens.ts` (colors for both modes, radii 8/12/16/24/full, subtle/medium/strong shadows, motion, z-index, layout). They feed the MUI palette (`theme/palettes.ts`, `theme/index.ts`, exposed as `theme.tokens`) and are injected as `--qa-*` CSS variables by the root layout. Components never hardcode colors.
- **Primitives** in `src/components/ui/`: `Surface`, `PageShell`/`PageHeader`, `Section`/`SectionHeader`, `PrimaryButton`/`SecondaryButton`/`GhostButton`/`IconAction`, `FormField`/`PasswordField`/`SearchField`, `AppDialog`, `ConfirmDialog`, `ActionsMenu`, `IconTile`, `EmptyState`/`ErrorState`/`LoadingState`, skeletons.
- Arabic RTL first (`stylis-plugin-rtl`), Tajawal, no negative letter-spacing (it breaks joined Arabic glyphs). Animations respect `prefers-reduced-motion`.
- Light-mode `primary.main` is Primary Dark `#0369A1`: Azure `#0284C7` is below WCAG AA contrast on white.
- `stylis` is pinned to `4.2.0` to match `@emotion/cache`; a mismatched prefixer crashes SSR of MUI inputs.

## Testing

```bash
npm run test                                   # 80 unit/component/API tests
npx playwright install chromium                # once
npm run build && npm run test:e2e              # E2E against a production build
```

E2E specs are **read-only** (they never create or delete data) but use the database from `.env`. To build next to a running `next dev`, set `NEXT_DIST_DIR=.next-verify` for both `next build` and `npm run test:e2e`; set `E2E_BASE_URL` to test a deployed site instead.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/             # API routes
│   ├── (site)/          # Main site routes
│   └── context/         # React context providers
├── components/          # Reusable React components
├── hooks/               # Custom React hooks
├── libs/                # Utility libraries
├── services/            # API service layer
├── scenes/              # Page-level UI (Landing, Classes, Resources, Profile)
├── actions/             # Server helpers and admin-only server actions
├── constants/           # Navigation and shell constants
├── types/               # TypeScript type definitions
└── styles/              # Global styles
```

## API Endpoints

All write endpoints require an **ADMIN** session: `401` without a session, `403` for non-admins. IDs must be 24-char Mongo ObjectIds (`400` otherwise). Errors are JSON `{ "message": string }`.

| Endpoint                                                      | Access | Notes                                                            |
| ------------------------------------------------------------- | ------ | ---------------------------------------------------------------- |
| `GET /api/class`                                              | public | classes with root folder and file/video counts                   |
| `POST` / `PUT` / `DELETE /api/class`                          | admin  | create / rename+image / delete (recursive)                       |
| `GET /api/class/[classId]`                                    | signed | one class                                                        |
| `GET /api/resources/[folderId]`                               | public | `{ folders, files, videos }`                                     |
| `GET /api/folder/[folderId]/breadcrumbs`                      | public | folder chain from the class root                                 |
| `POST` / `PUT` / `DELETE /api/folder`                         | admin  | `PUT` takes `{ folderId, name }` (legacy `parentFolderId` works) |
| `POST` / `PUT` / `DELETE /api/file`                           | admin  | `DELETE` also removes the R2 object                              |
| `POST` / `PUT` / `DELETE /api/video`                          | admin  | YouTube id is derived server-side from `url`                     |
| `POST /api/move`, `POST /api/reorder`                         | admin  | move file/video (same class only), LexoRank reorder              |
| `PUT /api/landing` (`POST` alias)                             | admin  | validated upsert of the landing CMS                              |
| `GET` / `PATCH` / `DELETE /api/user`                          | admin  | list (no credentials), change role, delete (never yourself)      |
| `POST /api/user/register`                                     | public | only `ADMIN_EMAIL` may register                                  |
| `POST /api/user/update`, `/change-password`, `DELETE /delete` | signed | own account (admins may delete others)                           |

## Database Schema

The application uses MongoDB with Prisma ORM. Key models include:

- **User** - User accounts with authentication
- **Session** - Active user sessions
- **Class** - Educational classes
- **Folder** - Nested folder structure
- **File** - File resources
- **Video** - Video resources
- **VerificationToken** - Email verification tokens

See [prisma/schema.prisma](prisma/schema.prisma) for the complete schema.

## Authentication

The application uses [NextAuth.js](https://next-auth.js.org/) for authentication with:

- Credentials provider (email/password)
- Session-based authentication
- MongoDB adapter for session persistence

## File Storage

- **Cloudflare R2** - File storage; admins upload directly with presigned URLs
- **YouTube** - Video hosting and playback

## Performance Optimizations

- **Image Optimization** - Next.js Image component
- **Code Splitting** - Automatic route-based code splitting
- **Caching** - ISR (Incremental Static Regeneration)
- **LexoRank** - Efficient sorting and reordering without database writes
- **Lazy Loading** - Component and data lazy loading

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the project's style guidelines by running:

```bash
npm run fix-style
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

## Roadmap

- [ ] Advanced analytics and reporting
- [ ] Collaborative features
- [ ] AI-powered content recommendations
- [ ] Mobile application
- [ ] Real-time notifications
- [ ] Advanced permission management

---

**Built with ❤️ for educators and learners**
