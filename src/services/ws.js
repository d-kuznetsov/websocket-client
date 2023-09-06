class WebSocketService {
  constructor() {
    this.socket = null
    this.onMessageCallbacks = []
  }

  connect() {
    this.socket = new WebSocket(import.meta.env.VITE_WEB_SOCKET_API)

    this.socket.addEventListener('open', (event) => {
      console.log('WebSocket connection opened:', event)
    })

    this.socket.addEventListener('close', (event) => {
      console.log('WebSocket connection closed:', event)
    })

    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data)
      this.onMessageCallbacks.forEach((callback) => callback(message))
    })
  }

  sendMessage(message) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    }
  }

  subscribe(...callbacks) {
    this.onMessageCallbacks.push(...callbacks)
  }

  unsubscribe(...callbacks) {
    this.onMessageCallbacks = this.onMessageCallbacks.filter((fn) => {
      return ![...callbacks].find((fn2) => fn2 == fn)
    })
  }

  close() {
    this.socket.close()
  }
}

export default WebSocketService
