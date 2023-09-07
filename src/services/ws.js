class WebSocketService {
  constructor() {
    this.socket = null
    this.errorHandlers = []
    this.messageHandlers = {}
  }

  connect() {
    this.socket = new WebSocket(import.meta.env.VITE_WEB_SOCKET_API)

    this.socket.addEventListener('close', () => {
      this.errorHandlers.forEach((handler) => handler())
    })

    this.socket.addEventListener('error', () => {
      this.errorHandlers.forEach((handler) => handler())
    })

    this.socket.addEventListener('message', (event) => {
      const { type, data } = JSON.parse(event.data)
      this.messageHandlers[type] && this.messageHandlers[type].forEach((handler) => handler(data))
    })
  }

  sendMessage(message) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    }
  }

  addMessageHandler(type, handler) {
    if (!this.messageHandlers[type]) {
      this.messageHandlers[type] = []
    }
    this.messageHandlers[type].push(handler)
  }

  addErrorHandler(handler) {
    this.errorHandlers.push(handler)
  }

  close() {
    this.socket.close()
  }
}

export default WebSocketService
