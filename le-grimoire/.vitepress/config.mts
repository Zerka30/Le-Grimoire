import { defineConfig } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid";
import { generateSidebar, VitePressSidebarOptions } from 'vitepress-sidebar';

const base = process.env.BASE_PATH || '/'

function sidebarFromPath(path: string): VitePressSidebarOptions {
    return {
        documentRootPath: './le-grimoire/site',
        scanStartPath: path,
        basePath: `/${path}/`,
        resolvePath: `/${path}/`,
        useTitleFromFileHeading: true,
        useFolderTitleFromIndexFile: true,
        collapsed: false,
        collapseDepth: 2
    }
}

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
        sidebar: generateSidebar([
            sidebarFromPath('docs')
        ]),
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