<template>
  <div class="mobile-container page-container">
    <van-nav-bar
      title="云课堂"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      :border="false"
      class="static-header"
    />
    
    <div class="app-shell-content">
      <div class="course-list-content">
        <div 
          v-for="item in courses" 
          :key="item.id" 
          class="exhibition-list-card"
          @click="goToPlayer(item.id)"
        >
          <div class="card-img-wrapper">
             <img :src="item.cover_image" class="exhibition-list-img" />
             <div class="play-btn-overlay"><i class="fas fa-play"></i></div>
          </div>
          <div class="exhibition-list-info">
            <h3 class="exhibition-list-title">{{ item.title }}</h3>
            <p class="exhibition-list-desc">{{ item.subtitle }}</p>
            <div class="meta-row">
                <span class="meta-item"><i class="far fa-clock"></i> {{ item.duration ? Math.floor(item.duration / 60) + '分钟' : '未知' }}</span>
                <span class="meta-item"><i class="far fa-eye"></i> {{ item.view_count }}次观看</span>
            </div>
          </div>
        </div>
        
        <div v-if="courses.length === 0" class="empty-state">
            <van-empty description="暂无课程" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCourses, type CourseItem } from '../api/course';

const router = useRouter();
const courses = ref<CourseItem[]>([]);

const onClickLeft = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};

const fetchCourses = async () => {
  try {
    courses.value = await getCourses();
  } catch (e) {
    console.error('Failed to fetch courses', e);
  }
};

onMounted(() => {
  fetchCourses();
});

const goToPlayer = (id: number) => {
  router.push(`/course-player/${id}`);
};
</script>

<style scoped>
.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #F7F8FA;
}

.course-list-content {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.exhibition-list-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.card-img-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
}

.exhibition-list-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-btn-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.exhibition-list-info {
  padding: 15px;
}

.exhibition-list-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  margin-bottom: 5px;
  font-family: "KaiTi", "STKaiti", serif;
}

.exhibition-list-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 10px;
}

.meta-row {
    display: flex;
    gap: 15px;
    font-size: 11px;
    color: #999;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.empty-state {
    padding: 40px 0;
    text-align: center;
    color: #999;
}
</style>
