### 图书管理系统

[![](https://shields.io/badge/blog-visit-green?style=for-the-badge&logo=WordPress)](https://blog.zc6666.top) [![](https://shields.io/badge/releases-view-pink?style=for-the-badge)](https://github.com/aub123/BookManager) 


****

#### 基本功能

- 图书搜索、借还、续期、逾期提醒
- 基本权限管理
- 管理员增删改查

#### 部署

首先创建数据库：

```mermaid
erDiagram
	Inventory {
		INT bookId
		BIGINT isbn
		TEXT bookname
		TEXT authors
		TEXT description
		TEXT photo
		TEXT publisher
		TEXT price
		TEXT category
		TEXT stock
		TEXT borrowed
	}
    Users {
    	INT uid
    	TEXT name
    	TEXT email
    	TEXT pwd
    	INT role
    	INT borrowed
    }
    Tracker {
    	INT uid
    	TEXT tracker
    }
    Borrowed {
    	INT uid
    	BIGINT isbn
    	TIMESTAMP time
    }
    Users ||--o| Tracker : has
    Borrowed }o--|| Inventory : refers
    Borrowed }o--|| Users : refers
```

```sql
/*
 Navicat Premium Data Transfer

 Source Server         : ProjectCxsj
 Source Server Type    : MySQL
 Source Server Version : 80025
 Source Host           : localhost:3306
 Source Schema         : library

 Target Server Type    : MySQL
 Target Server Version : 80025
 File Encoding         : 65001

 Date: 02/07/2022 11:01:38
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for borrowed
-- ----------------------------
DROP TABLE IF EXISTS `borrowed`;
CREATE TABLE `borrowed`  (
  `uid` int(0) NULL DEFAULT NULL,
  `isbn` bigint(0) NULL DEFAULT NULL,
  `time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for inventory
-- ----------------------------
DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory`  (
  `bookid` int(0) NOT NULL AUTO_INCREMENT,
  `isbn` bigint(0) NULL DEFAULT NULL,
  `bookname` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `authors` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `photo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `publisher` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `price` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `category` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `stock` int(0) NULL DEFAULT NULL,
  `borrowed` int(0) NULL DEFAULT 0,
  PRIMARY KEY (`bookid`) USING BTREE,
  UNIQUE INDEX `isbn`(`isbn`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7645 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for trackers
-- ----------------------------
DROP TABLE IF EXISTS `trackers`;
CREATE TABLE `trackers`  (
  `tracker` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `uid` int(0) NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `uid` int(0) NOT NULL AUTO_INCREMENT,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `email` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `pwd` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `role` int(0) NULL DEFAULT NULL,
  `borrowed` int(0) NULL DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2003131314 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

```

下载

```shell
git clone git@github.com:aub123/BookManager.git
```

在/bookManager目录下创建.env配置文件

```
SQL_HOST=localhost
DB_NAME=库名
DB_USER=用户名
DB_PWD=密码
```

运行

```shell
pnpm install
pnpm start
```



你可以在.env文件中添加PORT字段来更改服务端监听端口
