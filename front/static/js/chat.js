const urlId = getUrlId()

function getUrlId() {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("id")
    if (id == null) {
        window.location.href = "/chats"
    }
    return id
}

loadPage(false)

async function loadPage(once) {
    try {
        const chatData = await axios.get(`/api/chats/${urlId}`)
        const chat = chatData.data.chat
        if (chat == "NULL") {
            console.log("Chat not found")
        } else {
            const chatName = document.querySelector("#chatName")
            chatName.innerHTML = chat.name
            const user = await axios.get(`/api/userid/self`)
            const userId = user.data.userId
            renderCards(chat, userId, once)
        }
    } catch (err) {
        console.log(err)
    }
}

async function renderCards(chat, userId, once) {
    try {
        const cards = document.querySelector("#message-list")
        cards.innerHTML = ""
        for (const message of chat.messages) {
            if (message.sender == userId) {
                cards.innerHTML += createCard(message, "me")
            } else {
                const user = await axios.get(`/api/username/${message.sender}`)
                const username = user.data.username
                cards.innerHTML += createCard(message, username)
            }
        }
        cards.scrollTop = cards.scrollHeight;
        if (!once) {
            checkForUpdates(chat.updatedAt, userId)
        }
    } catch (err) {
        console.log(err)
    }
}

function createCard(message, username) {
    let orient = "left"
    if (username == "me") {
        orient = "right"
    }
    const messageDate = new Date(message.sentAt)
    let messageHour = messageDate.getHours()
    let messageMinute = messageDate.getMinutes()
    let messageTime = new Date()
    if (messageTime.getHours() == messageHour && messageTime.getMinutes() == messageMinute) {
        messageTime = "Now"
    } else {
        if (messageHour < 10) {
            messageHour = "0" + messageHour
        }
        if (messageMinute < 10) {
            messageMinute = "0" + messageMinute
        }
        messageTime = messageHour + ":" + messageMinute
    }
    const card = `
    <div class="msg ${orient}-msg">
      <div class="msg-img" style="background-image: url(img/user.png)"></div>
      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${username}</div>
          <div class="msg-info-time">${messageTime}</div>
        </div>
        <div class="msg-text">${message.content}</div>
      </div>
    </div>`
    return card
}

async function preRenderCards(userId) {
    try {
        const chatData = await axios.get(`/api/chats/${urlId}`)
        const chat = chatData.data.chat
        renderCards(chat, userId, false)
    } catch (err) {
        console.log(err)
    }
}

async function checkForUpdates(chatUpdatedAt, userId) {
    try {
        await sleep(5000)
        const newUpdated = await axios.get(`/api/chats/${urlId}/updated`)
        const newUpdatedAt = newUpdated.data.updatedAt
        if (chatUpdatedAt == newUpdatedAt) {
            checkForUpdates(chatUpdatedAt, userId)
        } else {
            preRenderCards(userId)
        }
    } catch (err) {
        console.log(err)
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const sendButton = document.querySelector("#send-button")
sendButton.addEventListener("click", getInput)
document.querySelector('#message').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      getInput()
    }
});
async function getInput() {
    try {
        const message = document.querySelector("#message")
        await axios.post(`/api/chats/${urlId}/messages`, {content: message.value})
        message.value = ""
        loadPage(true)
    } catch (err) {
        console.log(err)
    }
}
