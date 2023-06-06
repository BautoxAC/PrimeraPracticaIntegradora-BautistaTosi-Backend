const socket = io()
const nameU = document.getElementById("userName")
const passwordU = document.getElementById("userPassword")
const submitButton = document.getElementById("buttonSumbit")

submitButton.addEventListener("click", (e) => {
    e.preventDefault()
    if (String(nameU.value) && String(passwordU.value)) {
        socket.emit("new_user_front_to_back", { userName: nameU.value, userPassword: passwordU.value })
    } else {
        alert("tanto en usuario como la contraseña deben ser texto y son requeridos")
    }
})
socket.on("logged_back_to_front", (data) => {
    if (!data.status) {
        alert(data.message)
    } else {
        alert(data.message)
        const url = "http://localhost:8080/chat?logged=" + data.status + "&user=" + data.data
        window.location.href = url
    }
}
)

