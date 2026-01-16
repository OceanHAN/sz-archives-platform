<template>
  <div class="appointment-list">
    <div class="table-operations">
      <a-space>
        <a-radio-group v-model:value="bizTypeFilter" @change="fetchAppointments">
          <a-radio-button value="">全部</a-radio-button>
          <a-radio-button value="exhibition">展览预约</a-radio-button>
          <a-radio-button value="course">课程预约</a-radio-button>
          <a-radio-button value="archive">查档预约</a-radio-button>
        </a-radio-group>
        <a-select
          v-model:value="statusFilter"
          placeholder="状态过滤"
          style="width: 120px"
          @change="fetchAppointments"
        >
          <a-select-option :value="undefined">全部状态</a-select-option>
          <a-select-option :value="0">待处理</a-select-option>
          <a-select-option :value="1">已完成</a-select-option>
          <a-select-option :value="2">已取消</a-select-option>
        </a-select>
      </a-space>
    </div>

    <a-table 
      :columns="columns" 
      :data-source="appointments" 
      :loading="loading"
      style="margin-top: 16px"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'biz_type'">
          <a-tag :color="getBizTypeColor(record.biz_type)">
            {{ getBizTypeLabel(record.biz_type) }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-badge :status="getStatusBadge(record.status)" :text="getStatusLabel(record.status)" />
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a v-if="record.status === 0" @click="handleStatusChange(record.id, 1)">核销完成</a>
            <a-divider v-if="record.status === 0" type="vertical" />
            <a v-if="record.status === 0" class="ant-btn-link-danger" @click="handleStatusChange(record.id, 2)">取消</a>
            <span v-else>-</span>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';
import { message } from 'ant-design-vue';

const loading = ref(false);
const appointments = ref([]);
const bizTypeFilter = ref('');
const statusFilter = ref<number | undefined>(undefined);

const columns = [
  { title: '预约单号', dataIndex: 'booking_no', key: 'booking_no' },
  { title: '业务类型', dataIndex: 'biz_type', key: 'biz_type' },
  { title: '联系人', dataIndex: 'contact_name', key: 'contact_name' },
  { title: '手机号', dataIndex: 'contact_phone', key: 'contact_phone' },
  { title: '日期', dataIndex: 'booking_date', key: 'booking_date' },
  { title: '时间段', dataIndex: 'time_slot', key: 'time_slot' },
  { title: '人数', dataIndex: 'visitor_count', key: 'visitor_count' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action' },
];

const fetchAppointments = async () => {
  loading.value = true;
  try {
    let url = '/appointments?';
    if (bizTypeFilter.value) url += `biz_type=${bizTypeFilter.value}&`;
    if (statusFilter.value !== undefined) url += `status=${statusFilter.value}&`;
    
    const data: any = await api.get(url);
    appointments.value = data;
  } catch (e) {
    message.error('获取预约列表失败');
  } finally {
    loading.value = false;
  }
};

const handleStatusChange = async (id: number, status: number) => {
  try {
    await api.put(`/appointments/${id}/status`, { status });
    message.success('操作成功');
    fetchAppointments();
  } catch (e) {
    message.error('操作失败');
  }
};

const getBizTypeLabel = (type: string) => {
  const map: any = {
    exhibition: '展览预约',
    course: '课程预约',
    archive: '查档预约'
  };
  return map[type] || type;
};

const getBizTypeColor = (type: string) => {
  const map: any = {
    exhibition: 'blue',
    course: 'purple',
    archive: 'orange'
  };
  return map[type] || 'default';
};

const getStatusLabel = (status: number) => {
  const map: any = {
    0: '待处理',
    1: '已完成',
    2: '已取消',
    3: '已过期'
  };
  return map[status] || '未知';
};

const getStatusBadge = (status: number) => {
  const map: any = {
    0: 'processing',
    1: 'success',
    2: 'error',
    3: 'default'
  };
  return map[status] || 'default';
};

onMounted(() => {
  fetchAppointments();
});
</script>

<style scoped>
.table-operations {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
}
.ant-btn-link-danger {
  color: #ff4d4f;
}
</style>