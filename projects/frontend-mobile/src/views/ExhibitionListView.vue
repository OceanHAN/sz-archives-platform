<template>
  <div class="mobile-container page-container">
    <van-nav-bar
      title="展览列表"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
      :border="false"
      class="static-header"
    />
    
    <div class="app-shell-content">
      <van-tabs v-model:active="active" sticky>
        <van-tab title="云展厅">
            <div class="exhibition-list-content">
                <div 
                    v-for="item in onlineExhibitions" 
                    :key="item.id" 
                    class="exhibition-list-card"
                    @click="goToDetail(item.id)"
                >
                    <img :src="item.cover_image" class="exhibition-list-img" />
                    <div class="exhibition-list-info">
                        <h3 class="exhibition-list-title">{{ item.title }}</h3>
                        <p class="exhibition-list-desc">{{ item.summary }}</p>
                        <div class="tag" style="position: static; transform: none; display: inline-block; margin-top: 10px;">VR全景</div>
                    </div>
                </div>
            </div>
        </van-tab>
        <van-tab title="线下展览">
             <div class="exhibition-list-content">
                <div 
                    v-for="item in offlineExhibitions" 
                    :key="item.id" 
                    class="exhibition-list-card"
                    @click="goToDetail(item.id)"
                >
                    <img :src="item.cover_image" class="exhibition-list-img" />
                    <div class="exhibition-list-info">
                        <h3 class="exhibition-list-title">{{ item.title }}</h3>
                        <p class="exhibition-list-desc">{{ item.summary }}</p>
                        <div class="tag" style="position: static; transform: none; display: inline-block; margin-top: 10px; background: #A83226;">常设展览</div>
                    </div>
                </div>
            </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getExhibitions, type ExhibitionItem } from '../api/exhibition';

/**
 * 展览列表页面
 * Exhibition List View
 */
const active = ref(0);
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

const onlineExhibitions = computed(() => exhibitions.value.filter(e => e.type === 'virtual'));
const offlineExhibitions = computed(() => exhibitions.value.filter(e => e.type === 'physical'));

const goToDetail = (id: number) => {
    router.push(`/exhibition-detail/${id}`);
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

/* Reuse global styles from styles.css where possible, but scoped here for specifics if needed */
.exhibition-list-content {
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

.exhibition-list-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
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
}

.tag {
    color: white;
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 4px;
    background: #5d4037;
}
</style>