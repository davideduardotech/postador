let idPost;

function openDeletePost(id) {
    const deletePopup = document.getElementById("popup-delete-post")

    idPost = id

    deletePopup.classList.remove("hidden")
}

function closeDeletePost() {
    const deletePopup = document.getElementById("popup-delete-post")

    deletePopup.classList.add("hidden")
}

async function deletePost() {
    closeDeletePost()

    const loading = document.getElementById("loading")
    loading.classList.remove("hidden")

    fetch(`/app/posts/delete-post/${idPost}`, {
      method: 'DELETE',
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