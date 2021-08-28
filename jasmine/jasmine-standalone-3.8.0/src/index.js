/*
    TODO:

    - add event listeners to handle user input
    - setup save button
    - store connections in localStorage on submit

    functions:
        - getName(), getEmail(), getPhone(), getForm()
        - handleSave()

 */
let connectionsDb;

document.addEventListener("DOMContentLoaded", () => {
    // let connectionsFromLocalStorage = [];
    let connections = [];
    // const connectionsFromLocalStorage = getConnections();
    const removeBtn = document.querySelector(".remove-btn");
    setupConnectionsDb();
     // append connections to dom as a list
    //  if (connectionsFromLocalStorage) {
    //     removeBtn.style.display = "inline-block";
    //     connections = connectionsDb;
    //     render(connections);
    // }
    // removeConnectionsOnClick(connections);
    saveConnectionsOnClick(connections);
    console.log('DomLoaded')
});

function getConnections() {
    // get connections from local storage and return them
    return JSON.parse(localStorage.getItem("connections"));
}

function getInputs() {
    return (
        function() {
            const form = getForm();

            return {
                getName: function() {
                    return form.children[0];
                },

                getEmail: function() {
                    return form.children[2];
                },

                getPhone: function() {
                    return form.children[4];
                },
            }
    })();
}

function getForm() {
    return document.getElementById("connections-form");
}

function getButton() {
    return document.querySelector(".save-btn");
}

function saveConnectionsOnClick(connections) {
    const saveBtn = getButton();
    const removeBtn = document.querySelector(".remove-btn");
    // handle saving connection
    saveBtn.addEventListener("click", (e) => {
        e.preventDefault();
        // get user inputs from form
        const inputs = getInputs();
        const nameInput = inputs.getName();
        const emailInput = inputs.getEmail();
        const phoneInput = inputs.getPhone();

        const newConnection = {
            "name": nameInput.value,
            "email": emailInput.value,
            "phone": phoneInput.value
        };

        // store inputs in an array
        connections.push(newConnection);
        console.log('connections ', connections)
        // // save inputs in localStorage
        // localStorage.setItem("connections", JSON.stringify(connections));
        saveConnectionsToDb(newConnection);
        resetForm(inputs);
        removeBtn.style.display = "inline-block";
        // render(connections);
    });
}

function removeConnectionsOnClick(connections) {
    const removeBtn = document.querySelector(".remove-btn");
    // add event listener for remove button
    removeBtn.addEventListener("dblclick", (e) => {
        e.preventDefault();
        removeBtn.style.display = "none";

        // remove connections from localStorage
        localStorage.removeItem("connections");

        // reset connections array
        connections = [];

        // render empty array
        render(connections);
    });
}

function resetForm(inputs) {
    inputs.getName().value = "";
    inputs.getEmail().value = "";
    inputs.getPhone().value = "";
}

function setupConnectionsDb() {
    window.onload = () => {
        let request = window.indexedDB.open("connections", 1);

        request.onerror = () => {
            console.log("Connections not loaded");
        };

        request.onsuccess = () => {
            console.log("Successfully loaded connections");

            connectionsDb = request.result;
            displayData();
        };

        request.onupgradeneeded = (e) => {
            
            // grab reference to db
            let db = e.target.result;

            let objectStore = db.createObjectStore(
                "connections", { keyPath: "id", autoIncrement: true}
            );

            objectStore.createIndex("name", "name", { unique: false });
            objectStore.createIndex("email", "email", { unique: false });
            objectStore.createIndex("phone", "phone", { unique: false });
        }

    };
}

function saveConnectionsToDb(newConnection) {
    let connection = newConnection;
    console.log('db in saveConnectionsToDb ', connectionsDb)
    console.log('newConnection ', connection);

    let transaction = connectionsDb.transaction(["connections"], "readwrite");

    let objectStore = transaction.objectStore("connections");

    let request = objectStore.add(newConnection);

    request.onsuccess = () => {
        console.log(`Successfully stored ${connection.name} to db`);
    }

    transaction.oncomplete = () => {
        console.log("Transaction completed");
        displayData();
    }

    transaction.onerror = () => {
        console.log("Transaction not completed. Error");
    }
}

function render(connections) {
    // create a new list, li and grab its container
    const container = document.querySelector(".connections-list-container");
    let list = document.querySelector(".connections-list");
    let listItems = "";
    console.log('render')
    // render connections to the dom as an unordered list
    connections.map(connection => {
        listItems += `
            <li class="connection"><a href="#">${connection.name}</a></li>
        `;
    });
    list.innerHTML = listItems;
    container.appendChild(list);
}

function displayData() {
     // create a new list, li and grab its container
    const container = document.querySelector(".connections-list-container");
    let list = document.querySelector(".connections-list");
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    let objectStore = connectionsDb
        .transaction("connections")
        .objectStore("connections");
    
    objectStore.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;

        if (cursor) {
            let card = document.createElement("div");
            card.className = "connection-card";
            let name = document.createElement("p");
            let email = document.createElement("p");
            let phone = document.createElement("p");

            card.appendChild(name);
            card.appendChild(email);
            card.appendChild(phone);
            list.appendChild(card);

            name.textContent = cursor.value.name;
            email.textContent = cursor.value.email;
            phone.textContent = cursor.value.phone;

            card.setAttribute("data-connection-id", cursor.value.id);

            let deleteButton = document.createElement("button");
            card.appendChild(deleteButton);
            deleteButton.textContent = "Remove";
            deleteButton.addEventListener("click", removeItem);

            cursor.continue();
        } else {
            if (!list.firstChild) {
                let error = document.createElement("p");
                error.textContent = "No connections store";
                list.appendChild(error);
            }
        }
        console.log("Connections displayed")
    }
}

function removeItem(e) {
    let connectionId = Number(e.target.parentNode.getAttribute("data-connection-id"));

    let transaction = connectionsDb.transaction(["connections"], "readwrite");

    let objectStore = transaction.objectStore("connections");

    objectStore.delete(connectionId);

    transaction.oncomplete = () => {
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
        const list = document.querySelector(".connections-list");

        console.log(`Connection ${connectionId} is removed`);

        if (!list.firstChild) {
            let error = document.createElement("li");
            error.textContent = "No connections store";
            list.appendChild(error);
        }
    }
}

function createConnectionsList() {
    const ul = document.createElement("ul");
    ul.className = "connections-list";
    return ul;
}

function printConnections(connections) {
    return connections;
}