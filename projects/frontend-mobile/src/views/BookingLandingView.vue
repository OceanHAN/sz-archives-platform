<template>
  <div class="booking-landing">
    <!-- Header -->
    <div class="header">
      <div class="back-btn" @click="$router.back()">
        <van-icon name="arrow-left" />
      </div>
      <div class="title">参观预约</div>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="booking-type-card individual" @click="goToForm('individual')">
        <div class="card-content">
          <div class="icon-box">
            <van-icon name="user-o" />
          </div>
          <div class="text-box">
            <h3>个人预约</h3>
            <p>适用于1-5人散客参观预约</p>
          </div>
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>

      <div class="booking-type-card group" @click="goToForm('group')">
        <div class="card-content">
          <div class="icon-box">
            <van-icon name="friends-o" />
          </div>
          <div class="text-box">
            <h3>团队预约</h3>
            <p>适用于6人及以上团体参观预约</p>
          </div>
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>

      <!-- Notice -->
      <div class="notice-section">
        <div class="notice-header">
          <van-icon name="warning-o" />
          <span>预约须知</span>
        </div>
        <div class="notice-content">
          <p>1. 开放时间：周一至周五 9:00-17:00（16:30停止入馆）。</p>
          <p>2. 提前预约：请至少提前1天进行预约。</p>
          <p>3. 证件要求：入馆请出示本人身份证原件及预约二维码。</p>
          <p>4. 咨询电话：0755-88123456。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToForm = (type: string) => {
  router.push({
    path: '/booking',
    query: { type }
  });
};
</script>

<style scoped>
.booking-landing {
  min-height: 100vh;
  background: #f8f8f8;
  padding-bottom: 30px;
}

.header {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  font-size: 20px;
  color: #333;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  margin-right: 20px;
}

.content {
  padding: 20px 15px;
}

.booking-type-card {
  background: #fff;
  border-radius: 12px;
  padding: 25px 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.card-content {
  display: flex;
  align-items: center;
}

.icon-box {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 15px;
}

.individual .icon-box {
  background: #e3f2fd;
  color: #1976d2;
}

.group .icon-box {
  background: #f1f8e9;
  color: #689f38;
}

.text-box {
  flex: 1;
}

.text-box h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #333;
}

.text-box p {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.arrow-icon {
  color: #ccc;
  font-size: 16px;
}

.notice-section {
  margin-top: 30px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
}

.notice-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.notice-header .van-icon {
  color: #ff9800;
}

.notice-content {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}

.notice-content p {
  margin: 5px 0;
}
</style>
