class WebSocketService {
  constructor() {
    this.socket = null
    this.messageHandlers = []
    this.errorHandlers = []
    this.closeHandlers = []
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
      const message = JSON.parse(event.data)
      this.messageHandlers.forEach((callback) => callback(message))
    })
  }

  sendMessage(message) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    }
  }

  addMessageHandlers(...callbacks) {
    this.messageHandlers.push(...callbacks)
  }

  addCloseHandler(handler) {
    this.closeHandlers.push(handler)
  }

  addErrorHandler(handler) {
    this.errorHandlers.push(handler)
  }

  unsubscribe(...callbacks) {
    this.messageHandlers = this.messageHandlers.filter((fn) => {
      return ![...callbacks].find((fn2) => fn2 == fn)
    })
  }

  close() {
    this.socket.close()
  }
}

export default WebSocketService
