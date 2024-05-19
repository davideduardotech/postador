const selectedAccounts = []

function removeAccount(idAccount, platform) {
    const loading = document.getElementById("loading")
    loading.classList.remove("hidden")

    fetch("/app/social-accounts/remove/" + idAccount, {
      method: "DELETE",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform: platform })
    })
    .then((response) => {
        if (response.status == 200) location.reload();
    })
    .catch((err) => {
        loading.classList.add("hidden")
        alertMessage("error", "Tente novamente mais tarde")
    })
}


function openImportAccountInstagram() {
    getAccountsInstagram()
}

function closeImportAccountInstagram() {
    const popup = document.querySelector("#popup-import-account-instagram")
    popup.classList.add("hidden")
}

function selectAccount(idAccount, idPage) {
    const findAccount = selectedAccounts.find(account => account.idAccount == idAccount)

    if (!findAccount) {
        const select = document.querySelector(`#select-account-${idAccount}`).classList.add("hidden")
        const unselect = document.querySelector(`#unselect-account-${idAccount}`).classList.remove("hidden")

        selectedAccounts.push({idAccount: idAccount, idPage: idPage})
    }
}

function unselectAccount(idAccount) {
    const indexToRemove = selectedAccounts.findIndex(account => account.idAccount == idAccount);

    if (indexToRemove !== -1) {
        selectedAccounts.splice(indexToRemove, 1);
    }

    const select = document.querySelector(`#select-account-${idAccount}`).classList.remove("hidden")
    const unselect = document.querySelector(`#unselect-account-${idAccount}`).classList.add("hidden")
}

function importAccountsInstagram() {
    if (selectedAccounts.length > 0) {
        closeImportAccountInstagram()

        const loading = document.getElementById("loading")
        loading.classList.remove("hidden")

        fetch('/app/social-accounts/import-accounts-instagram', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accounts: selectedAccounts })
        })
        .then(async (response) => {
            loading.classList.add("hidden")

            if (response.status == 200) {
                location.reload()
            } else {
                const data = await response.json()

                alertMessage("error", data.error)
            }
        })
        .catch((error) => {
            loading.classList.add("hidden")
            alertMessage("error", error)
        })
    } else {
        alertMessage("error", "Selecione no mínimo uma conta")
    }
}

function getAccountsInstagram() {
    const loading = document.getElementById("loading")
    loading.classList.remove("hidden")

    fetch('/app/social-accounts/get-accounts-instagram', {
        method: 'GET'
    })
    .then(async (response) => {
        loading.classList.add("hidden")

        if (response.status == 200) {
            const data = await response.json()

            const popup = document.querySelector("#popup-import-account-instagram").classList.remove("hidden")
            const listAccountsInstagram = document.getElementById("list-accounts-instagram")
            const selectAccountsArea = document.getElementById("select-accounts-area")
            listAccountsInstagram.innerHTML = ""

            if (data.accountsInstagram.length > 0) {
                for (const account of data.accountsInstagram) {
                    const accountElement = `
                        <div class="mt-4 pb-4 mb-4 border-b border-gray-300">
                            <div class="flex flex-wrap items-center justify-between">
                                <div class="flex items-center">
                                    <img class="w-10 h-10 mr-4 rounded-full" src="${account.profile_picture_url}">
                                    <div>
                                        <h4 class="font-semibold leading-6 text-gray-600">@${account.username}</h4>
                                    </div>
                                </div>
                
                                <div class="flex items-center">
                                    <button id="select-account-${account.id}" onclick="selectAccount('${account.id}', '${account.idPage}')" class="px-2 py-1 rounded-full font-semibold text-sm bg-purple-50 text-purple">Selecionar</button>
                                    <button id="unselect-account-${account.id}" onclick="unselectAccount('${account.id}', '${account.idPage}')" class="px-2 py-1 rounded-full font-semibold text-sm bg-red-50 text-red-700 hidden">Cancelar</button>
                                </div>
                            </div>
                        </div>
                    `

                    listAccountsInstagram.insertAdjacentHTML("beforeend", accountElement)
                }

                const buttonElement = `
                    <div class="px-5">
                        <button class="w-full py-3 bg-purple rounded-xl fire-sans text-sm text-white font-semibold" onclick="importAccountsInstagram()">Importar contas selecionadas</button>
                    </div>
                `

                selectAccountsArea.insertAdjacentHTML("beforeend", buttonElement)
            } else {
                const emptyElement = `
                    <div class="flex flex-col items-center py-14 text-sm fire-sans">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-purple">
                            <path fill-rule="evenodd" d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00.005 10.337.75.75 0 01-.574.812l-3.114.733a9.75 9.75 0 01-6.594-.77l-.108-.054a8.25 8.25 0 00-5.69-.625l-2.202.55V21a.75.75 0 01-1.5 0V3A.75.75 0 013 2.25z" clip-rule="evenodd" />
                        </svg>       
                        <h2 class="mt-4 font-bold text-purple text-lg">Nenhuma página encontrada</h2>
                        <p class="mt-2 text-gray-800 text-center px-6">Você precisar conectar a sua conta profissional do Instagram à uma página do Facebook. Saiba mais clicando <a class="underline text-purple" href="https://help.instagram.com/570895513091465" target="_blank">clicando aqui</a>.</p>
                    </div>
                `

                listAccountsInstagram.insertAdjacentHTML("beforeend", emptyElement)
            }
        } else {
            const data = await response.json()

            alertMessage("error", data.error)
        }
    })
    .catch((error) => {
        loading.classList.add("hidden")
        alertMessage("error", error)
    })
}