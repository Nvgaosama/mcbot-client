// src/main/index.ts
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { MineflayerBot } from '../MineflayerBot'

let botManager: MineflayerBot | null = null
let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false, // 允许加载本地 HTTP 内容
      allowRunningInsecureContent: true, // 允许运行不安全内容
      additionalArguments: [
        `--csp=default-src 'self' http://localhost:*; 
     style-src 'self' 'unsafe-inline' http://localhost:*;  // 允许内联样式
     frame-src 'self' http://localhost:*`
      ]
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('startBot', (event, username: string, host: string) => {
    console.log('收到启动 bot 请求', { username, host })
    try {
      // 销毁旧实例（避免端口占用）
      if (botManager) {
        botManager.destroy()
        botManager.removeAllListeners() // 清除旧事件监听
        botManager = null
      }

      botManager = new MineflayerBot()
      botManager.createBot(username, host)

      // 1. 监听 Viewer 3D 渲染就绪（优先用这个事件发送 URL）
      botManager.on('viewer-render-ready', (viewerUrl: string) => {
        if (mainWindow && mainWindow.isVisible()) {
          console.log('Viewer 渲染就绪，通知渲染进程:', viewerUrl)
          mainWindow.webContents.send('viewer-ready', viewerUrl)
        }
      })

      // 2. 监听 Viewer 服务就绪（降级方案，可选）
      botManager.on('viewer-server-ready', (viewerUrl: string) => {
        console.log('Viewer 服务就绪:', viewerUrl)
        // 若没有 render-ready 事件，可在这里发送（但优先用上面的事件）
        // if (!mainWindow?.webContents.isLoading()) {
        //   mainWindow?.webContents.send('viewer-ready', viewerUrl)
        // }
      })

      // 3. 监听 Viewer 错误
      botManager.on('viewer-error', (errorMsg: string) => {
        console.error('Viewer 错误:', errorMsg)
        mainWindow?.webContents.send('bot-error', errorMsg)
      })

      // 4. 监听 bot 错误
      botManager.on('bot-error', (errorMsg: string) => {
        console.error('Bot 错误:', errorMsg)
        mainWindow?.webContents.send('bot-error', errorMsg)
      })

      console.log('Bot 创建指令已发送，等待就绪事件...')
    } catch (error) {
      const errMsg = `创建 bot 失败: ${(error as Error).message}`
      console.error(errMsg)
      mainWindow?.webContents.send('bot-error', errMsg)
    }
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
