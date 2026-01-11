-- 深圳市档案馆小程序数据库初始化脚本
-- 版本: 1.0
-- 日期: 2026-01-09

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- 1. 用户表 (t_user)
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `openid` varchar(64) NOT NULL COMMENT '微信OpenID',
  `unionid` varchar(64) DEFAULT NULL COMMENT '微信UnionID',
  `nickname` varchar(64) DEFAULT NULL COMMENT '昵称',
  `avatar_url` varchar(255) DEFAULT NULL COMMENT '头像地址',
  `mobile` varchar(255) DEFAULT NULL COMMENT '手机号(加密)',
  `real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  `id_card` varchar(255) DEFAULT NULL COMMENT '身份证号(加密)',
  `is_verified` tinyint(1) NOT NULL DEFAULT '0' COMMENT '实名状态: 0-未认证, 1-已认证',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- ----------------------------
-- 2. 展览主表 (t_exhibition)
-- ----------------------------
DROP TABLE IF EXISTS `t_exhibition`;
CREATE TABLE `t_exhibition` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` varchar(100) NOT NULL COMMENT '展览标题',
  `cover_image` varchar(255) NOT NULL COMMENT '封面图URL',
  `summary` varchar(500) DEFAULT NULL COMMENT '展览简介',
  `content` text COMMENT '展览详情(富文本)',
  `type` varchar(20) NOT NULL DEFAULT 'virtual' COMMENT '类型: virtual(云展), physical(线下)',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态: 1-发布, 0-草稿',
  `view_count` int(11) DEFAULT '0' COMMENT '浏览量',
  `sort_order` int(11) DEFAULT '0' COMMENT '排序权重',
  `start_date` datetime DEFAULT NULL COMMENT '开始时间',
  `end_date` datetime DEFAULT NULL COMMENT '结束时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='展览主表';

-- ----------------------------
-- 3. VR场景表 (t_exhibition_scene)
-- ----------------------------
DROP TABLE IF EXISTS `t_exhibition_scene`;
CREATE TABLE `t_exhibition_scene` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `exhibition_id` bigint(20) NOT NULL COMMENT '关联展览ID',
  `name` varchar(50) NOT NULL COMMENT '场景名称',
  `thumb_url` varchar(255) NOT NULL COMMENT '缩略图URL',
  `panorama_url` varchar(255) NOT NULL COMMENT '全景图资源URL',
  `initial_view` json DEFAULT NULL COMMENT '初始视角参数',
  `hotspots` json DEFAULT NULL COMMENT '热点数据数组',
  `sort_order` int(11) DEFAULT '0' COMMENT '排序',
  PRIMARY KEY (`id`),
  KEY `idx_exhibition_id` (`exhibition_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='VR场景表';

-- ----------------------------
-- 4. 线上云课堂 (t_course_online)
-- ----------------------------
DROP TABLE IF EXISTS `t_course_online`;
CREATE TABLE `t_course_online` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` varchar(100) NOT NULL COMMENT '课程标题',
  `subtitle` varchar(200) DEFAULT NULL COMMENT '副标题',
  `cover_image` varchar(255) NOT NULL COMMENT '封面图',
  `video_url` varchar(500) NOT NULL COMMENT '视频流地址',
  `duration` int(11) DEFAULT '0' COMMENT '时长(秒)',
  `publish_date` date NOT NULL COMMENT '发布日期',
  `tags` varchar(255) DEFAULT NULL COMMENT '标签',
  `view_count` int(11) DEFAULT '0' COMMENT '播放量',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='线上云课堂';

-- ----------------------------
-- 5. 线下预约课程 (t_course_offline)
-- ----------------------------
DROP TABLE IF EXISTS `t_course_offline`;
CREATE TABLE `t_course_offline` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` varchar(100) NOT NULL COMMENT '课程/活动标题',
  `cover_image` varchar(255) NOT NULL COMMENT '封面图',
  `category` varchar(20) NOT NULL COMMENT '分类: party(党课), ideology(思政), activity(招募)',
  `is_deliverable` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否送课上门',
  `detail_html` text COMMENT '详情页富文本',
  `min_group_size` int(11) DEFAULT '1' COMMENT '最小团体人数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='线下预约课程';

-- ----------------------------
-- 6. 预约记录表 (t_appointment)
-- ----------------------------
DROP TABLE IF EXISTS `t_appointment`;
CREATE TABLE `t_appointment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `booking_no` varchar(32) NOT NULL COMMENT '预约单号',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `biz_type` varchar(20) NOT NULL COMMENT '业务类型: exhibition, course, archive',
  `biz_id` bigint(20) NOT NULL COMMENT '关联业务ID',
  `booking_date` date NOT NULL COMMENT '预约日期',
  `time_slot` varchar(20) NOT NULL COMMENT '时间段',
  `visitor_count` int(11) NOT NULL DEFAULT '1' COMMENT '参观人数',
  `contact_name` varchar(50) NOT NULL COMMENT '联系人',
  `contact_phone` varchar(20) NOT NULL COMMENT '联系电话',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态: 0-待核销, 1-已完成, 2-已取消, 3-过期',
  `qr_code` varchar(255) DEFAULT NULL COMMENT '核销二维码地址',
  `checkin_time` datetime DEFAULT NULL COMMENT '核销时间',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_booking_no` (`booking_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_booking_date` (`booking_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预约记录表';

-- ----------------------------
-- 7. 档案信息表 (t_archive)
-- ----------------------------
DROP TABLE IF EXISTS `t_archive`;
CREATE TABLE `t_archive` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `archive_code` varchar(50) NOT NULL COMMENT '档号',
  `title` varchar(255) NOT NULL COMMENT '题名',
  `content_desc` text COMMENT '内容摘要',
  `category_id` int(11) DEFAULT NULL COMMENT '全宗号/分类ID',
  `year` varchar(10) DEFAULT NULL COMMENT '年份',
  `location_ref` varchar(100) DEFAULT NULL COMMENT '馆藏位置索引',
  `pdf_url` varchar(255) DEFAULT NULL COMMENT '数字化副本地址',
  `is_open` tinyint(1) NOT NULL DEFAULT '1' COMMENT '开放状态: 1-开放, 0-控制',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_archive_code` (`archive_code`),
  FULLTEXT KEY `ft_title_desc` (`title`,`content_desc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='档案信息表';

-- ----------------------------
-- 8. 资讯表 (t_news)
-- ----------------------------
DROP TABLE IF EXISTS `t_news`;
CREATE TABLE `t_news` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` varchar(100) NOT NULL COMMENT '标题',
  `cover_image` varchar(255) DEFAULT NULL COMMENT '列表图',
  `summary` varchar(200) DEFAULT NULL COMMENT '摘要',
  `content` longtext NOT NULL COMMENT '正文内容',
  `publish_time` datetime NOT NULL COMMENT '发布时间',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='资讯表';

SET FOREIGN_KEY_CHECKS = 1;
