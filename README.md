# MeghamGarg.com

[![Netlify Status](https://api.netlify.com/api/v1/badges/0ac14488-7759-4c6a-b5e5-56c2cdce12cf/deploy-status)](https://app.netlify.com/sites/meghamgarg/deploys)

> A modern, interactive portfolio and blog website showcasing software development expertise through cutting-edge web technologies.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38BDF8?logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.164.1-000000?logo=three.js)](https://threejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?logo=supabase)](https://supabase.com/)

## 🌟 Features

### 🎨 Interactive Portfolio

- **3D Animations**: Interactive iPhone and MacBook models with realistic lighting
- **Animated Backgrounds**: Dynamic displacement spheres with WebGL shaders
- **Smooth Scroll Effects**: Intersection Observer-powered animations
- **Responsive Design**: Custom grid patterns adapting to all screen sizes

### 📝 Full-Featured Blog

- **Rich Content**: Markdown support with syntax highlighting, math equations (KaTeX), and task lists
- **Dynamic Routing**: SEO-friendly URLs with slug-based navigation
- **Tag System**: Categorization and related post suggestions
- **Draft Mode**: Preview posts before publishing
- **Social Sharing**: Built-in sharing capabilities

### 🛡️ Admin Dashboard

- **Secure Authentication**: Password-protected admin panel with middleware
- **Content Management**: Create, edit, and manage blog posts
- **Media Gallery**: Image upload and management system
- **Subscriber Analytics**: Newsletter subscription management
- **Protected Routes**: Role-based access control

### 🚀 Performance & SEO

- **Next.js App Router**: Latest routing architecture for optimal performance
- **Dynamic Metadata**: Automatic SEO optimization for all pages
- **Sitemap Generation**: Automated sitemap and robots.txt
- **Analytics Integration**: Google Analytics and Microsoft Clarity

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14.2.3 with App Router
- **UI Library**: React 18 with custom components
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion for smooth transitions
- **3D Graphics**: Three.js with React Three Fiber
- **Icons**: Tabler Icons React

### Backend & Database

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom admin auth with bcrypt
- **API Routes**: Next.js API endpoints
- **File Storage**: Supabase Storage for media assets

### Content & Markdown

- **Markdown Parser**: React Markdown with GFM support
- **Code Highlighting**: React Syntax Highlighter
- **Math Rendering**: KaTeX for mathematical expressions
- **Content Sanitization**: Rehype plugins for security

### Development & Deployment

- **Language**: JavaScript/TypeScript
- **Package Manager**: npm
- **Linting**: ESLint with Next.js configuration
- **Deployment**: Optimized for Vercel/Netlify

## 📁 Project Structure

```
MeghamGarg.com/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 admin/              # Admin dashboard
│   │   │   ├── 📄 page.jsx        # Main admin panel
│   │   │   ├── 📁 blogs/          # Blog management
│   │   │   └── 📁 gallery/        # Media management
│   │   ├── 📁 api/                # API endpoints
│   │   │   ├── 📁 admin/          # Admin authentication
│   │   │   ├── 📁 blogs/          # Blog CRUD operations
│   │   │   └── 📁 subscribe/      # Newsletter API
│   │   ├── 📁 blog/               # Blog pages
│   │   │   └── 📁 [slug]/         # Dynamic blog posts
│   │   ├── 📁 logs/               # Blog listing
│   │   ├── 📄 layout.jsx          # Root layout
│   │   ├── 📄 page.jsx            # Homepage
│   │   └── 📄 globals.css         # Global styles
│   ├── 📁 components/             # React components
│   │   ├── 📄 custom-markdown.jsx # Enhanced markdown renderer
│   │   ├── 📄 blog-card.jsx       # Blog post cards
│   │   ├── 📄 navbar.jsx          # Navigation component
│   │   └── 📄 ...                 # Other components
│   ├── 📁 ui/                     # Reusable UI modules
│   │   ├── 📁 admin/              # Admin-specific components
│   │   ├── 📁 blog/               # Blog-specific components
│   │   ├── 📁 canvas/             # 3D canvas components
│   │   ├── 📁 common/             # Shared components
│   │   └── 📁 home/               # Homepage components
│   ├── 📁 utils/                  # Utility functions
│   │   ├── 📄 supabaseClient.js   # Database client
│   │   ├── 📄 apiUtils.js         # API helpers
│   │   └── 📄 cn.js               # Class name utility
│   ├── 📁 hooks/                  # Custom React hooks
│   ├── 📁 constants/              # Configuration files
│   └── 📁 assets/                 # Fonts and CSS
├── 📁 public/                     # Static assets
│   ├── 📁 images/                 # Image assets
│   ├── 📁 models/                 # 3D model files
│   ├── 📁 icons/                  # SVG icons
│   └── 📄 ...                     # Other static files
├── 📄 package.json               # Dependencies and scripts
├── 📄 tailwind.config.js         # Tailwind configuration
├── 📄 next.config.mjs            # Next.js configuration
└── 📄 middleware.js              # Route protection
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Git for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/MeghamGarg.com.git
   cd MeghamGarg.com
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Admin Authentication
   ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password
   JWT_SECRET=your_jwt_secret

   # Analytics (Optional)
   NEXT_PUBLIC_GA_ID=your_google_analytics_id
   NEXT_PUBLIC_CLARITY_ID=your_microsoft_clarity_id
   ```

5. **Database setup**

   ```sql
   -- Create blogs table
   CREATE TABLE blogs (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     content TEXT NOT NULL,
     slug VARCHAR(255) UNIQUE NOT NULL,
     tags TEXT[],
     excerpt TEXT,
     is_draft BOOLEAN DEFAULT false,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Create subscribers table
   CREATE TABLE subscribers (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     subscribed_at TIMESTAMP DEFAULT NOW()
   );
   ```

6. **Start development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 📝 Content Management

### Creating Blog Posts

1. **Access Admin Panel**

   - Navigate to `/admin`
   - Enter your admin password

2. **Create New Post**

   - Click "Create New Blog"
   - Fill in title, content (Markdown), tags, and excerpt
   - Toggle draft mode for previewing
   - Click "Create Blog" to publish

3. **Markdown Features**
   - Syntax highlighting for code blocks
   - Math equations with KaTeX
   - Task lists with checkboxes
   - Tables, images, and embeds
   - Custom styling with Tailwind classes

### Managing Content

- **Edit Posts**: Click edit icon on any blog post
- **Delete Posts**: Use delete button with confirmation
- **Manage Subscribers**: View and export newsletter subscribers
- **Upload Images**: Use gallery section for media management

## 🎨 Customization

### Design System

The website uses a custom design system built with Tailwind CSS:

```css
/* Primary Colors */
--amber-400: #fbbf24; /* Primary accent */
--amber-300: #fcd34d; /* Light accent */
--amber-500: #f59e0b; /* Dark accent */

/* Background */
--bg-primary: #000000; /* Main background */
--bg-secondary: #1a1a1a; /* Card backgrounds */

/* Text */
--text-primary: #ffffff; /* Primary text */
--text-secondary: #d1d5db; /* Secondary text */
```

### Component Customization

Components are modular and easily customizable:

```jsx
// Example: Customizing the blog card
<BlogCard
  title="Custom Title"
  excerpt="Custom excerpt..."
  tags={["custom", "tags"]}
  className="custom-styling"
/>
```

### 3D Models

Add new 3D models to the `/public/models/` directory and import them:

```jsx
import { useGLTF } from "@react-three/drei";

function CustomModel() {
  const { scene } = useGLTF("/models/your-model.gltf");
  return <primitive object={scene} />;
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**

   - Import project in Vercel dashboard
   - Connect your GitHub repository

2. **Configure Environment**

   - Add all environment variables
   - Set build command: `npm run build`

3. **Deploy**
   - Automatic deployments on git push
   - Preview deployments for PRs

### Other Platforms

The project is compatible with:

- **Netlify**: Zero-config deployment
- **Railway**: Full-stack deployment
- **AWS Amplify**: Scalable hosting
- **DigitalOcean App Platform**: Simple deployment

## 🔧 Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
npm run lint:fix    # Fix linting issues
```

## 📊 Performance

The website is optimized for performance:

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Excellent ratings
- **Bundle Size**: Optimized with code splitting
- **Image Optimization**: Next.js automatic optimization
- **Lazy Loading**: Components and 3D models

## 🔒 Security

Security measures implemented:

- **Content Sanitization**: All user content is sanitized
- **CSRF Protection**: Built-in Next.js protection
- **Environment Variables**: Sensitive data in environment
- **Password Hashing**: Bcrypt for admin authentication
- **XSS Prevention**: Secure markdown rendering

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Three.js Community** - 3D graphics library
- **Supabase** - Backend-as-a-Service platform
- **Vercel** - Deployment and hosting platform

## 📞 Contact

**Megham Garg**

- Website: [meghamgarg.com](https://meghamgarg.com)
- Email: [contact@meghamgarg.com](mailto:contact@meghamgarg.com)
- LinkedIn: [linkedin.com/in/meghamgarg](https://linkedin.com/in/meghamgarg)
- GitHub: [github.com/gargmegham](https://github.com/gargmegham)

---

<p align="center">
  <strong>Built with ❤️ and cutting-edge web technologies</strong>
</p>

<p align="center">
  <a href="https://meghamgarg.com">🌐 Live Website</a> |
  <a href="#-features">✨ Features</a> |
  <a href="#-quick-start">🚀 Quick Start</a> |
  <a href="#-deployment">🚀 Deploy</a>
</p>
