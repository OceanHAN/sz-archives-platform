<template>
  <div class="mobile-container page-container">
    <van-nav-bar
      title="资讯中心"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
      :border="false"
      class="static-header"
    />
    
    <div class="app-shell-content">
      <van-tabs v-model:active="active" sticky>
        <van-tab title="最新">
          <div class="news-list">
             <div class="news-item" v-for="item in latestNews" :key="item.id">
                <div class="news-text">
                   <h3 class="news-title">{{ item.title }}</h3>
                   <div class="news-meta">
                      <span class="news-date">{{ item.date }}</span>
                      <span class="news-tag" v-if="item.isTop">置顶</span>
                   </div>
                </div>
                <div class="news-thumb" v-if="item.image">
                   <img :src="item.image" />
                </div>
             </div>
          </div>
        </van-tab>
        <van-tab title="公告">
            <div class="news-list">
             <div class="news-item" v-for="item in noticeNews" :key="item.id">
                <div class="news-text full-width">
                   <h3 class="news-title">{{ item.title }}</h3>
                   <div class="news-meta">
                      <span class="news-date">{{ item.date }}</span>
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
import { ref } from 'vue';

/**
 * 资讯中心页面
 * News View
 */
const active = ref(0);

// Mock Data
const latestNews = ref([
    {
        id: 1,
        title: '深圳市档案馆开展“6·9国际档案日”系列宣传活动',
        date: '2023-06-09',
        isTop: true,
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=200'
    },
    {
        id: 2,
        title: '关于恢复对外开放的公告',
        date: '2023-05-15',
        isTop: false,
        image: null
    },
    {
        id: 3,
        title: '“兰台讲堂”第五期顺利开讲，专家解读城市记忆',
        date: '2023-05-10',
        isTop: false,
        image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=200'
    }
]);

const noticeNews = ref([
    {
        id: 4,
        title: '深圳市档案馆2023年节假日开放时间安排',
        date: '2023-01-01'
    },
    {
        id: 5,
        title: '关于查档系统维护升级的通知',
        date: '2023-03-20'
    }
]);
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