import { useState, useEffect, useRef } from 'react'
import Versions from './components/Versions'

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, ...args: unknown[]) => void
        on: (channel: string, listener: (...args: unknown[]) => void) => void
        removeAllListeners: (channel: string) => void
      }
    }
  }
}

function App(): React.JSX.Element {
  const [username, setUsername] = useState('')
  const [host, setHost] = useState('')
  const [viewerUrl, setViewerUrl] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // 添加旋转动画样式
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    // 监听 viewer 准备就绪
    const handleViewerReady = (event: Electron.IpcRendererEvent, url: string): void => {
      setViewerUrl(url)
      setIsConnecting(false)
      setError(null)
    }

    // 监听可能的错误信息
    const handleError = (event: Electron.IpcRendererEvent, message: string): void => {
      setError(message)
      setIsConnecting(false)
      setViewerUrl(null)
    }

    const ipc = window.electron?.ipcRenderer
    if (ipc) {
      ipc.on('viewer-ready', handleViewerReady)
      ipc.on('bot-error', handleError)
    }

    return () => {
      if (ipc) {
        ipc.removeAllListeners('viewer-ready')
        ipc.removeAllListeners('bot-error')
      }
    }
  }, [])

  // 当viewerUrl变化时，重新加载iframe
  useEffect(() => {
    if (viewerUrl && iframeRef.current) {
      iframeRef.current.src = viewerUrl
    }
  }, [viewerUrl])

  const ipcHandle = (): void => {
    if (!username.trim() || !host.trim()) {
      alert('请输入服务器IP和用户名')
      return
    }

    setIsConnecting(true)
    setError(null)
    setViewerUrl(null)
    window.electron?.ipcRenderer?.send('startBot', username, host)
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(e.target.value)
  }

  const handleHostChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setHost(e.target.value)
  }

  const openViewerInBrowser = (): void => {
    if (viewerUrl) {
      window.open(viewerUrl, '_blank')
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="actions" style={{ marginBottom: '20px' }}>
        <div className="action" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            id="host"
            placeholder="输入服务器IP"
            value={host}
            onChange={handleHostChange}
            style={{ padding: '8px', flex: 1, minWidth: '200px' }}
          />
          <input
            id="username"
            placeholder="输入用户名"
            value={username}
            onChange={handleUsernameChange}
            style={{ padding: '8px', flex: 1, minWidth: '150px' }}
          />
          <button
            onClick={ipcHandle}
            disabled={isConnecting}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: isConnecting ? 0.7 : 1
            }}
          >
            {isConnecting ? '连接中...' : '加入服务器'}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '10px' }}>游戏画面</h3>
        <div
          style={{
            width: '100%',
            height: '600px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <iframe
            ref={iframeRef}
            src={viewerUrl || 'http://localhost:3000'}
            width="100%"
            height="100%"
            title="Minecraft Viewer"
            style={{ backgroundColor: '#000' }}
          />
        </div>
      </div>

      {viewerUrl && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px'
          }}
        >
          <p style={{ margin: '0 0 10px 0' }}>
            <button
              onClick={openViewerInBrowser}
              style={{
                padding: '5px 10px',
                marginRight: '10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              在浏览器中打开 viewer
            </button>
            <span style={{ color: '#666' }}>Viewer 地址: {viewerUrl}</span>
          </p>
          <p style={{ margin: '0', fontSize: '0.9em', color: '#666' }}>
            提示: 可以使用WASD键移动，鼠标控制视角，空格跳跃，左Shift潜行
          </p>
        </div>
      )}

      <Versions></Versions>
    </div>
  )
}

export default App
