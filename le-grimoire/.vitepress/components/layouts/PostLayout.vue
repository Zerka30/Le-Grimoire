<template>
  <div class="post-layout">
    <div class="post-container">
      <!-- Bannière avec image de couverture -->
      <div class="post-banner" v-if="frontmatter.thumbnail">
        <img :src="withBase(frontmatter.thumbnail)" :alt="frontmatter.title" class="post-thumbnail" />
      </div>
      
      <!-- En-tête de l'article -->
      <div class="post-header">
        <div class="post-meta">
          <span class="post-date" v-if="frontmatter.date">{{ formatDate(frontmatter.date) }}</span>
          <span class="post-author" v-if="frontmatter.author">
            <span class="post-meta-separator">•</span>
            <span class="post-author-name">{{ frontmatter.author }}</span>
          </span>
        </div>
        
        <div class="post-tags" v-if="frontmatter.tags && frontmatter.tags.length > 0">
          <span 
            v-for="tag in frontmatter.tags" 
            :key="tag" 
            class="post-tag"
            :style="{ backgroundColor: getTagColor(tag) }"
          >
            {{ tag }}
          </span>
        </div>
        
        <p class="post-description" v-if="frontmatter.description">{{ frontmatter.description }}</p>
      </div>
      
      <!-- Contenu de l'article -->
      <div class="post-content vp-doc">
        <Content />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
import { withBase, Content } from 'vitepress'
import { computed } from 'vue'

const { frontmatter } = useData()

function formatDate(date) {
  if (!date) return ''
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('fr-FR', options)
}

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
    'automation': '#8e44ad',
    'dns': '#9b59b6',
    'as-code': '#2ecc71',
    'proxy': '#e74c3c',
    'reverse-proxy': '#3498db'
  }
  
  return tagColors[tag.toLowerCase()] || getRandomColor(tag)
}
</script>

<style>
.post-layout {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0;
}

.post-container {
  width: 100%;
  max-width: 860px;
  padding: 0 20px;
}

/* Ajoutons des règles pour les écrans plus larges */
@media (min-width: 1200px) {
  .post-container {
    max-width: 1000px;
  }
}

@media (min-width: 1600px) {
  .post-container {
    max-width: 1200px;
  }
}

.post-banner {
  width: 100%;
  margin: 2rem 0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center; /* Centre l'image si elle est plus petite que le conteneur */
}

.post-thumbnail {
  max-width: 100%;
  height: auto;
  display: inline-block;
  vertical-align: middle;
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

.post-description {
  font-size: 1.2rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  margin-top: 1rem;
  font-weight: 400;
  font-style: italic;
}

.post-content {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--vp-c-text-1);
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.post-content h1 {
  font-size: 2.5rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.post-content h2 {
  font-size: 1.8rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.post-content h3 {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.post-content p {
  margin-bottom: 1.25rem;
}

.post-content img {
  max-width: 100%;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.post-content ul, .post-content ol {
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
}

.post-content li {
  margin-bottom: 0.5rem;
}

.post-content blockquote {
  border-left: 4px solid var(--vp-c-brand);
  padding-left: 1rem;
  color: var(--vp-c-text-2);
  font-style: italic;
  margin: 1.5rem 0;
}

.post-content code {
  background-color: var(--vp-c-bg-soft);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
}

.post-content pre {
  position: relative;
  background-color: var(--vp-c-bg-soft);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5rem 0;
  max-width: 100%;
}

.post-content pre code {
  padding: 0;
  background-color: transparent;
  border-radius: 0;
}

.post-content a {
  color: var(--vp-c-brand);
  text-decoration: none;
  border-bottom: 1px dashed var(--vp-c-brand-light);
  transition: border-bottom 0.2s;
}

.post-content a:hover {
  border-bottom: 1px solid var(--vp-c-brand);
}

/* S'assurer que les boutons de copie de VitePress sont visibles */
.post-content div[class*="language-"] {
  position: relative;
}

/* Responsive */
@media (max-width: 768px) {
  .post-banner {
    height: 250px;
  }
  
  .post-content h1 {
    font-size: 2rem;
  }
  
  .post-content h2 {
    font-size: 1.6rem;
  }
  
  .post-content h3 {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .post-banner {
    height: 200px;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .post-meta-separator {
    display: none;
  }
}
</style>