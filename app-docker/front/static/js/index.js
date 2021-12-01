loadPage()

async function loadPage() {
    try {
        const authenticated = await axios.get("/api/authenticated")
        const logInOut = document.querySelector("#logInOut")
        const navbar = document.querySelector("#navbar")
        if (authenticated.data.success) {
            logInOut.innerHTML = "Logout"
            navbar.innerHTML = ""
            navbar.innerHTML+=`<a href="/chats"><button class="transparent-btn card-link nav-button"><i class="fa fa-comments fa-2x"></i></button></a>`
            navbar.innerHTML+=`<a href="/profile"><button class="transparent-btn card-link nav-button" ><i  class="fa fa-user fa-2x"></i></button></a>`
        } else {
            logInOut.innerHTML = "Login"
            navbar.innerHTML = ""
        }
    } catch (err) {
        console.log(err)
    }
}