<template>
  <div class="mobile-container page-container">
    <van-nav-bar
      title="预约课程"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
      :border="false"
      class="static-header"
    />
    
    <div class="app-shell-content">
      <van-tabs v-model:active="active" sticky>
        <van-tab title="近期课程">
          <div class="course-list">
            <div 
              v-for="course in recentCourses" 
              :key="course.id" 
              class="course-card"
            >
              <div class="course-cover" :style="{ backgroundImage: `url(${course.cover})` }">
                <div class="course-status" :class="course.statusClass">{{ course.statusText }}</div>
              </div>
              <div class="course-info">
                <h3 class="title">{{ course.title }}</h3>
                <div class="meta-row">
                  <i class="far fa-user"></i>
                  <span>主讲人：{{ course.speaker }}</span>
                </div>
                <div class="meta-row">
                  <i class="far fa-clock"></i>
                  <span>时间：{{ course.time }}</span>
                </div>
                <div class="action-row">
                  <van-button 
                    size="small" 
                    :type="course.canBook ? 'primary' : 'default'" 
                    :disabled="!course.canBook"
                    round
                    color="#A83226"
                    @click="handleBookCourse(course)"
                  >
                    {{ course.btnText }}
                  </van-button>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="往期回顾">
          <div class="course-list">
             <div 
              v-for="course in historyCourses" 
              :key="course.id" 
              class="course-card history"
            >
              <div class="course-cover" :style="{ backgroundImage: `url(${course.cover})` }">
                <div class="play-overlay"><i class="fas fa-play-circle"></i></div>
              </div>
              <div class="course-info">
                <h3 class="title">{{ course.title }}</h3>
                <div class="meta-row">
                  <i class="far fa-user"></i>
                  <span>主讲人：{{ course.speaker }}</span>
                </div>
                <div class="meta-row">
                   <i class="far fa-eye"></i>
                   <span>观看：{{ course.views }}</span>
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
import { useRouter } from 'vue-router';
import { showSuccessToast, showFailToast, showConfirmDialog } from 'vant';
import { createAppointment } from '../api/appointment';

/**
 * 预约课程页面
 * Course Booking View
 */
const active = ref(0);
const router = useRouter();

// Mock Data
const recentCourses = ref([
  {
    id: 1,
    title: '深圳档案里的红色记忆',
    speaker: '张教授',
    time: '2023-10-15 14:30',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600',
    statusText: '报名中',
    statusClass: 'status-booking',
    btnText: '立即报名',
    canBook: true
  },
  {
    id: 2,
    title: '城市发展与档案保护',
    speaker: '李研究员',
    time: '2023-10-20 09:30',
    cover: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600',
    statusText: '已满员',
    statusClass: 'status-full',
    btnText: '名额已满',
    canBook: false
  }
]);

const historyCourses = ref([
  {
    id: 3,
    title: '改革开放口述史',
    speaker: '王老师',
    views: '2,304',
    cover: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=600'
  },
  {
    id: 4,
    title: '非遗文化传承',
    speaker: '陈大师',
    views: '1,502',
    cover: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=600'
  }
]);

const handleBookCourse = async (course: any) => {
  try {
    await showConfirmDialog({
      title: '预约确认',
      message: `确定要预约课程《${course.title}》吗？`,
    });

    const data = {
      biz_type: 'course',
      biz_id: course.id,
      booking_date: course.time.split(' ')[0],
      time_slot: course.time.split(' ')[1],
      contact_name: '测试用户', // In real app, get from user profile
      contact_phone: '13800138000',
      visitor_count: 1
    };

    await createAppointment(data);
    showSuccessToast('课程预约成功');
    
    // Update local UI
    course.btnText = '已预约';
    course.canBook = false;
  } catch (e) {
    if (e !== 'cancel') {
      console.error(e);
      showFailToast('预约失败');
    }
  }
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

/* Use global .static-header, .app-shell-content from styles.css */

.course-list {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.course-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.course-cover {
  height: 160px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.course-status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
  font-weight: bold;
}

.status-booking {
  background-color: #A83226;
}

.status-full {
  background-color: #999;
}

.course-info {
  padding: 15px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.meta-row {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
}

.meta-row i {
  width: 20px;
  text-align: center;
  margin-right: 5px;
}

.action-row {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

/* History Style */
.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 40px;
  opacity: 0.8;
}
</style>