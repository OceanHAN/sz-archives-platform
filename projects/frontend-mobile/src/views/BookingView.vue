<template>
  <div class="booking-page mobile-container">
    <!-- 顶部导航栏 (Static in Flex) -->
    <van-nav-bar
      :title="pageTitle"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      class="static-nav"
    />

    <!-- 表单区域 (Scrollable in Flex) -->
    <div class="booking-scroll-content">
      <van-notice-bar
        left-icon="info-o"
        :text="noticeText"
        background="#ecf9ff"
        color="#1989fa"
      />

      <van-form @submit="onSubmit">
        <van-cell-group inset title="基本信息">
          <!-- 预约类型展示 -->
          <van-field
            :model-value="bookingTypeLabel"
            label="业务类型"
            readonly
          />
          
          <!-- 日期选择 -->
          <van-field
            v-model="formState.booking_date"
            is-link
            readonly
            name="booking_date"
            label="预约日期"
            placeholder="点击选择日期"
            :rules="[{ required: true, message: '请选择预约日期' }]"
            @click="showCalendar = true"
          />
          <van-calendar
            v-model:show="showCalendar"
            @confirm="onConfirmDate"
            color="#1989fa"
            :min-date="minDate"
            :max-date="maxDate"
          />

          <!-- 时间段选择 -->
          <van-field
            v-model="formState.time_slot"
            is-link
            readonly
            name="time_slot"
            label="时间段"
            placeholder="点击选择时间段"
            :rules="[{ required: true, message: '请选择时间段' }]"
            @click="showTimePicker = true"
          />
          <van-popup v-model:show="showTimePicker" position="bottom" round>
            <van-picker
              title="选择时间段"
              :columns="timeSlotColumns"
              @confirm="onConfirmTime"
              @cancel="showTimePicker = false"
            />
          </van-popup>

          <!-- 参观人数 (仅团队或普通展览预约显示) -->
          <van-field
            v-if="showVisitorCount"
            name="visitor_count"
            label="参观人数"
            :rules="[{ required: true, message: '请输入参观人数' }]"
          >
            <template #input>
              <van-stepper v-model="formState.visitor_count" min="1" :max="maxVisitors" integer theme="round" button-size="22" />
            </template>
          </van-field>
        </van-cell-group>

        <!-- 查档专用字段 -->
        <van-cell-group inset title="查档信息" v-if="isArchiveBooking">
          <van-field
            v-model="formState.id_card"
            name="id_card"
            label="身份证号"
            placeholder="请输入本人身份证号"
            :rules="[
              { required: true, message: '请填写身份证号' },
              { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证格式不正确' }
            ]"
          />
          <van-field
            v-model="formState.purpose"
            name="purpose"
            label="查档目的"
            placeholder="简述查档目的（如：编史修志、工作考察等）"
            type="textarea"
            rows="2"
            autosize
            maxlength="100"
            show-word-limit
            :rules="[{ required: true, message: '请填写查档目的' }]"
          />
        </van-cell-group>

        <!-- 联系人信息 -->
        <van-cell-group inset title="联系方式">
          <van-field
            v-model="formState.contact_name"
            name="contact_name"
            label="联系人"
            placeholder="请输入真实姓名"
            :rules="[{ required: true, message: '请填写联系人姓名' }]"
          />

          <van-field
            v-model="formState.contact_phone"
            name="contact_phone"
            type="tel"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[
              { required: true, message: '请填写手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
            ]"
          />
        </van-cell-group>
      </van-form>
      <div style="height: 20px;"></div>
    </div>

    <!-- 底部固定提交按钮 (Static in Flex) -->
    <div class="submit-bar-static">
      <van-button round block type="primary" native-type="submit" :loading="loading" @click="onSubmit">
        提交预约
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 预约功能页面
 * Booking Functionality Page
 * 
 * 核心功能 (Core Features):
 * 1. 支持三种预约类型：个人观展、团队参观、档案查阅
 * 2. 动态表单验证 (Vant Form)
 * 3. 严格的移动端布局适配 (App Shell Mode)
 */
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showSuccessToast, showFailToast } from 'vant';
import { createAppointment, type AppointmentData } from '../api/appointment';

const route = useRoute();
const router = useRouter();

// UI 状态控制
// UI State Controls
const loading = ref(false);
const showCalendar = ref(false);
const showTimePicker = ref(false);

// 日期范围配置（明天起至未来30天）
// Date Range Configuration (Tomorrow -> +30 days)
const minDate = new Date();
minDate.setDate(minDate.getDate() + 1);
const maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 30);

// 核心业务逻辑：判断预约类型
// Core Business Logic: Determine Booking Type
// type: 'archive' (查档) | 'exhibition' (个人观展) | 'group' (团队观展)
const bookingType = computed(() => (route.query.type as string) || 'exhibition');
const isArchiveBooking = computed(() => bookingType.value === 'archive');
const isGroupBooking = computed(() => bookingType.value === 'group');

// 动态文案
// Dynamic Text Labels
const pageTitle = computed(() => {
  if (isArchiveBooking.value) return '预约查档';
  if (isGroupBooking.value) return '团队预约';
  return '个人观展';
});

const bookingTypeLabel = computed(() => {
  if (isArchiveBooking.value) return '档案查阅';
  if (isGroupBooking.value) return '团队参观';
  return '个人参观';
});

const noticeText = computed(() => {
  if (isArchiveBooking.value) return '查档请携带本人有效身份证件，建议提前规划查档内容。';
  if (isGroupBooking.value) return '团队预约需提前3天申请，人数限制10-50人。';
  return '档案馆周二至周日开放，请提前预约入馆。';
});

// 字段控制
const showVisitorCount = computed(() => !isArchiveBooking.value); // 查档默认1人
const maxVisitors = computed(() => isGroupBooking.value ? 50 : 5);

// 表单数据模型
// 扩展 AppointmentData 接口以包含前端特有的字段（id_card, purpose）
// 注意：后端实体也需要相应支持这些字段，或者在 api 层处理
interface ExtendedAppointmentData extends AppointmentData {
  id_card?: string;
  purpose?: string;
}

const formState = reactive<ExtendedAppointmentData>({
  biz_type: bookingType.value,
  biz_id: 1, // 默认关联 ID
  booking_date: '',
  time_slot: '',
  contact_name: '',
  contact_phone: '',
  visitor_count: 1,
  id_card: '',
  purpose: ''
});

// 时间段选项
const timeSlotColumns = [
  { text: '上午 09:00 - 11:30', value: '09:00-11:30' },
  { text: '下午 14:00 - 17:00', value: '14:00-17:00' },
];

// 事件处理
const onClickLeft = () => history.back();

const onConfirmDate = (value: Date) => {
  showCalendar.value = false;
  // 格式化日期 YYYY-MM-DD
  const dateStr = `${value.getFullYear()}-${(value.getMonth() + 1).toString().padStart(2, '0')}-${value.getDate().toString().padStart(2, '0')}`;
  formState.booking_date = dateStr;
};

const onConfirmTime = ({ selectedOptions }: { selectedOptions: any[] }) => {
  showTimePicker.value = false;
  formState.time_slot = selectedOptions[0]?.value;
};

const onSubmit = async () => {
  loading.value = true;
  try {
    // 提交前的数据处理
    const submitData = {
      ...formState,
      // 如果是查档，强制人数为 1
      visitor_count: isArchiveBooking.value ? 1 : formState.visitor_count,
      // 确保 biz_type 正确
      biz_type: bookingType.value
    };

    console.log('Submitting:', submitData);
    await createAppointment(submitData);
    
    showSuccessToast('预约提交成功');
    
    // 延迟返回
    setTimeout(() => {
      router.back();
    }, 1500);
  } catch (error) {
    console.error(error);
    showFailToast('预约提交失败，请重试');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // 初始化逻辑
  if (isGroupBooking.value) {
    formState.visitor_count = 10;
  }
});
</script>

<style scoped>
.booking-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f8fa;
  overflow: hidden; /* Important: prevent outer scroll */
}

/* Flex item 1: Static Nav */
.static-nav {
  flex-shrink: 0;
  width: 100%;
}

/* Flex item 2: Scrollable Content */
.booking-scroll-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
  -webkit-overflow-scrolling: touch; /* Smooth scroll on iOS */
}

/* Flex item 3: Static Footer */
.submit-bar-static {
  flex-shrink: 0;
  width: 100%;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 99;
}

/* 统一导航栏样式 */
:deep(.van-nav-bar) {
  background-color: var(--bg-beige); /* 使用全局米色背景 */
}

:deep(.van-nav-bar__title) {
  color: #333;
  font-weight: bold;
}

:deep(.van-nav-bar__text), :deep(.van-nav-bar__arrow) {
  color: var(--primary-gold); /* 使用全局金色 */
}
</style>
