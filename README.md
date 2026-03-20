# Wall Photo Display

<div align="center">

<p>
	<a href="https://github.com/LunaDeerTech/WallPhotoDisplay/stargazers"><img src="https://img.shields.io/github/stars/LunaDeerTech/WallPhotoDisplay?style=for-the-badge&logo=github" alt="GitHub stars" /></a>
	<a href="https://github.com/LunaDeerTech/WallPhotoDisplay/network/members"><img src="https://img.shields.io/github/forks/LunaDeerTech/WallPhotoDisplay?style=for-the-badge&logo=github" alt="GitHub forks" /></a>
	<a href="https://github.com/LunaDeerTech/WallPhotoDisplay/issues"><img src="https://img.shields.io/github/issues/LunaDeerTech/WallPhotoDisplay?style=for-the-badge&logo=github" alt="GitHub issues" /></a>
	<a href="LICENSE"><img src="https://img.shields.io/badge/License-GPLv3-2ea043?style=for-the-badge" alt="GPLv3 License" /></a>
</p>

<p>
	<img src="https://img.shields.io/badge/Vue-3-42b883?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue 3" />
	<img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
	<img src="https://img.shields.io/badge/Express-4.x-111111?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
	<img src="https://img.shields.io/badge/SQLite-Ready-003b57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
	<img src="https://img.shields.io/badge/PWA-Installable-5a0fc8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA Installable" />
	<img src="https://img.shields.io/badge/Docker-Ready-2496ed?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Ready" />
</p>

<h3>一个适合团队、社区与小圈子长期共同维护的多人照片墙</h3>

<p>
	它不是一次性展示用的图片列表，而是一个可以持续上传、分类、筛选、回看的共享记忆空间。
</p>

<p>
	适合部署在自己的服务器、NAS 或云主机上，以较低维护成本搭建一个真正可用、可持续运营的照片墙系统。
</p>

</div>

## 目录

- [项目特点](#项目特点)
- [适用场景](#适用场景)
- [功能概览](#功能概览)
- [快速开始](#快速开始)
- [首次上线建议](#首次上线建议)
- [自动化上传](#自动化上传)
- [技术栈](#技术栈)
- [项目定位](#项目定位)
- [License](#license)

## 项目特点

| 方向 | 说明 |
| --- | --- |
| 长期沉淀 | 不是一次性相册，更适合持续记录活动、日常与集体记忆 |
| 多人协作 | 支持多用户上传、账号体系、权限区分与后台管理 |
| 移动端友好 | 支持 PWA，可安装到手机主屏，浏览体验更接近原生应用 |
| 开放但可控 | 可开启强制登录浏览、上传审核、验证码、邮箱验证等能力 |
| 易于部署 | 默认内置 SQLite，单机即可运行，适合先落地再扩展 |
| 可自动接入 | 支持 API Key 上传，方便脚本、机器人或外部服务集成 |

## 适用场景

- 游戏服务器相册墙：记录活动、建筑、合影、赛事瞬间。
- 校园或社团相册：沉淀活动照片、比赛回顾、年度记忆。
- 公司团队文化墙：收集团建、分享会、节日活动照片。
- 家庭与朋友共享相册：集中管理旅行、聚会、纪念日影像。
- 社区或兴趣小组图库：通过标签快速整理同主题内容。

## 功能概览

### 浏览体验优先

- 瀑布流照片墙，适合大量图片持续展示。
- 同时适配桌面端与移动端布局。
- 支持按标签、上传用户、点赞状态进行筛选。
- 支持 PWA 安装、更新提示与离线状态提示。

### 多人上传，但不失控

- 登录用户可批量上传图片。
- 支持拖拽上传，单次最多 20 张，单张不超过 10MB。
- 支持 JPEG、PNG、GIF、WebP。
- 上传时可统一添加标签，便于后续检索和整理。

### 后台运营能力完整

- 管理员可审核待发布图片。
- 可控制是否强制登录后才能浏览。
- 可控制是否开放注册。
- 可开启 API Key 能力，允许脚本或工具上传图片。
- 可开启验证码，降低恶意登录、注册和找回密码风险。

### 账号体系不止于登录

- 支持注册、登录、个人资料管理。
- 支持邮箱绑定与邮箱验证。
- 支持通过邮箱重置密码。
- 支持管理员进行用户管理。

### 核心模块一览

| 模块 | 说明 |
| --- | --- |
| 照片展示 | 多用户共享照片墙，适合长期沉淀内容 |
| 标签系统 | 通过 `#标签` 组织照片，支持推荐与筛选 |
| 上传审核 | 普通用户上传后可进入待审核状态 |
| 用户体系 | 登录、注册、邮箱验证、密码重置、角色权限 |
| 管理后台 | 用户管理、图片审核、站点设置、邮件设置 |
| PWA | 支持安装到桌面或手机主屏，具备应用式体验 |
| API 上传 | 使用 API Key 进行自动化上传 |

## 快速开始

### 方式一：Docker 部署

最省事的方式是直接使用 Docker。

```bash
# 默认管理员账号 admin / admin123，部署后请尽快修改密码
docker compose up -d
```

仓库已提供 [docker-compose.yml](docker-compose.yml) 和 [Dockerfile](Dockerfile)。

部署前至少确认以下内容：

- 将 `JWT_SECRET` 改成自己的随机字符串。
- 挂载好 `data` 目录，持久化数据库和上传文件。
- 按需修改端口映射，默认对外暴露 `3000` 端口。

默认容器会将数据保存在 `/app/data`，其中包括：

- SQLite 数据库
- 上传的原图与缩略图
- 站点配置文件

### 方式二：本地开发

```bash
npm install
npm run dev
```

常用命令：

```bash
# 类型检查
npm run typecheck

# 生产构建（前端 + 后端）
npm run build:all

# 启动生产构建结果
npm run start
```

## 首次上线建议

1. 修改默认管理员密码。
2. 在后台确认站点名称、描述和菜单图标。
3. 按你的使用场景决定是否开启“强制登录浏览”。
4. 如果面向多人投稿，建议开启“上传审核”。
5. 如果希望开放新用户加入，再开启“开放注册”。
6. 如果需要邮箱验证或找回密码，配置 SMTP 邮件参数。
7. 如果有自动化脚本上传图片，再开启 API Key。

## 自动化上传

如果你希望把 Wall Photo Display 当作“图片接收站”，项目已经内置 API Key 上传能力。典型用途包括：

- 游戏服务器截图自动归档
- 活动摄影工作流自动投递
- Bot、脚本或第三方工具定时上传
- 其他系统把图片同步到照片墙

通过 API 上传的图片仍然遵守站点审核规则。如果管理员开启了审核，API 上传内容同样需要审核后才会公开显示。

## 技术栈

- 前端：Vue 3 + TypeScript + Vite
- 后端：Express.js
- 数据库：SQLite
- 图片处理：Sharp
- 应用形态：PWA
- 部署方式：Docker / Node.js

这套组合的优点是轻量、容易部署、维护成本低，适合个人站点、小团队内部系统和中小规模社区场景。

## 项目定位

Wall Photo Display 更适合以下定位：

- 一个可自托管的多人照片墙
- 一个适合运营和维护的活动图库
- 一个对移动端友好的轻量图片社区
- 一个可以逐步接入自动化上传的影像归档入口

如果你需要的是“让一群人持续共享、整理、回看照片”的系统，而不是一次性展示页面，这个项目就是为这种场景设计的。

## License

本项目采用 GPL-3.0 License。详见 [LICENSE](LICENSE)。
