import mineflayer from 'mineflayer'
import { mineflayer as mineflayerViewer } from 'prismarine-viewer'
import { EventEmitter } from 'events' // 引入事件机制
import type { Server } from 'http' // 引入 HTTP 服务类型

export class MineflayerBot extends EventEmitter {
  // 继承 EventEmitter，支持事件监听
  private bot: mineflayer.Bot | null = null
  private port: number = 3000
  private viewerServer: Server | null = null // 存储 Viewer 的 HTTP 服务实例

  public createBot(username: string, host: string): mineflayer.Bot {
    console.log(`Creating bot: ${username}@${host}`)

    // 若已有 bot，先销毁避免冲突
    if (this.bot) {
      this.bot.end('Recreate bot')
      this.bot = null
    }

    this.bot = mineflayer.createBot({
      host: host,
      username: username,
      checkTimeoutInterval: 60 * 1000,
      hideErrors: false,
      auth: 'microsoft',
      version: '1.21.8'
    })

    this.bot.on('login', () => {
      console.log(`Bot ${username} logged in successfully`)
      this.emit('bot-login', username) // 可选：通知主进程 bot 登录成功
    })

    this.bot.on('spawn', () => {
      console.log('Bot spawn position:', this.bot?.entity.position)
      console.log('Bot spawned in the world')
      this.startViewer() // 生成后启动 Viewer
    })

    this.bot.on('error', (err: Error) => {
      console.error('Bot error:', err.message)
      this.emit('bot-error', `Bot 错误: ${err.message}`) // 通知主进程 bot 错误
    })

    this.bot.on('kicked', (reason: string) => {
      console.log('Bot kicked:', reason)
      this.emit('bot-kicked', `被踢出服务器: ${reason}`) // 通知主进程被踢
    })

    this.bot.on('end', (reason: string) => {
      console.log('Bot disconnected, reason:', reason)
      this.emit('bot-end', `断开连接: ${reason}`) // 通知主进程断开连接
      // 断开时销毁 Viewer 服务
      if (this.viewerServer) {
        this.viewerServer.close(() => {
          console.log('Viewer server closed')
          this.emit('viewer-closed')
        })
        this.viewerServer = null
      }
    })

    return this.bot
  }

  private startViewer(): void {
    if (!this.bot) return

    try {
      // 启动 Viewer：prismarine-viewer 的 mineflayer 方法会返回 HTTP 服务实例
      this.viewerServer = mineflayerViewer(this.bot, {
        port: this.port,
        firstPerson: false,
        viewDistance: 6
      })

      // 1. 监听 Viewer HTTP 服务「启动成功」（端口监听就绪）
      this.viewerServer?.on('listening', () => {
        const viewerUrl = `http://localhost:${this.port}`
        console.log(`Viewer server started at: ${viewerUrl}`)
        // 发送「服务就绪」事件（HTTP 服务已可访问）
        this.emit('viewer-server-ready', viewerUrl)
      })

      // 2. 监听 Viewer 服务「错误」（如端口占用）
      this.viewerServer?.on('error', (err: Error & { code?: string }) => {
        let errorMsg = `Viewer 启动失败: ${err.message}`
        // 处理常见错误：端口占用
        if (err.code === 'EADDRINUSE') {
          errorMsg = `Viewer 端口 ${this.port} 已被占用，请关闭其他占用进程或修改端口`
        }
        console.error(errorMsg)
        this.emit('viewer-error', errorMsg) // 通知主进程 Viewer 错误
      })

      // 3. 监听 Viewer 页面「客户端连接」（间接确认 3D 渲染就绪）
      // 当渲染进程的 iframe 成功连接到 Viewer 服务时，会触发 'client' 事件
      this.viewerServer?.on('client', (client: any) => {
        const viewerUrl = `http://localhost:${this.port}`
        console.log('Viewer client connected (3D render ready)')
        // 发送「渲染就绪」事件（此时加载 iframe 不会黑屏）
        this.emit('viewer-render-ready', viewerUrl)
      })
    } catch (err) {
      const errorMsg = `Viewer 初始化异常: ${(err as Error).message}`
      console.error(errorMsg)
      this.emit('viewer-error', errorMsg)
    }
  }

  public getViewerUrl(): string {
    return `http://localhost:${this.port}`
  }

  public getBot(): mineflayer.Bot | null {
    return this.bot
  }

  // 手动销毁 bot 和 Viewer（可选，供主进程调用）
  public destroy(): void {
    if (this.bot) {
      this.bot.end('Manual destroy')
      this.bot = null
    }
    if (this.viewerServer) {
      this.viewerServer.close()
      this.viewerServer = null
    }
  }
}
