<template>
  <div class="blog-layout">
    <div class="blog-layout-main">
      <slot></slot>
    </div>
    <div class="blog-layout-sidebar">
      <ProfileCard width="350px" />
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.blog-layout {
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 100%;
}

.blog-layout-main {
  flex: 1;
  min-width: 0;
}

.blog-layout-sidebar {
  width: 350px;
  flex-shrink: 0;
}

@media (max-width: 1080px) {
  .blog-layout {
    flex-direction: column;
  }

  .blog-layout-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .blog-layout-sidebar {
    display: none;
  }
}
</style>