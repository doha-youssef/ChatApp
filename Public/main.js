const socket = io()

const msgContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const msgForm = document.getElementById('message-form')
const msgInput = document.getElementById('message-input')
const msgTone = new Audio('/message-tone.mp3')

msgForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
})

function sendMessage() {
    if (msgInput.value === '')
        return
    const data = {
        name: nameInput.value,
        message: msgInput.value,
        dateTime: new Date()
    }
    socket.emit('message', data)
    addMessage(true, data)
    msgInput.value = ''
}

socket.on('chat-message', (data) => {
    msgTone.play();
    addMessage(false, data)
})

function addMessage(isOwn, data) {
    clearTypingMessages();
    const element = `
    <li class="${isOwn ? 'message-right' : 'message-left'}" style="display: block;">
        <p class="message">
          ${data.message}
          <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
        </p>
      </li>
      `
    msgContainer.innerHTML += element
    scrollToBottom();
}

function scrollToBottom() {
    msgContainer.scrollTo(0, msgContainer.scrollHeight)
}

msgInput.addEventListener('focus', (e)=> {
    socket.emit('typing', {
        typing: `✍️ ${nameInput.value} is typing a message...`
    })
})

msgInput.addEventListener('keypress', (e)=> {
    socket.emit('typing', {
        typing: `✍️ ${nameInput.value} is typing a message...`
    })
})

msgInput.addEventListener('blur', (e)=> {
    socket.emit('typing', {
        typing: ''
    })
})

socket.on('typing', (data) => {
    clearTypingMessages();
    const element = `
        <li class="message-typing">
            <p class="typing" id="typing">
                ${data.typing}
            </p>
        </li>`
    msgContainer.innerHTML += element
})

function clearTypingMessages(){
    document.querySelectorAll('li.message-typing').forEach(element => {
        element.parentNode.removeChild(element)
    })
}