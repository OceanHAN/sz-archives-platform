<template>
  <div class="mobile-container home-page">
    <!-- Scrollable Content Area -->
    <div class="home-scroll-content">
      <!-- Branding -->
      <header class="branding">
        <div class="logo-icon">
          <i class="fas fa-landmark"></i>
        </div>
        <h1>深圳市档案馆</h1>
        <p class="subtitle">SHENZHEN MUNICIPAL ARCHIVES</p>
      </header>

      <div class="scroll-content">
        <!-- Action Cards -->
        <div class="action-cards">
          <div class="card card-red" @click="$router.push('/booking?type=archive')">
            <div class="card-text">
              <h3>预约查档</h3>
              <p>Archive Access<br>Appointment</p>
            </div>
            <div class="card-icon">
              <i class="fas fa-id-card"></i>
            </div>
          </div>
          <div class="card card-teal" @click="$router.push('/booking?type=exhibition')">
            <div class="card-text">
              <h3>预约展览</h3>
              <p>Exhibition<br>Booking</p>
            </div>
            <div class="card-icon">
              <i class="fas fa-images"></i>
            </div>
          </div>
        </div>

        <!-- Feature Panel -->
        <div class="feature-panel">
          <div class="feature-item touch-block" role="button" tabindex="0" @click="$router.push('/guide')" @keydown.enter="$router.push('/guide')">
            <div class="icon-box"><i class="fas fa-map-signs"></i></div>
            <span class="cn">场馆导览</span>
            <span class="en">Venue Guide</span>
          </div>
          <div class="feature-item touch-block" role="button" tabindex="0" @click="$router.push('/search')" @keydown.enter="$router.push('/search')">
            <div class="icon-box"><i class="fas fa-search"></i></div>
            <span class="cn">档案检索</span>
            <span class="en">Archive Search</span>
          </div>
          <div class="feature-item touch-block" role="button" tabindex="0" @click="$router.push('/course-booking')" @keydown.enter="$router.push('/course-booking')">
            <div class="icon-box"><i class="fas fa-chalkboard-teacher"></i></div>
            <span class="cn">预约课程</span>
            <span class="en">Course Registration</span>
          </div>
        </div>

        <!-- Promo Banner -->
        <div class="promo-banner">
          <div class="promo-content">
            <h2>跟着档案学党史</h2>
            <p>档案文献党课</p>
            <button class="btn-book" @click="$router.push('/course-booking')">立即预约</button>
          </div>
        </div>

        <!-- Sub Features -->
        <div class="sub-features">
          <div class="tile tile-left" @click="navigateToMap">
            <h3>跟着档案观深圳</h3>
            <p>数字人文平台</p>
            <div class="tile-icon"><i class="fas fa-city"></i></div>
          </div>
          <div class="tile tile-right">
            <span class="badge">即将上线</span>
            <h3>逆时追忆</h3>
            <p>城市记忆 时光珍藏</p>
            <p class="small">沉浸式档案数字导览</p>
          </div>
        </div>

        <!-- Cloud Exhibition -->
        <section class="section-block">
          <div class="section-header">
            <div class="header-left">
              <i class="fas fa-wheat section-icon"></i>
              <h2>云展厅 <span class="en-title">Virtual Exhibition</span></h2>
            </div>
            <a class="more-link" @click="$router.push('/exhibition-list')">更多 <i class="fas fa-chevron-right"></i></a>
          </div>
          
          <div class="horizontal-scroll">
            <div 
              v-for="item in exhibitions" 
              :key="item.id"
              class="exhibition-card" 
              @click="$router.push(`/exhibition-detail/${item.id}`)"
            >
              <div class="card-bg" :style="{ backgroundImage: `url(${item.cover_image})` }">
                <div class="card-content">
                  <h3 class="calligraphy">{{ item.title }}</h3>
                  <p class="desc">{{ item.summary }}</p>
                  <span class="tag">{{ item.type === 'virtual' ? '云展' : '线下展' }}</span>
                </div>
              </div>
            </div>
            <div v-if="exhibitions.length === 0" class="exhibition-card">
               <div class="card-bg" style="background: #eee; color: #999;">
                  暂无展览
               </div>
            </div>
          </div>
        </section>

        <!-- Cloud Course -->
        <section class="section-block">
          <div class="section-header">
            <div class="header-left">
              <i class="fas fa-wheat section-icon"></i>
              <h2>云课堂 <span class="en-title">Online Courses</span></h2>
            </div>
            <a class="more-link" @click="$router.push('/course-list')">更多 <i class="fas fa-chevron-right"></i></a>
          </div>

          <div class="course-card" @click="$router.push('/course-booking')">
            <div class="course-bg">
              <div class="play-btn"><i class="fas fa-play"></i></div>
              <h3 class="calligraphy-gold">深圳抗战</h3>
              <h3 class="calligraphy-gold sub">血与火的记忆</h3>
              <div class="bottom-tag">跟着档案学党史</div>
            </div>
          </div>
        </section>
        
        <!-- Bottom Spacer handled by padding in scroll-content -->
        <div style="height: 20px;"></div>
      </div>
    </div>

    <!-- Bottom Nav (Static in Flex) -->
    <nav class="bottom-nav static-nav">
      <div class="nav-item active">
        <i class="fas fa-landmark"></i>
        <span>首页 Home</span>
      </div>
      <div class="nav-item" @click="$router.push('/news')">
        <i class="fas fa-newspaper"></i>
        <span>资讯 News</span>
      </div>
      <div class="nav-item" @click="$router.push('/profile')">
        <i class="far fa-user"></i>
        <span>我的 Profile</span>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getExhibitions, type ExhibitionItem } from '../api/exhibition';

const router = useRouter();

const exhibitions = ref<ExhibitionItem[]>([]);

const fetchExhibitions = async () => {
  try {
    exhibitions.value = await getExhibitions();
  } catch (e) {
    console.error('Failed to fetch exhibitions', e);
  }
};

onMounted(() => {
  fetchExhibitions();
});

const navigateToMap = () => {
  console.log('HomeView: Navigating to MapView...');
  router.push('/map-view');
};
</script>

<style scoped>
/* 首页专用布局 - 模拟 App 视口 */
/* Home Page Layout - Simulating App Viewport */
.home-page {
  height: 100vh;
  overflow: hidden;
  padding-bottom: 0 !important; /* 覆盖全局 padding */
  display: flex;
  flex-direction: column;
}

/* 滚动内容区域 */
/* Scrollable Content Area */
.home-scroll-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* iOS 平滑滚动 */
}

/* 底部导航栏 - 静态定位 */
/* Bottom Nav - Static Position in Flex */
.static-nav {
  position: static !important; /* 覆盖全局 absolute */
  flex-shrink: 0;
  width: 100%;
  z-index: 100;
  background: white;
  border-top: 1px solid #eee;
}
</style>
