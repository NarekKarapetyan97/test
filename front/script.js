const socket = io('http://localhost:5001')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const showname = document.getElementById('showname')
const feedback = document.getElementById('feedback')

const d = new Date()
const date = d.toLocaleString()

socket.on('chat-message', (data) => {
    feedback.innerHTML = ''
    appendMessage(`${data.name}: ${data.message}: ${date}`)
    data.date = date
})

socket.emit('online-user', showname.innerHTML)
socket.on('user-connected', (name) => {
    appendConnection(`${name} connected`)
})

messageInput.addEventListener('keypress', function () {
    socket.emit('typing', showname.innerHTML)
})

socket.on('typing', function (name) {
    feedback.innerHTML = '<p><em>' + name + ' is typing a message..</em></p>'
})

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message} ${date}`)

    socket.emit('send-chat-message', { message, showname: showname.innerHTML })
    messageInput.value = ''
})

function appendMessage(sendmessage) {
    const messageElement = document.createElement('div')
    messageElement.innerText = JSON.stringify(sendmessage)
    messageContainer.append(messageElement)
    messageElement.setAttribute('class', 'your-message')
}

function appendConnection(userConnected) {
    const connectedElement = document.createElement('div')
    connectedElement.innerText = JSON.stringify(userConnected)
    messageContainer.append(connectedElement)
    connectedElement.setAttribute('class', 'userConnected')
}
