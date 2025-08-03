# Next.js TypeScript Template

A modern Next.js template with TypeScript, Tailwind CSS, shadcn/ui, and essential development tools pre-configured.

## 🚀 Features

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **shadcn/ui** components
- **ESLint & Prettier** for code quality
- **Custom color scheme system** easily configurable
- **React Icons** for icons
- **Geist fonts** (Sans & Mono)

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles & color system
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   └── ui/                  # shadcn/ui components
├── lib/
│   └── utils.ts             # Utility functions
└── types/                   # TypeScript definitions
```

## 🎨 Color System

This template includes a flexible color system in `globals.css` using CSS custom properties. Easily customize your brand colors by modifying the CSS variables in the `:root` selector.

## 🛠️ Getting Started

1. **Use this template** by clicking "Use this template" button
2. **Clone your new repository**
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start development server:**
   ```bash
   npm run dev
   ```
5. **Customize colors** in `src/app/globals.css`

## 📦 What's Included

### Dependencies
- `next` - React framework
- `react` & `react-dom` - React library
- `typescript` - Type checking
- `tailwindcss` - Utility-first CSS
- `react-icons` - Icon library
- Various shadcn/ui components

### Dev Dependencies
- `eslint` & `prettier` - Code quality
- `@types/*` - TypeScript definitions

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format with Prettier

## 🔧 Customization

### Colors
Modify the CSS variables in `src/app/globals.css` to change the color scheme.

### Components
Add new shadcn/ui components:
```bash
npx shadcn@latest add button card input
```

### Fonts
The template uses Geist fonts. Change in `src/app/layout.tsx` if needed.

## 📄 License

MIT License - feel free to use this template for any project!