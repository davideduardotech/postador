let currentPlan;

function openUpdatePlan(data) {
    const plan = JSON.parse(data)

    currentPlan = plan._id

    const titleInput = document.getElementById("title").value = plan.title
    const descriptionTextarea = document.getElementById("description").value = plan.description
    const valueMonthInput = document.getElementById("value-month").value = plan.valueMonth
    const quantityAccounts = document.getElementById("quantity-accounts").value = plan.quantityAccounts
    const quantityGroups = document.getElementById("quantity-groups").value = plan.quantityGroups
    const quantityPages = document.getElementById("quantity-pages").value = plan.quantityPages
    const quantitySchedule = document.getElementById("quantity-schedule").value = plan.quantitySchedule
    const quantityReplyPosts = document.getElementById("quantity-reply-posts").value = plan.quantityReplyPosts
    const quantityComments = document.getElementById("quantity-comments").value = plan.quantityComments
    const quantitySets = document.getElementById("quantity-sets").value = plan.quantitySets

    const selectAll = document.getElementById("select-all")
    const standardAnswers = document.getElementById("standard-answers")
    const markedSelect = document.getElementById("marked")

    for (let i = 0; i < selectAll.options.length; i++) {
        if (selectAll.options[i].value == String(plan.selectAll)) {
            selectAll.options[i].selected = true;
            break
        }
    }

    for (let i = 0; i < standardAnswers.options.length; i++) {
        if (standardAnswers.options[i].value == String(plan.standardAnswers)) {
            standardAnswers.options[i].selected = true;
            break
        }
    }

    for (let i = 0; i < markedSelect.options.length; i++) {
        if (markedSelect.options[i].value == String(plan.marked)) {
            markedSelect.options[i].selected = true;
            break
        }
    }

    const popup = document.querySelector("#popup-update-plan")
    popup.classList.remove("hidden")
}

function closeUpdatePlan() {
    const popup = document.querySelector("#popup-update-plan")
    popup.classList.add("hidden")
}

async function updatePlan() {
    closeUpdatePlan()

    const title = document.getElementById("title")
    const description = document.getElementById("description")
    const valueMonth = document.getElementById("value-month")
    const quantityAccounts = document.getElementById("quantity-accounts")
    const quantityGroups = document.getElementById("quantity-groups")
    const quantityPages = document.getElementById("quantity-pages")
    const quantitySchedule = document.getElementById("quantity-schedule")
    const quantityReplyPosts = document.getElementById("quantity-reply-posts")
    const quantityComments = document.getElementById("quantity-comments")
    const quantitySets = document.getElementById("quantity-sets")
    const selectAll = document.getElementById("select-all")
    const standardAnswers = document.getElementById("standard-answers")
    const marked = document.getElementById("marked")

    const loading = document.getElementById("loading")
    loading.classList.remove("hidden")

    fetch(`/app/admin/plans/update-plan/${currentPlan}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title.value,
            description: description.value,
            valueMonth: valueMonth.value,
            quantityAccounts: quantityAccounts.value,
            quantityGroups: quantityGroups.value,
            quantityPages: quantityPages.value,
            quantitySchedule: quantitySchedule.value,
            quantityReplyPosts: quantityReplyPosts.value,
            quantityComments: quantityComments.value,
            quantitySets: quantitySets.value,
            selectAll: selectAll.value,
            standardAnswers: standardAnswers.value,
            marked: marked.value
        })
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