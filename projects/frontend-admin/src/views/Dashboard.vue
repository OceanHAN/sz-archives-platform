<template>
  <div class="dashboard">
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card>
          <a-statistic title="档案总数" :value="1280" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="今日预约" :value="45" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="在线展览" :value="12" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="系统访问量" :value="8920" />
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" style="margin-top: 24px;">
      <a-col :span="16">
        <a-card title="最近更新档案">
          <a-table :dataSource="recentArchives" :columns="columns" :pagination="false" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="待处理预约">
          <a-list :dataSource="pendingAppointments">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta
                  :title="item.user"
                  :description="item.time"
                />
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
const recentArchives = [
  { key: '1', code: 'SZ-2024-001', title: '关于城市规划的建议', time: '2024-01-16' },
  { key: '2', code: 'SZ-2024-002', title: '历史建筑保护名录', time: '2024-01-15' },
  { key: '3', code: 'SZ-2024-003', title: '特区早期影像资料', time: '2024-01-14' },
];

const columns = [
  { title: '档号', dataIndex: 'code', key: 'code' },
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '更新时间', dataIndex: 'time', key: 'time' },
];

const pendingAppointments = [
  { user: '张三', time: '今日 14:00' },
  { user: '李四', time: '明日 10:30' },
  { user: '王五', time: '1月18日 15:00' },
];
</script>