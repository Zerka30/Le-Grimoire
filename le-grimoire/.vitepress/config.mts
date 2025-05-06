import { defineConfig, createContentLoader, type SiteConfig } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid";
import { generateSidebar, VitePressSidebarOptions } from 'vitepress-sidebar';
import path from 'path';
import { Feed } from 'feed';
import fs from 'fs';

const BASE_URL = 'https://grimoire.zerka.dev';
const base = process.env.BASE_PATH || '/';

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
    },
    buildEnd: async (config: SiteConfig) => {
        const feed = new Feed({
            title: "Grimoire d'un Ops",
            description: "Pratiques, astuces, rituels et incantations.",
            id: BASE_URL,
            link: BASE_URL,
            language: 'fr',
            image: `${BASE_URL}/avatar.png`,
            favicon: `${BASE_URL}/favicon.ico`,
            copyright: `Copyright © ${new Date().getFullYear()} Raphaël Hien`,
            feedLinks: {
                rss: `${BASE_URL}/rss.xml`,
            },
            author: {
                name: "Raphaël Hien",
                email: "contact@raphaelhien.fr",
                link: BASE_URL
            }
        });

        const posts = await createContentLoader('blog/posts/*.md', {
            excerpt: true,
            render: true,
        }).load();

        posts.sort(
            (a, b) =>
                +new Date(b.frontmatter.date as string) -
                +new Date(a.frontmatter.date as string)
        )

        for (const post of posts) {
            if (post.frontmatter.isPublished !== false) {
                const url = `${BASE_URL}/blog/posts/${post.url.split('/').pop()}`;

                feed.addItem({
                    title: post.frontmatter.title,
                    id: url,
                    link: url,
                    description: post.frontmatter.description,
                    content: post.html,
                    author: [
                        {
                            name: post.frontmatter.author || "Raphaël Hien",
                            email: "contact@raphaelhien.fr",
                            link: BASE_URL
                        }
                    ],
                    date: new Date(post.frontmatter.date),
                    image: post.frontmatter.thumbnail ?
                        `${BASE_URL}${post.frontmatter.thumbnail.startsWith('/') ? '' : '/'}${post.frontmatter.thumbnail}` :
                        undefined
                });
            }
        }

        fs.writeFileSync(path.join(config.outDir, 'rss.xml'), feed.rss2());
    }
}));