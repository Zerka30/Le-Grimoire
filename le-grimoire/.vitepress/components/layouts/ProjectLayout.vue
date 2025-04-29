<template>
  <div class="project-layout">
    <div class="project-layout-main">
      <slot></slot>
    </div>
    <div class="project-layout-sidebar">
      <ProfileCard width="350px" />
    </div>
  </div>
</template>

<script setup>
// Pas besoin d'importer ProfileCard car il est déjà enregistré globalement
</script>

<style scoped>
.project-layout {
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 100%;
}

.project-layout-main {
  flex: 1;
  min-width: 0;
}

.project-layout-sidebar {
  width: 350px;
  flex-shrink: 0;
}

@media (max-width: 1080px) {
  .project-layout {
    flex-direction: column;
  }

  .project-layout-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .project-layout-sidebar {
    display: none;
  }
}
</style>