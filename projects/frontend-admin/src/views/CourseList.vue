<template>
  <div class="course-list">
    <div class="table-operations">
      <a-button type="primary" @click="showAddModal">
        <template #icon><PlusOutlined /></template>
        发布新课程
      </a-button>
    </div>

    <a-table :columns="columns" :data-source="courses" :loading="loading" style="margin-top: 16px">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'cover'">
          <img :src="record.cover_image" style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px;" />
        </template>
        <template v-else-if="column.key === 'video'">
          <a :href="record.video_url" target="_blank" rel="noopener noreferrer">预览视频</a>
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
      :title="editingId ? '编辑课程' : '发布新课程'"
      @ok="handleModalOk"
    >
      <a-form :model="formState" layout="vertical">
        <a-form-item label="课程标题" required>
          <a-input v-model:value="formState.title" />
        </a-form-item>
        <a-form-item label="副标题/讲师">
          <a-input v-model:value="formState.subtitle" placeholder="例如：主讲人：张教授" />
        </a-form-item>
        <a-form-item label="封面图片" required>
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
        <a-form-item label="视频链接" required>
          <a-input v-model:value="formState.video_url" placeholder="https://...mp4" />
        </a-form-item>
        <a-form-item label="时长(秒)">
          <a-input-number v-model:value="formState.duration" :min="0" />
        </a-form-item>
        <a-form-item label="发布日期" required>
          <a-date-picker v-model:value="formState.publish_date" value-format="YYYY-MM-DD" style="width: 100%" />
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

const loading = ref(false);
const courses = ref([]);
const modalVisible = ref(false);
const editingId = ref<number | null>(null);
const uploading = ref(false);

const formState = reactive({
  title: '',
  subtitle: '',
  cover_image: '',
  video_url: '',
  duration: 0,
  publish_date: dayjs().format('YYYY-MM-DD'),
});

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
    // Get this url from response in real world.
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

const columns = [
  { title: '封面', key: 'cover' },
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '副标题', dataIndex: 'subtitle', key: 'subtitle' },
  { title: '发布日期', dataIndex: 'publish_date', key: 'publish_date' },
  { title: '视频', key: 'video' },
  { title: '操作', key: 'action' },
];

const fetchCourses = async () => {
  loading.value = true;
  try {
    const data: any = await api.get('/courses');
    courses.value = data;
  } catch (e) {
    message.error('获取课程失败');
  } finally {
    loading.value = false;
  }
};

const showAddModal = () => {
  editingId.value = null;
  Object.assign(formState, {
    title: '',
    subtitle: '',
    cover_image: '',
    video_url: '',
    duration: 0,
    publish_date: dayjs().format('YYYY-MM-DD'),
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
    await api.delete(`/courses/${id}`);
    message.success('删除成功');
    fetchCourses();
  } catch (e) {
    message.error('删除失败');
  }
};

const handleModalOk = async () => {
  try {
    if (editingId.value) {
      await api.put(`/courses/${editingId.value}`, formState);
      message.success('修改成功');
    } else {
      await api.post('/courses', formState);
      message.success('发布成功');
    }
    modalVisible.value = false;
    fetchCourses();
  } catch (e) {
    message.error('操作失败');
  }
};

onMounted(() => {
  fetchCourses();
});
</script>
