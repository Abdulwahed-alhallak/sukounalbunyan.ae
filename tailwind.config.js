/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
      "./resources/views/**/*.blade.php",
      "./resources/js/**/*.tsx",
      "./packages/noble/*/src/Resources/js/**/*.tsx",
  ],
  prefix: "",
  theme: {
  	container: {
  		center: 'true',
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		fontFamily: {
  			sans: ['Geist Sans', 'IBM Plex Sans Arabic', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  			mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			'border-hover': 'hsl(var(--border-hover))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			'background-2': 'hsl(var(--background-2))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))'
  			},
  			warning: {
  				DEFAULT: 'hsl(var(--warning))',
  				foreground: 'hsl(var(--warning-foreground))'
  			},
  			info: {
  				DEFAULT: 'hsl(var(--info))',
  				foreground: 'hsl(var(--info-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			/* ═══ Geist Color Scales ═══ */
  			'geist-gray': {
  				'1': 'hsl(var(--gray-1))',
  				'2': 'hsl(var(--gray-2))',
  				'3': 'hsl(var(--gray-3))',
  				'4': 'hsl(var(--gray-4))',
  				'5': 'hsl(var(--gray-5))',
  				'6': 'hsl(var(--gray-6))',
  				'7': 'hsl(var(--gray-7))',
  				'8': 'hsl(var(--gray-8))',
  				'9': 'hsl(var(--gray-9))',
  				'10': 'hsl(var(--gray-10))'
  			},
  			'geist-blue': {
  				'1': 'hsl(var(--blue-1))',
  				'2': 'hsl(var(--blue-2))',
  				'3': 'hsl(var(--blue-3))',
  				'4': 'hsl(var(--blue-4))',
  				'5': 'hsl(var(--blue-5))',
  				'6': 'hsl(var(--blue-6))',
  				'7': 'hsl(var(--blue-7))',
  				'8': 'hsl(var(--blue-8))',
  				'9': 'hsl(var(--blue-9))',
  				'10': 'hsl(var(--blue-10))'
  			},
  			'geist-red': {
  				'1': 'hsl(var(--red-1))',
  				'2': 'hsl(var(--red-2))',
  				'3': 'hsl(var(--red-3))',
  				'4': 'hsl(var(--red-4))',
  				'5': 'hsl(var(--red-5))',
  				'6': 'hsl(var(--red-6))',
  				'7': 'hsl(var(--red-7))',
  				'8': 'hsl(var(--red-8))',
  				'9': 'hsl(var(--red-9))',
  				'10': 'hsl(var(--red-10))'
  			},
  			'geist-amber': {
  				'1': 'hsl(var(--amber-1))',
  				'2': 'hsl(var(--amber-2))',
  				'3': 'hsl(var(--amber-3))',
  				'4': 'hsl(var(--amber-4))',
  				'5': 'hsl(var(--amber-5))',
  				'6': 'hsl(var(--amber-6))',
  				'7': 'hsl(var(--amber-7))',
  				'8': 'hsl(var(--amber-8))',
  				'9': 'hsl(var(--amber-9))',
  				'10': 'hsl(var(--amber-10))'
  			},
  			'geist-green': {
  				'1': 'hsl(var(--green-1))',
  				'2': 'hsl(var(--green-2))',
  				'3': 'hsl(var(--green-3))',
  				'4': 'hsl(var(--green-4))',
  				'5': 'hsl(var(--green-5))',
  				'6': 'hsl(var(--green-6))',
  				'7': 'hsl(var(--green-7))',
  				'8': 'hsl(var(--green-8))',
  				'9': 'hsl(var(--green-9))',
  				'10': 'hsl(var(--green-10))'
  			},
  			'geist-teal': {
  				'1': 'hsl(var(--teal-1))',
  				'7': 'hsl(var(--teal-7))',
  				'10': 'hsl(var(--teal-10))'
  			},
  			'geist-purple': {
  				'1': 'hsl(var(--purple-1))',
  				'6': 'hsl(var(--purple-6))',
  				'7': 'hsl(var(--purple-7))',
  				'10': 'hsl(var(--purple-10))'
  			},
  			'geist-pink': {
  				'1': 'hsl(var(--pink-1))',
  				'7': 'hsl(var(--pink-7))',
  				'10': 'hsl(var(--pink-10))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			},
  			'fade-in': {
  				from: { opacity: '0' },
  				to: { opacity: '1' }
  			},
  			'fade-out': {
  				from: { opacity: '1' },
  				to: { opacity: '0' }
  			},
  			'slide-up': {
  				from: { opacity: '0', transform: 'translateY(6px)' },
  				to: { opacity: '1', transform: 'translateY(0)' }
  			},
  			'slide-down': {
  				from: { opacity: '0', transform: 'translateY(-6px)' },
  				to: { opacity: '1', transform: 'translateY(0)' }
  			},
  			'scale-in': {
  				from: { opacity: '0', transform: 'scale(0.97)' },
  				to: { opacity: '1', transform: 'scale(1)' }
  			},
  			'scale-out': {
  				from: { opacity: '1', transform: 'scale(1)' },
  				to: { opacity: '0', transform: 'scale(0.97)' }
  			},
  			'slide-in-right': {
  				from: { opacity: '0', transform: 'translateX(8px)' },
  				to: { opacity: '1', transform: 'translateX(0)' }
  			},
  			'slide-in-left': {
  				from: { opacity: '0', transform: 'translateX(-8px)' },
  				to: { opacity: '1', transform: 'translateX(0)' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in': 'fade-in 0.3s ease-out',
  			'fade-out': 'fade-out 0.3s ease-out',
  			'slide-up': 'slide-up 0.3s ease-out',
  			'slide-down': 'slide-down 0.3s ease-out',
  			'scale-in': 'scale-in 0.2s ease-out',
  			'scale-out': 'scale-out 0.2s ease-out',
  			'slide-in-right': 'slide-in-right 0.3s ease-out',
  			'slide-in-left': 'slide-in-left 0.3s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
