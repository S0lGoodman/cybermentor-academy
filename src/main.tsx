import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './components/ThemeProvider'

// Get initial theme from localStorage or default to dark
const initialTheme = localStorage.getItem("vite-ui-theme") || "dark";

// Add initial theme class to prevent flash
document.documentElement.classList.add(initialTheme);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme={initialTheme as "light" | "dark"}>
    <App />
  </ThemeProvider>
);
