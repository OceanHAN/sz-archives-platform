<template>
  <div class="profile-page mobile-container">
    <!-- Header (Scrolls with content or fixed? Usually fixed header in profile is nice, but let's scroll it for simplicity unless specified) -->
    <!-- Let's keep the header inside the scrollable area for now to match typical simple profiles, or keep it fixed? 
         Looking at HomeView, the header scrolls. 
         Looking at BookingView, the header is static.
         The Profile header looks like a banner. Let's make it part of the scroll content so it moves away.
    -->
    
    <div class="app-shell-content">
      <div class="profile-header">
        <div class="user-info">
          <div class="avatar-circle">
            <i class="far fa-user"></i>
          </div>
          <div class="user-text">
            <h2>未登录用户</h2>
            <p style="font-size: 12px; opacity: 0.8;">点击登录查看更多信息</p>
          </div>
        </div>
        <div class="header-actions">
          <div class="action-item">
            <i class="fas fa-cog"></i>
            <span>设置</span>
          </div>
          <div class="action-item">
            <i class="far fa-bell"></i>
            <span>消息</span>
          </div>
        </div>
      </div>

      <div class="profile-content">
        <div class="menu-group">
          <div class="menu-item" @click="$router.push('/my-appointments')">
            <div class="menu-left">
              <i class="fas fa-calendar-check menu-icon"></i>
              <span>我的预约</span>
            </div>
            <i class="fas fa-chevron-right arrow-icon"></i>
          </div>
          <div class="menu-item">
            <div class="menu-left">
              <i class="fas fa-history menu-icon"></i>
              <span>借阅历史</span>
            </div>
            <i class="fas fa-chevron-right arrow-icon"></i>
          </div>
          <div class="menu-item">
            <div class="menu-left">
              <i class="fas fa-star menu-icon"></i>
              <span>我的收藏</span>
            </div>
            <i class="fas fa-chevron-right arrow-icon"></i>
          </div>
        </div>

        <div class="menu-group">
          <div class="menu-item">
            <div class="menu-left">
              <i class="fas fa-id-card menu-icon"></i>
              <span>实名认证</span>
            </div>
            <div style="font-size: 12px; color: #999;">未认证 <i class="fas fa-chevron-right arrow-icon"></i></div>
          </div>
          <div class="menu-item">
            <div class="menu-left">
              <i class="fas fa-question-circle menu-icon"></i>
              <span>帮助与反馈</span>
            </div>
            <i class="fas fa-chevron-right arrow-icon"></i>
          </div>
        </div>
      </div>
      
      <!-- Spacer for bottom safe area if needed, though padding-bottom usually handles it -->
      <div style="height: 20px;"></div>
    </div>


  <!-- Bottom Nav (Static) -->
    <nav class="bottom-nav static-nav">
      <div class="nav-item" @click="$router.push('/')">
        <i class="fas fa-landmark"></i>
        <span>首页 Home</span>
      </div>
      <div class="nav-item" @click="$router.push('/news')">
        <i class="fas fa-newspaper"></i>
        <span>资讯 News</span>
      </div>
      <div class="nav-item active">
        <i class="far fa-user"></i>
        <span>我的 Profile</span>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
/**
 * 个人中心视图
 * Profile View Component
 * 
 * 展示用户信息、功能菜单入口。
 * Displays user info and feature menu links.
 * 
 * 布局策略:
 * - App Shell 模式 (Flex Column)
 * - 顶部头部随内容滚动
 * - 底部导航栏固定 (Static in Flex)
 */
</script>

<style scoped>
/* 页面容器 - 限制高度和溢出 */
.profile-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #F5F5F5;
  padding-bottom: 0 !important; /* Override global padding if any */
}

/* 滚动区域使用全局 .app-shell-content */

/* 复用全局样式，但在 scoped 中可以微调 */
</style>
