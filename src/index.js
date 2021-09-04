let connectionsDb;

document.addEventListener("DOMContentLoaded", () => {
    setupConnectionsDb();
    saveConnectionsOnClick();
});

function setupConnectionsDb() {
    window.onload = () => {
        // open db
        let request = window.indexedDB.open("connections", 1);

        // handle request result
        handleDbOpen(request);
    };
}

function handleDbOpen(request) {
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
}

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
        saveConnectionToDb(newConnection);
        resetForm();
        removeBtn.style.display = "inline-block";
    });
}

function saveConnectionToDb(newConnection) {
    handleSave(newConnection);
}

function handleSave(connection) {
    let transaction = connectionsDb.transaction(["connections"], "readwrite");
    let objectStore = transaction.objectStore("connections");
    let request = objectStore.add(connection);

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

function resetForm(inputs) {
    DOM.getName().value = "";
    DOM.getEmail().value = "";
    DOM.getPhone().value = "";
}

function removeConnectionsOnClick(connections) {
    // remove all connections from db
}

function renderConnections() {
     // grab container and list from dom
    const list = DOM.getList();

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    let objectStore = connectionsDb
        .transaction("connections")
        .objectStore("connections");
    
    objectStore.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;

        if (cursor) {
            // add new connection data to a card
            createNewConnectionCard(cursor, list);
            cursor.continue();
        } else if (!list.firstChild) {
            displayNoConnections(list);
        }
    }
}

function createNewConnectionCard(cursor, list) {
    // create elements for card
    const card = document.createElement("div");
    card.className = "connection-card";
    const name = document.createElement("p");
    const email = document.createElement("p");
    const phone = document.createElement("p");

    // append card elements to list
    card.appendChild(name);
    card.appendChild(email);
    card.appendChild(phone);
    list.appendChild(card);

    // set card data to new connection input
    name.textContent = cursor.value.name;
    email.textContent = cursor.value.email;
    phone.textContent = cursor.value.phone;

    // set the id on connection card 
    card.setAttribute("data-connection-id", cursor.value.id);

    // create and append a remove button to each card
    const deleteButton = document.createElement("button");
    card.appendChild(deleteButton);
    deleteButton.textContent = "Remove";
    deleteButton.addEventListener("click", removeItem);
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
            displayNoConnections(list);
        }
    }
}

function displayNoConnections(list) {
    let error = document.createElement("p");
    error.textContent = "No connections store";
    list.appendChild(error);
}

/*
    set a dom module that contains all querying methods needed and
    a variable to be used across function for storing the database
*/
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

module.exports = DOM;