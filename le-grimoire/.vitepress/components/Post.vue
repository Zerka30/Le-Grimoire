<template>
  <div class="post-container">
    <!-- Bannière de l'article avec image de couverture -->
    <div class="post-banner" v-if="thumbnail">
      <img :src="withBase(thumbnail)" :alt="title" class="post-thumbnail" />
    </div>
    
    <!-- En-tête de l'article avec métadonnées -->
    <div class="post-header">
      <div class="post-meta">
        <span class="post-date" v-if="date">{{ formatDate(date) }}</span>
        <span class="post-author" v-if="author">
          <span class="post-meta-separator">•</span>
          <span class="post-author-name">{{ author }}</span>
        </span>
      </div>
      
      <h1 class="post-title">{{ title }}</h1>
      
      <div class="post-tags" v-if="tags && tags.length > 0">
        <span 
          v-for="tag in tags" 
          :key="tag" 
          class="post-tag"
          :style="{ backgroundColor: getTagColor(tag) }"
        >
          {{ tag }}
        </span>
      </div>
      
      <p class="post-description" v-if="description">{{ description }}</p>
    </div>
    
    <!-- Contenu de l'article -->
    <div class="post-content">
      <slot></slot>
    </div>
    
    <!-- Pied de page de l'article -->
    <div class="post-footer">
      <div class="post-navigation">
        <a v-if="prevPost" :href="withBase(prevPost.url)" class="post-nav-link prev">
          ← {{ prevPost.title }}
        </a>
        <a v-if="nextPost" :href="withBase(nextPost.url)" class="post-nav-link next">
          {{ nextPost.title }} →
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { withBase, useData } from 'vitepress'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  tags: {
    type: Array,
    default: () => []
  },
  prevPost: {
    type: Object,
    default: null
  },
  nextPost: {
    type: Object,
    default: null
  }
})

const { frontmatter } = useData()

// Utiliser les propriétés du frontmatter si elles ne sont pas fournies via les props
const title = computed(() => props.title || frontmatter.value.title || '')
const description = computed(() => props.description || frontmatter.value.description || '')
const date = computed(() => props.date || frontmatter.value.date || '')
const author = computed(() => props.author || frontmatter.value.author || '')
const thumbnail = computed(() => props.thumbnail || frontmatter.value.thumbnail || '')
const tags = computed(() => {
  if (props.tags && props.tags.length > 0) return props.tags
  if (frontmatter.value.tags) {
    return Array.isArray(frontmatter.value.tags) 
      ? frontmatter.value.tags 
      : frontmatter.value.tags.split(',').map(t => t.trim())
  }
  return []
})

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
    'automation': '#8e44ad',
    'dns': '#2980b9',
    'as-code': '#27ae60',
    'proxy': '#c0392b',
    'reverse-proxy': '#8e44ad'
  }
  
  return tagColors[tag.toLowerCase()] || getRandomColor(tag)
}

function getRandomColor(seed) {
  const colors = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#d35400', '#c0392b', '#16a085', '#8e44ad'
  ]
  const index = Math.abs(seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length
  return colors[index]
}

function formatDate(date) {
  if (!date) return ''
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('fr-FR', options)
}
</script>

<style scoped>
.post-container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  overflow-x: hidden;
}

.post-banner {
  width: 100%;
  height: 400px;
  overflow: hidden;
  margin-bottom: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-header {
  margin-bottom: 2rem;
}

.post-meta {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.post-meta-separator {
  margin: 0 0.5rem;
}

.post-title {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
  line-height: 1.2;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.post-description {
  font-size: 1.2rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  margin-top: 1rem;
  font-weight: 400;
  font-style: italic;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.post-tag {
  font-size: 0.75rem;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 500;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.post-content {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--vp-c-text-1);
}

.post-footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.post-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.post-nav-link {
  display: inline-block;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s, transform 0.2s;
  max-width: 45%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-nav-link:hover {
  background-color: var(--vp-c-bg-mute);
  transform: translateY(-2px);
}

.post-nav-link.prev {
  text-align: left;
}

.post-nav-link.next {
  text-align: right;
  margin-left: auto;
}

/* Améliorations de la responsivité */
@media (max-width: 1200px) {
  .post-banner {
    height: 350px;
  }
}

@media (max-width: 960px) {
  .post-banner {
    height: 300px;
  }
  
  .post-title {
    font-size: 2.2rem;
  }
}

@media (max-width: 768px) {
  .post-banner {
    height: 250px;
    border-radius: 8px;
  }
  
  .post-title {
    font-size: 2rem;
  }
  
  .post-description {
    font-size: 1.1rem;
  }
  
  .post-navigation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .post-nav-link {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .post-banner {
    height: 200px;
  }
  
  .post-title {
    font-size: 1.8rem;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .post-meta-separator {
    display: none;
  }
  
  .post-tags {
    margin-top: 0.5rem;
  }
}
</style>
