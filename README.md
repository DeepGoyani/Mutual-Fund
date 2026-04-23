# Getway Mutual Fund Platform

A comprehensive mutual fund investment platform built with Next.js 15, featuring real-time NAV tracking, intelligent fund comparison, SIP/Lumpsum calculators, and advanced investment tools.

## 🚀 Features

### Core Functionality
- **Real-Time NAV Tracking**: Live mutual fund data from MFAPI
- **Fund Comparison**: Compare up to 3 funds side-by-side
- **Investment Calculators**: SIP and Lumpsum return calculators with historical data
- **Advanced Search**: Find mutual funds by name, scheme code, or AMC
- **Interactive Charts**: Visual representations of fund performance

### Technical Features
- **Dual Router Architecture**: Demonstrates both App Router and Pages Router
- **Multiple Rendering Strategies**: SSG, SSR, ISR, and CSR implementations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Material UI Integration**: Professional UI components with Material-UI
- **Dark/Light Theme**: Theme toggle with system preference detection

## 🛠 Tech Stack

- **Framework**: Next.js 15.5.4 with React 19.1.0
- **Styling**: Tailwind CSS 4 + Material-UI 7.3.4
- **Data Fetching**: SWR for client-side caching, Axios for API calls
- **State Management**: Zustand for global state
- **Charts**: Material-UI X-Charts for data visualization
- **Animations**: Framer Motion for smooth transitions
- **Notifications**: React Hot Toast for user feedback

## 📱 Pages & Routes

### App Router Routes
- `/` - Home page with hero section and feature highlights
- `/learn` - Educational content about mutual funds (SSG)
- `/learn/funds` - Curated fund listings (ISR - daily)
- `/learn/fund/[code]` - Detailed fund view (SSR)
- `/learn/tools` - Investment tools and calculators (CSR)
- `/funds` - Browse all mutual funds
- `/scheme/[code]` - Individual scheme details

### Pages Router Routes
- `/market` - Market overview with fund snapshots (ISR - hourly)
- `/market/fund/[code]` - Detailed market fund analysis (SSR)
- `/market/compare` - Fund comparison tool (CSR)
- `/market/about` - About the platform (SSG)

### API Routes
- `/api/funds` - Fund listings and search
- `/api/mf` - Mutual fund data from MFAPI
- `/api/scheme/[code]/sip` - SIP calculator endpoint
- `/api/scheme/[code]/lumpsum` - Lumpsum calculator endpoint
- `/api/market/*` - Market-related data endpoints

## 🎨 UI Components

### Investment Tools
- **SipCalculator**: Calculate Systematic Investment Plan returns
- **LumpsumCalculator**: Calculate one-time investment returns
- **FundCard**: Display fund information with hover effects
- **CompareTable**: Side-by-side fund comparison
- **ReturnsTable**: Historical returns visualization

### Navigation & Layout
- **NavBar**: Responsive navigation with theme toggle
- **Footer**: Application footer with links
- **HeroIllustration**: Animated hero section graphics
- **NavChart**: Mini chart in navigation

### Utility Components
- **SearchBar**: Fund search with autocomplete
- **EmptyState**: Consistent empty state design
- **ThemeToggle**: Dark/light mode switcher
- **LanguageSwitcher**: Multi-language support

## 📊 Data Source

**API Endpoint**: [MFAPI](https://api.mfapi.in/)
- `GET https://api.mfapi.in/mf` - List all mutual funds
- `GET https://api.mfapi.in/mf/<schemeCode>` - Get specific fund details

**Data Features**:
- Latest NAV with date sorting
- Trailing returns (1m, 3m, 6m, 1y, 3y, 5y)
- Historical NAV data for calculations
- Fund metadata and scheme information

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mutual-fund
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env.local` at project root:
   ```env
   NEXT_PUBLIC_CURATED_CODES=100027,100065,100171,100188,100120,100083,102885,118825,120503,125497
   NEXT_PUBLIC_MARKET_CODES=100027,100065,100171,100188,100120
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Application**
   Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
npm start
```

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── funds/             # Fund browsing pages
│   ├── learn/             # Educational content
│   ├── scheme/            # Individual scheme pages
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── components/            # Reusable React components
│   ├── SipCalculator.jsx
│   ├── LumpsumCalculator.jsx
│   ├── FundCard.jsx
│   ├── NavBar.jsx
│   └── ... (20+ components)
├── pages/                 # Next.js Pages Router
│   ├── market/           # Market-related pages
│   └── _app.js           # Pages Router app component
├── lib/                  # Utility libraries
└── utils/                # Helper functions
```

## 🎯 Rendering Strategies

### Static Site Generation (SSG)
- `/learn` - Educational overview
- `/market/about` - Static documentation
- **Use Case**: Content that doesn't change frequently

### Incremental Static Regeneration (ISR)
- `/learn/funds` - Daily fund listings (24h revalidation)
- `/market` - Hourly market snapshots (1h revalidation)
- **Use Case**: Data that changes periodically

### Server-Side Rendering (SSR)
- `/learn/fund/[code]` - Fresh NAV data on request
- `/market/fund/[code]` - Real-time fund analysis
- **Use Case**: Data that must be always current

### Client-Side Rendering (CSR)
- `/learn/tools` - Interactive calculators
- `/market/compare` - Dynamic fund comparison
- **Use Case**: User-driven interactions

## 🔧 Configuration

### Tailwind CSS
- Configured in `tailwind.config.js`
- Custom brand colors and design system
- Responsive utilities

### Material-UI
- Theme customization in `MuiProviders.jsx`
- Consistent design language
- Accessible components

### Next.js
- Turbopack enabled for faster builds
- Image optimization
- API routes for backend functionality

## 📈 Performance Features

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Caching**: SWR for intelligent data caching
- **Bundle Analysis**: Optimized dependencies
- **SEO**: Meta tags and structured data

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request