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
- Video hosting and streaming via Bunny CDN
- File uploads with AWS S3 integration
- Support for multiple file types
- Presigned URLs for secure file access

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
- **Next.js 14** - React framework for production
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
- **AWS S3** - File storage
- **Bunny CDN** - Video streaming and storage
- **Stripe** - Payment processing (optional)

### Developer Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## Getting Started

### Prerequisites
- Node.js >= 18.17.0
- npm or yarn
- MongoDB database
- AWS S3 credentials (for file uploads)
- Bunny CDN credentials (for video hosting)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/saasbold.git
   cd saasbold
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=your_mongodb_url
   SHADOW_DATABASE_URL=your_shadow_db_url
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_key
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   AWS_REGION=your_aws_region
   S3_BUCKET_NAME=your_bucket_name
   BUNNY_API_KEY=your_bunny_api_key
   STRIPE_SECRET_KEY=your_stripe_key
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
- `npm run stripe:listen` - Listen for Stripe webhooks

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
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── styles/              # Global styles
```

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/session` - Get current session

### Classes
- `GET /api/class` - List classes
- `POST /api/class` - Create class
- `PUT /api/class/[id]` - Update class
- `DELETE /api/class/[id]` - Delete class

### Resources
- `GET /api/resources` - List resources
- `POST /api/resources` - Create resource
- `PUT /api/resources/[id]` - Update resource
- `DELETE /api/resources/[id]` - Delete resource

### Files & Folders
- `GET /api/file` - List files
- `POST /api/file` - Upload file
- `GET /api/folder` - List folders
- `POST /api/folder` - Create folder

### Utilities
- `POST /api/reorder` - Reorder items
- `POST /api/move` - Move items between folders
- `POST /api/revalidate` - Revalidate cache

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

- **AWS S3** - Primary file storage with presigned URLs for secure access
- **Bunny CDN** - Video streaming with optimized delivery

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
