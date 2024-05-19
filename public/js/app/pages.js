const selectedPages = []
const pagesSets = []

let quantityPages;
let idAccount;

function openSelectAccount() {
    const popup = document.querySelector("#popup-select-account")

    popup.classList.remove("hidden")
}

function closeSelectAccount() {
    const popup = document.querySelector("#popup-select-account")

    popup.classList.add("hidden")
}


function openSelectPages() {
    const popup = document.querySelector("#popup-select-pages")

    popup.classList.remove("hidden")
}

function closeSelectPages() {
    const popup = document.querySelector("#popup-select-pages")

    popup.classList.add("hidden")
}


function openCreateSet() {
    const popup = document.querySelector("#popup-create-set")

    popup.classList.remove("hidden")
}

function closeCreateSet() {
    const popup = document.querySelector("#popup-create-set")

    popup.classList.add("hidden")
}


function selectPage(idPage, idAccount, typeAction) {
    if (selectedPages.length != quantityPages) {
        if (typeAction == "import") {
            const findPage = selectedPages.find(page => page.id == idPage)

            if (!findPage) {
                const select = document.querySelector(`#select-page-${idPage}-import`).classList.add("hidden")
                const unselect = document.querySelector(`#unselect-page-${idPage}-import`).classList.remove("hidden")
        
                selectedPages.push({id: idPage, idAccount: idAccount})
            }
        } else if (typeAction == "set") {
            const findPage = pagesSets.find(page => page.idPage == idPage)

            if (!findPage) {
                const select = document.querySelector(`#select-page-${idPage}-set`).classList.add("hidden")
                const unselect = document.querySelector(`#unselect-page-${idPage}-set`).classList.remove("hidden")
        
                pagesSets.push({idPage: idPage, idAccount: idAccount})
            }
        }
    } else {
        alertMessage("error", "Limite de páginas atingido")
    }
}

function unselectPage(idPage, idAccount, typeAction) {
    if (typeAction == "import") {
        const indexToRemove = selectedPages.findIndex(page => page.id == idPage && page.idAccount == idAccount);
        
        if (indexToRemove !== -1) {
            selectedPages.splice(indexToRemove, 1);
        }
    } else if (typeAction == "set") {
        const indexToRemove = pagesSets.findIndex(page => page.idPage == idPage && page.idAccount == idAccount);

        if (indexToRemove !== -1) {
            pagesSets.splice(indexToRemove, 1);
        }
    }

    const select = document.querySelector(`#select-page-${idPage}-${typeAction}`).classList.remove("hidden")
    const unselect = document.querySelector(`#unselect-page-${idPage}-${typeAction}`).classList.add("hidden")
}


async function getPages(id) {
    closeSelectAccount()

    idAccount = id

    const loading = document.querySelector("#loading")
    loading.classList.remove("hidden")

    fetch("/app/get-pages-account/" + id, {
        method: "POST"
    })
    .then(async (response) => {
        loading.classList.add("hidden")

        if (response.status == 200) {
            const data = await response.json()

            const popup = document.querySelector("#popup-select-pages").classList.remove("hidden")
            const listPages = document.getElementById("list-pages")
            listPages.innerHTML = ""

            if (data.results.length > 0) {
                for (const page of data.results) {
                    const pageElement = `
                        <div class="py-4 border-b border-gray-200">
                            <div class="flex flex-wrap items-center justify-between">
                                <div class="flex items-center">
                                    <img class="w-10 sm:w-12 h-10 sm:h-12 mr-4 rounded-full" src="${page.photo}">
                                    <div>
                                        <h4 class="font-semibold leading-6 text-gray-800">${page.name}</h4>
                                    </div>
                                </div>
                
                                <div class="flex items-center">
                                    <button id="select-page-${page.idPage}-import" onclick="selectPage('${page.idPage}', '${page.idAccount}', 'import')" class="inline-flex items-center justify-center py-1 px-2 text-sm text-purple leading-5 font-semibold bg-purple-100 rounded-xl transition duration-200">Selecionar</button>
                                    <button id="unselect-page-${page.idPage}-import" onclick="unselectPage('${page.idPage}', '${page.idAccount}', 'import')" class="hidden inline-flex items-center justify-center py-1 px-2 text-sm text-red-700 leading-5 font-semibold bg-red-100 rounded-xl transition duration-200">Cancelar</button>
                                </div>
                            </div>
                        </div>
                    `

                    listPages.insertAdjacentHTML("beforeend", pageElement)
                }

                const buttonSavePages = document.getElementById("button-save-pages").classList.remove("hidden")
            } else {
                const emptyElement = `
                    <div class="flex flex-col items-center py-14 text-sm fire-sans">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                            <path stroke="#752A7A" fill-rule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clip-rule="evenodd" />
                            <path stroke="#752A7A" d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                        </svg>
                        <h2 class="mt-4 font-bold text-purple text-lg">Nenhuma página encontrada</h2>
                    </div>
                `

                listPages.insertAdjacentHTML("beforeend", emptyElement)

                const buttonSavePages = document.getElementById("button-save-pages").classList.add("hidden")
            }
        } else {
            const data = await response.json()

            alertMessage("error", data.error)
        }
    })
    .catch((error) => {
        alertMessage("error", "Não foi possível estabeler a conexão com o servidor.")
    })
}

async function saveSelectedPages() {
    closeSelectPages()

    const loading = document.querySelector("#loading")
    loading.classList.remove("hidden")

    fetch(`/app/save-selected-pages/${idAccount}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ pages: selectedPages })
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
        alertMessage("error", "Não foi possível estabeler a conexão com o servidor.")
    })
}

async function removePage(idPage) {
    const loading = document.querySelector("#loading")
    loading.classList.remove("hidden")

    fetch(`/app/remove-page/${idPage}`, {
        method: "DELETE"
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
        alertMessage("error", "Não foi possível estabeler a conexão com o servidor.")
    })
}


async function saveSet() {
    const nameSet = document.getElementById("name-set")

    if (nameSet.value.length == 0) {
        alertMessage("error", "Defina um nome para o conjunto")
        return
    }

    if (pagesSets.length == 0) {
        alertMessage("error", "Selecione as páginas")
        return
    }

    closeCreateSet()

    const loading = document.querySelector("#loading")
    loading.classList.remove("hidden")

    fetch(`/app/save-pages-set`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nameSet.value, pages: pagesSets })
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
        alertMessage("error", "Não foi possível estabeler a conexão com o servidor.")
    })
}

async function deleteSet(name) {
    const loading = document.querySelector("#loading")
    loading.classList.remove("hidden")

    fetch(`/app/delete-pages-set`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name })
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
        alertMessage("error", "Não foi possível estabeler a conexão com o servidor.")
    })
}

document.addEventListener("DOMContentLoaded", function() {
    const scriptElement = document.querySelector('script[src="/js/app/pages.js"]');

    const quantityPagesPlan = scriptElement.getAttribute('data-quantity-pages-plan');
    const quantityPagesUser = scriptElement.getAttribute('data-quantity-pages-user');
    const dataUser = scriptElement.getAttribute('data-user');

    if (dataUser == "false") {
        quantityPages = quantityPagesPlan - quantityPagesUser
    } else {
        quantityPages = 10000
    }
})