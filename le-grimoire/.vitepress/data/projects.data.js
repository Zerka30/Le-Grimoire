import { defineLoader } from 'vitepress'
import fs from 'fs'
import path from 'path'

export default defineLoader({
    watch: ['../../site/projects/*/index.md'],
    async load(watchedFiles) {
        const matter = await import('gray-matter')

        // Si aucun fichier n'est trouvé, essayons de lister manuellement les fichiers
        if (watchedFiles.length === 0) {
            try {
                // Chemin absolu vers le dossier des projets
                const projectsDir = path.resolve(__dirname, '../../site/projects')

                // Vérifier si le dossier existe
                if (fs.existsSync(projectsDir)) {
                    // Lister tous les dossiers de projets
                    const projectFolders = fs.readdirSync(projectsDir, { withFileTypes: true })
                        .filter(dirent => dirent.isDirectory() && dirent.name !== 'items')
                        .map(dirent => dirent.name)

                    // Récupérer les fichiers index.md de chaque dossier de projet
                    const files = projectFolders
                        .map(folder => path.join(projectsDir, folder, 'index.md'))
                        .filter(file => fs.existsSync(file))

                    // Utiliser ces fichiers au lieu de watchedFiles
                    watchedFiles = files
                }
            } catch (error) {
                console.error('Erreur lors de la recherche des projets:', error)
            }
        }

        if (watchedFiles.length === 0) {
            return []
        }

        // Traiter tous les fichiers pour extraire les métadonnées
        const allProjects = watchedFiles.map(file => {
            const content = fs.readFileSync(file, 'utf-8')
            const { data: frontmatter, excerpt } = matter.default(content, { excerpt: true })

            // Extraire le nom du dossier du projet pour l'URL
            const projectFolder = path.basename(path.dirname(file))
            const url = `/projects/${projectFolder}/`

            return {
                title: frontmatter.title || projectFolder,
                description: frontmatter.description || excerpt || '',
                thumbnail: frontmatter.thumbnail || '',
                technologies: frontmatter.technologies || [],
                featured: frontmatter.featured || false,
                status: frontmatter.status || 'inactive',
                isPublic: frontmatter.isPublic !== undefined ? frontmatter.isPublic : true,
                createdAt: frontmatter.createdAt || '',
                updatedAt: frontmatter.updatedAt || '',
                url: url,
                repoUrl: frontmatter.repoUrl || '',
                demoUrl: frontmatter.demoUrl || '',
                docsUrl: frontmatter.docsUrl || ''
            }
        }).filter(project => project.isPublic)

        return allProjects
    }
})