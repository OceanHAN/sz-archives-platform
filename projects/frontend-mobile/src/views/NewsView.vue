<template>
  <div class="mobile-container page-container">
    <van-nav-bar
      title="资讯中心"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      :border="false"
      class="static-header"
    />
    
    <div class="app-shell-content">
      <van-tabs v-model:active="active" sticky>
        <van-tab title="最新">
          <div class="news-list">
             <div class="news-item" v-for="item in latestNews" :key="item.id" @click="goToDetail(item.id)">
                <div class="news-text">
                   <h3 class="news-title">{{ item.title }}</h3>
                   <div class="news-meta">
                      <span class="news-date">{{ formatDate(item.publish_time) }}</span>
                      <!-- <span class="news-tag" v-if="item.isTop">置顶</span> -->
                   </div>
                </div>
                <div class="news-thumb" v-if="item.cover_image">
                   <img :src="item.cover_image" />
                </div>
             </div>
          </div>
        </van-tab>
        <van-tab title="公告">
            <div class="news-list">
             <div class="news-item" v-for="item in noticeNews" :key="item.id" @click="goToDetail(item.id)">
                <div class="news-text full-width">
                   <h3 class="news-title">{{ item.title }}</h3>
                   <div class="news-meta">
                      <span class="news-date">{{ formatDate(item.publish_time) }}</span>
                   </div>
                </div>
             </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getNews, type NewsItem } from '../api/news';
import dayjs from 'dayjs';

const router = useRouter();
const active = ref(0);
const latestNews = ref<NewsItem[]>([]);
const noticeNews = ref<NewsItem[]>([]);

const fetchNews = async () => {
  try {
    const data = await getNews();
    latestNews.value = data;
    // For demo, we just duplicate for notice tab or filter if backend has type
    noticeNews.value = data.filter((_, i) => i % 2 !== 0);
  } catch (e) {
    console.error(e);
  }
};

const goToDetail = (id: number) => {
  router.push(`/news-detail/${id}`);
};

const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('YYYY-MM-DD');
};

const onClickLeft = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};

onMounted(() => {
  fetchNews();
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

.news-list {
    padding: 0 15px;
}

.news-item {
    display: flex;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
    gap: 15px;
}

.news-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.full-width {
    width: 100%;
}

.news-title {
    font-size: 16px;
    color: #333;
    line-height: 1.5;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.news-meta {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #999;
}

.news-tag {
    background: #A83226;
    color: white;
    padding: 1px 4px;
    border-radius: 2px;
    font-size: 10px;
    margin-left: 8px;
}

.news-thumb {
    width: 100px;
    height: 70px;
    border-radius: 4px;
    overflow: hidden;
    flex-shrink: 0;
}

.news-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>