<template>
  <div class="mobile-container page-container">
    <van-nav-bar
      title="课程播放"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      class="static-header"
    />

    <div class="app-shell-content">
      <div v-if="course" class="player-container">
        <!-- Video Player -->
        <div class="video-wrapper">
          <video 
            controls 
            autoplay
            class="video-player"
            :poster="course.cover_image"
          >
            <source :src="course.video_url" type="video/mp4">
            您的浏览器不支持视频播放。
          </video>
        </div>

        <!-- Info Section -->
        <div class="info-section">
          <h1 class="course-title">{{ course.title }}</h1>
          <p class="course-subtitle">{{ course.subtitle }}</p>
          
          <div class="meta-row">
            <span><i class="far fa-clock"></i> {{ course.publish_date }}</span>
            <span><i class="far fa-eye"></i> {{ course.view_count }}次观看</span>
          </div>

          <div class="divider"></div>

          <div class="description">
            <h3>课程简介</h3>
            <p>本课程深入挖掘深圳档案资源，为您讲述深圳发展历程中的生动故事。</p>
          </div>
        </div>
      </div>
      <div v-else class="loading-state">
        <van-loading vertical>加载中...</van-loading>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCourseDetail, type CourseItem } from '../api/course';
import { showToast } from 'vant';

const route = useRoute();
const router = useRouter();
const courseId = route.params.id;
const course = ref<CourseItem | null>(null);

const onClickLeft = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};

const fetchDetail = async () => {
  try {
    course.value = await getCourseDetail(Number(courseId));
  } catch (e) {
    console.error(e);
    showToast('获取课程失败');
  }
};

onMounted(() => {
  fetchDetail();
});
</script>

<style scoped>
.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.player-container {
  display: flex;
  flex-direction: column;
}

.video-wrapper {
  width: 100%;
  background: black;
  aspect-ratio: 16/9;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.info-section {
  padding: 20px;
}

.course-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
}

.course-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.meta-row {
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: #999;
  margin-bottom: 15px;
}

.meta-row span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.divider {
  height: 1px;
  background: #eee;
  margin: 15px 0;
}

.description h3 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.description p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  text-align: justify;
}

.loading-state {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>