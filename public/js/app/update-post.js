let typePost;
const content = document.getElementById("content")

const linkSelectedArea = document.getElementById("link-selected-area")
const linkSelectedContent = document.getElementById("link-selected-content")

const selectMediaArea = document.getElementById("select-media")

const mediaSelectedArea = document.getElementById("media-selected-area")
const imageInput = document.getElementById("image-input")
const videoInput = document.getElementById("video-input")

const imageSelectedPreview = document.getElementById("image-selected-preview")
const linkSelectedPreview = document.getElementById("link-selected-preview")

const selectedItems = document.getElementById('selected-items')

let link = ""
let isSchedule;
let isPublished;
let changeMedia = false

const media = []
const groups = []
const pages = []
const accountsInstagram = []


function loadData() {
    const scriptElement = document.querySelector('script[src="/js/app/update-post.js"]');

    const postData = scriptElement.getAttribute('data-post');

    const postObject = JSON.parse(postData)

    content.value = postObject.content

    for (const page of postObject.pages) {
        addPage(page.idPage, page.idAccount, page.photo)
    }

    for (const group of postObject.groups) {
        addGroup(group.idGroup, group.idAccount, group.photo)
    }

    for (const account of postObject.accountsInstagram) {
        addAccountInstagram(account.idAccount, account.photo)
    }

    if (!postObject.isPublished) {
        isPublished = false

        if (postObject.isSchedule) {
            isSchedule = true

            const schedule = document.querySelector('#schedule-true').checked = true

            const dateObject = new Date(postObject.createdAt);

            const dayInput = document.getElementById("day");
            dayInput.valueAsDate = dateObject;

            const hourInput = document.getElementById("hour");
            hourInput.value = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            openSchedule()
        } else {
            isSchedule = false
        }
        
        if (postObject.typePost == "text-link") {
            typePost = "text-link"
            link = postObject.link
            selectMediaArea.classList.add("hidden")
            linkSelectedArea.classList.remove("hidden")
            linkSelectedContent.innerText = postObject.link
        } else if (postObject.typePost == "media") {
            typePost = "media"
            mediaSelectedArea.classList.remove("hidden")

            const html = `
                <div id="${postObject.media}" class="w-full p-3 mb-6 bg-white border border-coolGray-200 rounded-md">
                    <div class="flex flex-wrap items-center justify-between">
                        <p class="flex w-full sm:w-auto items-center">
                            <img src="${postObject.media}" class="h-14 rounded-lg">
                            <span class="ml-2.5 text-coolGray-800 font-medium">${postObject.media}</span>
                        </p>
                        <button onclick="deleteMedia('${postObject.media}', 'update')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-purple">
                                <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
                            </svg>                  
                        </button>
                    </div>
                </div>
            `

            media.push(postObject.media)

            mediaSelectedArea.insertAdjacentHTML("beforeend", html)
        }
    } else {
        isPublished = true

        selectMediaArea.classList.add("hidden")
    }
}


function openSelectPopup() {
    const popup = document.getElementById("popup-select")
    popup.classList.remove("hidden")
}

function closeSelectPopup() {
    const popup = document.getElementById("popup-select")
    popup.classList.add("hidden")
}


function openSelect(selectId) {
    const selects = ["select-pages", "select-groups", "select-instagram", "select-sets"];

    for (const select of selects) {
        const element = document.getElementById(select);
        const buttonElement = document.getElementById(`button-${select}`);

        if (select === selectId) {
            element.classList.remove("hidden");
            buttonElement.classList.remove("text-purple");
            buttonElement.classList.add("bg-purple", "text-white");
        } else {
            element.classList.add("hidden");
            buttonElement.classList.add("text-purple");
            buttonElement.classList.remove("bg-purple", "text-white");
        }
    }
}


function openPreview() {
    const popup = document.getElementById("popup-preview")
    popup.classList.remove("hidden")

    const imgPreviewArea = document.getElementById("img-preview-area")
    const imgPreviewSrc = document.getElementById("img-preview-src")

    const linkPreviewArea = document.getElementById("link-preview-area")
    const linkPreviewContent = document.getElementById("link-preview-content")
    
    const contentPost = document.getElementById("content")
    const contentPreview = document.getElementById("content-preview").innerText = contentPost.value

    imgPreviewArea.classList.add("hidden")
    linkPreviewArea.classList.add("hidden")

    if (media.length > 0) {
        imgPreviewArea.classList.remove("hidden")
        imgPreviewSrc.src = `${media[0]}`
    } else {
        linkPreviewArea.classList.remove("hidden")
        linkPreviewContent.innerText = link
    }
}

function closePreview() {
    const popup = document.getElementById("popup-preview")

    popup.classList.add("hidden")
}


function selectImage() {
    if (!isPublished) {
        typePost = "media"
        changeMedia = true
        mediaSelectedArea.classList.remove("hidden")

        var chars = 'abcdefghijklmnopqrstuvwxyz';
        var id = '';

        for (var i = 0; i < chars.length; i++) {
            var random = Math.floor(Math.random() * chars.length);
            id += chars.charAt(random);
        }

        const html = `
            <div id="${id}" class="w-full p-3 mb-6 bg-white border border-coolGray-200 rounded-md">
                <div class="flex flex-wrap items-center justify-between">
                    <p class="flex w-full sm:w-auto items-center">
                        <img src="${URL.createObjectURL(imageInput.files[0])}" class="h-14 rounded-lg">
                        <span class="ml-2.5 text-coolGray-800 font-medium">${imageInput.files[0].name}</span>
                    </p>
                    <button onclick="deleteMedia('${id}', 'new')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-purple">
                            <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
                        </svg>                  
                    </button>
                </div>
            </div>
        `

        imageInput.files[0].id = id

        media.push(imageInput.files[0])

        mediaSelectedArea.insertAdjacentHTML("beforeend", html)

        imageInput.files = []
    } else {
        alertMessage("error", "Não é possível adicionar imagens")
    }
}

function selectVideo() {
    if (!isPublished) {
        typePost = "media"
        changeMedia = true
        mediaSelectedArea.classList.remove("hidden")

        var chars = 'abcdefghijklmnopqrstuvwxyz';
        var id = '';

        for (var i = 0; i < chars.length; i++) {
            var random = Math.floor(Math.random() * chars.length);
            id += chars.charAt(random);
        }

        const html = `
            <div id="${id}" class="w-full p-3 mb-6 bg-white border border-coolGray-200 rounded-md">
                <div class="flex flex-wrap items-center justify-between">
                    <div class="flex w-full sm:w-auto items-center">
                        <video class="w-48 h-24 rounded-lg" controls>
                            <source src="${URL.createObjectURL(videoInput.files[0])}" type="video/mp4">
                        </video>
                        <span class="ml-2.5 text-coolGray-800 font-medium">${videoInput.files[0].name}</span>
                    </div>
                    <button onclick="deleteMedia('${id}', 'new')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-purple">
                            <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
                        </svg>                  
                    </button>
                </div>
            </div>
        `

        videoInput.files[0].id = id

        media.push(videoInput.files[0])

        mediaSelectedArea.insertAdjacentHTML("beforeend", html)

        videoInput.files = []
    } else {
        alertMessage("error", "Não é possível adicionar imagens")
    }
}

function deleteMedia(id, type) {
    const mediaRemove = document.getElementById(id);
    mediaRemove.remove()

    if (type == "new") {
        const indexToRemove = media.findIndex(item => item.id == id);

        if (indexToRemove !== -1) {
            media.splice(indexToRemove, 1);
        }
    } else if (type == "update") {
        const indexToRemove = media.findIndex(item => item == id);

        if (indexToRemove !== -1) {
            media.splice(indexToRemove, 1);
        }
    }

    if (media.length == 0) {
        typePost = ""
    }
}


function addPage(idPage, idAccount, photo) {
    if (!isPublished) {
        const findPage = pages.find(item => item.idPage == idPage)

        if (!findPage) {
            const add = document.querySelector(`#add-page${idPage}`).classList.add("hidden")
            const remove = document.querySelector(`#del-page${idPage}`).classList.remove("hidden")

            const addPageSet = document.querySelector(`#add-page${idPage}-set`)
            const removePageSet = document.querySelector(`#del-page${idPage}-set`)

            if (addPageSet && removePageSet) {
                addPageSet.classList.add("hidden")
                removePageSet.classList.remove("hidden")
            }

            pages.push({ idPage: idPage, idAccount: idAccount, photo: photo })

            let image = document.createElement('img')
            image.classList.add("w-8", "h-8", "rounded-full", `img-${idPage}`)
            image.src = photo

            selectedItems.appendChild(image);
        }
    } else {
        alertMessage("error", "Não é possível adicionar páginas")
    }
}

function delPage(idPage) {
    const add = document.querySelector(`#add-page${idPage}`).classList.remove("hidden")
    const remove = document.querySelector(`#del-page${idPage}`).classList.add("hidden")

    const addPageSet = document.querySelector(`#add-page${idPage}-set`)
    const removePageSet = document.querySelector(`#del-page${idPage}-set`)

    if (addPageSet && removePageSet) {
        addPageSet.classList.remove("hidden")
        removePageSet.classList.add("hidden")
    }

    const indexToRemove = pages.findIndex(item => item.idPage == idPage);

    if (indexToRemove !== -1) {
        pages.splice(indexToRemove, 1);
    }

    const imageToDelete = document.querySelector(`.img-${idPage}`);
    imageToDelete.remove();
}


function addGroup(idGroup, idAccount, photo) {
    if (!isPublished) {
        const findGroup = groups.find(item => item.idGroup == idGroup)

        if (!findGroup) {
            const add = document.querySelector(`#add-group${idGroup}`).classList.add("hidden")
            const remove = document.querySelector(`#del-group${idGroup}`).classList.remove("hidden")

            const addGroupSet = document.querySelector(`#add-group${idGroup}-set`)
            const removeGroupSet = document.querySelector(`#del-group${idGroup}-set`)

            if (addGroupSet && removeGroupSet) {
                addGroupSet.classList.add("hidden")
                removeGroupSet.classList.remove("hidden")
            }

            groups.push({ idGroup: idGroup, idAccount: idAccount, photo: photo })

            let image = document.createElement('img')
            image.classList.add("w-8", "h-8", "rounded-full", `img-${idGroup}`)

            if (photo.length > 0) {
                image.src = photo

                selectedItems.appendChild(image);
            } else {
                const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("width", "30");
                svg.setAttribute("height", "30");
                svg.setAttribute("viewBox", "0 0 30 30");
                svg.setAttribute("fill", "none");
                svg.classList.add(`img${idGroup}`)

                const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
                group.setAttribute("clip-path", "url(#clip0_111_100)");

                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", "M14.9212 4.71216C12.3376 4.71216 10.2432 7.15741 10.2432 10.1738C10.2432 12.2657 11.2506 14.0826 12.7299 15L11.0145 15.795L6.44948 17.9122C6.00848 18.1327 5.78838 18.5066 5.78838 19.0359C5.78838 20.7117 5.78838 22.3875 5.78838 24.0634C5.82465 24.692 6.2018 25.2778 6.81328 25.2878H23.0538C23.7519 25.2271 24.105 24.6648 24.1119 24.0634C24.1119 22.3876 24.1119 20.7117 24.1119 19.0359C24.1119 18.5066 23.8918 18.1327 23.4508 17.9122L19.0511 15.795L17.2227 14.9287C18.6413 13.9907 19.5992 12.2131 19.5992 10.1738C19.5992 7.15741 17.5047 4.71216 14.9212 4.71216ZM7.37558 6.63276C6.26375 6.67498 5.3826 7.15608 4.71315 7.92266C3.97265 8.84561 3.61165 9.94141 3.60467 11.0315C3.65015 12.6435 4.3714 14.1695 5.6554 14.9677L0.529075 17.3499C0.17625 17.4822 0 17.7909 0 18.276V22.3109C0.02755 22.8461 0.3054 23.2958 0.826375 23.3035H4.23348V19.0359C4.28985 17.8949 4.82565 16.9726 5.78838 16.5226L9.19455 14.9022C9.45915 14.7478 9.71283 14.538 9.95538 14.2734C8.55098 12.1065 8.35595 9.51108 9.26105 7.22833C8.67237 6.86806 8.0108 6.63653 7.37558 6.63276ZM22.5902 6.63276C21.8632 6.64798 21.1912 6.91573 20.6393 7.29386C21.5197 9.59728 21.2768 12.1943 19.9772 14.2069C20.2639 14.5376 20.5623 14.7913 20.871 14.9677L24.1452 16.5226C25.1426 17.0696 25.6569 18 25.6668 19.0359V23.3036H29.1727C29.7492 23.2538 29.995 22.7939 30 22.311V18.276C30 17.835 29.8238 17.5263 29.4709 17.3499L24.4102 14.9344C25.7226 13.9667 26.3816 12.5164 26.3944 11.0315C26.3595 9.85621 26.0004 8.76491 25.2859 7.92266C24.5392 7.11268 23.6132 6.64133 22.5902 6.63276Z");
                path.setAttribute("fill", "#752a7a");

                const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
                const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
                clipPath.setAttribute("id", "clip0_111_100");

                const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("width", "30");
                rect.setAttribute("height", "30");
                rect.setAttribute("fill", "white");

                clipPath.appendChild(rect);
                defs.appendChild(clipPath);
                group.appendChild(path);
                svg.appendChild(group);
                svg.appendChild(defs);

                selectedItems.appendChild(svg)
            }
        }
    } else {
        alertMessage("error", "Não é possível adicionar grupos")
    }
}

function delGroup(idGroup) {
    const add = document.querySelector(`#add-group${idGroup}`).classList.remove("hidden")
    const remove = document.querySelector(`#del-group${idGroup}`).classList.add("hidden")

    const addGroupSet = document.querySelector(`#add-group${idGroup}-set`)
    const removeGroupSet = document.querySelector(`#del-group${idGroup}-set`)

    if (addGroupSet && removeGroupSet) {
        addGroupSet.classList.remove("hidden")
        removeGroupSet.classList.add("hidden")
    }

    const indexToRemove = groups.findIndex(item => item.idGroup == idGroup);

    if (indexToRemove !== -1) {
        groups.splice(indexToRemove, 1);
    }

    const imageToDelete = document.querySelector(`.img-${idGroup}`);
    imageToDelete.remove();
}


function addAccountInstagram(idAccount, photo) {
    if (!isPublished) {
        const findAccount = accountsInstagram.find(item => item.idAccount == idAccount)

        if (!findAccount) {
            const add = document.querySelector(`#add-account-instagram${idAccount}`).classList.add("hidden")
            const remove = document.querySelector(`#del-account-instagram${idAccount}`).classList.remove("hidden")

            accountsInstagram.push({ idAccount: idAccount, photo: photo })

            let image = document.createElement('img')
            image.classList.add("w-8", "h-8", "rounded-full", `img-${idAccount}`)
            image.src = photo

            selectedItems.appendChild(image);
        }
    } else {
        alertMessage("error", "Não é possível adicionar contas do Instagram")
    }
}

function delAccountInstagram(idAccount) {
    const add = document.querySelector(`#add-account-instagram${idAccount}`).classList.remove("hidden")
    const remove = document.querySelector(`#del-account-instagram${idAccount}`).classList.add("hidden")

    const indexToRemove = accountsInstagram.findIndex(item => item.idAccount == idAccount);

    if (indexToRemove !== -1) {
        accountsInstagram.splice(indexToRemove, 1);
    }

    const imageToDelete = document.querySelector(`.img-${idAccount}`);
    imageToDelete.remove();
}


function selectAll(items, type, nameSet) {
    const itemsJson = JSON.parse(items)

    if (type == "pages" || type == "set-pages") {
        for (const item of itemsJson) {
            addPage(item.idPage, item.idAccount, item.photo)
        }
    } else if (type == "groups" || type == "set-groups") {
        for (const item of itemsJson) {
            addGroup(item.idGroup, item.idAccount, item.photo)
        }
    } else if (type == "instagram") {
        for (const item of itemsJson) {
            addAccountInstagram(item.idAccount, item.photo)
        }
    }

    if (nameSet != undefined) {
        document.getElementById(`select-all-${type}-${nameSet}`).classList.add("hidden")
        document.getElementById(`unselect-all-${type}-${nameSet}`).classList.remove("hidden")
    } else {
        document.getElementById(`select-all-${type}`).classList.add("hidden")
        document.getElementById(`unselect-all-${type}`).classList.remove("hidden")
    }
}

function unselectAll(items, type, nameSet) {
    const itemsJson = JSON.parse(items)

    if (type == "pages" || type == "set-pages") {
        for (const item of itemsJson) {
            delPage(item.idPage)
        }
    } else if (type == "groups" || type == "set-groups") {
        for (const item of itemsJson) {
            delGroup(item.idGroup)
        }
    } else if (type == "instagram") {
        for (const item of itemsJson) {
            delAccountInstagram(item.idAccount)
        }
    }

    if (nameSet != undefined) {
        document.getElementById(`select-all-${type}-${nameSet}`).classList.remove("hidden")
        document.getElementById(`unselect-all-${type}-${nameSet}`).classList.add("hidden")
    } else {
        document.getElementById(`select-all-${type}`).classList.remove("hidden")
        document.getElementById(`unselect-all-${type}`).classList.add("hidden")
    }
}


// Open schedule
function openSchedule() {
    const schedule = document.getElementById("schedule").classList.remove("hidden")
}

function closeSchedule() {
    const schedule = document.getElementById("schedule").classList.add("hidden")
}




function openPreviewPost() {
    const linkValid = /^(http|https):\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/;

    if (groups.length == 0 && pages.length == 0 && accountsInstagram.length == 0) {
        alertMessage("error", "Selecione pelo menos um grupo ou página")
        return
    }

    if (link.length > 0) {
        if (linkValid.test(link) == false) {
            alertMessage("error", "Insira uma imagens, vídeos ou link")
            return
        }
    }

    openPreview()
}

function updatePost(idPost) {
    const content = document.getElementById("content");

    const day = document.querySelector('#day');
    const hour = document.querySelector('#hour');

    const interval = document.getElementById("interval");

    const schedule = document.querySelector('#schedule-true');

    const linkValid = /^(http|https):\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/;

    if (groups.length == 0 && pages.length == 0 && accountsInstagram.length == 0) {
        alertMessage("error", "Selecione pelo menos um grupo ou página")
        return
    }

    if (link.length > 0) {
        if (linkValid.test(link) == false) {
            alertMessage("error", "Insira um link válido")
            return
        }
    }

    if (interval.value.length == 0) {
        alertMessage("error", "Insira o intervalo de tempo")
        return
    }

    if (!isPublished) {
        if (schedule.checked) {
            if (day.value == "") {
                alertMessage("error", "Selecione um dia válido")
                return
            }

            if (hour.value == "") {
                alertMessage("error", "Selecione um horário válido")
                return
            }
        }
    }

    closePreview()
    
    const loading = document.getElementById("loading")
    loading.classList.remove("hidden")

    if (!isPublished) {
        if (media.length > 0) {
            const formData = new FormData();
            formData.append('image', media[0]);

            if (changeMedia) {
                fetch(`/app/posts/update-media/${idPost}`, {
                    method: 'PUT',
                    body: formData
                })
                    .then((response) => {
                        return response.text()
                    })
                    .then((filename) => {
                        fetch(`/app/posts/update-post-schedule-media/${idPost}`, {
                            method: 'PUT',
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ content: content.value, pages: pages, groups: groups, accountsInstagram: accountsInstagram, day: day.value, hour: hour.value, interval: interval.value })
                        })
                            .then(async (response) => {
                                if (response.status == 200) {
                                    location.href = `/app/view-post/${idPost}`
                                } else {
                                    const data = await response.json()
                                    
                                    alertMessage("error", data.error)
            
                                    loading.classList.add("hidden")
                                }
                            })
                    })
            } else {
                fetch(`/app/posts/update-post-schedule-media/${idPost}`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ content: content.value, pages: pages, groups: groups, accountsInstagram: accountsInstagram, day: day.value, hour: hour.value, interval: interval.value })
                })
                    .then(async (response) => {
                        if (response.status == 200) {
                            location.href = `/app/view-post/${idPost}`
                        } else {
                            const data = await response.json()
                            
                            alertMessage("error", data.error)
    
                            loading.classList.add("hidden")
                        }
                    })
            }
        } else {
            return fetch(`/app/posts/update-post-schedule-link/${idPost}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: content.value, link: link, pages: pages, groups: groups, day: day.value, hour: hour.value, interval: interval.value })
            })
                .then(async (response) => {
                    if (response.status == 200) {
                        location.href = `/app/view-post/${idPost}`
                    } else {
                        const data = await response.json()
                        
                        alertMessage("error", data.error)

                        loading.classList.add("hidden")
                    }
                })
        }
    } else {
        return fetch(`/app/posts/update-post-published/${idPost}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: content.value })
        })
            .then(async (response) => {
                if (response.status == 200) {
                    location.href = `/app/view-post/${idPost}`
                } else {
                    const data = await response.json()
                    
                    alertMessage("error", data.error)

                    loading.classList.add("hidden")
                }
            })
    }
}

imageInput.addEventListener('change', selectImage);
videoInput.addEventListener('change', selectVideo);

content.addEventListener('input', function () {
    const linkValid = /^(http|https):\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/;

    const lastWord = content.value.split(/\s+/).pop();

    if (linkValid.test(lastWord) && typePost != "media") {
        typePost = "text-link"
        link = lastWord
        selectMediaArea.classList.add("hidden")
        linkSelectedArea.classList.remove("hidden")
        linkSelectedContent.innerText = lastWord
        alertMessage("success", "Link importado com suceso")
    }
})

document.addEventListener("DOMContentLoaded", function() {
    loadData()
})