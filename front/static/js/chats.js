loadPage()
let madeChats

async function loadPage() {
    try {
        const chats = await axios.get("/api/chats")
        madeChats = 0
        renderCards(chats.data.chats)
        navbar.innerHTML = ""
        navbar.innerHTML+=`<a href="/profile"><button class="transparent-btn card-link nav-button" ><i  class="fa fa-user fa-2x"></i></button></a>`
        checkForMadeCards(chats.data.chats.length)
    } catch (err) {
        console.log(err)
    }
}

function addEventListeners() {
    const chatBtns = [...document.querySelectorAll("#chat-button")]
    chatBtns.forEach((btn) =>
        btn.addEventListener("click", () => {
            window.location.href = `chat?id=${getId(btn)}`
        })
    )
}

async function renderCards(chats) {
    try {
        const cards = document.querySelector("#chat-list")
        cards.innerHTML = ""
        chats.forEach (async (chatId) => {
            try {
                const chatSmall = await axios.get(`/api/chats/${chatId}/small`)
                const latestMessageDate = new Date(chatSmall.data.time)
                let latestMessageHour = latestMessageDate.getHours()
                let latestMessageMinute = latestMessageDate.getMinutes()
                let latestMessageTime = new Date()
                if (latestMessageTime.getHours() == latestMessageHour && latestMessageTime.getMinutes() == latestMessageMinute) {
                    latestMessageTime = "Now"
                } else {
                    if (latestMessageHour < 10) {
                        latestMessageHour = "0" + latestMessageHour
                    }
                    if (latestMessageMinute < 10) {
                        latestMessageMinute = "0" + latestMessageMinute
                    }
                    latestMessageTime = latestMessageHour + ":" + latestMessageMinute
                }
                cards.innerHTML += createCard(chatId, chatSmall.data.chatName, chatSmall.data.latestMessage, latestMessageTime)
                madeChats++
            } catch (err) {
                console.log(err)
            }
        })
    } catch (err) {
        console.log(err)
    }
}

function createCard(chatId, chatName, latestMessage, latestMessageTime) {
    const card = `
    <div chat-id="${chatId}" class="friend-drawer friend-drawer--onhover">
        <img class="profile-image" src="img/user-white.png" alt="">
        <div class="text">
            <span class="time text-muted small">${latestMessageTime}</span>
            <h6>${chatName}</h6>
            <p class="text-muted">${latestMessage}</p>
        </div>
        <button id="chat-button" type="button" class="btn btn-primary">Show messages</button>
    </div>`
    return card
}

function getId(btn) {
    const parent = btn.parentElement
    const id = parent.getAttribute("chat-id")
    return id
}

async function checkForMadeCards(chatLength) {
    try {
        await sleep(1000)
        if (madeChats == chatLength) {
            addEventListeners()
            await sleep(30000)
            loadPage()
        } else {
            checkForMadeCards(chatLength)
        }
    } catch (err) {
        console.log(err)
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const sendButton = document.querySelector("#start-chat-button")
sendButton.addEventListener("click", getInput)

async function getInput() {
    try {
        const chatName = document.querySelector("#chatName")
        const participantsString = document.querySelector("#participants")
        const participantsStringTrimmed = participantsString.value.replace(/\s+/g, '')
        const participants = participantsStringTrimmed.split(",")
        const newChat = {
            name: chatName.value,
            participants: participants
        }
        await axios.post("/api/chats", newChat)
        chatName.value = ""
        participantsString.value = ""
        loadPage()
    } catch (err) {
        console.log(err)
    }
}