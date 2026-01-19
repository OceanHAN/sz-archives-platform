<template>
  <div class="mobile-container map-view-page">
    <!-- Map Area -->
    <div class="map-wrapper">
      <div id="map" class="leaflet-map-target"></div>
    </div>

    <!-- UI Overlay -->
    <div class="map-ui-overlay">
      <header class="immersive-header">
        <i class="fas fa-chevron-left back-icon" @click="$router.back()"></i>
        <h1>跟着档案观深圳</h1>
        <div class="placeholder"></div>
      </header>

      <!-- Map Controls -->
      <div class="map-controls">
        <div class="control-btn" @click="showYearSelector = true">
          <i class="fas fa-layer-group"></i>
          <span>历史地图</span>
        </div>
      </div>

      <!-- Opacity Slider (Removed for Switch Mode) -->
      <!-- <div class="opacity-control" v-if="activeMap">
        ...
      </div> -->
    </div>

    <!-- Year Selector Action Sheet -->
    <van-action-sheet
      v-model:show="showYearSelector"
      :actions="yearActions"
      cancel-text="取消"
      description="选择历史年份地图"
      close-on-click-action
      @select="handleYearSelect"
    />

    <!-- Landmark Details Drawer -->
    <van-popup
      v-model:show="showDrawer"
      position="bottom"
      round
      :style="{ height: '60%' }"
      class="landmark-drawer"
    >
      <div class="drawer-content" v-if="selectedLandmark">
        <div class="drawer-header">
          <div class="header-info">
            <h2 class="landmark-name">{{ selectedLandmark.name }}</h2>
            <p class="landmark-address"><i class="fas fa-map-marker-alt"></i> {{ selectedLandmark.address }}</p>
          </div>
          <div class="header-image" v-if="selectedLandmark.cover_image">
            <img :src="selectedLandmark.cover_image" />
          </div>
        </div>
        
        <div class="drawer-body">
          <div class="summary-section">
            <p>{{ selectedLandmark.summary }}</p>
          </div>

          <div class="timeline-section">
            <div class="timeline-title">历史沿革</div>
            <div class="timeline-list">
              <div v-for="(event, index) in selectedLandmark.events" :key="index" class="timeline-item">
                <div class="timeline-year">{{ event.year }}</div>
                <div class="timeline-content">
                  <div class="event-title">{{ event.title }}</div>
                  <div class="event-desc">{{ event.description }}</div>
                  <img v-if="event.image" :src="event.image" class="event-image" />
                </div>
              </div>
              <div v-if="!selectedLandmark.events || selectedLandmark.events.length === 0" class="empty-timeline">
                暂无历史大事记
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getLandmarks, getLandmarkDetail, type LandmarkItem } from '../api/landmark';
import { getHistoricalMaps, type HistoricalMapItem } from '../api/historical-map';

const map = ref<L.Map | null>(null);
const landmarks = ref<LandmarkItem[]>([]);
const selectedLandmark = ref<LandmarkItem | null>(null);
const showDrawer = ref(false);

// Historical Map State
const historicalMaps = ref<HistoricalMapItem[]>([]);
const showYearSelector = ref(false);
const activeMap = ref<HistoricalMapItem | null>(null);
const currentOverlay = ref<L.ImageOverlay | null>(null);
const overlayOpacity = ref(0.7);

const SZ_CENTER: L.LatLngExpression = [22.5431, 114.0579];

const yearActions = computed(() => {
  const actions = historicalMaps.value.map(m => ({
    name: `${m.year}年 - ${m.title}`,
    value: m.id,
    color: activeMap.value?.id === m.id ? '#C5A065' : '#333'
  }));
  
  // Add "Current Map" option
  actions.unshift({
    name: '当前地图',
    value: 0,
    color: !activeMap.value ? '#C5A065' : '#333'
  } as any);
  
  return actions;
});

const tileLayer = ref<L.TileLayer | null>(null);

onMounted(async () => {
  await nextTick();
  initMap();
  loadLandmarks();
  loadHistoricalMaps();
});

const initMap = () => {
  if (map.value) return;

  map.value = L.map('map', {
    center: SZ_CENTER,
    zoom: 11,
    zoomControl: false, 
    attributionControl: false,
  });

  // Use CartoDB Voyager tiles for better performance and look
  tileLayer.value = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    minZoom: 3,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(map.value);
};

const loadLandmarks = async () => {
  try {
    const data = await getLandmarks();
    landmarks.value = data;
    renderMarkers();
  } catch (e) {
    console.error('Failed to load landmarks', e);
  }
};

const loadHistoricalMaps = async () => {
  try {
    historicalMaps.value = await getHistoricalMaps();
  } catch (e) {
    console.error('Failed to load historical maps', e);
  }
};

const handleYearSelect = (action: any) => {
  const mapId = action.value;
  if (mapId === 0) {
    // Show current map
    if (currentOverlay.value && map.value) {
      map.value.removeLayer(currentOverlay.value);
    }
    if (tileLayer.value && map.value) {
      if (!map.value.hasLayer(tileLayer.value)) {
        tileLayer.value.addTo(map.value);
      }
    }
    currentOverlay.value = null;
    activeMap.value = null;
    return;
  }

  const selected = historicalMaps.value.find(m => m.id === mapId);
  if (selected) {
    renderOverlay(selected);
  }
};

const renderOverlay = (historyMap: HistoricalMapItem) => {
  if (!map.value) return;

  // Remove existing overlay
  if (currentOverlay.value) {
    map.value.removeLayer(currentOverlay.value);
  }
  
  // Remove tile layer (switch mode)
  if (tileLayer.value && map.value.hasLayer(tileLayer.value)) {
    map.value.removeLayer(tileLayer.value);
  }

  // Define bounds
  const bounds: L.LatLngBoundsExpression = [
    [historyMap.bounds.southWest.lat, historyMap.bounds.southWest.lng],
    [historyMap.bounds.northEast.lat, historyMap.bounds.northEast.lng]
  ];

  // Add new overlay with 100% opacity
  currentOverlay.value = L.imageOverlay(historyMap.url, bounds, {
    opacity: 1,
    interactive: true
  }).addTo(map.value);

  // Fit bounds to show the overlay
  map.value.fitBounds(bounds);
  
  activeMap.value = historyMap;
};

// Removed updateOpacity as it is no longer used in switch mode


const getCategoryColor = (cat: string) => {
  const map: any = { red: '#ff4d4f', history: '#faad14', culture: '#1890ff', hotspot: '#52c41a' };
  return map[cat] || '#1890ff';
};

const renderMarkers = () => {
  if (!map.value) return;

  landmarks.value.forEach(item => {
    const color = getCategoryColor(item.category);
    const iconHtml = `<div class="custom-marker" style="background-color: ${color}">
      <i class="fas fa-map-marker-alt"></i>
    </div>`;
    
    const icon = L.divIcon({
      className: 'custom-pin-container',
      html: iconHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    const marker = L.marker([item.latitude, item.longitude], { icon }).addTo(map.value!);
    marker.on('click', () => handleMarkerClick(item.id));
  });
};

const handleMarkerClick = async (id: number) => {
  try {
    const detail = await getLandmarkDetail(id);
    selectedLandmark.value = detail;
    showDrawer.value = true;
    
    // Center map on marker
    map.value?.setView([detail.latitude, detail.longitude], 14, { animate: true });
  } catch (e) {
    console.error(e);
  }
};

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
    map.value = null;
  }
});
</script>

<style scoped>
.map-view-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.map-wrapper {
  flex: 1;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.leaflet-map-target {
  width: 100%;
  height: 100%;
}

.map-ui-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 20;
  height: 100%; /* Cover full height to position controls */
}

.immersive-header {
  position: absolute;
  top: 44px; /* Status bar height */
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  pointer-events: auto;
}

.immersive-header h1 {
  font-size: 18px;
  color: #333;
  background: rgba(255,255,255,0.8);
  padding: 4px 12px;
  border-radius: 16px;
  backdrop-filter: blur(4px);
}

.back-icon {
  font-size: 20px;
  color: #333;
  background: rgba(255,255,255,0.8);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.map-controls {
  position: absolute;
  top: 100px;
  right: 16px;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-btn {
  background: #fff;
  color: #333;
  padding: 8px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.control-btn i {
  color: #C5A065;
}

.opacity-control {
  position: absolute;
  bottom: 120px; /* Above drawer trigger area */
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  background: rgba(255,255,255,0.9);
  padding: 12px 20px;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  pointer-events: auto;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.slider-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;
}

.custom-slider-button {
  width: 20px;
  height: 20px;
  color: #fff;
  font-size: 10px;
  line-height: 18px;
  text-align: center;
  background-color: #C5A065;
  border-radius: 100px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

:deep(.custom-marker) {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  font-size: 16px;
}

/* Drawer Styles */
.landmark-drawer {
  background: #f8f8f8;
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  background: #fff;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
}

.header-info {
  flex: 1;
  padding-right: 15px;
}

.landmark-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.landmark-address {
  font-size: 13px;
  color: #999;
}

.header-image img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.summary-section {
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 20px;
}

.timeline-section {
  padding-bottom: 40px;
}

.timeline-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 4px solid #C5A065;
}

.timeline-list {
  padding-left: 10px;
}

.timeline-item {
  display: flex;
  margin-bottom: 25px;
  position: relative;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 24px;
  top: 25px;
  bottom: -25px;
  width: 2px;
  background: #e0e0e0;
}

.timeline-item:last-child::before {
  display: none;
}

.timeline-year {
  font-size: 16px;
  font-weight: bold;
  color: #C5A065;
  width: 60px;
  padding-top: 2px;
}

.timeline-content {
  flex: 1;
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  margin-left: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.event-title {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 5px;
}

.event-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 10px;
}

.event-image {
  width: 100%;
  border-radius: 4px;
}

.empty-timeline {
  text-align: center;
  color: #999;
  padding: 20px;
}
</style>
