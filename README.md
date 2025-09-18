# MC Robot Client
基于 Electron + Vite + React + TypeScript 的跨平台 Minecraft 机器人控制桌面客户端

**此项目处于开发阶段！下述所有功能皆为待实现状态 请勿下载使用**

当前界面预览：
<img width="1186" height="793" alt="f9d8d3dfec17119d944aa74537a281a5" src="https://github.com/user-attachments/assets/cb17a98f-0ace-4bd3-a23c-41a2d09b94ed" />


## 项目简介
MC Robot Client 是一款为 Minecraft 服务器打造的可视化机器人控制工具，核心依托 **Mineflayer** 库实现机器人自动化逻辑，通过直观的前端界面让玩家无需编写复杂代码即可完成机器人行为编排。  

项目旨在解决传统 Minecraft 自动化中"重复操作繁琐"与"多人协作低效"的问题，支持全服玩家通过机器人协同完成大型巨构建造、资源量产等目标，同时保留玩家对策略设计的核心控制权。


## 核心功能
### 1. 可视化行为编排
- 基于节点化状态机的编辑器，支持拖拽"移动""挖矿""运输""条件判断"等行为模块
- 图形化连接模块生成执行逻辑，实时高亮机器人当前运行节点，直观追踪流程状态

### 2. 多机器人管理
- 同时控制多个机器人实例，支持快速切换不同机器人的配置界面
- 实时展示每个机器人的核心状态：生命值、饱食度、背包物品、当前任务进度

### 3. 沉浸式监控与交互
- 集成机器人第一视角预览窗口，同步展示 Minecraft 游戏内画面
- 支持手动干预机器人行为，可随时暂停、重启或调整执行流程

### 4. 全服协作适配
- 机器人生产进度与全服巨构目标联动，提交物资实时转化为实体建筑方块
- 支持组队分工，物资贡献排名与专属奖励体系，强化多人协作动力


## 技术栈
- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite + electron-vite
- **运行环境**：Electron（融合 Node.js 与浏览器能力）
- **机器人核心**：Mineflayer（Minecraft 机器人开发库）
- **状态管理**：React Context API（轻量适配多机器人状态）
- **UI 组件**：自定义主题组件（贴合 Minecraft 科技感风格）


## 快速开始
### 前置依赖
- Node.js 16.x+ 或 18.x LTS
- npm/pnpm 包管理工具
- 可连接的 Minecraft 服务器（1.18+ 版本推荐）

### 安装与启动
1. 克隆仓库
   ```bash
   git clone https://github.com/your-username/mc-robot-client.git
   cd mc-robot-client
   ```

2. 安装依赖
   ```bash
   # 使用 npm
   npm install

   # 或使用 pnpm（推荐）
   pnpm install
   ```

3. 启动开发环境
   ```bash
   npm run dev
   ```

4. 连接 Minecraft 服务器
   - 在客户端界面填写服务器 IP、端口及机器人用户名
   - 拖拽行为模块编排流程，点击"启动"按钮激活机器人


## 项目结构
```
mc-robot-client/
├── electron/                # Electron 主进程
│   ├── main.ts              # 窗口创建与 Mineflayer 机器人核心逻辑
│   └── preload.ts           # 主进程与渲染进程通信桥接
├── src/                     # React 渲染进程（前端界面）
│   ├── components/          # 核心组件（节点编辑器、状态面板等）
│   ├── context/             # 多机器人状态管理
│   ├── App.tsx              # 根组件
│   └── main.tsx             # 前端入口
├── electron.vite.config.ts  # 构建配置
└── package.json             # 依赖与脚本配置
```


## 贡献指南
1. Fork 本仓库
2. 创建特性分支（`git checkout -b feature/xxx`）
3. 提交代码（`git commit -m "feat: 添加xxx功能"`）
4. 推送分支（`git push origin feature/xxx`）
5. 发起 Pull Request

欢迎贡献新的行为模块、优化界面交互或修复 Bug，提交前请确保通过 ESLint 代码规范检查。


## 许可证
本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。


## 致谢
- [Mineflayer](https://github.com/PrismarineJS/mineflayer)：提供 Minecraft 机器人核心能力
- [electron-vite](https://github.com/alex8088/electron-vite)：简化 Electron + Vite 项目配置
- [React](https://react.dev/)：构建高效前端界面的核心框架


---

# MC Robot Client
A Cross-Platform Minecraft Bot Control Client Built with Electron, Vite, React & TypeScript


## Project Overview
MC Robot Client is a visual bot control tool designed for Minecraft servers. It leverages the **Mineflayer** library to implement bot automation logic, enabling players to orchestrate bot behaviors through an intuitive frontend interface—no complex coding required.  

The project aims to solve the pain points of "tedious repetitive operations" and "inefficient multiplayer collaboration" in traditional Minecraft automation. It supports server-wide players in completing large-scale megastructure construction, resource mass production, and other goals through bot collaboration, while retaining players' core control over strategy and design.


## Core Features
### 1. Visual Behavior Orchestration
- Node-based state machine editor supporting drag-and-drop behavior modules (movement, mining, transportation, condition judgment, etc.)
- Graphical module connections to generate execution logic, with real-time highlighting of the bot's current running node for intuitive process tracking

### 2. Multi-Bot Management
- Control multiple bot instances simultaneously with quick switching between configuration interfaces
- Real-time display of each bot's core status: health, hunger, inventory items, and current task progress

### 3. Immersive Monitoring & Interaction
- Integrated bot first-person perspective preview window syncing in-game Minecraft visuals
- Manual intervention support for bot behaviors (pause, restart, or adjust execution flow anytime)

### 4. Server-Wide Collaboration Adaptation
- Bot production progress linked to server-wide megastructure goals, with submitted materials instantly converted into physical building blocks
- Team division support, material contribution ranking, and exclusive reward system to enhance multiplayer collaboration motivation


## Tech Stack
- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite + electron-vite
- **Runtime Environment**: Electron (integrating Node.js and browser capabilities)
- **Bot Core**: Mineflayer (Minecraft bot development library)
- **State Management**: React Context API (lightweight adaptation for multi-bot states)
- **UI Components**: Custom theme components (aligned with Minecraft tech style)


## Quick Start
### Prerequisites
- Node.js 16.x+ or 18.x LTS
- npm/pnpm package manager
- Accessible Minecraft server (1.18+ recommended)

### Installation & Launch
1. Clone the repository
   ```bash
   git clone https://github.com/your-username/mc-robot-client.git
   cd mc-robot-client
   ```

2. Install dependencies
   ```bash
   # Using npm
   npm install

   # Or using pnpm (recommended)
   pnpm install
   ```

3. Start development environment
   ```bash
   npm run dev
   ```

4. Connect to Minecraft server
   - Enter server IP, port, and bot username in the client interface
   - Orchestrate processes by dragging behavior modules and click "Start" to activate the bot


## Project Structure
```
mc-robot-client/
├── electron/                # Electron Main Process
│   ├── main.ts              # Window creation & Mineflayer bot core logic
│   └── preload.ts           # Main-renderer process communication bridge
├── src/                     # React Renderer Process (Frontend)
│   ├── components/          # Core components (node editor, status panel, etc.)
│   ├── context/             # Multi-bot state management
│   ├── App.tsx              # Root component
│   └── main.tsx             # Frontend entry
├── electron.vite.config.ts  # Build configuration
└── package.json             # Dependencies & scripts configuration
```


## Contribution Guidelines
1. Fork this repository
2. Create a feature branch (`git checkout -b feature/xxx`)
3. Commit your changes (`git commit -m "feat: add xxx feature"`)
4. Push to the branch (`git push origin feature/xxx`)
5. Open a Pull Request

Contributions for new behavior modules, UI interaction optimizations, or bug fixes are welcome. Please ensure compliance with ESLint code standards before submission.


## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Acknowledgments
- [Mineflayer](https://github.com/PrismarineJS/mineflayer): Provides core Minecraft bot capabilities
- [electron-vite](https://github.com/alex8088/electron-vite): Simplifies Electron + Vite project configuration
- [React](https://react.dev/): Core framework for building efficient frontend interfaces
