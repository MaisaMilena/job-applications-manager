function populateTable(data) {
    const dataContainer = document.getElementById("content-list");
    dataContainer.innerHTML = ''

    const applicationsCount = document.createElement("p")
    applicationsCount.innerHTML = makeTotalCount(data)
    dataContainer.appendChild(applicationsCount)
    if (data.length > 0) {
        for (const application of data) {
            const div = document.createElement("div");
            div.classList.add("application-card");
            div.innerHTML = makeCardContent(application)
            dataContainer.appendChild(div);
        }
        for (const application of data) {
            addResumeFetchAction(application.resume_file_name)
        }
    } else {
        const div = document.createElement("div");
        div.innerHTML = makeEmptyCard()
        dataContainer.appendChild(div);
    }
}

function makeTotalCount(data) {
    return `<p>Total: ${data.length}</p>`
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
        </div>` 
}

function makeEmptyCard() {
    return `
    <div style="min-width: 700px">
        <p>No content match this filter.</p>
    </div>`
}

function makeResumeContent(item) {
    var component = `
    <p class="p_secondary">${formatDate(item.application_timestamp)}</p>
    `
    if (item.application_origin.origin_name && item.application_origin.origin_url) {
        component += `
        <a href="${item.application_origin.origin_url}" target="_blank"">${item.application_origin.origin_name}</a>
        ` 
    } else if (item.application_origin.origin_name) {
        component += `<p>${item.application_origin.origin_name}</p>` 
    }

    if (item.resume_file_name) {
        component += `
        <div style="height: 10px"></div> 
        <a href="#" id="pdf-link-${item.resume_file_name}">
        <img src="images/icon-resume.svg" style="width:40px; height:40px;">
        </a>`
    }

    return component
}

function addResumeFetchAction(resumeFileName) {
    if (resumeFileName != null) {
        document.getElementById("pdf-link-"+resumeFileName).addEventListener("click", function(event) {
            event.preventDefault();
            onClickResume(resumeFileName);
        });
    }
}

function onClickResume(resumeFileName) {
    fetch(`/resume/${encodeURIComponent(resumeFileName)}`)
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            window.open(url); // Open the PDF in a new window/tab
        })
        .catch(error => {
            console.error("Error fetching PDF data:", error);
        });
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