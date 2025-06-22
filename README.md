# NightForge Tree API Demo

A Next.js implementation of an interactive tree-structured data management dashboard with D3.js visualizations.

## Features

### 🌟 Core Functionality
- **Interactive Tree Visualization**: D3.js-powered hierarchical data visualization
- **Dynamic Filtering**: Filter by tree, status, type, and search terms
- **Tag Cloud**: Interactive tag cloud with click-to-filter functionality
- **Data Inspector**: Detailed view of trees, clusters, and areas
- **Statistics Dashboard**: Real-time stats that update based on active filters

### 🎨 UI/UX Features
- **Dark Theme**: Custom NightForge color scheme with CSS variables
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **Interactive Elements**: Hover effects, transitions, and animations
- **Modal Details**: Click on tree nodes to view detailed information
- **Custom Fonts**: Inter and Space Grotesk for modern typography

### 🔧 Technical Features
- **Next.js 15**: Latest Next.js with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **D3.js Integration**: Advanced data visualization
- **Modular Architecture**: Clean, extensible component structure

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and CSS variables
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/
│   └── NightForgeDemo.tsx  # Main dashboard component
└── lib/
    ├── seedData.ts         # Static demo data
    └── types.ts            # TypeScript type definitions
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Data Structure

The application uses a hierarchical data structure:

- **Trees**: Top-level containers (e.g., "Enterprise Architecture")
- **Clusters**: Logical groupings within trees (e.g., "Infrastructure")
- **Areas**: Specific functional areas within clusters (e.g., "Servers")
- **Tags**: Metadata labels for categorization

## Component Architecture

### NightForgeDemo Component
The main component uses React hooks for state management and D3.js for visualization:

- **State Management**: Uses `useState` for filters and D3 readiness
- **Effect Management**: `useEffect` for initialization and updates
- **Event Handling**: Interactive filtering and search functionality
- **Dynamic Rendering**: Real-time updates based on filter changes

### Key Functions
- `renderTreeVisualization()`: Creates D3.js tree diagram
- `renderTagCloud()`: Generates interactive tag cloud
- `renderDataInspector()`: Displays detailed data view
- `renderStats()`: Updates dashboard statistics
- `getFilteredData()`: Applies all active filters

## Styling

### CSS Variables
Custom NightForge color scheme defined in `globals.css`:
- Gray palette: `--nf-gray-900` to `--nf-gray-100`
- Primary colors: `--nf-primary-500`, `--nf-primary-300`
- Accent colors: `--nf-accent-cyan`, `--nf-accent-pink`
- Status colors: `--nf-success`, `--nf-warning`, `--nf-error`

### Component Classes
- `.nf-card`: Card component with hover effects
- `.nf-btn-primary` / `.nf-btn-secondary`: Button styles
- `.tag-badge`: Tag styling with color variants
- `.stats-grid`: Responsive grid layout

## Features in Detail

### Interactive Tree Visualization
- Node types: Trees (large circles), Clusters (medium), Areas (small)
- Color coding: Purple (trees), Cyan (clusters), Green (areas)
- Status indicators: Green/red dots for active/inactive status
- Click-to-expand: Modal details for each node

### Advanced Filtering
- **Tree Filter**: Show data for specific trees
- **Status Filter**: Active/inactive toggle
- **Type Filter**: Focus on clusters or areas
- **Search**: Full-text search across names and tags
- **Reset**: Clear all filters

### Tag Cloud
- Frequency-based sizing and sorting
- Color-coded by type (cluster/area/tag)
- Click-to-filter functionality
- Real-time updates with filtering

### Statistics Dashboard
- Live counters that update with filters
- Visual indicators with custom colors
- Responsive grid layout

## Browser Compatibility

- Modern browsers with ES6+ support
- D3.js v7 compatibility
- CSS Grid and Flexbox support required

## Customization

### Adding New Data
Update `src/lib/seedData.ts` with your tree structure following the existing format.

### Styling Changes
Modify CSS variables in `src/app/globals.css` to match your brand colors.

### Extending Functionality
The modular architecture makes it easy to add new features:
- Add new filter types in the `Filters` interface
- Extend the data model in `types.ts`
- Add new visualization types in the main component

## Performance Considerations

- D3.js lazy loading with Next.js Script component
- Efficient filtering with memoized data transformations
- Optimized re-renders using React hooks dependency arrays
- CSS transitions for smooth interactions

## Deployment

Build and deploy using standard Next.js commands:

```bash
npm run build
npm start
```

The application is optimized for production with:
- Static asset optimization
- Font optimization with Google Fonts
- CSS minification
- JavaScript bundling

---

Built with ❤️ using Next.js, D3.js, and Tailwind CSS
