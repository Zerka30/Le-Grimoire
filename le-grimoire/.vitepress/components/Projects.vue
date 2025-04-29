<template>
  <div class="projects-container">
    <div v-if="isLoading" class="loading-projects">
      <p>Chargement des projets...</p>
    </div>
    
    <template v-else>
      <div v-if="featuredProjects.length > 0" class="projects-section">
        <h2 class="projects-section-title">Projets phares</h2>
        <div class="projects-grid">
          <ProjectCard 
            v-for="project in featuredProjects" 
            :key="project.title"
            v-bind="project"
          />
        </div>
      </div>
      
      <div v-if="activeProjects.length > 0" class="projects-section">
        <h2 class="projects-section-title">Projets actifs</h2>
        <div class="projects-grid">
          <ProjectCard 
            v-for="project in activeProjects" 
            :key="project.title"
            v-bind="project"
          />
        </div>
      </div>
      
      <div v-if="otherProjects.length > 0" class="projects-section">
        <h2 class="projects-section-title">Autres projets</h2>
        <div class="projects-grid">
          <ProjectCard 
            v-for="project in otherProjects" 
            :key="project.title"
            v-bind="project"
          />
        </div>
      </div>
      
      <div v-if="projects.length === 0" class="no-projects">
        <p>Aucun projet n'a été trouvé.</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ProjectCard from './ProjectCard.vue';
import { data as projectsData } from '../data/projects.data.js';

const projects = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    console.log('Chargement des projets depuis projects.data.js...');
    
    // Vérifier si projectsData est une fonction ou directement les données
    if (typeof projectsData === 'function') {
      const projectsResult = await projectsData();
      console.log('Données chargées depuis projects.data.js (fonction):', projectsResult);
      
      if (projectsResult && Array.isArray(projectsResult)) {
        projects.value = projectsResult;
      } else {
        console.warn('La fonction projectsData n\'a pas retourné un tableau');
      }
    } else if (Array.isArray(projectsData)) {
      // Si projectsData est directement un tableau
      console.log('Données chargées depuis projects.data.js (tableau):', projectsData);
      projects.value = projectsData;
    } else {
      console.warn('projectsData n\'est ni une fonction ni un tableau:', typeof projectsData);
    }
    
    console.log('Projets chargés:', projects.value);
  } catch (error) {
    console.error('Erreur lors du chargement des projets:', error);
  } finally {
    isLoading.value = false;
  }
});

const featuredProjects = computed(() => {
  return projects.value.filter(project => project.featured);
});

const activeProjects = computed(() => {
  return projects.value.filter(project => project.status === 'active' && !project.featured);
});

const otherProjects = computed(() => {
  return projects.value.filter(project => project.status !== 'active' && !project.featured);
});
</script>

<style scoped>
.projects-container {
  width: 100%;
  max-width: 100%;
  padding: 0;
}

.loading-projects {
  text-align: center;
  padding: 2rem 0;
  color: var(--vp-c-text-2);
}

.projects-section {
  margin-bottom: 3rem;
}

.projects-section-title {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.projects-section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: var(--vp-c-brand);
  border-radius: 3px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.no-projects {
  text-align: center;
  padding: 2rem 0;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>