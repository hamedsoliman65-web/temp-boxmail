# Design Guidelines for Temp Box Mail Blog Platform

## Design Approach
**Reference-Based Design**: Inspired by Medium and TechCrunch's clean article layouts and professional tech content presentation, adapted to match Temp Box Mail's existing visual identity. Focus on readability, content hierarchy, and seamless integration with the main site's aesthetic.

## Typography System

**Font Families**:
- Primary: 'Roboto', sans-serif (via Google Fonts CDN)
- Secondary: 'Open Sans', sans-serif (via Google Fonts CDN)

**Hierarchy**:
- Article Titles (H1): 36px/42px, Roboto Bold, tight leading
- Section Headers (H2): 28px/34px, Roboto Medium
- Subsections (H3): 22px/28px, Roboto Medium
- Body Text: 18px/28px, Open Sans Regular (generous line-height for readability)
- Meta Info (dates, categories): 14px/20px, Open Sans Regular, #757575
- Captions: 15px/22px, Open Sans Italic

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, and 24 (p-4, m-6, gap-8, py-12, px-16, mb-24)

**Container Widths**:
- Article content: max-w-3xl (optimal reading width ~700px)
- Homepage grid: max-w-7xl
- Admin panel: max-w-6xl

**Grid Layouts**:
- Homepage article cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
- Category filters: Horizontal scroll on mobile, full row on desktop
- Comment section: Single column, max-w-3xl

## Component Library

### Navigation
- Sticky header with Temp Box Mail logo linking to main site
- Blog title/subtitle section
- Category pills (AI, Cybersecurity, Technology) with active state in Primary blue
- Search bar: rounded-lg, border gray-300, focus:border-primary

### Article Cards (Homepage)
- Featured image: aspect-ratio 16:9, object-cover, rounded-t-lg
- White background card with subtle shadow (shadow-md hover:shadow-xl transition)
- Padding: p-6
- Category badge: top-left or above title, bg-primary/10, text-primary, rounded-full px-4 py-1
- Title: 3-line clamp, Roboto Medium 20px
- Excerpt: 2-line clamp, Open Sans 16px, text-gray-600
- Meta row: flex justify-between, date + read time
- Hover: Slight lift effect (transform scale-105)

### Article Page Layout
- Hero image: Full-width, max-height 400px, object-cover
- Breadcrumb: Home > Category > Article title
- Article header: Centered, max-w-3xl, includes title, meta info (author, date, read time), category tags
- Article body: max-w-3xl, mx-auto, generous vertical spacing (space-y-6)
- Inline images: Full width within content container, rounded-lg, my-8, with optional captions
- External links: text-primary, underline, hover:text-secondary
- Share buttons: Sticky sidebar on desktop, fixed bottom bar on mobile

### Admin Panel
- Login card: Centered, max-w-md, shadow-lg, p-8
- Dashboard: Sidebar navigation (Articles, Add New, Settings), main content area
- Article editor: Split view - left: rich text editor, right: preview
- Rich text toolbar: Icons for bold, italic, headings, links, image upload, lists
- Form inputs: rounded-lg, border-gray-300, focus:ring-2 focus:ring-primary

### Comment System
- Comment card: border-l-4 border-primary, pl-4, py-3, bg-gray-50
- Comment form: rounded-lg border, p-6, includes name/email fields + textarea
- Submit button: Primary blue, px-6 py-3, rounded-lg

### Social Share Buttons
- Horizontal row: Facebook (blue), Twitter (light blue), LinkedIn (dark blue), Email (gray)
- Icon + label format, rounded-lg, px-4 py-2, hover:opacity-80

## Bilingual Support
- Language toggle: Top-right header, flag icons or AR/EN text
- RTL layout support for Arabic: Use dir="rtl" attribute, flip padding/margins accordingly
- Font loading: Include Arabic-optimized variant of Open Sans

## Images

**Hero Images**: 
- Homepage: Full-width hero banner (1400x400px) showcasing AI/cybersecurity theme with blurred gradient overlay
- Article pages: Featured image header (1200x500px) relevant to article topic
- Buttons on hero: Use backdrop-blur-md with bg-white/20 or bg-primary/80

**Content Images**:
- Article cards: 16:9 thumbnail (600x338px)
- Inline article images: Variable size, max-width 100%, maintain aspect ratio
- Image sources: Use placeholder tech/AI/cybersecurity images from Unsplash or similar

**Icon Library**: Heroicons (via CDN) for UI elements - use outline style for navigation, solid for buttons/actions

## Accessibility
- Maintain WCAG AA contrast ratios (text #212121 on white background passes)
- Form labels always visible and associated with inputs
- Focus states: 2px ring in primary color on all interactive elements
- Alt text required for all images
- Keyboard navigation support for admin panel and comment forms