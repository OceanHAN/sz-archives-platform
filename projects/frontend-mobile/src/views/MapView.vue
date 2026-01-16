<template>
  <div class="mobile-container map-view-page">
    
    <!-- Map Area -->
    <div class="map-wrapper">
      <div id="map" class="leaflet-map-target"></div>
      
      <!-- Loading State with Transition -->
      <transition name="fade">
        <div v-if="!mapReady" class="map-loading-overlay">
          <div class="spinner"></div>
          <p>{{ loadStatus }}</p>
        </div>
      </transition>
    </div>

    <!-- UI Overlay -->
    <div class="map-ui-overlay">
      <!-- Status Bar -->
      <div class="status-bar white-text">
        <span class="time">9:41</span>
        <div class="status-icons">
          <i class="fas fa-signal"></i>
          <i class="fas fa-wifi"></i>
          <i class="fas fa-battery-full"></i>
        </div>
      </div>

      <!-- Header -->
      <header class="immersive-header">
        <i class="fas fa-chevron-left back-icon" @click="$router.back()"></i>
        <h1>跟着档案观深圳</h1>
        <div class="placeholder"></div>
      </header>

      <!-- Timeline Area -->
      <div class="timeline-container">
        <div class="timeline-scroll" ref="timelineScroll">
          <div 
            v-for="year in years" 
            :key="year" 
            class="time-item" 
            :class="{ active: currentYear === year }"
            :ref="el => { if (currentYear === year) activeYearEl = el }"
            @click="changeYear(year)"
          >
            {{ year }}
          </div>
        </div>
        <div class="timeline-indicator"></div>
      </div>

      <!-- Bottom Tab Bar -->
      <div class="immersive-tab-bar">
        <div class="tab-item active">
          <i class="fas fa-cube"></i>
          <span>自由模式</span>
        </div>
        <div class="tab-item" @click="$router.push('/waterfall')">
          <i class="fas fa-th"></i>
          <span>瀑布流</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import L from 'leaflet';

console.log('MapView: Component setup');

const map = ref<L.Map | null>(null);
const historicalGroup = ref<L.LayerGroup | null>(null);
const timelineScroll = ref<HTMLElement | null>(null);
const activeYearEl = ref<any>(null);
const mapReady = ref(false);
const loadStatus = ref('正在准备地图引擎...');
const currentYear = ref(2025);
const years = [1979, 1980, 1985, 1990, 2000, 2010, 2020, 2025];
let historicalLayer: L.ImageOverlay | null = null;

const SZ_CENTER: L.LatLngExpression = [22.5431, 114.0579];

onMounted(async () => {
  console.log('MapView: onMounted');
  await nextTick();
  
  // Ensure DOM is ready
  setTimeout(() => {
    initMap();
  }, 100);
});

const initMap = () => {
  try {
    const mapEl = document.getElementById('map');
    if (!mapEl) {
      console.error('MapView: No #map element found');
      return;
    }

    if (map.value) return;

    console.log('MapView: Initializing Leaflet map');
    map.value = L.map('map', {
      center: SZ_CENTER,
      zoom: 13,
      zoomControl: false, 
      attributionControl: false,
      fadeAnimation: true,
      zoomAnimation: true
    });

    // GaoDe Tiles - Using a more robust URL pattern
    L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
      subdomains: '1234',
      maxZoom: 18,
      minZoom: 3,
    }).addTo(map.value);

    const icon = L.divIcon({
      className: 'custom-pin',
      html: '<div class="map-marker-pin"><i class="fas fa-star" style="color:#ff4d4f; font-size:24px;"></i></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    L.marker(SZ_CENTER, { icon }).addTo(map.value);
    
    // Initialize a dedicated group for historical overlays
    historicalGroup.value = L.layerGroup().addTo(map.value);
    
    mapReady.value = true;
    console.log('MapView: Map initialized');

    // Initial resize fix
    map.value.invalidateSize();

    // Center the initial year
    nextTick(() => {
      if (activeYearEl.value && timelineScroll.value) {
        activeYearEl.value.scrollIntoView({
          inline: 'center',
          block: 'nearest'
        });
      }
    });

  } catch (e: any) {
    console.error('MapView: Init error:', e);
    loadStatus.value = '初始化失败: ' + e.message;
  }
};

onUnmounted(() => {
  console.log('MapView: onUnmounted');
  if (map.value) {
    map.value.remove();
    map.value = null;
  }
});

const changeYear = (year: number) => {
  console.log('MapView: Changing year to', year);
  currentYear.value = year;
  
  // Center the active year in the scroll view
  nextTick(() => {
    if (activeYearEl.value && timelineScroll.value) {
      activeYearEl.value.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  });

  if (!map.value || !historicalGroup.value) return;

  // 1. Completely clear the historical group
  historicalGroup.value.clearLayers();

  // 2. Extra safety: Clear any loose ImageOverlay
  map.value.eachLayer((layer) => {
    if (layer instanceof L.ImageOverlay) {
      map.value?.removeLayer(layer);
    }
  });

  if (year <= 1985) {
    // If year is old, we just change the zoom/view to show a "different" perspective
    // instead of adding a confusing text-filled image overlay.
    map.value.setView(SZ_CENTER, 11);
    
    // Optional: Add a subtle sepia filter to the map tiles instead of a mask
    const mapEl = document.getElementById('map');
    if (mapEl) mapEl.style.filter = 'sepia(0.5) contrast(0.9)';
  } else {
    map.value.setView(SZ_CENTER, 13);
    const mapEl = document.getElementById('map');
    if (mapEl) mapEl.style.filter = 'none';
  }
};
</script>

<style scoped>
.map-view-page {
  background-color: #222;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.map-wrapper {
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

.leaflet-map-target {
  width: 100%;
  height: 100%;
}

.map-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #222;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  color: #fff;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: #C5A065;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Fade transition for loading overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.map-ui-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
}

.map-ui-overlay > * {
  pointer-events: auto;
}

.status-bar {
  position: absolute;
  top: 0;
  width: 100%;
  padding: 0 20px;
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  color: white;
  background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
}

.immersive-header {
  position: absolute;
  top: 44px;
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 1000;
}

.immersive-header h1 {
  font-size: 18px;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.8);
}

.back-icon {
  font-size: 20px;
  color: white;
  cursor: pointer;
  filter: drop-shadow(0 2px 3px rgba(0,0,0,0.8));
}

.timeline-container {
  position: absolute;
  top: 100px;
  width: 100%;
  z-index: 900;
  background: linear-gradient(to bottom, rgba(0,0,0,0.4), transparent);
  padding: 15px 0;
}

.timeline-scroll {
  display: flex;
  overflow-x: auto;
  padding: 0 50%;
  scroll-snap-type: x mandatory;
}

.timeline-scroll::-webkit-scrollbar { display: none; }

.time-item {
  flex-shrink: 0;
  padding: 5px 15px;
  color: rgba(255,255,255,0.5);
  scroll-snap-align: center;
  transition: all 0.3s;
  cursor: pointer;
}

.time-item.active {
  color: #fff;
  font-size: 20px;
  font-weight: bold;
}

.timeline-indicator {
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  margin: 8px auto 0;
  box-shadow: 0 0 6px rgba(255,255,255,0.8);
}

.immersive-tab-bar {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  height: 64px;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(15px);
  border-radius: 32px;
  display: flex;
  align-items: stretch; /* Allow items to fill full height for better centering control */
  z-index: 1000;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 8px 25px rgba(0,0,0,0.5);
  padding: 0;
  margin: 0;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Center content vertically */
  color: rgba(255,255,255,0.4);
  font-size: 11px;
  transition: all 0.3s ease;
}

.tab-item i {
  font-size: 24px; /* Increased size */
  margin-bottom: 3px;
  display: block;
  line-height: 1;
}

.tab-item span {
  display: block;
  line-height: 1;
  font-weight: 500;
}

.tab-item.active { color: #fff; }

:deep(.map-marker-pin) {
  animation: bounce 1s infinite alternate;
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-6px); }
}
</style>