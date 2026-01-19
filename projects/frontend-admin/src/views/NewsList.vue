<template>
  <div class="news-list">
    <div class="table-operations">
      <a-button type="primary" @click="showAddModal">
        <template #icon><plus-outlined /></template>
        发布新资讯
      </a-button>
    </div>

    <a-table :columns="columns" :data-source="newsList" :loading="loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'cover'">
          <img v-if="record.cover_image" :src="record.cover_image" style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px;" />
          <span v-else>无封面</span>
        </template>
        <template v-else-if="column.key === 'publish_time'">
          {{ dayjs(record.publish_time).format('YYYY-MM-DD HH:mm') }}
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
      :title="editingId ? '编辑资讯' : '发布新资讯'"
      width="800px"
      @ok="handleModalOk"
    >
      <a-form :model="formState" layout="vertical">
        <a-form-item label="标题" required>
          <a-input v-model:value="formState.title" />
        </a-form-item>
        <a-form-item label="封面图片">
          <a-upload
            name="file"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="http://localhost:3000/upload"
            :before-upload="beforeUpload"
            @change="handleUpload"
          >
            <img v-if="formState.cover_image" :src="formState.cover_image" alt="avatar" style="width: 100%" />
            <div v-else>
              <loading-outlined v-if="uploading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="摘要" required>
          <a-textarea v-model:value="formState.summary" :rows="3" />
        </a-form-item>
        <a-form-item label="发布时间">
          <a-date-picker v-model:value="formState.publish_time" show-time />
        </a-form-item>
        <a-form-item label="正文" required>
          <div style="height: 400px; border: 1px solid #ccc; overflow-y: auto;">
            <QuillEditor
              v-model:content="formState.content"
              contentType="html"
              toolbar="full"
              style="height: 350px"
            />
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import api from '../api';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// Business logic
const loading = ref(false);
const newsList = ref([]);
const modalVisible = ref(false);
const editingId = ref<number | null>(null);
const uploading = ref(false);

const formState = reactive({
  title: '',
  cover_image: '',
  summary: '',
  content: '',
  publish_time: dayjs(),
});

const columns = [
  { title: '封面', key: 'cover' },
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '发布时间', key: 'publish_time' },
  { title: '操作', key: 'action' },
];

const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const handleUpload = async (info: any) => {
  if (info.file.status === 'uploading') {
    uploading.value = true;
    return;
  }
  
  if (info.file.status === 'done') {
    uploading.value = false;
    if (info.file.response && info.file.response.url) {
      formState.cover_image = info.file.response.url;
      message.success('上传成功');
    }
  }
  
  if (info.file.status === 'error') {
    uploading.value = false;
    message.error('上传失败');
  }
};

const fetchNews = async () => {
  loading.value = true;
  try {
    const data: any = await api.get('/news');
    newsList.value = data;
  } catch (e) {
    message.error('获取资讯失败');
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
    content: '',
    publish_time: dayjs(),
  });
  modalVisible.value = true;
};

const editRecord = (record: any) => {
  editingId.value = record.id;
  Object.assign(formState, { 
    ...record,
    publish_time: dayjs(record.publish_time)
  });
  modalVisible.value = true;
};

const deleteRecord = async (id: number) => {
  try {
    await api.delete(`/news/${id}`);
    message.success('已删除');
    fetchNews();
  } catch (e) {
    message.error('删除失败');
  }
};

const handleModalOk = async () => {
  try {
    const data = {
      ...formState,
      publish_time: formState.publish_time.toDate(),
    };
    
    if (editingId.value) {
      await api.patch(`/news/${editingId.value}`, data);
      message.success('修改成功');
    } else {
      await api.post('/news', data);
      message.success('发布成功');
    }
    modalVisible.value = false;
    fetchNews();
  } catch (e) {
    message.error('操作失败');
  }
};

onMounted(() => {
  fetchNews();
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
