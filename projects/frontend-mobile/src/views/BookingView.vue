<template>
  <div class="booking-view">
    <!-- Header -->
    <div class="header">
      <div class="back-btn" @click="$router.back()">
        <van-icon name="arrow-left" />
      </div>
      <div class="title">{{ pageTitle }}</div>
    </div>

    <!-- Scrollable Content -->
    <div class="scroll-content">
      <!-- Date Selector (Calendar Strip) -->
      <div class="section-title">选择日期</div>
      <div class="date-strip">
        <div 
          v-for="date in dateList" 
          :key="date.full"
          class="date-item"
          :class="{ active: selectedDate === date.full, disabled: !date.available }"
          @click="date.available && (selectedDate = date.full)"
        >
          <div class="weekday">{{ date.weekday }}</div>
          <div class="day">{{ date.day }}</div>
        </div>
      </div>

      <!-- Venue/Exhibition Selection -->
      <div class="section-title">选择展览/展馆</div>
      <div class="venue-grid">
        <div 
          v-for="venue in venues" 
          :key="venue.id"
          class="venue-card"
          :class="{ active: selectedVenueId === venue.id }"
          @click="selectedVenueId = venue.id"
        >
          <div class="venue-image" :style="{ backgroundImage: `url(${venue.cover_image})` }">
            <div class="active-overlay" v-if="selectedVenueId === venue.id">
              <van-icon name="success" />
            </div>
          </div>
          <div class="venue-name">{{ venue.name }}</div>
          <div class="venue-status">余位: {{ venue.capacity }}</div>
        </div>
      </div>

      <!-- Time Slot Selection -->
      <div class="section-title">选择时间</div>
      <div class="time-grid">
        <div 
          v-for="slot in timeSlots" 
          :key="slot.value"
          class="time-item"
          :class="{ active: selectedTime === slot.value }"
          @click="selectedTime = slot.value"
        >
          {{ slot.label }}
        </div>
      </div>

      <!-- Visitor Count -->
      <div class="section-title">参观人数</div>
      <div class="visitor-count-box">
        <van-field name="visitor_count" label="人数">
          <template #input>
            <van-stepper 
              v-model="visitorCount" 
              :min="isGroup ? 6 : 1" 
              :max="isGroup ? 50 : 5" 
              integer 
              button-size="32px"
              input-width="50px"
            />
          </template>
        </van-field>
      </div>

      <div style="height: 100px;"></div>
    </div>

    <!-- Footer Action -->
    <div class="footer-action">
      <div class="summary">
        <div class="date-time">{{ selectedDate }} {{ selectedTime }}</div>
        <div class="count">{{ visitorCount }} 人</div>
      </div>
      <van-button 
        type="primary" 
        round 
        class="confirm-btn" 
        @click="showAuthModal = true"
        :disabled="!isFormValid"
      >
        确定预约
      </van-button>
    </div>

    <!-- Auth/Login Modal -->
    <van-popup v-model:show="showAuthModal" round position="bottom" class="auth-popup">
      <div class="auth-content">
        <div class="auth-header">
          <h3>登录后继续预约</h3>
          <p>为了保障预约权益，请先登录系统</p>
        </div>
        <div class="auth-body">
          <van-field
            v-model="phone"
            type="tel"
            label="手机号"
            placeholder="请输入手机号"
            :border="false"
            class="auth-input"
          />
          <van-field
            v-model="code"
            center
            clearable
            label="验证码"
            placeholder="请输入验证码"
            :border="false"
            class="auth-input"
          >
            <template #button>
              <van-button size="small" type="primary" plain round>发送验证码</van-button>
            </template>
          </van-field>
          <van-button type="primary" block round class="login-btn" @click="handleLogin">
            登录并预约
          </van-button>
        </div>
        <div class="auth-footer">
          未注册手机号验证后将自动注册
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getVenues, type VenueItem } from '../api/venue';
import { createAppointment } from '../api/appointment';
import { showSuccessToast, showFailToast } from 'vant';

const route = useRoute();
const router = useRouter();

const isGroup = computed(() => route.query.type === 'group');
const isArchive = computed(() => route.query.type === 'archive');

const pageTitle = computed(() => {
  if (isArchive.value) return '预约查档';
  if (isGroup.value) return '团队预约';
  return '个人预约';
});
const venues = ref<VenueItem[]>([]);
const selectedDate = ref('');
const selectedVenueId = ref<number | null>(null);
const selectedTime = ref('');
const visitorCount = ref(isGroup.value ? 6 : 1);

// UI States
const showAuthModal = ref(false);
const phone = ref('');
const code = ref('');

// Generate Date List (Next 7 days)
const dateList = computed(() => {
  const list = [];
  const now = new Date();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const full = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    list.push({
      full,
      day: d.getDate(),
      weekday: weekdays[d.getDay()],
      available: d.getDay() !== 1 // Assuming Monday closed
    });
  }
  return list;
});

const timeSlots = [
  { label: '09:00 - 10:30', value: '09:00-10:30' },
  { label: '10:30 - 12:00', value: '10:30-12:00' },
  { label: '14:00 - 15:30', value: '14:00-15:30' },
  { label: '15:30 - 17:00', value: '15:30-17:00' }
];

const isFormValid = computed(() => {
  return selectedDate.value && selectedVenueId.value && selectedTime.value;
});

const handleLogin = async () => {
  if (!phone.value || !code.value) {
    showFailToast('请填写完整信息');
    return;
  }
  
  // Mock login and submit
  try {
    const venue = venues.value.find(v => v.id === selectedVenueId.value);
    await createAppointment({
      biz_type: isGroup.value ? 'group' : 'exhibition',
      biz_id: selectedVenueId.value!,
      booking_date: selectedDate.value,
      time_slot: selectedTime.value,
      visitor_count: visitorCount.value,
      contact_name: '测试用户',
      contact_phone: phone.value
    });
    
    showSuccessToast('预约成功');
    showAuthModal.value = false;
    setTimeout(() => {
      router.push('/my-appointments');
    }, 1500);
  } catch (e) {
    showFailToast('预约失败');
  }
};

onMounted(async () => {
  try {
    venues.value = await getVenues();
    if (dateList.value.length > 0) {
      selectedDate.value = dateList.value[0].full;
    }
  } catch (e) {
    console.error(e);
  }
});
</script>

<style scoped>
.booking-view {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.header {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.back-btn {
  font-size: 20px;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  margin-right: 20px;
}

.scroll-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin: 20px 0 12px 0;
  color: #333;
}

.date-strip {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  padding-bottom: 5px;
}

.date-item {
  flex-shrink: 0;
  width: 50px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #f5f5f5;
  color: #666;
  border: 1px solid transparent;
}

.date-item.active {
  background: #e3f2fd;
  color: #1976d2;
  border-color: #1976d2;
}

.date-item.disabled {
  opacity: 0.3;
}

.date-item .weekday {
  font-size: 12px;
  margin-bottom: 4px;
}

.date-item .day {
  font-size: 18px;
  font-weight: 600;
}

.venue-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.venue-card {
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #eee;
  padding-bottom: 8px;
}

.venue-card.active {
  border-color: #1976d2;
  background: #f8fbff;
}

.venue-image {
  height: 100px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.active-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(25, 118, 210, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
}

.venue-name {
  padding: 8px 10px 2px 10px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.venue-status {
  padding: 0 10px;
  font-size: 12px;
  color: #999;
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.time-item {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 14px;
  color: #666;
  border: 1px solid transparent;
}

.time-item.active {
  background: #e3f2fd;
  color: #1976d2;
  border-color: #1976d2;
}

.visitor-count-box {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 5px 0;
}

.footer-action {
  height: 80px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  padding: 0 15px;
  padding-bottom: env(safe-area-inset-bottom);
}

.summary {
  flex: 1;
}

.summary .date-time {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.summary .count {
  font-size: 12px;
  color: #999;
}

.confirm-btn {
  width: 140px;
  height: 44px;
}

.auth-popup {
  padding: 30px 20px;
}

.auth-header {
  margin-bottom: 30px;
}

.auth-header h3 {
  font-size: 20px;
  margin: 0 0 8px 0;
}

.auth-header p {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.auth-input {
  background: #f5f5f5;
  margin-bottom: 15px;
  border-radius: 8px;
  padding: 10px 15px;
}

.login-btn {
  margin-top: 20px;
  height: 48px;
}

.auth-footer {
  text-align: center;
  font-size: 12px;
  color: #ccc;
  margin-top: 20px;
}
</style>
