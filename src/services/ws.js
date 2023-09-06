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

  addMessageListener(callback) {
    this.onMessageCallbacks.push(callback)
  }

  close() {
    this.socket.close()
  }
}

export default WebSocketService
