// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'

import Blog from '../components/Blog.vue'
import ProfileCard from '../components/ProfileCard.vue'
import BlogLayout from '../components/layouts/BlogLayout.vue'
import ProjectLayout from '../components/layouts/ProjectLayout.vue'
import Projects from '../components/Projects.vue'
import ProjectCard from '../components/ProjectCard.vue'


/** @type {import('vitepress').Theme} */
export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component('Blog', Blog)
        app.component('ProfileCard', ProfileCard)
        app.component('BlogLayout', BlogLayout)
        app.component('ProjectLayout', ProjectLayout)
        app.component('Projects', Projects)
        app.component('ProjectCard', ProjectCard)
    }
}
