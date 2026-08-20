import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
          700: '#047857'
        }
      },
      screens: {
        xs: '375px'
      }
    }
  }
}
