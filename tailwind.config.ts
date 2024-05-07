import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './app.vue',
        './error.vue',
    ],

    theme: {
        fontFamily: {
            sans: ['"Roboto"', 'sans-serif'],
        },

        extend: {
            colors: {
                primary: {
                    50: '#f1f2ff',
                    100: '#e5e5ff',
                    200: '#ceceff',
                    300: '#aaa7ff',
                    400: '#7f75ff',
                    500: '#573dff',
                    600: '#4316ff',
                    700: '#3204fd',
                    800: '#2903d3',
                    900: '#2405ad',
                    950: '#110076',
                },
            },
        },
    },

    darkMode: 'class',
};
