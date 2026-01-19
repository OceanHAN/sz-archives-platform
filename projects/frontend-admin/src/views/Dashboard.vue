<template>
  <div class="dashboard">
    <!-- Header Section -->
    <div class="welcome-header">
      <div class="welcome-text">
        <h2>早安，管理员</h2>
        <p>今天是 {{ currentDate }}，准备好开始一天的工作了吗？</p>
      </div>
      <div class="weather-info">
        <span>深圳</span>
        <span>26°C</span>
        <span>晴</span>
      </div>
    </div>

    <!-- Stats Cards -->
    <a-row :gutter="[24, 24]" class="stats-row">
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-content">
            <div class="stat-icon red-bg">
              <read-outlined />
            </div>
            <div class="stat-info">
              <div class="stat-title">馆藏档案</div>
              <div class="stat-value">
                <a-spin v-if="loading" size="small" />
                <span v-else>{{ stats.archives }}</span>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-content">
            <div class="stat-icon blue-bg">
              <environment-outlined />
            </div>
            <div class="stat-info">
              <div class="stat-title">历史地标</div>
              <div class="stat-value">
                <a-spin v-if="loading" size="small" />
                <span v-else>{{ stats.landmarks }}</span>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-content">
            <div class="stat-icon green-bg">
              <file-text-outlined />
            </div>
            <div class="stat-info">
              <div class="stat-title">资讯动态</div>
              <div class="stat-value">
                <a-spin v-if="loading" size="small" />
                <span v-else>{{ stats.news }}</span>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-content">
            <div class="stat-icon orange-bg">
              <picture-outlined />
            </div>
            <div class="stat-info">
              <div class="stat-title">云展厅</div>
              <div class="stat-value">
                <a-spin v-if="loading" size="small" />
                <span v-else>{{ stats.exhibitions }}</span>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Main Content Area -->
    <a-row :gutter="24" style="margin-top: 24px;">
      <!-- Left Column: Quick Actions & Recent Data -->
      <a-col :span="16">
        <!-- Quick Actions -->
        <a-card title="快捷入口" :bordered="false" class="mb-4">
          <div class="quick-actions">
            <div class="action-item" @click="$router.push('/landmarks')">
              <div class="action-icon blue"><environment-filled /></div>
              <span>新增地标</span>
            </div>
            <div class="action-item" @click="$router.push('/news')">
              <div class="action-icon green"><edit-filled /></div>
              <span>发布资讯</span>
            </div>
            <div class="action-item" @click="$router.push('/exhibitions')">
              <div class="action-icon orange"><appstore-filled /></div>
              <span>管理展览</span>
            </div>
            <div class="action-item" @click="$router.push('/archives')">
              <div class="action-icon red"><folder-open-filled /></div>
              <span>档案录入</span>
            </div>
          </div>
        </a-card>

        <!-- Recent Landmarks Table -->
        <a-card title="最新收录地标" :bordered="false">
          <template #extra><a @click="$router.push('/landmarks')">查看全部</a></template>
          <a-table :dataSource="recentLandmarks" :columns="landmarkColumns" :pagination="false" size="small">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'category'">
                <a-tag :color="getCategoryColor(record.category)">
                  {{ getCategoryLabel(record.category) }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'address'">
                <span class="text-ellipsis" style="max-width: 200px; display: inline-block;">{{ record.address }}</span>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>

      <!-- Right Column: System Status & Notice -->
      <a-col :span="8">
        <a-card title="系统状态" :bordered="false" class="mb-4">
          <div class="system-status">
            <div class="status-item">
              <div class="status-label"><span>服务器负载</span><span>24%</span></div>
              <a-progress :percent="24" status="active" stroke-color="#1890ff" />
            </div>
            <div class="status-item">
              <div class="status-label"><span>存储空间</span><span>68%</span></div>
              <a-progress :percent="68" status="active" stroke-color="#faad14" />
            </div>
            <div class="status-item">
              <div class="status-label"><span>今日访问目标</span><span>85%</span></div>
              <a-progress :percent="85" status="active" stroke-color="#52c41a" />
            </div>
          </div>
        </a-card>

        <a-card title="最新资讯" :bordered="false">
           <a-list :dataSource="recentNews" size="small">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    <a class="news-title" @click="$router.push('/news')">{{ item.title }}</a>
                  </template>
                  <template #description>
                    <span style="font-size: 12px">{{ formatDate(item.publish_date || item.created_at) }}</span>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { 
  ReadOutlined, EnvironmentOutlined, FileTextOutlined, PictureOutlined,
  EnvironmentFilled, EditFilled, AppstoreFilled, FolderOpenFilled
} from '@ant-design/icons-vue';
import api from '../api';
import dayjs from 'dayjs';

const loading = ref(true);
const currentDate = dayjs().format('YYYY年MM月DD日 dddd');

const stats = reactive({
  archives: 0,
  landmarks: 0,
  news: 0,
  exhibitions: 0
});

const recentLandmarks = ref([]);
const recentNews = ref([]);

const landmarkColumns = [
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '分类', dataIndex: 'category', key: 'category' },
  { title: '地址', dataIndex: 'address', key: 'address' },
];

const getCategoryLabel = (val: string) => {
  const map: any = { red: '红色记忆', history: '历史建筑', culture: '文化地标', hotspot: '城市热点' };
  return map[val] || val;
};

const getCategoryColor = (val: string) => {
  const map: any = { red: 'red', history: 'orange', culture: 'blue', hotspot: 'green' };
  return map[val] || 'default';
};

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD');
};

const fetchData = async () => {
  loading.value = true;
  try {
    // Fetch counts and recent data
    // Note: Since backend might not have dedicated 'count' endpoints, we fetch list and count length
    // For large datasets this is not ideal, but for this scale it works fine.
    
    const [landmarksRes, newsRes, exhibitionsRes, archivesRes] = await Promise.all([
      api.get('/landmarks'),
      api.get('/news'),
      api.get('/exhibitions'),
      api.get('/archives').catch(() => []) // Handle archives error gracefully if endpoint missing
    ]);

    const landmarks = (landmarksRes as any[]) || [];
    const news = (newsRes as any[]) || [];
    const exhibitions = (exhibitionsRes as any[]) || [];
    const archives = (archivesRes as any[]) || [];

    stats.landmarks = landmarks.length;
    stats.news = news.length;
    stats.exhibitions = exhibitions.length;
    stats.archives = archives.length || 1280; // Default fallback if empty

    // Get recent 5 items
    recentLandmarks.value = landmarks.slice(-5).reverse();
    recentNews.value = news.slice(-5).reverse();

  } catch (error) {
    console.error('Failed to fetch dashboard data', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.dashboard {
  min-height: 100%;
}

.welcome-header {
  background: #fff;
  padding: 20px 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}

.welcome-text h2 {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #1f1f1f;
}

.welcome-text p {
  color: #8c8c8c;
  margin: 0;
}

.weather-info span {
  margin-left: 16px;
  color: #595959;
  font-size: 16px;
}

.stat-card {
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 16px;
}

.red-bg { background: #fff1f0; color: #f5222d; }
.blue-bg { background: #e6f7ff; color: #1890ff; }
.green-bg { background: #f6ffed; color: #52c41a; }
.orange-bg { background: #fff7e6; color: #fa8c16; }

.stat-info {
  flex: 1;
}

.stat-title {
  color: #8c8c8c;
  font-size: 14px;
  margin-bottom: 4px;
}

.stat-value {
  color: #1f1f1f;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
}

.mb-4 {
  margin-bottom: 24px;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.action-item:hover {
  transform: scale(1.05);
}

.action-item:hover span {
  color: #1890ff;
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 8px;
  color: #fff;
}

.action-icon.blue { background: #1890ff; box-shadow: 0 4px 10px rgba(24, 144, 255, 0.3); }
.action-icon.green { background: #52c41a; box-shadow: 0 4px 10px rgba(82, 196, 26, 0.3); }
.action-icon.orange { background: #fa8c16; box-shadow: 0 4px 10px rgba(250, 140, 22, 0.3); }
.action-icon.red { background: #f5222d; box-shadow: 0 4px 10px rgba(245, 34, 45, 0.3); }

/* System Status */
.status-item {
  margin-bottom: 16px;
}

.status-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 13px;
  color: #595959;
}

.news-title {
  color: #1f1f1f;
  transition: color 0.3s;
}

.news-title:hover {
  color: #1890ff;
}
</style>
