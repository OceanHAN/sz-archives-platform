<template>
  <div class="mobile-container guide-page">
    <!-- Background Decorations -->
    <div class="bg-flower-top"><i class="fas fa-spa"></i></div>
    <div class="bg-flower-bottom"><i class="fas fa-spa"></i></div>

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
    <header class="page-header guide-header">
      <i class="fas fa-chevron-left back-icon" @click="$router.back()"></i>
      <h1>场馆导览</h1>
      <div class="placeholder"></div>
    </header>

    <!-- Category Tabs -->
    <div class="guide-tabs-container">
      <div 
        v-for="cat in categories" 
        :key="cat.id"
        class="guide-tab" 
        :class="{ active: currentCategory === cat.id }"
        @click="currentCategory = cat.id"
      >
        {{ cat.name }}
      </div>
    </div>

    <!-- More Services Float Button -->
    <div class="float-btn-more">
      <i class="fas fa-chevron-down"></i>
      <span>更多<br>服务</span>
    </div>

    <!-- Map Area -->
    <div class="app-shell-content map-view-content">
      <div class="map-container">
        <!-- Floor Map Image -->
        <img :src="currentMapUrl" alt="Floor Map" class="floor-map">
        
        <!-- Markers -->
        <transition-group name="fade">
          <div 
            v-for="marker in activeMarkers" 
            :key="marker.id"
            class="map-marker"
            :style="{ 
              top: marker.top, 
              left: marker.left, 
              right: marker.right,
              backgroundColor: marker.color || 'var(--primary-red)' 
            }"
          >
            <span>{{ marker.label }}</span>
          </div>
        </transition-group>
      </div>
    </div>

    <!-- Floor Selector -->
    <div class="floor-selector">
      <div 
        v-for="floor in floors" 
        :key="floor"
        class="floor-btn" 
        :class="{ active: currentFloor === floor }"
        @click="currentFloor = floor"
      >
        {{ floor }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 场馆导览页面
 * Guide View Implementation
 */
import { ref, computed } from 'vue';

const currentCategory = ref('exhibition');
const currentFloor = ref('1F');

const categories = [
  { id: 'service', name: '服务台' },
  { id: 'toilet', name: '卫生间' },
  { id: 'exhibition', name: '展览' },
  { id: 'elevator', name: '电梯' }
];

const floors = ['B1', '1F', '2F', '3F'];

// Marker Data
const markers = [
  // 1F Exhibition
  { id: 1, category: 'exhibition', floor: '1F', label: '专题展厅', top: '30%', left: '20%' },
  { id: 2, category: 'exhibition', floor: '1F', label: '专题展厅', top: '40%', right: '10%' },
  { id: 3, category: 'exhibition', floor: '1F', label: '报告厅', top: '60%', right: '20%' },
  // 1F Service
  { id: 4, category: 'service', floor: '1F', label: '总服务台', top: '70%', left: '45%', color: '#C5A065' },
  // 2F Service
  { id: 5, category: 'service', floor: '2F', label: '2F咨询处', top: '50%', left: '50%', color: '#C5A065' },
  // 1F Toilet
  { id: 6, category: 'toilet', floor: '1F', label: '洗手间', top: '20%', left: '10%', color: '#2F7B6E' },
  { id: 7, category: 'toilet', floor: '1F', label: '洗手间', top: '20%', right: '10%', color: '#2F7B6E' },
  // 1F Elevator
  { id: 8, category: 'elevator', floor: '1F', label: '客梯', top: '50%', left: '10%', color: '#333' }
];

const activeMarkers = computed(() => {
  return markers.filter(m => m.category === currentCategory.value && m.floor === currentFloor.value);
});

const currentMapUrl = computed(() => {
  const colors: Record<string, string> = {
    'exhibition': 'A83226',
    'service': 'C5A065',
    'toilet': '2F7B6E',
    'elevator': '333333'
  };
  const bgColors: Record<string, string> = {
    'B1': 'E0E0E0',
    '1F': 'F9F5EB',
    '2F': 'FFF8E1',
    '3F': 'FFF3E0'
  };
  const color = colors[currentCategory.value];
  const bg = bgColors[currentFloor.value];
  return `https://placehold.co/350x350/${bg}/${color}?text=${currentFloor.value}+${currentCategory.value.toUpperCase()}+Map`;
});
</script>

<style scoped>
/* Specific Styles for Guide Page */
.guide-page {
  background-color: var(--bg-beige);
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.guide-header {
  padding-bottom: 10px;
}

.guide-tabs-container {
  background-color: #F3E5C8;
  margin: 0 15px 15px;
  border-radius: 12px;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  z-index: 10;
}

.guide-tab {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  color: #8D7B65;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.guide-tab.active {
  background-color: var(--primary-gold);
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.map-view-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
}

.map-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  overflow: hidden;
}

.floor-map {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.map-marker {
  position: absolute;
  padding: 4px 10px;
  border-radius: 4px;
  color: white;
  font-size: 10px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  white-space: nowrap;
  z-index: 5;
  transform: translate(-50%, -50%);
}

.floor-selector {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 20px 15px;
  background: transparent;
  z-index: 10;
}

.floor-btn {
  width: 50px;
  height: 36px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #666;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.2s ease;
}

.floor-btn.active {
  background-color: var(--primary-red);
  color: white;
  border-color: var(--primary-red);
}

.float-btn-more {
  position: absolute;
  top: 180px;
  right: 15px;
  width: 50px;
  height: 50px;
  background: #F3E5C8;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  z-index: 20;
  font-size: 10px;
  color: #8D7B65;
  text-align: center;
  line-height: 1.1;
  border: 1px solid rgba(197, 160, 101, 0.3);
}

.float-btn-more i {
  font-size: 12px;
  margin-bottom: 2px;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

/* Background Decorations (Reusing from Search) */
.bg-flower-top {
    position: absolute;
    top: 50px;
    left: 20px;
    font-size: 150px;
    color: rgba(255, 255, 255, 0.4);
    z-index: -1;
    transform: rotate(-20deg);
}

.bg-flower-bottom {
    position: absolute;
    bottom: 100px;
    right: -20px;
    font-size: 180px;
    color: rgba(255, 255, 255, 0.4);
    z-index: -1;
    transform: rotate(10deg);
}
</style>