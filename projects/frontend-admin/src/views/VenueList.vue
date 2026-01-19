<template>
  <div class="venue-list">
    <div class="table-operations">
      <a-button type="primary" @click="showAddModal">
        <template #icon><plus-outlined /></template>
        添加线下展馆
      </a-button>
    </div>

    <a-table :columns="columns" :data-source="venues" :loading="loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'cover'">
          <img :src="record.cover_image" style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px;" />
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag :color="record.status ? 'green' : 'red'">
            {{ record.status ? '开放中' : '已关闭' }}
          </a-tag>
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
      v-model:visible="modalVisible"
      :title="editingId ? '编辑展馆' : '添加线下展馆'"
      @ok="handleModalOk"
    >
      <a-form :model="formState" layout="vertical">
        <a-form-item label="展馆名称" required>
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="封面图片地址" required>
          <a-input v-model:value="formState.cover_image" placeholder="https://..." />
        </a-form-item>
        <a-form-item label="描述" required>
          <a-textarea v-model:value="formState.description" :rows="3" />
        </a-form-item>
        <a-form-item label="预约限额 (每场)" required>
          <a-input-number v-model:value="formState.capacity" :min="1" />
        </a-form-item>
        <a-form-item label="状态">
          <a-switch v-model:checked="formState.status" checked-children="开放" un-checked-children="关闭" />
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number v-model:value="formState.sort_order" :min="0" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import api from '../api';
import { message } from 'ant-design-vue';

const loading = ref(false);
const venues = ref([]);
const modalVisible = ref(false);
const editingId = ref<number | null>(null);

const formState = reactive({
  name: '',
  cover_image: '',
  description: '',
  capacity: 50,
  status: true,
  sort_order: 0,
});

const columns = [
  { title: '封面', key: 'cover' },
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '容纳人数', dataIndex: 'capacity', key: 'capacity' },
  { title: '状态', key: 'status' },
  { title: '排序', dataIndex: 'sort_order', key: 'sort_order' },
  { title: '操作', key: 'action' },
];

const fetchVenues = async () => {
  loading.value = true;
  try {
    const data: any = await api.get('/venues');
    venues.value = data;
  } catch (e) {
    message.error('获取展馆列表失败');
  } finally {
    loading.value = false;
  }
};

const showAddModal = () => {
  editingId.value = null;
  Object.assign(formState, {
    name: '',
    cover_image: '',
    description: '',
    capacity: 50,
    status: true,
    sort_order: 0,
  });
  modalVisible.value = true;
};

const editRecord = (record: any) => {
  editingId.value = record.id;
  Object.assign(formState, { ...record });
  modalVisible.value = true;
};

const deleteRecord = async (id: number) => {
  try {
    await api.delete(`/venues/${id}`);
    message.success('已删除');
    fetchVenues();
  } catch (e) {
    message.error('删除失败');
  }
};

const handleModalOk = async () => {
  try {
    if (editingId.value) {
      await api.patch(`/venues/${editingId.value}`, formState);
      message.success('修改成功');
    } else {
      await api.post('/venues', formState);
      message.success('添加成功');
    }
    modalVisible.value = false;
    fetchVenues();
  } catch (e) {
    message.error('操作失败');
  }
};

onMounted(() => {
  fetchVenues();
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
</style>
