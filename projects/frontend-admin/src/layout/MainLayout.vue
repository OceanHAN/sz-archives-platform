<template>
  <a-layout class="admin-layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">
        <img src="../assets/vue.svg" alt="logo" />
        <span v-if="!collapsed">深圳档案管理系统</span>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="dashboard" @click="$router.push('/')">
          <template #icon><dashboard-outlined /></template>
          <span>工作台</span>
        </a-menu-item>
        <a-menu-item key="archives" @click="$router.push('/archives')">
          <template #icon><file-search-outlined /></template>
          <span>档案管理</span>
        </a-menu-item>
        <a-menu-item key="exhibitions" @click="$router.push('/exhibitions')">
          <template #icon><picture-outlined /></template>
          <span>云展厅管理</span>
        </a-menu-item>
        <a-menu-item key="venues" @click="$router.push('/venues')">
          <template #icon><shop-outlined /></template>
          <span>线下展馆管理</span>
        </a-menu-item>
        <a-menu-item key="appointments" @click="$router.push('/appointments')">
          <template #icon><calendar-outlined /></template>
          <span>预约管理</span>
        </a-menu-item>
        <a-menu-item key="courses" @click="$router.push('/courses')">
          <template #icon><video-camera-outlined /></template>
          <span>云课堂管理</span>
        </a-menu-item>
        <a-menu-item key="news" @click="$router.push('/news')">
          <template #icon><read-outlined /></template>
          <span>资讯管理</span>
        </a-menu-item>
        <a-menu-item key="landmarks" @click="$router.push('/landmarks')">
          <template #icon><compass-outlined /></template>
          <span>地图地标管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 16px; display: flex; align-items: center; justify-content: space-between;">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        
        <div class="user-info">
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              管理员 <down-outlined />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>个人中心</a-menu-item>
                <a-menu-item>退出登录</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px', overflow: 'initial' }"
      >
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  DashboardOutlined,
  FileSearchOutlined,
  PictureOutlined,
  ShopOutlined,
  CalendarOutlined,
  VideoCameraOutlined,
  ReadOutlined,
  CompassOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DownOutlined
} from '@ant-design/icons-vue';

const collapsed = ref(false);
const selectedKeys = ref<string[]>(['dashboard']);
const route = useRoute();

watch(() => route.path, (path) => {
  if (path === '/') selectedKeys.value = ['dashboard'];
  else if (path.startsWith('/archives')) selectedKeys.value = ['archives'];
  else if (path.startsWith('/exhibitions')) selectedKeys.value = ['exhibitions'];
  else if (path.startsWith('/venues')) selectedKeys.value = ['venues'];
  else if (path.startsWith('/appointments')) selectedKeys.value = ['appointments'];
  else if (path.startsWith('/courses')) selectedKeys.value = ['courses'];
  else if (path.startsWith('/news')) selectedKeys.value = ['news'];
  else if (path.startsWith('/landmarks')) selectedKeys.value = ['landmarks'];
}, { immediate: true });
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

.logo {
  height: 32px;
  margin: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
}

.logo img {
  height: 100%;
}

.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}
</style>