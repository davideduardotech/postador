let posts = []

let numberOptionPost = 2
let numberOptionStandard = 2
let quantityReplyPosts;


function openSelect(selectId) {
  const selects = ["create-standard", "created-standard", "create-answers", "select-standard"];

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


function markPost(input) {
  const findPost = posts.find(item => item == input.value)

  if (!findPost) {
    if (quantityReplyPosts != posts.length) {
      input.checked = true

      input.removeEventListener("change", markPost)
      input.addEventListener("change", function () {
        unmarkPost(input)
      })

      posts.push(input.value)

      if (posts.length >= 2) {
        document.getElementById("actions").classList.remove("hidden")
      }
    } else {
      input.checked = false
      alertMessage("error", "Quantidade de publicações com comentários automáticos ativos atingido")
    }
  }
}

function unmarkPost(input) {
  input.checked = false

  input.removeEventListener("change", unmarkPost)
  input.addEventListener("change", function () {
    markPost(input)
  })

  const indexToRemove = posts.indexOf(input.value);

  if (indexToRemove !== -1) {
    posts.splice(indexToRemove, 1);
  }

  if (posts.length == 1) {
    document.getElementById("actions").classList.add("hidden")
  }
}


function openStandardAnswers() {
  const popup = document.getElementById("popup-standard-answers")

  popup.classList.remove("hidden")
}

function closeStandardAnswers() {
  const popup = document.getElementById("popup-standard-answers")

  popup.classList.add("hidden")
}


function openActiveReply(idPost) {
  const popup = document.getElementById("popup-active-reply")

  popup.classList.remove("hidden")

  if (idPost) {
    const findPost = posts.find(item => item == idPost)

    if (!findPost) {
      posts.push(idPost)
    }
  }
}

function closeActiveReply() {
  const popup = document.getElementById("popup-active-reply")

  popup.classList.add("hidden")
}


function openDisableReply(idPost) {
  const popup = document.getElementById("popup-disable-reply")

  popup.classList.remove("hidden")

  if (idPost) {
    const findPost = posts.find(item => item == idPost)

    if (!findPost) {
      posts.push(idPost)
    }
  }
}

function closeDisableReply() {
  const popup = document.getElementById("popup-disable-reply")

  popup.classList.add("hidden")
}


function newOption(area) {
  if (area == "post") {
    if (numberOptionStandard <= 10) {
      var chars = 'abcdefghijklmnopqrstuvwxyz';
      var id = '';

      for (var i = 0; i < chars.length; i++) {
        var random = Math.floor(Math.random() * chars.length);
        id += chars.charAt(random);
      }

      const html = `
        <div class="flex items-center mt-2" id="${id}">
          <h2 class="mr-2 font-semibold inter">${numberOptionStandard}</h2>
          <textarea rows="1" name="content" id="content" class="block w-full rounded-lg p-1.5 option-post text-sm text-gray-900 border-purple shadow-sm" placeholder="Nova opção de comentário"></textarea>

          <button onclick="deleteOption(${id}, 'post')" class="ml-2 mr-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-red-700">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      `;

      numberOptionPost += 1

      document.getElementById("options-post").insertAdjacentHTML("beforeend", html);
    } else {
      alertMessage("error", "Limite de 10 comentários atingidos")
    }
  } else if (area == "standard") {
    if (numberOptionStandard <= 10) {
      var chars = 'abcdefghijklmnopqrstuvwxyz';
      var id = '';

      for (var i = 0; i < chars.length; i++) {
        var random = Math.floor(Math.random() * chars.length);
        id += chars.charAt(random);
      }

      const html = `
        <div class="flex items-center mt-2" id="${id}">
          <h2 class="mr-2 font-semibold inter">${numberOptionStandard}</h2>
          <textarea rows="1" name="content" id="content" class="block w-full rounded-lg p-1.5 option-standard text-sm text-gray-900 border-purple shadow-sm" placeholder="Nova opção de comentário"></textarea>

          <button onclick="deleteOption(${id}, 'standard')" class="ml-2 mr-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-red-700">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      `;

      numberOptionStandard += 1

      document.getElementById("options-standard").insertAdjacentHTML("beforeend", html);
    } else {
      alertMessage("error", "Limite de 10 comentários atingidos")
    }
  }
}

function deleteOption(id, area) {
  id.remove()

  if (area == "post") {
    numberOptionPost -= 1
  } else if (area == "standard") {
    numberOptionStandard -= 1
  }
}


async function createStandardAnswers() {
  const name = document.getElementById("name-standard")
  const options = document.getElementsByClassName('option-standard')
  const contents = []

  if (name.value.length == 0) {
    alertMessage("error", "Defina um nome para as respostas")
    return
  }

  for (const option of options) {
    if (option.value.length < 1) {
      alertMessage("error", "Preencha o conteúdo do comentário")
      return
    }

    contents.push(option.value)
  }

  closeStandardAnswers()

  const loading = document.getElementById("loading")
  loading.classList.remove("hidden")

  fetch(`/app/reply-comments/create-standard-answers`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.value, contents: contents })
  })
    .then(async (response) => {
      if (response.status == 200) {
        location.reload()
      } else {
        const data = await response.json()

        alertMessage("error", data.error)

        loading.classList.add("hidden")
      }
    })
    .catch(err => {
      loading.classList.add("hidden")
      alertMessage("error", "Não foi possível estabeler a conexão com o servidor.")
    })
}

async function deleteStandardAnswers(name) {
  closeStandardAnswers()

  const loading = document.getElementById("loading")
  loading.classList.remove("hidden")

  fetch(`/app/reply-comments/delete-standard-answers`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name })
  })
    .then(async (response) => {
      if (response.status == 200) {
        location.reload()
      } else {
        const data = await response.json()

        alertMessage("error", data.error)

        loading.classList.add("hidden")
      }
    })
    .catch(err => {
      loading.classList.add("hidden")
      alertMessage("error", "Não foi possível estabeler a conexão com o servidor.")
    })
}


async function activeReply(type, nameStandard) {
  const options = document.getElementsByClassName('option-post')
  const contents = []

  if (posts.length == 0) {
    alertMessage("error", "Selecione pelo menos uma publicação")
    return
  }

  if (type != "standard") {
    for (const option of options) {
      if (option.value.length == 0) {
        alertMessage("error", "Preencha o conteúdo do comentário")
        return
      }

      contents.push(option.value)
    }
  }

  closeActiveReply()

  const loading = document.getElementById("loading")
  loading.classList.remove("hidden")

  fetch(`/app/reply-comments/active`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: contents, posts: posts, type: type, nameStandard: nameStandard })
  })
    .then(async (response) => {
      if (response.status == 200) {
        location.reload()
      } else {
        const data = await response.json()

        alertMessage("error", data.error)

        loading.classList.add("hidden")
      }
    })
    .catch(err => {
      loading.classList.add("hidden")
      alertMessage("error", "Não foi possível estabeler a conexão com o servidor.")
    })
}

async function disableReply() {
  closeDisableReply()

  const loading = document.getElementById("loading")
  loading.classList.remove("hidden")

  fetch(`/app/reply-comments/disable`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ posts: posts })
  })
    .then(async (response) => {
      if (response.status == 200) {
        location.reload()
      } else {
        const data = await response.json()

        alertMessage("error", data.error)

        loading.classList.add("hidden")
      }
    })
    .catch(err => {
      loading.classList.add("hidden")
      alertMessage("error", "Não foi possível estabeler a conexão com o servidor.")
    })
}

document.addEventListener("DOMContentLoaded", function () {
  const allCheckbox = document.getElementsByClassName("mark-post")

  for (const checkbox of allCheckbox) {
    checkbox.addEventListener("change", function () {
      markPost(checkbox)
    })
  }

  const scriptElement = document.querySelector('script[src="/js/app/reply-comments.js"]');

  const quantityReplyPlan = scriptElement.getAttribute('data-quantity-reply');
  const quantityActive = scriptElement.getAttribute('data-quantity-active');
  const dataUser = scriptElement.getAttribute('data-user');

  if (dataUser == "false") {
    quantityReplyPosts = quantityReplyPlan - quantityActive
  } else {
    quantityReplyPosts = 10000
  }
})