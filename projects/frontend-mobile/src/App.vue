<script setup lang="ts">
import { RouterView } from 'vue-router'
// 根组件：主要负责渲染路由视图
// Root component: Responsible for rendering the router view
console.log('App.vue setup');
</script>

<template>
  <!-- 路由出口，根据当前 URL 渲染对应的页面组件 -->
  <!-- Router Outlet: Renders the component matching the current URL -->
  <router-view />
</template>

<style>
/* 全局样式已在 main.ts 中引入 assets/styles.css，此处可放置 App 级特有样式 */
/* Global styles are imported in main.ts via assets/styles.css */
</style>
