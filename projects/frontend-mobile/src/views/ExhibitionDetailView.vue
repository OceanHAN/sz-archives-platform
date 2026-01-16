<template>
  <div class="mobile-container page-container">
    <van-nav-bar
      title="展览详情"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
      :border="false"
      class="static-header"
    />
    
    <div class="app-shell-content" v-if="exhibition">
      <!-- Banner -->
      <div class="detail-banner">
        <img :src="exhibition.cover_image" alt="Exhibition Cover" />
      </div>

      <!-- Content -->
      <div class="detail-content-scroll">
        <h2 class="course-title">{{ exhibition.title }}</h2>
        <div class="course-meta">
          <p><i class="far fa-clock"></i> 展览类型：{{ exhibition.type === 'virtual' ? '云展厅' : '实地展览' }}</p>
          <p><i class="fas fa-map-marker-alt"></i> 展览地点：{{ exhibition.type === 'virtual' ? '在线预览' : '深圳市档案馆' }}</p>
        </div>

        <div class="section-heading">展览介绍</div>
        <div class="section-text">
          <p>{{ exhibition.summary }}</p>
          <div v-if="exhibition.content" v-html="exhibition.content"></div>
          <p v-else>本次展览精选了深圳市档案馆馆藏的珍贵档案文献，生动展现了相关领域的光辉历程和伟大成就。</p>
        </div>
      </div>
    </div>
    <div v-else class="loading-state">
        加载中...
    </div>
    
    <!-- Bottom Action Bar -->
    <div class="detail-bottom-bar static-nav">
        <van-button 
            type="primary" 
            block 
            round 
            color="#A83226" 
            @click="handleBook"
        >
            立即预约
        </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast } from 'vant';
import { getExhibitionDetail, type ExhibitionItem } from '../api/exhibition';

const route = useRoute();
const router = useRouter();
const exhibitionId = route.params.id;
const exhibition = ref<ExhibitionItem | null>(null);

const fetchDetail = async () => {
    try {
        exhibition.value = await getExhibitionDetail(Number(exhibitionId));
    } catch (e) {
        console.error('Failed to fetch exhibition detail', e);
        showToast('获取详情失败');
    }
};

onMounted(() => {
    fetchDetail();
});

const handleBook = () => {
    showToast('跳转预约...');
    router.push('/booking?type=exhibition');
};
</script>

<style scoped>
.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff;
}

.detail-banner {
  width: 100%;
  height: 240px;
  flex-shrink: 0;
}

.detail-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-content-scroll {
  padding: 20px;
  background: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  margin-top: -20px; /* Overlap effect */
  position: relative;
  z-index: 1;
}

.course-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  font-family: "KaiTi", "STKaiti", serif;
}

.course-meta {
  font-size: 13px;
  color: #666;
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.section-heading {
  font-size: 16px;
  font-weight: bold;
  color: #5D4037;
  margin-bottom: 10px;
  border-left: 4px solid #C5A065;
  padding-left: 10px;
}

.section-text {
  font-size: 14px;
  color: #444;
  line-height: 1.8;
  margin-bottom: 20px;
  text-align: justify;
}

.detail-bottom-bar {
    padding: 10px 20px;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
}
</style>
