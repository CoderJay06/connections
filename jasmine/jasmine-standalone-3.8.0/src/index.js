const DOM = (
    function() {
        return {
            getForm: function() {
                return document.getElementById("connections-form");
            },

            getName: function() {
                return document.querySelector(".name");
            },

            getEmail: function() {
                return document.querySelector(".email");
            },

            getPhone: function() {
                return document.querySelector(".phone");
            },

            getSaveBtn: function() {
                return document.querySelector(".save-btn");
            },

            getRemoveBtn: function() {
                return document.querySelector(".remove-btn");
            },

            getListContainer: function() {
                return document.querySelector(".connections-list-container");
            },

            getList: function() {
                return document.querySelector(".connections-list");
            }
        }
})();

let connectionsDb;

document.addEventListener("DOMContentLoaded", () => {
    let connections = [];

    setupConnectionsDb();
    saveConnectionsOnClick();
});

function saveConnectionsOnClick() {
    const saveBtn = DOM.getSaveBtn();
    const removeBtn = DOM.getRemoveBtn();

    // handle saving connection
    saveBtn.addEventListener("click", (e) => {
        e.preventDefault();
        // get user inputs from form
        const nameInput = DOM.getName();
        const emailInput = DOM.getEmail();
        const phoneInput = DOM.getPhone();

        const newConnection = {
            "name": nameInput.value,
            "email": emailInput.value,
            "phone": phoneInput.value
        };

        // save new connection data to indexedDB
        saveConnectionsToDb(newConnection);
        resetForm();
        removeBtn.style.display = "inline-block";
    });
}

function removeConnectionsOnClick(connections) {
    // remove all connections from db
}

function resetForm(inputs) {
    DOM.getName().value = "";
    DOM.getEmail().value = "";
    DOM.getPhone().value = "";
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
            renderConnections();
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
    let transaction = connectionsDb.transaction(["connections"], "readwrite");
    let objectStore = transaction.objectStore("connections");
    let request = objectStore.add(newConnection);

    request.onsuccess = () => {
        console.log(`Successfully stored ${connection.name} to db`);
    }

    transaction.oncomplete = () => {
        console.log("Transaction completed");
        renderConnections();
    }

    transaction.onerror = () => {
        console.log("Transaction not completed. Error");
    }
}

function renderConnections() {
     // create a new list, li and grab its container
    const container = DOM.getListContainer();
    let list = DOM.getList();

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
    }
}

function removeItem(e) {
    let connectionId = Number(e.target.parentNode.getAttribute("data-connection-id"));
    let transaction = connectionsDb.transaction(["connections"], "readwrite");
    let objectStore = transaction.objectStore("connections");

    objectStore.delete(connectionId);

    transaction.oncomplete = () => {
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
        const list = DOM.getList();

        console.log(`Connection ${connectionId} is removed`);

        if (!list.firstChild) {
            let error = document.createElement("li");
            error.textContent = "No connections store";
            list.appendChild(error);
        }
    }
}

function printConnections(connections) {
    return connections;
}