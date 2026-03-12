/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#225C9C',
          light: '#2D6FB5',
          dark: '#1A4A7D',
        },
        green: {
          DEFAULT: '#249E6C',
          light: '#2DB87E',
          dark: '#1D7F57',
        },
        gold: {
          DEFAULT: '#F4B400',
          light: '#FFD54F',
          dark: '#C89200',
        },
        red: {
          DEFAULT: '#D93025',
          light: '#EF5350',
          dark: '#B71C1C',
        },
        background: '#F8F6F0',
        card: {
          DEFAULT: '#FEFDFB',
          hover: '#FDFCF8',
        },
        text: {
          primary: '#1E293B',
          secondary: '#64748B',
          muted: '#94A3B8',
          inverse: '#FFFFFF',
        },
        attending: '#249E6C',
        maybe: '#F4B400',
        absent: '#D93025',
        'no-response': '#94A3B8',
      },
      fontFamily: {
        display: ['Grandstander', 'cursive'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(120, 80, 40, 0.06)',
        md: '0 4px 6px rgba(120, 80, 40, 0.08)',
        lg: '0 10px 15px rgba(120, 80, 40, 0.1)',
        card: '0 2px 8px rgba(120, 80, 40, 0.06)',
        'card-hover': '0 8px 24px rgba(120, 80, 40, 0.12)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
}
