import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // CRUCIAL : Permet de charger les fichiers depuis le système de fichiers local d'Anki
  base: './', 
  build: {
    // On compile DIRECTEMENT dans le dossier source Python (aqt)
    outDir: '../aqt/palace_dist',
    emptyOutDir: true,
    assetsDir: 'assets',
  }
})