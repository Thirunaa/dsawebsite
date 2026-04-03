# DSA Academy

A React-based DSA interview preparation platform with a blue-themed, shadcn-inspired UI.  
It includes:
- A premium-style landing page built from the `reference` UI direction.
- A searchable/filterable lesson library.
- Dedicated lesson detail pages with YouTube thumbnail previews and resource links.

Live site: [https://thirunaa.github.io/dsawebsite/](https://thirunaa.github.io/dsawebsite/)

## Tech Stack
- React 18 (Create React App)
- React Router v6
- Tailwind CSS + shadcn-style component primitives
- Lucide icons

## Run Locally
```bash
npm install
npm start
```

## Build
```bash
npm run build
```

## Project Structure
```text
src/
  components/
    landing/           # Home page sections (Navbar, Hero, Topics, CTA, Footer)
    library/           # Library search/filter/list UI
    ui/                # Reusable shadcn-style primitives (button, card, input, separator)
  pages/
    HomePage.js
    ProblemPage.js
  lib/
    utils.js           # className merge helper
  utils/
    content.js         # resource URL helpers + YouTube thumbnail fallbacks
  data.json
  filterData.json
```

## Thumbnail Quality Note
YouTube does not guarantee true 4K thumbnails for every video.  
The app now requests the highest available options first (`maxresdefault` / `hq720`) and gracefully falls back when needed.
