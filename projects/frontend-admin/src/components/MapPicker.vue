<template>
  <div class="map-container">
    <div class="search-box">
      <a-input-search
        v-model:value="searchQuery"
        placeholder="搜索地点（如：深圳市民中心）"
        enter-button
        @search="handleSearch"
        :loading="searching"
      />
    </div>
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { message } from 'ant-design-vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps<{
  lat?: number;
  lng?: number;
}>();

const emit = defineEmits(['update:lat', 'update:lng', 'select']);

const mapContainer = ref<HTMLElement | null>(null);
const searchQuery = ref('');
const searching = ref(false);
let map: L.Map | null = null;
let marker: L.Marker | null = null;

const handleSearch = async () => {
  if (!searchQuery.value) return;
  
  searching.value = true;
  try {
    // Append '深圳市' if not present to prioritize local results, 
    // but allow user to search freely if they want.
    // Actually, Nominatim works best with specific queries.
    // We'll limit viewbox to Shenzhen area if possible, or just search globally.
    // Let's just search globally but bias towards current map view if we could, 
    // but simpler is just a query.
    
    // Using OpenStreetMap Nominatim API
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}&limit=1`);
    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);

      if (map) {
        map.setView([lat, lng], 16);
        updateMarker(lat, lng);
      }
      message.success(`已定位到：${result.display_name.split(',')[0]}`);
    } else {
      message.warning('未找到相关地点，请尝试更详细的关键词');
    }
  } catch (error) {
    console.error('Search error:', error);
    message.error('搜索失败，请稍后重试');
  } finally {
    searching.value = false;
  }
};

const updateMarker = (lat: number, lng: number) => {
  if (!map) return;
  
  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    marker = L.marker([lat, lng]).addTo(map);
  }

  emit('update:lat', lat);
  emit('update:lng', lng);
  emit('select', { lat, lng });
};

onMounted(() => {
  if (mapContainer.value) {
    // Default to Shenzhen coordinates if no props
    const initialLat = props.lat || 22.543099;
    const initialLng = props.lng || 114.057868;

    map = L.map(mapContainer.value).setView([initialLat, initialLng], 13);

    // Use CartoDB Voyager tiles for better performance and look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20
    }).addTo(map);

    // Initial marker if props exist
    if (props.lat && props.lng) {
      marker = L.marker([props.lat, props.lng]).addTo(map);
    }

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      updateMarker(lat, lng);
    });
  }
});

watch(
  () => [props.lat, props.lng],
  ([newLat, newLng]) => {
    if (newLat && newLng && map) {
      if (marker) {
        marker.setLatLng([newLat as number, newLng as number]);
      } else {
        marker = L.marker([newLat as number, newLng as number]).addTo(map);
      }
      // Only pan if the map center is far away? 
      // Or just pan. Let's assume external updates should center the map.
      // But avoid re-centering if it was caused by our own click?
      // The prop update usually comes from our emit, which might cause a loop if we are not careful.
      // However, usually it's fine.
      map.setView([newLat as number, newLng as number], map.getZoom());
    }
  }
);
</script>

<style scoped>
.map-container {
  height: 300px;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #d9d9d9;
  position: relative;
}
.search-box {
  position: absolute;
  top: 10px;
  left: 50px; /* Leave space for zoom controls usually on left */
  right: 10px;
  z-index: 1000;
  max-width: 300px;
  background: rgba(255, 255, 255, 0.9);
  padding: 5px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}
#map {
  height: 100%;
  width: 100%;
  z-index: 1; 
}
</style>
