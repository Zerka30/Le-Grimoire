<template>
  <div class="project-card" :class="{ 'featured': featured }">
    <div class="project-card-header">
      <div class="project-card-thumbnail">
        <img :src="thumbnail || getDefaultThumbnail()" :alt="title" />
      </div>
      <div class="project-card-badges">
        <span v-if="featured" class="project-card-badge featured">Projet phare</span>
        <span v-if="status" class="project-card-badge" :class="status.toLowerCase()">{{ getStatusLabel(status) }}</span>
      </div>
    </div>
    
    <div class="project-card-content">
      <h3 class="project-card-title">
        <a :href="url" v-if="url">{{ title }}</a>
        <span v-else>{{ title }}</span>
      </h3>
      
      <p class="project-card-description">{{ description }}</p>
      
      <div class="project-card-tech">
        <span 
          v-for="tech in technologies" 
          :key="tech" 
          class="project-card-tech-item"
          :style="{ backgroundColor: getTechColor(tech) }"
        >
          {{ tech }}
        </span>
      </div>
      
      <div class="project-card-links">
        <a v-if="demoUrl" :href="demoUrl" target="_blank" rel="noopener noreferrer" class="project-card-link demo">
          <span class="link-icon">🔍</span> Démo
        </a>
        <a v-if="repoUrl" :href="repoUrl" target="_blank" rel="noopener noreferrer" class="project-card-link repo">
          <span class="link-icon">📦</span> Repo
        </a>
        <a v-if="docsUrl" :href="docsUrl" target="_blank" rel="noopener noreferrer" class="project-card-link docs">
          <span class="link-icon">📖</span> Docs
        </a>
        <a v-if="url" :href="url" class="project-card-link details">
          <span class="link-icon">ℹ️</span> Détails
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  technologies: {
    type: Array,
    default: () => []
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  },
  repoUrl: {
    type: String,
    default: ''
  },
  demoUrl: {
    type: String,
    default: ''
  },
  docsUrl: {
    type: String,
    default: ''
  }
});

function getRandomColor(seed) {
  const colors = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#d35400', '#c0392b', '#16a085', '#8e44ad'
  ];
  const index = Math.abs(seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
  return colors[index];
}

function getTechColor(tech) {
  const techColors = {
    'javascript': '#f7df1e',
    'typescript': '#3178c6',
    'python': '#3776ab',
    'vue': '#42b883',
    'react': '#61dafb',
    'node.js': '#339933',
    'docker': '#2496ed',
    'kubernetes': '#326ce5',
    'aws': '#ff9900',
    'terraform': '#7b42bc',
    'ansible': '#ee0000',
    'linux': '#fcc624',
    'go': '#00add8',
    'rust': '#dea584'
  };
  
  return techColors[tech.toLowerCase()] || getRandomColor(tech);
}

function getStatusLabel(status) {
  const statusLabels = {
    'active': 'Actif',
    'completed': 'Terminé',
    'paused': 'En pause',
    'planning': 'En planification',
    'archived': 'Archivé'
  };
  
  return statusLabels[status.toLowerCase()] || status;
}

function getDefaultThumbnail() {
  const title = props.title || 'Projet';
  const initials = title
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  
  const bgColor = getRandomColor(props.title);
  
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200' width='300' height='200'%3E%3Crect width='300' height='200' fill='${bgColor.replace('#', '%23')}'/%3E%3Ctext x='150' y='110' font-family='Arial, sans-serif' font-size='60' font-weight='bold' fill='white' text-anchor='middle'%3E${initials}%3C/text%3E%3C/svg%3E`;
}
</script>

<style scoped>
.project-card {
  background-color: var(--vp-c-bg-soft);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.project-card.featured {
  border: 2px solid var(--vp-c-brand);
}

.project-card-header {
  position: relative;
}

.project-card-thumbnail {
  height: 180px;
  overflow: hidden;
}

.project-card-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.project-card:hover .project-card-thumbnail img {
  transform: scale(1.05);
}

.project-card-badges {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.project-card-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.project-card-badge.featured {
  background-color: var(--vp-c-brand);
}

.project-card-badge.active {
  background-color: #2ecc71;
}

.project-card-badge.completed {
  background-color: #3498db;
}

.project-card-badge.paused {
  background-color: #f39c12;
}

.project-card-badge.planning {
  background-color: #9b59b6;
}

.project-card-badge.archived {
  background-color: #7f8c8d;
}

.project-card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.project-card-title {
  margin: 0 0 12px 0;
  font-size: 1.3rem;
  line-height: 1.3;
}

.project-card-title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
}

.project-card-title a:hover {
  color: var(--vp-c-brand);
}

.project-card-description {
  margin: 0 0 16px 0;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.5;
  flex-grow: 1;
}

.project-card-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.project-card-tech-item {
  font-size: 0.7rem;
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.project-card-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}

.project-card-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s, transform 0.2s;
}

.project-card-link:hover {
  transform: translateY(-2px);
}

.project-card-link.demo {
  background-color: #e8f4fd;
  color: #3498db;
}

.project-card-link.repo {
  background-color: #eafaf1;
  color: #2ecc71;
}

.project-card-link.docs {
  background-color: #fef9e7;
  color: #f39c12;
}

.project-card-link.details {
  background-color: #f4ecf7;
  color: #9b59b6;
}

.link-icon {
  font-size: 1rem;
}
</style>