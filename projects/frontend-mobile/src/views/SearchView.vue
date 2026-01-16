<template>
  <div class="mobile-container search-page">
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
    <header class="page-header search-header">
      <i class="fas fa-chevron-left back-icon" @click="$router.back()"></i>
      <h1>档案检索</h1>
      <div class="placeholder"></div>
    </header>

    <!-- Search Section -->
    <div class="app-shell-content">
      <!-- Search Input Container -->
      <div class="search-input-container" :class="{ 'compact': results.length > 0 }">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="keyword" 
            placeholder="请输入查询关键词" 
            @keyup.enter="handleSearch"
          >
          <span v-if="keyword" class="clear-btn" @click="clearSearch">清除</span>
        </div>
      </div>

      <!-- Archive Selection (Only show when no results) -->
      <div v-if="results.length === 0" class="archive-list-container">
        <!-- Main Archive -->
        <div 
          class="archive-btn" 
          :class="{ active: selectedArchives.includes('sz') }"
          @click="toggleArchive('sz')"
        >深圳市档案馆</div>

        <!-- District Archives Grid -->
        <div class="archive-grid">
          <div 
            v-for="dist in districts" 
            :key="dist.id"
            class="archive-btn" 
            :class="{ active: selectedArchives.includes(dist.id) }"
            @click="toggleArchive(dist.id)"
          >{{ dist.name }}</div>
          <div 
            class="archive-btn" 
            :class="{ active: selectedArchives.length === 0 }"
            @click="selectedArchives = []"
          >全部</div>
        </div>
      </div>

      <!-- Results List -->
      <div v-else class="result-list-container">
        <!-- Result Stats & Secondary Search -->
        <div class="result-meta-container">
          <p class="result-count">共为您找到相关档案 <span class="count-num">{{ results.length }}</span> 条</p>
          
          <div class="secondary-search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="secondaryKeyword" 
              placeholder="在结果中二次检索"
              @keyup.enter="handleSecondarySearch"
            >
            <button class="secondary-search-btn" @click="handleSecondarySearch">检索</button>
          </div>
        </div>

        <div 
          class="result-card" 
          v-for="item in filteredResults" 
          :key="item.id"
          @click="goToDetail(item.id)"
        >
          <div class="card-header">
            <span class="archive-code">档号：{{ item.archive_code }}</span>
            <i class="far fa-copy copy-icon" @click.stop="copyCode(item.archive_code)"></i>
          </div>
          <h3 class="card-title" v-html="formatTitle(item.title)"></h3>
          <div class="card-meta-grid">
            <div class="meta-item"><span>年度：</span>{{ item.year || '1980' }}</div>
            <div class="meta-item"><span>分类：</span>{{ item.category_id || '文书档案' }}</div>
            <div class="meta-item"><span>开放：</span>{{ item.is_open ? '是' : '否' }}</div>
            <div class="meta-item"><span>存址：</span>深圳市档案馆</div>
          </div>
          <div class="card-footer" v-if="item.pdf_url">
            <span class="pdf-tag"><i class="far fa-file-pdf"></i> 可查阅电子版</span>
          </div>
        </div>

        <div class="pagination-container" v-if="filteredResults.length > 0">
          <button class="page-btn" disabled>上一页</button>
          <span class="page-info">1 / 1</span>
          <button class="page-btn" disabled>下一页</button>
        </div>

        <div v-if="filteredResults.length === 0" class="no-secondary-results">
          <i class="fas fa-exclamation-circle"></i>
          <p>在当前结果中未找到相关档案</p>
          <button class="text-btn" @click="secondaryKeyword = ''">清除二次检索</button>
        </div>
      </div>
    </div>

    <!-- Bottom Search Button (Only show when no results) -->
    <div v-if="results.length === 0" class="bottom-action-container">
      <button 
        class="search-action-btn" 
        :class="{ 'loading': loading }"
        :style="{ 
          backgroundColor: (keyword.trim() && !loading) ? 'var(--primary-red)' : '#A9A9A9',
          opacity: loading ? 0.8 : 1
        }"
        @click="handleSearch"
        :disabled="!keyword.trim() || loading"
      >
        <i v-if="loading" class="fas fa-circle-notch fa-spin" style="margin-right: 8px;"></i>
        {{ loading ? '搜索中...' : '搜索' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { searchArchives, type ArchiveItem } from '../api/archive';
import { showToast } from 'vant';

const router = useRouter();
const keyword = ref('');
const secondaryKeyword = ref('');
const selectedArchives = ref<string[]>(['sz']);
const results = ref<ArchiveItem[]>([]);

const districts = [
  { id: 'ft', name: '福田区档案馆' },
  { id: 'lh', name: '罗湖区档案馆' },
  { id: 'ns', name: '南山区档案馆' },
  { id: 'yt', name: '盐田区档案馆' },
  { id: 'ba', name: '宝安区档案馆' },
  { id: 'lg', name: '龙岗区档案馆' },
  { id: 'lhq', name: '龙华区档案馆' },
  { id: 'ps', name: '坪山区档案馆' },
  { id: 'gm', name: '光明区档案馆' },
  { id: 'dp', name: '大鹏新区档案馆' }
];

const filteredResults = computed(() => {
  if (!secondaryKeyword.value.trim()) return results.value;
  const k = secondaryKeyword.value.trim().toLowerCase();
  return results.value.filter(item => 
    item.title.toLowerCase().includes(k) || 
    item.archive_code.toLowerCase().includes(k)
  );
});

const toggleArchive = (id: string) => {
  const index = selectedArchives.value.indexOf(id);
  if (index > -1) {
    selectedArchives.value.splice(index, 1);
  } else {
    selectedArchives.value.push(id);
  }
};

const loading = ref(false);

const handleSearch = async () => {
  const k = keyword.value.trim();
  if (!k || loading.value) return;
  
  loading.value = true;
  try {
    // Simulate network delay for better UX feel
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const data = await searchArchives(k);
    results.value = data;
    secondaryKeyword.value = ''; // Clear secondary search on new primary search
  } catch (e) {
    console.error('Search failed', e);
  } finally {
    loading.value = false;
  }
};

const handleSecondarySearch = () => {
  // Logic is handled by computed property
  console.log('Secondary search for:', secondaryKeyword.value);
};

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code);
  showToast('档号已复制');
};

const clearSearch = () => {
  keyword.value = '';
  results.value = [];
  secondaryKeyword.value = '';
};

const formatTitle = (title: string) => {
  let formatted = title;
  
  // Highlight primary keyword
  if (keyword.value) {
    const reg = new RegExp(`(${keyword.value})`, 'gi');
    formatted = formatted.replace(reg, '<span class="highlight">$1</span>');
  }
  
  // Highlight secondary keyword if present
  if (secondaryKeyword.value) {
    const reg2 = new RegExp(`(${secondaryKeyword.value})`, 'gi');
    formatted = formatted.replace(reg2, '<span class="highlight-secondary">$1</span>');
  }
  
  return formatted;
};

const goToDetail = (id: number) => {
  router.push(`/archive-detail/${id}`);
};
</script>

<style scoped>
/* Scoped styles to complement global styles in styles.css */
.search-page {
  position: relative;
  overflow: hidden;
}

.search-header {
  top: 0;
  margin-bottom: 0;
  background: transparent;
}

.app-shell-content {
  padding-top: 0;
}

/* Ensure the result list has enough scrolling space */
.result-list-container {
  padding-bottom: 40px;
}

.search-action-btn:active {
  transform: scale(0.98);
  filter: brightness(0.9);
}

.search-action-btn:disabled {
  cursor: not-allowed;
}

/* Results Display */
.result-meta-container {
  padding: 15px 15px 10px;
  background: white;
  margin-bottom: 10px;
}

.result-count {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
}

.count-num {
  color: var(--primary-red);
  font-weight: bold;
}

.secondary-search-box {
  display: flex;
  background: #F5F5F5;
  border-radius: 20px;
  padding: 5px 5px 5px 15px;
  align-items: center;
}

.secondary-search-box i {
  color: #999;
  font-size: 14px;
  margin-right: 8px;
}

.secondary-search-box input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 13px;
}

.secondary-search-btn {
  background: white;
  border: 1px solid #ddd;
  color: #666;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 15px;
  margin-left: 5px;
}

.result-card {
  background: white;
  margin: 0 15px 15px;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.archive-code {
  font-size: 12px;
  color: #999;
  background: #F9F9F9;
  padding: 2px 8px;
  border-radius: 4px;
}

.copy-icon {
  color: #ccc;
  font-size: 14px;
}

.card-title {
  font-size: 16px;
  color: #333;
  line-height: 1.4;
  margin-bottom: 12px;
  font-weight: bold;
}

.card-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  font-size: 12px;
  color: #666;
  border-top: 1px solid #F0F0F0;
  padding-top: 10px;
}

.meta-item span {
  color: #999;
}

.card-footer {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed #eee;
}

.pdf-tag {
  font-size: 11px;
  color: var(--primary-teal);
  background: rgba(47, 123, 110, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.no-secondary-results {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.no-secondary-results i {
  font-size: 40px;
  margin-bottom: 10px;
}

.text-btn {
  background: none;
  border: none;
  color: var(--primary-red);
  font-size: 14px;
  margin-top: 10px;
  text-decoration: underline;
}

.highlight {
  color: var(--primary-red);
  font-weight: bold;
}

.highlight-secondary {
  color: var(--primary-gold);
  background: rgba(197, 160, 101, 0.1);
  padding: 0 2px;
  border-radius: 2px;
}

.card-title :deep(.highlight) {
  color: var(--primary-red);
}

.card-title :deep(.highlight-secondary) {
  color: var(--primary-gold);
}
</style>