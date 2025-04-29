<template>
  <div class="blog-container">
    <div v-if="posts.length > 0" class="blog-list">
      <div v-for="post in posts" :key="post.url" class="blog-item">
        <div class="blog-item-thumbnail">
          <a :href="withBase(post.url)">
            <img :src="withBase(post.thumbnail || getDefaultThumbnail(post))" :alt="post.title" />
          </a>
        </div>
        <div class="blog-item-content">
          <h2 class="blog-item-title">
            <a :href="withBase(post.url)">{{ post.title }}</a>
          </h2>
          <div class="blog-item-meta">
            <span class="blog-item-date" v-if="post.date">{{ formatDate(post.date) }}</span>
            <span class="blog-item-author" v-if="post.author">
              <span class="blog-item-author-separator">•</span>
              <span class="blog-item-author-name">{{ post.author }}</span>
            </span>
          </div>
          <p class="blog-item-description">{{ post.description }}</p>
          <div class="blog-item-footer">
            <div class="blog-item-tags" v-if="post.tags && post.tags.length > 0">
              <span 
                v-for="tag in post.tags" 
                :key="tag" 
                class="blog-item-tag"
                :style="{ backgroundColor: getTagColor(tag) }"
              >
                {{ tag }}
              </span>
            </div>
            <a :href="withBase(post.url)" class="blog-item-read-more">Lire l'article →</a>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-posts">
      <p>Aucun article n'a été trouvé.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { withBase } from 'vitepress'

const posts = ref([])

function getRandomColor(seed) {
  const colors = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#d35400', '#c0392b', '#16a085', '#8e44ad'
  ]
  const index = Math.abs(seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length
  return colors[index]
}

function getTagColor(tag) {
  const tagColors = {
    'introduction': '#3498db',
    'blog': '#2ecc71',
    'tutoriel': '#e74c3c',
    'astuces': '#f39c12',
    'devops': '#9b59b6',
    'développement': '#1abc9c',
    'opérations': '#d35400',
    'sécurité': '#c0392b',
    'cloud': '#16a085',
    'automation': '#8e44ad'
  }
  
  return tagColors[tag.toLowerCase()] || getRandomColor(tag)
}

function getDefaultThumbnail(post) {
  const title = post.title || 'Blog Post'
  const initials = title
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
  
  const bgColor = getRandomColor(post.title)
  
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200' width='300' height='200'%3E%3Crect width='300' height='200' fill='${bgColor.replace('#', '%23')}'/%3E%3Ctext x='150' y='110' font-family='Arial, sans-serif' font-size='60' font-weight='bold' fill='white' text-anchor='middle'%3E${initials}%3C/text%3E%3C/svg%3E`
}

onMounted(async () => {
  try {
    try {
      const blogDataModule = await import('../data/blog.data.js')
      
      if (blogDataModule && blogDataModule.default) {
        console.log('Module blog.data.js importé:', blogDataModule)
        
        const blogData = await blogDataModule.default()
        console.log('Données chargées depuis blog.data.js:', blogData)
        
        if (blogData && Array.isArray(blogData) && blogData.length > 0) {
          posts.value = blogData.map(post => {
            let thumbnailPath = post.frontmatter?.thumbnail || ''
            if (thumbnailPath && !thumbnailPath.startsWith('http') && !thumbnailPath.startsWith('/')) {
              thumbnailPath = '/' + thumbnailPath
            }
            
            return {
              title: post.frontmatter?.title || 'Sans titre',
              description: post.frontmatter?.description || '',
              date: post.frontmatter?.date || '',
              author: post.frontmatter?.author || '',
              tags: post.frontmatter?.tags || [],
              thumbnail: thumbnailPath,
              url: post.url
            }
          }).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
          
          console.log('Posts transformés:', posts.value)
          return
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de blog.data.js:', error)
    }
    
    console.log('Tentative de chargement via import.meta.glob avec des chemins fixes')
    
    let modules = {}
    
    try {
      console.log('Essai avec le chemin: ../../site/blog/posts/*.md')
      modules = import.meta.glob('../../site/blog/posts/*.md', { eager: true })
      if (Object.keys(modules).length > 0) {
        console.log('Modules trouvés avec le chemin: ../../site/blog/posts/*.md')
      }
    } catch (e) {
      console.log('Chemin non trouvé: ../../site/blog/posts/*.md')
    }
    
    if (Object.keys(modules).length > 0) {
      console.log('Modules trouvés:', Object.keys(modules))
      
      posts.value = Object.entries(modules).map(([path, module]) => {
        console.log('Chemin du module:', path)
        console.log('Contenu du module:', module)
        
        let frontmatter = {}
        
        if (module.frontmatter) {
          console.log('Frontmatter trouvé directement:', module.frontmatter)
          frontmatter = module.frontmatter
        } 
        else if (module.__pageData) {
          try {
            console.log('Type de __pageData:', typeof module.__pageData)
            console.log('Valeur de __pageData:', module.__pageData)
            
            if (typeof module.__pageData === 'object') {
              console.log('__pageData est déjà un objet')
              const pageData = module.__pageData
              if (pageData.frontmatter) {
                console.log('Frontmatter trouvé dans pageData (objet):', pageData.frontmatter)
                frontmatter = pageData.frontmatter
              }
            } 
            else if (typeof module.__pageData === 'string') {
              if (module.__pageData.trim().startsWith('{') || module.__pageData.trim().startsWith('[')) {
                const pageData = JSON.parse(module.__pageData)
                console.log('PageData parsé:', pageData)
                
                if (pageData.frontmatter) {
                  console.log('Frontmatter trouvé dans pageData (parsé):', pageData.frontmatter)
                  frontmatter = pageData.frontmatter
                }
              } else {
                console.log('__pageData n\'est pas une chaîne JSON valide')
              }
            }
          } catch (e) {
            console.error('Erreur lors du traitement de __pageData:', e)
          }
        }
        else if (module.default) {
          console.log('Module default:', module.default)
          
          if (module.default.frontmatter) {
            console.log('Frontmatter trouvé dans default:', module.default.frontmatter)
            frontmatter = module.default.frontmatter
          }
          else if (module.default.__vccOpts) {
            console.log('Module default est un composant Vue:', module.default.__vccOpts)
            if (module.default.__vccOpts.frontmatter) {
              frontmatter = module.default.__vccOpts.frontmatter
            }
          }
          else if (module.default.attributes) {
            console.log('Attributs trouvés dans default:', module.default.attributes)
            frontmatter = module.default.attributes
          }
        }
        else if (module.attributes) {
          console.log('Attributs trouvés:', module.attributes)
          frontmatter = module.attributes
        }
        else if (module.content || module.default?.content) {
          const content = module.content || module.default?.content
          console.log('Contenu brut trouvé, tentative d\'extraction du frontmatter')
          
          const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/)
          if (frontmatterMatch && frontmatterMatch[1]) {
            try {
              console.log('Frontmatter YAML trouvé dans le contenu')
              const lines = frontmatterMatch[1].split('\n')
              lines.forEach(line => {
                const [key, ...valueParts] = line.split(':')
                if (key && valueParts.length) {
                  const value = valueParts.join(':').trim()
                  frontmatter[key.trim()] = value
                }
              })
            } catch (e) {
              console.error('Erreur lors du parsing du frontmatter YAML:', e)
            }
          }
        }
        
        console.log('Frontmatter final extrait:', frontmatter)
        
        const fileName = path.split('/').pop().replace('.md', '')
        const fileNameTitle = fileName
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        
        let thumbnailPath = frontmatter.thumbnail || ''
        if (thumbnailPath && !thumbnailPath.startsWith('http') && !thumbnailPath.startsWith('/')) {
          thumbnailPath = '/' + thumbnailPath
        }
        
        return {
          title: frontmatter.title || fileNameTitle,
          description: frontmatter.description || '',
          date: frontmatter.date || '',
          author: frontmatter.author || '',
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : 
                (typeof frontmatter.tags === 'string' ? frontmatter.tags.split(',').map(t => t.trim()) : []),
          thumbnail: thumbnailPath,
          url: path.replace(/^.*\/posts\//, '/blog/posts/').replace(/\.md$/, '')
        }
      }).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      
      console.log('Posts chargés via import.meta.glob:', posts.value)
    } else {
      console.log('Aucun module trouvé avec tous les chemins essayés')
    }
  } catch (error) {
    console.error('Erreur lors du chargement des posts:', error)
  }
})

function formatDate(date) {
  if (!date) return ''
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('fr-FR', options)
}
</script>

<style scoped>
:deep(.VPDoc) {
  width: 100%;
  max-width: 100%;
}

:deep(.VPDoc .container) {
  max-width: 100%;
  margin: 0;
  padding: 0 24px;
}

:deep(.VPDoc .content) {
  max-width: 100%;
  padding: 0;
}

:deep(.VPDoc .aside) {
  display: none;
}

.blog-container {
  width: 100%;
  max-width: 100%;
  padding: 0;
}

.blog-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.blog-item {
  display: flex;
  gap: 1.5rem;
  padding: 0;
  border-radius: 0;
  background-color: transparent;
  position: relative;
  transition: transform 0.2s ease;
}

.blog-item::after {
  content: '';
  position: absolute;
  bottom: -0.75rem;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--vp-c-divider) 0%, var(--vp-c-divider) 50%, transparent 100%);
  opacity: 0.6;
}

.blog-item:last-child::after {
  display: none;
}

.blog-item:hover {
  transform: translateX(4px);
}

.blog-item-thumbnail {
  flex-shrink: 0;
  width: 180px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.blog-item-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.blog-item:hover .blog-item-thumbnail img {
  transform: scale(1.05);
}

.blog-item-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 0.25rem 0;
}

.blog-item-meta {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.blog-item-author-separator {
  margin: 0 0.4rem;
}

.blog-item-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.4rem;
  line-height: 1.3;
  font-weight: 600;
}

.vp-doc h2 {
  border-top: none;
  padding-top: 0;
}

.blog-item-title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s ease;
}

.blog-item-title a:hover {
  color: var(--vp-c-brand);
}

.blog-item-description {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.blog-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.25rem;
}

.blog-item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.blog-item-tag {
  font-size: 0.7rem;
  color: white;
  padding: 0.15rem 0.6rem;
  border-radius: 20px;
  font-weight: 500;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.blog-item-read-more {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--vp-c-brand);
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: gap 0.2s ease;
}

.blog-item-read-more:hover {
  gap: 0.5rem;
}

.blog-item-read-more svg {
  transition: transform 0.2s ease;
}

.blog-item-read-more:hover svg {
  transform: translateX(2px);
}

.no-posts {
  text-align: center;
  padding: 2rem 0;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .blog-item {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .blog-item-thumbnail {
    width: 100%;
    height: 160px;
  }
  
  .blog-item-content {
    padding: 0;
  }
}

</style>