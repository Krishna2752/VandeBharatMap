# Vande Bharat Express Network

An interactive React + Vite dashboard that maps major Vande Bharat routes across India using Leaflet and react-leaflet. The app lets you browse route lines, inspect station stops, and filter the map by route from the dropdown, map clicks, or route cards.

## Features

- Interactive India-wide route map
- Color-coded Vande Bharat lines for each service
- Route filter by dropdown selection
- Click route lines or route cards to isolate a specific service
- Click outside a line to reset back to all routes
- Station markers with route and coordinate details
- Sidebar listing active route details and stop sequence
- Station names displayed alongside codes for better readability

## Tech Stack

- React 19
- Vite
- Leaflet
- react-leaflet
- lucide-react
- Tailwind CSS

## Project Structure

- src/App.jsx — app logic, route definitions, filtering, and map rendering
- src/stations.json — station lookup used to map route codes to coordinates
- src/index.css — base styles and app styling
- public/ — static assets
- vite.config.js — Vite config with React and Tailwind plugin setup

## Getting Started

From the project folder:

```bash
cd vande-bharat
npm install
npm run dev -- --host 0.0.0.0
```

Then open the local Vite URL shown in the terminal, usually:

```text
http://localhost:5173/
```

## Production Build

```bash
npm run build
```

The production bundle is generated in the dist folder.

## Notes

- Run commands from the app folder, not the parent workspace folder, to avoid missing-script errors.
- Route data is resolved against the station lookup file, so station codes must exist in src/stations.json for the route to render correctly.
- The app is designed for route exploration and map-based discovery of Vande Bharat services across the country.
