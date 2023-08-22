function populateTable(data) {
    const dataContainer = document.getElementById("content-list");
    dataContainer.innerHTML = ''
    data.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("application-card");
        div.innerHTML = makeCardContent(item)
        dataContainer.appendChild(div);
    });
}

function makeCardContent(item) {
    return `
        <div class="application-card-leading-content">
            <h1><a href="${item.website}" target="_blank"">${item.name}</a></h1>
            <p><b>Role</b>: ${item.role}</p>
            <p><b>Status</b>: ${item.status}</p>
            <br />
            <p><b>Notes</b>: ${item.note}</p>
            <br />
        </div>
        <div style="width: 20px"></div>
        <div class="application-card-trailing-content">
            ${makeResumeContent(item)}
        </div>
    ` 
}

function makeResumeContent(item) {
    const onClickAction = function (name) {
        fetch("/resume/"+name)
            .then(response => response.json())
            .then(data => {
                populateTable(data);
            })
            .catch(error => {
                console.error("Error fetching JSON data:", error);
            });
    }

    return `
    <span><a href="${item.resume_url}" target="_blank"">Check resume</a></span>
    <p class="p_secondary">${formatDate(item.application_timestamp)}</p>
    ` 
}

function formatDate(timestamp) {
    const date = new Date(timestamp * 1000)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}


// Data handling
function addFilterData() {
    document.getElementById("filterForm").addEventListener("submit", function(event) {
        event.preventDefault();
        
        const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'))
        var filteredCheckboxes = 
            checkboxes
            .filter((checkbox) => checkbox.checked)
            .map((e) => e.defaultValue)

        const radioButtons = Array.from(document.querySelectorAll('input[type="radio"]'))
        var filteredRadio = 
            radioButtons
            .filter((radio) => radio.checked)
            .map((e) => e.defaultValue)

        const body = {
            status: filteredCheckboxes,
            order: filteredRadio.pop()
        }

        fetch("/data", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            populateTable(data);
        })
        .catch(error => {
            console.error("Error fetching JSON data:", error);
        });
    })
}


fetch("/data")
    .then(response => response.json())
    .then(data => {
        populateTable(data);
    })
    .catch(error => {
        console.error("Error fetching JSON data:", error);
    });

addFilterData()