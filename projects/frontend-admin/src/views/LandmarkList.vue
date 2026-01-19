<template>
  <div class="landmark-list">
    <div class="table-operations">
      <a-button type="primary" @click="showAddModal">
        <template #icon><plus-outlined /></template>
        新增地标
      </a-button>
    </div>

    <a-table :columns="columns" :data-source="landmarks" :loading="loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'cover'">
          <img v-if="record.cover_image" :src="record.cover_image" style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px;" />
          <span v-else>无封面</span>
        </template>
        <template v-else-if="column.key === 'category'">
          <a-tag :color="getCategoryColor(record.category)">
            {{ getCategoryLabel(record.category) }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'coordinates'">
          {{ record.latitude.toFixed(4) }}, {{ record.longitude.toFixed(4) }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a @click="editRecord(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗？" @confirm="deleteRecord(record.id)">
              <a class="ant-btn-link-danger">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- Modal for Add/Edit -->
    <a-modal
      v-model:open="modalVisible"
      :title="editingId ? '编辑地标' : '新增地标'"
      width="900px"
      @ok="handleModalOk"
      :confirmLoading="submitting"
    >
      <a-form :model="formState" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="地标名称" required>
              <a-input v-model:value="formState.name" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="分类" required>
              <a-select v-model:value="formState.category">
                <a-select-option value="red">红色记忆</a-select-option>
                <a-select-option value="history">历史建筑</a-select-option>
                <a-select-option value="culture">文化地标</a-select-option>
                <a-select-option value="hotspot">城市热点</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="地理位置 (点击地图选择)">
          <MapPicker 
            v-if="modalVisible"
            v-model:lat="formState.latitude" 
            v-model:lng="formState.longitude" 
          />
          <div style="margin-top: 8px;">
            经度: {{ formState.longitude }} , 纬度: {{ formState.latitude }}
          </div>
        </a-form-item>

        <a-form-item label="地址">
          <a-input v-model:value="formState.address" />
        </a-form-item>

        <a-form-item label="封面图片">
          <a-input v-model:value="formState.cover_image" placeholder="图片URL" />
        </a-form-item>

        <a-form-item label="简介">
          <a-textarea v-model:value="formState.summary" :rows="2" />
        </a-form-item>

        <a-divider>历史沿革 / 大事记</a-divider>
        
        <div class="events-section">
          <div v-for="(event, index) in formState.events" :key="index" class="event-item">
            <div class="event-header">
              <span class="event-index">#{{ index + 1 }}</span>
              <a-button type="link" danger size="small" @click="removeEvent(index)">删除</a-button>
            </div>
            <a-row :gutter="12">
              <a-col :span="6">
                <a-input v-model:value="event.year" placeholder="年份 (如1925)" />
              </a-col>
              <a-col :span="18">
                <a-input v-model:value="event.title" placeholder="事件标题" />
              </a-col>
            </a-row>
            <div style="margin-top: 8px;">
              <a-textarea v-model:value="event.description" placeholder="事件详情描述" :rows="2" />
            </div>
            <div style="margin-top: 8px;">
              <a-input v-model:value="event.image" placeholder="事件配图URL" size="small" />
            </div>
          </div>
          
          <a-button type="dashed" block @click="addEvent">
            <plus-outlined /> 添加历史事件
          </a-button>
        </div>

      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import api from '../api';
import { message } from 'ant-design-vue';
import MapPicker from '../components/MapPicker.vue';

const loading = ref(false);
const submitting = ref(false);
const landmarks = ref([]);
const modalVisible = ref(false);
const editingId = ref<number | null>(null);

const formState = reactive({
  name: '',
  address: '',
  category: 'red',
  latitude: 22.543099,
  longitude: 114.057868,
  summary: '',
  cover_image: '',
  sort_order: 0,
  events: [] as any[],
});

const columns = [
  { title: '封面', key: 'cover' },
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '分类', key: 'category' },
  { title: '坐标', key: 'coordinates' },
  { title: '操作', key: 'action' },
];

const getCategoryLabel = (val: string) => {
  const map: any = { red: '红色记忆', history: '历史建筑', culture: '文化地标', hotspot: '城市热点' };
  return map[val] || val;
};

const getCategoryColor = (val: string) => {
  const map: any = { red: 'red', history: 'orange', culture: 'blue', hotspot: 'green' };
  return map[val] || 'default';
};

const fetchLandmarks = async () => {
  loading.value = true;
  try {
    const data: any = await api.get('/landmarks');
    landmarks.value = data;
  } catch (e) {
    message.error('获取地标失败');
  } finally {
    loading.value = false;
  }
};

const showAddModal = () => {
  editingId.value = null;
  Object.assign(formState, {
    name: '',
    address: '',
    category: 'red',
    latitude: 22.543099,
    longitude: 114.057868,
    summary: '',
    cover_image: '',
    sort_order: 0,
    events: [],
  });
  modalVisible.value = true;
};

const editRecord = async (record: any) => {
  editingId.value = record.id;
  // Need to fetch full details including events
  try {
    const fullData: any = await api.get(`/landmarks/${record.id}`);
    Object.assign(formState, fullData);
  } catch (e) {
    message.error('加载详情失败');
  }
  modalVisible.value = true;
};

const deleteRecord = async (id: number) => {
  try {
    await api.delete(`/landmarks/${id}`);
    message.success('已删除');
    fetchLandmarks();
  } catch (e) {
    message.error('删除失败');
  }
};

const addEvent = () => {
  formState.events.push({
    year: '',
    title: '',
    description: '',
    image: '',
  });
};

const removeEvent = (index: number) => {
  formState.events.splice(index, 1);
};

const handleModalOk = async () => {
  submitting.value = true;
  try {
    if (editingId.value) {
      await api.patch(`/landmarks/${editingId.value}`, formState);
      message.success('修改成功');
    } else {
      await api.post('/landmarks', formState);
      message.success('添加成功');
    }
    modalVisible.value = false;
    fetchLandmarks();
  } catch (e) {
    message.error('操作失败');
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  fetchLandmarks();
});
</script>

<style scoped>
.table-operations {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}
.ant-btn-link-danger {
  color: #ff4d4f;
}
.events-section {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
}
.event-item {
  background: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}
.event-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.event-index {
  font-weight: bold;
  color: #999;
}
</style>
