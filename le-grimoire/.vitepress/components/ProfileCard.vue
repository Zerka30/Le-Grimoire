<template>
  <div class="profile-card" :style="{ width: width, maxWidth: width }">
    <div class="profile-image">
      <img :src="avatar" alt="Photo de profil" />
    </div>
    
    <h2 class="profile-name">{{ name }}</h2>
    <div class="profile-title">{{ title }}</div>
    <div class="profile-email">{{ email }}</div>
    
    <div class="profile-bio">
      {{ bio }}
    </div>
    
    <div class="profile-location">{{ location }}</div>
    
    <div class="profile-divider"></div>
    
    <div class="profile-skills">
      <div v-for="(skill, index) in skills" :key="index" class="profile-skill">
        <span class="skill-icon" v-html="skill.icon"></span>
        <span class="skill-text">{{ skill.text }}</span>
      </div>
    </div>
    
    <div class="profile-divider"></div>
    
    <div class="profile-social">
      <a v-for="(link, index) in socialLinks" :key="index" :href="link.url" target="_blank" rel="noopener noreferrer" class="social-link">
        <span class="social-icon" v-html="link.icon"></span>
      </a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  avatar: {
    type: String,
    default: '/avatar.png'
  },
  name: {
    type: String,
    default: 'Raphaël Hien'
  },
  title: {
    type: String,
    default: 'Site Reliability Engineer'
  },
  email: {
    type: String,
    default: 'contact@raphaelhien.fr'
  },
  bio: {
    type: String,
    default: 'Passionné de DevOps, j\'explore et partage mes découvertes techniques au quotidien.'
  },
  location: {
    type: String,
    default: 'Annecy, France'
  },
  skills: {
    type: Array,
    default: () => [
      { icon: '🔒', text: 'GPG' },
      { icon: '☕', text: 'Expressos' }
    ]
  },
  socialLinks: {
    type: Array,
    default: () => [
      { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>', url: 'https://github.com/zerka30' },
      { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>', url: 'https://twitter.com/zerka30' },
      { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>', url: 'https://www.linkedin.com/in/raphaelhien/' },
      { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/></svg>', url: '/rss.xml' }
    ]
  },
  width: {
    type: String,
    default: '100%'
  }
})
</script>

<style scoped>
.profile-card {
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 16px;
  border: 3px solid var(--vp-c-brand);
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  margin: 0 0 4px;
  font-size: 1.5rem;
  font-weight: 600;
}

.profile-title {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 4px;
}

.profile-email {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
  margin-bottom: 16px;
}

.profile-bio {
  margin-bottom: 16px;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

.profile-location {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
  margin-bottom: 16px;
}

.profile-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--vp-c-divider), transparent);
  margin: 16px 0;
}

.profile-skills {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.profile-skill {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.skill-icon {
  font-size: 1.2rem;
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-social {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.social-link {
  color: var(--vp-c-text-2);
  transition: color 0.2s;
}

.social-link:hover {
  color: var(--vp-c-brand);
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 