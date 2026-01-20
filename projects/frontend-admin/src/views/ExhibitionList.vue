<template>
  <div class="exhibition-list">
    <div class="table-operations">
      <a-button type="primary" @click="showAddModal">
        <template #icon><plus-outlined /></template>
        发布新展览
      </a-button>
    </div>

    <a-table :columns="columns" :data-source="exhibitions" :loading="loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'cover'">
          <img :src="record.cover_image" style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px;" />
        </template>
        <template v-else-if="column.key === 'type'">
          <a-tag :color="record.type === 'virtual' ? 'blue' : 'purple'">
            {{ record.type === 'virtual' ? '虚拟展厅' : '实地展览' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a @click="editRecord(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定下架吗？" @confirm="deleteRecord(record.id)">
              <a class="ant-btn-link-danger">下架</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- Modal for Add/Edit -->
    <a-modal
      v-model:open="modalVisible"
      :title="editingId ? '编辑展览' : '发布新展览'"
      @ok="handleModalOk"
    >
      <a-form :model="formState" layout="vertical">
        <a-form-item label="名称" required>
          <a-input v-model:value="formState.title" />
        </a-form-item>
        <a-form-item label="封面图片地址" required>
          <a-input v-model:value="formState.cover_image" placeholder="https://..." />
        </a-form-item>
        <a-form-item label="简介" required>
          <a-textarea v-model:value="formState.summary" :rows="3" />
        </a-form-item>
        <a-form-item label="类型">
          <a-radio-group v-model:value="formState.type">
            <a-radio value="virtual">虚拟展厅</a-radio>
            <a-radio value="physical">实地展览</a-radio>
          </a-radio-group>
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
const exhibitions = ref([]);
const modalVisible = ref(false);
const editingId = ref<number | null>(null);

const formState = reactive({
  title: '',
  cover_image: '',
  summary: '',
  type: 'virtual',
  sort_order: 0,
});

const columns = [
  { title: '封面', key: 'cover' },
  { title: '名称', dataIndex: 'title', key: 'title' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '排序', dataIndex: 'sort_order', key: 'sort_order' },
  { title: '操作', key: 'action' },
];

const fetchExhibitions = async () => {
  loading.value = true;
  try {
    const data: any = await api.get('/exhibitions');
    exhibitions.value = data;
  } catch (e) {
    message.error('获取展览失败');
  } finally {
    loading.value = false;
  }
};

const showAddModal = () => {
  editingId.value = null;
  Object.assign(formState, {
    title: '',
    cover_image: '',
    summary: '',
    type: 'virtual',
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
    await api.delete(`/exhibitions/${id}`);
    message.success('已成功下架');
    fetchExhibitions();
  } catch (e) {
    message.error('下架失败');
  }
};

const handleModalOk = async () => {
  try {
    if (editingId.value) {
      await api.put(`/exhibitions/${editingId.value}`, formState);
      message.success('修改成功');
    } else {
      await api.post('/exhibitions', formState);
      message.success('发布成功');
    }
    modalVisible.value = false;
    fetchExhibitions();
  } catch (e) {
    message.error('操作失败');
  }
};

onMounted(() => {
  fetchExhibitions();
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
