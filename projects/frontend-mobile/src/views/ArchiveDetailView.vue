<template>
  <div class="mobile-container detail-page">
    <!-- Status Bar Mockup -->
    <div class="status-bar">
      <span class="time">9:41</span>
      <div class="status-icons">
        <i class="fas fa-signal"></i>
        <i class="fas fa-wifi"></i>
        <i class="fas fa-battery-full"></i>
      </div>
    </div>

    <!-- Page Header -->
    <header class="page-header detail-header">
      <i class="fas fa-chevron-left back-icon" @click="$router.back()"></i>
      <h1>档案详情</h1>
      <div class="placeholder"></div>
    </header>

    <!-- Main Content Scroll Area -->
    <div class="app-shell-content detail-scroll-content" v-if="archive">
      <!-- Archive Title -->
      <div class="detail-title-section">
        <h2>{{ archive.title }}</h2>
      </div>

      <!-- Metadata Card -->
      <div class="detail-card metadata-card">
        <div class="meta-row">
          <span class="meta-label">档号</span>
          <span class="meta-value">{{ archive.archive_code }} <i class="far fa-copy copy-icon" @click="copyCode"></i></span>
        </div>
        <div class="meta-row">
          <span class="meta-label">年度</span>
          <span class="meta-value">{{ archive.year || '1980' }}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">保管期限</span>
          <span class="meta-value">永久</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">密级</span>
          <span class="meta-value">{{ archive.is_open ? '公开' : '内部' }}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">档案存址</span>
          <span class="meta-value">深圳市档案馆</span>
        </div>
      </div>

      <!-- PDF Viewer Mockup -->
      <div class="detail-card pdf-viewer-card">
        <div class="pdf-header">
          <span class="pdf-title">电子全文.pdf</span>
          <div class="pdf-controls">
            <i class="fas fa-search-minus"></i>
            <span class="page-count">1 / 1</span>
            <i class="fas fa-search-plus"></i>
          </div>
        </div>
        <div class="pdf-content-mockup">
          <div class="pdf-page-placeholder">
            <div class="pdf-watermark">深圳市档案馆</div>
            <div class="pdf-text-lines">
              <div class="line" style="width: 80%"></div>
              <div class="line" style="width: 90%"></div>
              <div class="line" style="width: 95%"></div>
              <div class="line" style="width: 85%"></div>
              <div class="line" style="width: 92%"></div>
              <br>
              <div class="line" style="width: 88%"></div>
              <div class="line" style="width: 96%"></div>
              <div class="line" style="width: 75%"></div>
              <div class="line" style="width: 90%"></div>
            </div>
          </div>
        </div>
        <div class="pdf-footer-tip">
          <i class="fas fa-info-circle"></i> 当前预览为数字化副本
        </div>
      </div>
      
      <div style="height: 100px;"></div>
    </div>

    <!-- Bottom Action Bar -->
    <div class="detail-bottom-bar">
      <div class="action-btn-group">
        <div class="icon-action" @click="toggleFavorite">
          <i :class="isFavorite ? 'fas fa-star' : 'far fa-star'" :style="{ color: isFavorite ? 'var(--primary-gold)' : '' }"></i>
          <span>{{ isFavorite ? '已收藏' : '收藏' }}</span>
        </div>
        <div class="icon-action">
          <i class="fas fa-share-alt"></i>
          <span>分享</span>
        </div>
      </div>
      <button class="apply-btn" @click="handleApply">申请查阅</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { type ArchiveItem } from '../api/archive';
import { showToast } from 'vant';

const route = useRoute();
const archive = ref<ArchiveItem | null>(null);
const isFavorite = ref(false);

onMounted(() => {
  const id = route.params.id;
  // In a real app, we would fetch archive by ID from API
  // For now, we simulate with some dummy data if navigation didn't pass full object
  archive.value = {
    id: Number(id),
    archive_code: `SZ-A-${id}-2024`,
    title: '关于深圳市基本建设规划及历史档案资料的调研报告',
    year: '1980',
    is_open: true,
    pdf_url: 'dummy.pdf'
  };
});

const copyCode = () => {
  if (archive.value) {
    navigator.clipboard.writeText(archive.value.archive_code);
    showToast('档号已复制');
  }
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
  showToast(isFavorite.value ? '已添加到收藏' : '已取消收藏');
};

const handleApply = () => {
  showToast('申请已提交，请在“我的”页面查看进度');
};
</script>

<style scoped>
.detail-page {
  background-color: var(--bg-beige);
}

.detail-header {
  padding-bottom: 10px;
  background: white;
}

.detail-scroll-content {
  padding: 15px;
}

.detail-title-section {
  margin-bottom: 20px;
}

.detail-title-section h2 {
  font-size: 18px;
  color: #333;
  line-height: 1.5;
  font-weight: bold;
  text-align: justify;
}

.detail-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.meta-row {
  display: flex;
  margin-bottom: 15px;
  font-size: 14px;
}

.meta-row:last-child {
  margin-bottom: 0;
}

.meta-label {
  color: #999;
  width: 80px;
  flex-shrink: 0;
}

.meta-value {
  color: #333;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.copy-icon {
  color: #ccc;
  font-size: 14px;
}

/* PDF Mockup */
.pdf-viewer-card {
  padding: 0;
  overflow: hidden;
}

.pdf-header {
  background: #f5f5f5;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.pdf-title {
  font-size: 12px;
  color: #666;
  font-weight: bold;
}

.pdf-controls {
  display: flex;
  gap: 15px;
  color: #666;
}

.pdf-content-mockup {
  background: #525659;
  padding: 20px;
  height: 300px;
  overflow-y: auto;
}

.pdf-page-placeholder {
  background: white;
  width: 100%;
  padding: 30px;
  position: relative;
  min-height: 400px;
}

.pdf-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  font-size: 30px;
  color: rgba(0,0,0,0.03);
  font-weight: bold;
  pointer-events: none;
}

.line {
  height: 8px;
  background: #f0f0f0;
  margin-bottom: 12px;
}

.pdf-footer-tip {
  background: #f9f9f9;
  padding: 8px;
  text-align: center;
  font-size: 11px;
  color: #999;
}

.detail-bottom-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 -4px 15px rgba(0,0,0,0.05);
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
}

.action-btn-group {
  display: flex;
  gap: 25px;
  margin-right: 20px;
}

.icon-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666;
  font-size: 10px;
  gap: 4px;
}

.icon-action i {
  font-size: 20px;
}

.apply-btn {
  flex: 1;
  background: var(--primary-red);
  color: white;
  border: none;
  border-radius: 25px;
  height: 44px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(168, 50, 38, 0.2);
}
</style>