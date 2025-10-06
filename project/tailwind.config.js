/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-purple': '#7B61FF',
                'background-light': '#F8F9FA',
                'text-dark': '#212529',
                'text-muted': '#6C757D',
                'border-light': '#E5E7EB',
            },
            boxShadow: {
                'custom': '0 4px 12px rgba(0, 0, 0, 0.05)',
            }
        },
    },
    plugins: [],
}
