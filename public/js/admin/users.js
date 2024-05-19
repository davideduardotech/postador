let currentUser;

function openNewUser() {
    const popup = document.querySelector("#popup-new-user")
    popup.classList.remove("hidden")
}

function closeNewUser() {
    const popup = document.querySelector("#popup-new-user")
    popup.classList.add("hidden")
}

function openUpdateUser(id, name, cpf, phone, email, type) {
    currentUser = id

    const nameInput = document.getElementById("name-update-user").value = name
    const cpfInput = document.getElementById("cpf-update-user").value = cpf
    const phoneInput = document.getElementById("phone-update-user").value = phone
    const emailInput = document.getElementById("email-update-user").value = email
    const typeSelect = document.getElementById("type-update-user")

    for (let i = 0; i < typeSelect.options.length; i++) {
        if (typeSelect.options[i].value === type) {
          typeSelect.options[i].selected = true;
          break
        }
    }

    const popup = document.querySelector("#popup-update-user")
    popup.classList.remove("hidden")
}

function closeUpdateUser() {
    const popup = document.querySelector("#popup-update-user")
    popup.classList.add("hidden")
}

function openDeleteUser(id) {
    currentUser = id

    const popup = document.querySelector("#popup-delete-user")
    popup.classList.remove("hidden")
}

function closeDeleteUser() {
    const popup = document.querySelector("#popup-delete-user")
    popup.classList.add("hidden")
}

async function saveUser() {
    const name = document.getElementById("name-new-user")
    const cpf = document.getElementById("cpf-new-user")
    const phone = document.getElementById("phone-new-user")
    const email = document.getElementById("email-new-user")
    const password = document.getElementById("password-new-user")
    const type = document.getElementById("type-new-user")
    
    if (name.value.length == 0) return alertMessage("error", "Preencha o nome do usuário")
    if (cpf.value.length == 0) return alertMessage("error", "Preencha o CPF do usuário")
    if (phone.value.length == 0) return alertMessage("error", "Preencha o telefone do usuário")
    if (email.value.length == 0) return alertMessage("error", "Preencha o email do usuário")
    if (password.value.length == 0) return alertMessage("error", "Preencha a senha do usuário")

    closeNewUser()

    const loading = document.getElementById("loading")
    loading.classList.remove("hidden")

    fetch('/app/admin/users/save-user', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.value, cpf: cpf.value, phone: phone.value, email: email.value, password: password.value, plan: type.value })
    })
        .then(async (response) => {
            if (response.status == 200) {
                location.reload()
            } else {
                const data = await response.json()

                loading.classList.add("hidden")

                alertMessage("error", data.error)
                return
            }
        })
        .catch((error) => {
            console.log(error)
            loading.classList.add("hidden")
            alertMessage("error", "Não foi possível estabelecer a conexão com o servidor")
        })
}

async function updateUser() {
    const name = document.getElementById("name-update-user")
    const cpf = document.getElementById("cpf-update-user")
    const phone = document.getElementById("phone-update-user")
    const email = document.getElementById("email-update-user")
    const password = document.getElementById("password-update-user")
    const type = document.getElementById("type-update-user")

    if (name.value.length == 0) return alertMessage("error", "Preencha o nome do usuário")
    if (cpf.value.length == 0) return alertMessage("error", "Preencha o CPF do usuário")
    if (phone.value.length == 0) return alertMessage("error", "Preencha o telefone do usuário")
    if (email.value.length == 0) return alertMessage("error", "Preencha o email do usuário")

    closeUpdateUser()

    const loading = document.getElementById("loading")
    loading.classList.remove("hidden")

    fetch(`/app/admin/users/update-user/${currentUser}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.value, cpf: cpf.value, phone: phone.value, email: email.value, password: password.value, plan: type.value })
    })
        .then(async (response) => {
            if (response.status == 200) {
                location.reload()
            } else {
                const data = await response.json()

                loading.classList.add("hidden")

                alertMessage("error", data.error)
                return
            }
        })
        .catch((error) => {
            console.log(error)
            loading.classList.add("hidden")
            alertMessage("error", "Não foi possível estabelecer a conexão com o servidor")
        })
}

async function deleteUser() {
    closeDeleteUser()

    const loading = document.getElementById("loading")
    loading.classList.remove("hidden")

    fetch(`/app/admin/users/delete-user/${currentUser}`, {
        method: 'DELETE',
    })
        .then(async (response) => {
            if (response.status == 200) {
                location.reload()
            } else {
                const data = await response.json()

                loading.classList.add("hidden")

                alertMessage("error", data.error)
                return
            }
        })
        .catch((error) => {
            console.log(error)
            loading.classList.add("hidden")
            alertMessage("error", "Não foi possível estabelecer a conexão com o servidor")
        })
}

window.addEventListener('DOMContentLoaded', function () {
    VMasker(document.getElementById('cpf-new-user')).maskPattern('999.999.999-99');
    VMasker(document.getElementById('phone-new-user')).maskPattern('(99) 99999-9999');

    VMasker(document.getElementById('cpf-update-user')).maskPattern('999.999.999-99');
    VMasker(document.getElementById('phone-update-user')).maskPattern('(99) 99999-9999');
});