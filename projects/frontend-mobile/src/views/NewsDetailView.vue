<template>
  <div class="mobile-container page-container">
    <van-nav-bar
      title="资讯详情"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      :border="false"
      class="static-header"
    />
    
    <div class="app-shell-content detail-content" v-if="newsItem">
      <h1 class="news-title">{{ newsItem.title }}</h1>
      <div class="news-meta">
        <span class="date">{{ formatDate(newsItem.publish_time) }}</span>
        <span class="source">深圳市档案馆</span>
      </div>
      
      <div class="news-body" v-html="newsItem.content"></div>
    </div>
    
    <div v-else class="loading">
      <van-loading type="spinner" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getNewsDetail, type NewsItem } from '../api/news';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();
const newsItem = ref<NewsItem | null>(null);

const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm');
};

const onClickLeft = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/news');
  }
};

onMounted(async () => {
  const id = Number(route.params.id);
  if (id) {
    try {
      newsItem.value = await getNewsDetail(id);
    } catch (e) {
      console.error(e);
    }
  }
});
</script>

<style scoped>
.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff;
}

.detail-content {
  padding: 20px;
  overflow-y: auto;
}

.news-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  margin-bottom: 15px;
}

.news-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #999;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.news-body {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

/* Rich Text Styles */
:deep(.news-body img) {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
  border-radius: 4px;
}

:deep(.news-body p) {
  margin-bottom: 15px;
}

.loading {
  display: flex;
  justify-content: center;
  padding-top: 50px;
}
</style>
