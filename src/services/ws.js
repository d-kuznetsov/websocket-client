class WebSocketService {
  constructor() {
    this.socket = null
    this.messageHandlers = []
    this.errorHandlers = []
    this.closeHandlers = []
    this.msgHendlers = {}
  }

  connect() {
    this.socket = new WebSocket(import.meta.env.VITE_WEB_SOCKET_API)

    this.socket.addEventListener('open', (event) => {
      console.log('WebSocket connection opened:', event)
    })

    this.socket.addEventListener('close', (event) => {
      console.log('WebSocket connection closed:', event)
      this.closeHandlers.forEach((handler) => handler())
    })

    this.socket.addEventListener('error', (event) => {
      console.log('WebSocket connection closed:', event)
      this.errorHandlers.forEach((handler) => handler())
    })

    this.socket.addEventListener('message', (event) => {
      const { type, data } = JSON.parse(event.data)
      this.msgHendlers[type] && this.msgHendlers[type].forEach((handler) => handler(data))
    })
  }

  sendMessage(message) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    }
  }

  addMessageHandlers(type, handler) {
    if (!this.msgHendlers[type]) {
      this.msgHendlers[type] = []
    }
    this.msgHendlers[type].push(handler)
  }

  addCloseHandler(handler) {
    this.closeHandlers.push(handler)
  }

  addErrorHandler(handler) {
    this.errorHandlers.push(handler)
  }

  close() {
    this.socket.close()
  }
}

export default WebSocketService
