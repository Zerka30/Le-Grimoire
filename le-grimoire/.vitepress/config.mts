import { defineConfig } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid";
// Importez generateSidebar mais ne l'utilisez pas tout de suite
// import { generateSidebar } from 'vitepress-sidebar';

const base = process.env.BASE_PATH || '/'

export default withMermaid(defineConfig({
    base: base,
    srcDir: './site',
    title: "Grimoire d'un Ops",
    description: "Pratiques, astuces, rituels et incantations.",
    themeConfig: {
        nav: [
            { text: 'Accueil', link: '/' },
            { text: 'Blog', link: '/blog/' },
            { text: 'Projets', link: '/projects/' },
            { text: 'Documentation', link: '/docs/' },
        ],
        sidebar: {
            // Utilisez une sidebar simple pour docs en attendant
            '/docs/': [
                {
                    text: 'Documentation',
                    items: []
                }
            ]
        },
        search: {
            provider: 'local',
        },

        footer: {
            message: 'Made with ❤️ by Raphaël',
            copyright: 'Copyright © 2025',
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/zerka30' },
            { icon: 'linkedin', link: 'https://www.linkedin.com/in/raphaelhien/' },
        ],
    },
    mermaid: {
        look: 'handDrawn',
        theme: 'neutral',
    },
    vite: {
        publicDir: '../public',
    }
}))