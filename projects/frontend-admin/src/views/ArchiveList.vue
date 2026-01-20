<template>
  <div class="archive-list">
    <div class="table-operations">
      <a-space>
        <a-input-search
          v-model:value="searchText"
          placeholder="搜索档案标题或档号"
          style="width: 300px"
          @search="onSearch"
        />
        <a-button type="primary" @click="showAddModal">
          <template #icon><plus-outlined /></template>
          新增档案
        </a-button>
      </a-space>
    </div>

    <a-table 
      :columns="columns" 
      :data-source="archives" 
      :loading="loading"
      style="margin-top: 16px"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="editRecord(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗？" @confirm="deleteRecord(record.id)">
              <a class="ant-btn-link-danger">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
        <template v-else-if="column.key === 'is_open'">
          <a-tag :color="record.is_open ? 'green' : 'red'">
            {{ record.is_open ? '公开' : '内部' }}
          </a-tag>
        </template>
      </template>
    </a-table>

    <!-- Modal for Add/Edit -->
    <a-modal
      v-model:open="modalVisible"
      :title="editingId ? '编辑档案' : '新增档案'"
      @ok="handleModalOk"
    >
      <a-form :model="formState" layout="vertical">
        <a-form-item label="档号" required>
          <a-input v-model:value="formState.archive_code" />
        </a-form-item>
        <a-form-item label="标题" required>
          <a-input v-model:value="formState.title" />
        </a-form-item>
        <a-form-item label="年度">
          <a-input v-model:value="formState.year" />
        </a-form-item>
        <a-form-item label="是否公开">
          <a-switch v-model:checked="formState.is_open" />
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
const archives = ref([]);
const searchText = ref('');
const modalVisible = ref(false);
const editingId = ref<number | null>(null);

const formState = reactive({
  archive_code: '',
  title: '',
  year: '',
  is_open: true
});

const columns = [
  { title: '档号', dataIndex: 'archive_code', key: 'archive_code' },
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '年度', dataIndex: 'year', key: 'year' },
  { title: '状态', dataIndex: 'is_open', key: 'is_open' },
  { title: '操作', key: 'action' },
];

const fetchArchives = async () => {
  loading.value = true;
  try {
    const data: any = await api.get(`/archives/search?q=${searchText.value}`);
    archives.value = data;
  } catch (e) {
    message.error('获取档案失败');
  } finally {
    loading.value = false;
  }
};

const onSearch = () => {
  fetchArchives();
};

const showAddModal = () => {
  editingId.value = null;
  Object.assign(formState, { archive_code: '', title: '', year: '', is_open: true });
  modalVisible.value = true;
};

const editRecord = (record: any) => {
  editingId.value = record.id;
  Object.assign(formState, { ...record });
  modalVisible.value = true;
};

const deleteRecord = async (_id: number) => {
  // In a real app, call delete API
  message.success('模拟删除成功');
  fetchArchives();
};

const handleModalOk = () => {
  // In a real app, call save/update API
  message.success(editingId.value ? '修改成功' : '新增成功');
  modalVisible.value = false;
  fetchArchives();
};

onMounted(() => {
  fetchArchives();
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
