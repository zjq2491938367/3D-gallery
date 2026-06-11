# 3D Cover Flow Immersive Gallery 🌌

一个基于原生 Web 技术（HTML5 + CSS3 + Vanilla JS）构建的沉浸式 3D 展厅画廊。支持 GPU 硬件加速的 Cover Flow 卡片流动特效、随着图片色彩动态变化的氛围背景、沉浸式电影级详情页过渡，并安全接入了 Pexels API 代理接口。

👉 **在线演示地址**: [https://gallery.xiaoshu999.top](https://gallery.xiaoshu999.top)

---

## ✨ 项目特性

*   **🎬 沉浸式 3D 流式交互 (3D Cover Flow)**：
    *   完美的卡片流式铺开与弧形立体旋转效果。
    *   支持鼠标拖拽（Drag）、手机滑动（Swipe）、鼠标滚轮（Wheel）以及键盘方向键左右切换。
    *   **3D Hover 倾斜视差**：鼠标悬停在当前卡片上时，卡片会随光标角度进行细微的 3D 空间倾斜，带来逼真的三维立体触感。
    *   首屏加载时，卡片会从深空深度呈扇形 sequentially staggered（交错顺序）飞入视口。
*   **🌈 智能氛围背景 (Dynamic Ambient Glow)**：
    *   背景根据当前聚焦卡片的主题色彩自动生成动态径向渐变，并支持在设置面板中通过“Ambient Glow”滑块调节背景氛围灯光的亮度与不透明度。
*   **📖 电影级背景故事模式 (Background Story Mode)**：
    *   点击当前卡片即可无缝放大为全屏画作，同时高保真玻璃拟态详情面板滑入，展示图片故事、拍摄相机和拍摄地点等元数据。
    *   在故事阅读模式下，系统将自动锁死轮播控制、拖拽和键盘导航，提供专心的沉浸式阅读体验。
*   **🔌 Pexels 摄影画廊混合接入**：
    *   **首屏智能加载**：启动时在后台拉取 Pexels Curated 接口生成 10 张专业摄影作品，并在加载前秒级呈现本地离线预置卡片，避免白屏等待。
    *   **Pexels 搜索面板**：内置 Pexels 搜索功能，可输入关键字检索 12 张预览图。点击任意预览图自动获取其平均色值（Avg Color）、作者及相机元数据并加入 3D 卡片栈中，卡片会自动滑到中央聚焦。
    *   **网络防抖与并发控制**：在拉取 API 期间，搜索按钮及输入框会自动进入 Loading 禁用状态，防止网络重复请求和竞态冲突。
*   **🔒 安全的无服务器代理函数 (Secure Serverless Proxy)**：
    *   前台移除了所有硬编码的 API 密钥。所有的 Pexels 请求均通过托管在后端的 Serverless Function (`api/pexels.js`) 代理转发，密钥以环境变量形式注入在服务器端运行，防范恶意盗刷。

---

## 🛠️ 技术栈

*   **前端结构与样式**：HTML5 + 原生 CSS3（大量使用 CSS 自定义属性、3D Transform 空间变换、GPU 硬件加速 Transition、Glassmorphism 玻璃拟态）
*   **逻辑控制**：原生 Javascript (Vanilla JS, ES6+)
*   **后端代理**：Node.js (Serverless API 路由)
*   **平台适配**：针对手机设备进行深度媒体查询优化，锁定 100vw 视口防止 3D 卡片侧边溢出导致的浏览器自动缩放错位。

---

## 🚀 快速开始

### 本地开发与运行
因为项目包含无服务器代理函数，我们推荐使用不同的模式运行：

#### 1. 静态本地浏览（仅前端）
你可以使用任何静态服务器来运行项目（API 部分将自动降级为使用本地预置的 5 张卡片）：
```bash
# 使用 Python 起一个静态服务器
python -m http.server 8080
```
在浏览器中打开：`http://localhost:8080`

#### 2. Vercel 本地开发（包含 API 功能）
如果你安装了 Vercel CLI，可以在本地同时调试前端和 `api/pexels.js` 代理函数：
```bash
# 安装 vercel cli
npm install -g vercel

# 启动本地开发服务 (会自动读取并模拟 Serverless 函数环境)
vercel dev
```

---

## 📦 部署指南

### 方案一：Vercel 部署 (推荐)
1. 将本项目代码推送至 GitHub 仓库。
2. 登录 [Vercel 官网](https://vercel.com/)，选择 **Import Project** 导入你的仓库。
3. 在部署配置的 **Environment Variables** 部分，添加以下环境变量：
    *   **Key**: `PEXELS_API_KEY`
    *   **Value**: *你的 Pexels API Key*
4. 点击 **Deploy** 即可完成发布。

> 💡 **中国大陆用户访问优化**：
> 由于 Vercel 的默认二级域名（`*.vercel.app`）在大陆访问不稳定，建议你在 **Settings > Domains** 中绑定自己的域名，并将域名的 CNAME 解析记录指向 Vercel 大陆优化节点：
> `cname-china.vercel-dns.com`

---

## 📝 目录结构说明

```text
├── api/
│   └── pexels.js          # Node.js Serverless 代理函数 (隐藏 API 密钥)
├── index.html             # 单页面应用主 HTML
├── styles.css             # 全局排版及 3D CSS 自定义样式
├── app.js                 # 3D 渲染逻辑、滚动交互及 API 绑定
└── README.md              # 项目说明文档
```
