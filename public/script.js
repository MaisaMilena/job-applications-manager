function populateTable(data) {
    const dataContainer = document.getElementById("content-list");
    data.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("application-card");
        div.innerHTML = createCardContent(item)
        dataContainer.appendChild(div);
    });
}

function createCardContent(item) {
    return `
        <h1><a href="${item.website}" target="_blank"">${item.name}</a></h1>
        <p><b>Role</b>: ${item.role}</p>
        <p><b>Status</b>: ${item.status}</p>
        <br />
    ` 
}

fetch("/data")
    .then(response => response.json())
    .then(data => {
        populateTable(data);
    })
    .catch(error => {
        console.error("Error fetching JSON data:", error);
    });