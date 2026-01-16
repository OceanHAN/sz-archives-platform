<template>
  <div class="mobile-container page-container">
    <van-nav-bar
      title="我的预约"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
      class="static-header"
    />

    <div class="app-shell-content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div v-for="item in appointments" :key="item.id" class="appointment-item">
            <div class="item-header">
              <span class="booking-no">单号：{{ item.booking_no }}</span>
              <span class="status-tag" :class="getStatusClass(item.status)">
                {{ getStatusText(item.status) }}
              </span>
            </div>
            <div class="item-body">
              <div class="biz-info">
                <i :class="getBizIcon(item.biz_type)"></i>
                <span class="biz-type">{{ getBizText(item.biz_type) }}</span>
              </div>
              <div class="detail-row">
                <i class="far fa-calendar-alt"></i>
                <span>{{ item.booking_date }} {{ item.time_slot }}</span>
              </div>
              <div class="detail-row">
                <i class="far fa-user"></i>
                <span>{{ item.contact_name }} ({{ item.visitor_count }}人)</span>
              </div>
            </div>
            <div class="item-footer" v-if="item.status === 0">
              <van-button size="small" round @click="handleCancel(item.id)">取消预约</van-button>
              <van-button size="small" round type="primary" color="#A83226" @click="showQRCode(item)">出示凭证</van-button>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- QR Code Modal -->
    <van-popup v-model:show="qrVisible" round :style="{ padding: '30px' }">
      <div class="qr-container">
        <h3>预约凭证</h3>
        <div class="qr-mock">
          <i class="fas fa-qrcode"></i>
        </div>
        <p class="qr-tip">请向工作人员出示此码核销</p>
        <p class="qr-no">{{ currentItem?.booking_no }}</p>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import api from '../api';
import { showConfirmDialog, showToast } from 'vant';

const appointments = ref<any[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const qrVisible = ref(false);
const currentItem = ref<any>(null);

const fetchAppointments = async () => {
  try {
    const data: any = await api.get('/appointments/my?userId=1');
    appointments.value = data;
    finished.value = true;
  } catch (e) {
    showToast('获取预约失败');
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
};

const onLoad = () => {
  fetchAppointments();
};

const onRefresh = () => {
  finished.value = false;
  loading.value = true;
  onLoad();
};

const getStatusText = (status: number) => {
  const map: any = { 0: '待使用', 1: '已完成', 2: '已取消', 3: '已过期' };
  return map[status] || '未知';
};

const getStatusClass = (status: number) => {
  const map: any = { 0: 'status-pending', 1: 'status-done', 2: 'status-cancel' };
  return map[status] || '';
};

const getBizText = (type: string) => {
  const map: any = { exhibition: '展览预约', course: '课程预约', archive: '查档预约' };
  return map[type] || type;
};

const getBizIcon = (type: string) => {
  const map: any = { exhibition: 'fas fa-images', course: 'fas fa-chalkboard-teacher', archive: 'fas fa-id-card' };
  return map[type] || 'fas fa-calendar-check';
};

const handleCancel = async (id: number) => {
  try {
    await showConfirmDialog({ title: '确认取消', message: '确定要取消此项预约吗？' });
    await api.put(`/appointments/${id}/status`, { status: 2 });
    showToast('预约已取消');
    onRefresh();
  } catch (e) {
    if (e !== 'cancel') showToast('操作失败');
  }
};

const showQRCode = (item: any) => {
  currentItem.value = item;
  qrVisible.value = true;
};
</script>

<style scoped>
.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f8fa;
}

.appointment-item {
  background: white;
  margin: 15px;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
  margin-bottom: 12px;
}

.booking-no {
  font-size: 12px;
  color: #999;
}

.status-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-pending { color: #1989fa; background: #e8f4ff; }
.status-done { color: #07c160; background: #e6faf0; }
.status-cancel { color: #999; background: #f5f5f5; }

.biz-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.biz-info i { color: #A83226; font-size: 16px; }
.biz-type { font-size: 15px; font-weight: bold; color: #333; }

.detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
}

.item-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
  padding-top: 12px;
  border-top: 1px dashed #eee;
}

.qr-container {
  text-align: center;
}

.qr-mock {
  font-size: 150px;
  color: #333;
  margin: 20px 0;
}

.qr-tip { font-size: 14px; color: #666; }
.qr-no { font-size: 12px; color: #999; margin-top: 10px; }
</style>