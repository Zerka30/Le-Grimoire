import { defineLoader } from 'vitepress'

export default defineLoader({
    watch: ['site/blog/posts/*.md'],
    async load(watchedFiles) {
        const path = await import('path')
        const matter = await import('gray-matter')
        const fs = await import('fs')

        return watchedFiles.map(file => {
            const content = fs.readFileSync(file, 'utf-8')
            const { data: frontmatter, excerpt } = matter.default(content, { excerpt: true })

            // Extraire le slug du chemin du fichier
            const slug = file.replace(/^.*\/posts\//, '/blog/posts/').replace(/\.md$/, '')

            return {
                url: slug,
                frontmatter,
                excerpt
            }
        }).sort((a, b) => {
            return new Date(b.frontmatter.date || 0) - new Date(a.frontmatter.date || 0)
        })
    }
})