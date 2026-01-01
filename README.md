# Lenbow Dashboard

A modern, feature-rich loan application dashboard built with Next.js 16, React 19, and TypeScript.
This application provides a comprehensive interface for managing loan applications with
authentication, internationalization, and a beautiful UI powered by shadcn/ui.

## ✨ Features

- 🔐 **Authentication System** - Secure authentication flow with protected routes
- 🌍 **Internationalization** - Multi-language support (English & Bengali)
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- 🌓 **Dark Mode** - Theme toggle with next-themes
- 📊 **Data Tables** - Advanced tables with sorting, filtering, and pagination using TanStack Table
- 📈 **Charts & Visualizations** - Data visualization with Recharts
- 🔄 **State Management** - Redux Toolkit with RTK Query for API calls
- 📱 **Responsive Design** - Desktop and mobile-friendly layouts
- 🚀 **React Server Components** - Leveraging Next.js 16 App Router
- ✅ **Form Validation** - Type-safe form handling with React Hook Form and Zod
- 🎯 **Type Safety** - Full TypeScript support
- 🎭 **Animations** - Smooth animations with Framer Motion

## 🛠️ Tech Stack

### Core

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **React:** 19.2.3
- **TypeScript:** 5.x
- **Package Manager:** pnpm

### UI & Styling

- **Component Library:** [shadcn/ui](https://ui.shadcn.com/) (Radix Nova style)
- **CSS Framework:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons:** Lucide React & React Icons
- **Animations:** Framer Motion (motion)
- **Theme:** next-themes

### State & Data Management

- **State Management:** Redux Toolkit
- **Data Fetching:** RTK Query
- **Form Management:** React Hook Form
- **Validation:** Zod
- **Tables:** TanStack React Table

### Internationalization

- **i18n:** next-intl

### Additional Libraries

- **Date Handling:** date-fns
- **Charts:** Recharts
- **Notifications:** Sonner
- **Utilities:** clsx, tailwind-merge

## 📋 Prerequisites

- Node.js 20.x or higher
- pnpm 8.x or higher

## 🚀 Getting Started

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd dashbaord
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_API_URL=your_api_url_here
NEXT_PUBLIC_FRONTEND_URL=your_frontend_url_here
```

4. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📜 Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the production application
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   └── [locale]/          # Internationalized routes
│   │       ├── (authentication)/  # Auth pages
│   │       └── (private)/     # Protected pages
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── custom-ui/        # Custom extended components
│   │   ├── helpers/          # Helper components
│   │   └── table/            # Data table components
│   ├── core/                 # Core utilities & constants
│   ├── hooks/                # Custom React hooks
│   ├── i18n/                 # Internationalization config
│   ├── layout/               # Layout components
│   ├── lib/                  # Utility libraries
│   ├── providers/            # React context providers
│   ├── redux/                # Redux store & slices
│   ├── routes/               # Route definitions
│   ├── templates/            # Page templates
│   └── validators/           # Zod validation schemas
├── messages/                 # i18n translation files
├── public/                   # Static assets
└── @types/                   # TypeScript type definitions
```

## 🔑 Key Features Explained

### Authentication

The application includes a complete authentication system with:

- Protected routes using middleware
- Authentication state management with Redux
- Automatic redirect handling

### Internationalization

- Supports multiple languages (English, Bengali)
- Uses next-intl for seamless i18n
- Locale-based routing

### UI Components

Built with shadcn/ui components including:

- Buttons, Inputs, Forms
- Data Tables with advanced features
- Dialogs, Sheets, Drawers
- Sidebar navigation
- Charts and visualizations
- And many more...

### Data Management

- Redux Toolkit for global state
- RTK Query for API calls with caching
- Type-safe API slices

## 🎨 Customization

### Adding New Components

Use the shadcn CLI to add new components:

```bash
pnpm dlx shadcn@latest add [component-name]
```

### Theme Configuration

Theme settings can be modified in:

- [tailwind.config.js](tailwind.config.js) - Tailwind configuration
- [components.json](components.json) - shadcn/ui configuration
- [src/app/[locale]/globals.css](src/app/[locale]/globals.css) - Global styles

## 🌐 Environment Variables

| Variable                   | Description              | Required |
| -------------------------- | ------------------------ | -------- |
| `NEXT_PUBLIC_API_URL`      | Backend API URL          | Yes      |
| `NEXT_PUBLIC_FRONTEND_URL` | Frontend application URL | Yes      |

## 📦 Building for Production

```bash
pnpm build
pnpm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**

```bash
# Kill the process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

**Module not found errors:**

```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📞 Support

For support, please contact the development team or open an issue in the repository.
