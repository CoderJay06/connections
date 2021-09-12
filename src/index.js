let connectionsDb;

document.addEventListener("DOMContentLoaded", () => {
    setupConnectionsDb();
    saveConnectionsOnClick();
    removeConnectionsOnClick();
});

/* Database setup section */

function setupConnectionsDb() {
    window.onload = () => {
        // open db
        const request = window.indexedDB.open("connections", 1);
        openDb(request);
    };
}

function openDb(request) {
    handleRequestToOpenDb(request);
    addConnectionsDbToStore(request);
}

function handleRequestToOpenDb(request) {
    request.onerror = () => {
        console.log("Connections not loaded");
    };

    request.onsuccess = () => {
        console.log("Successfully loaded connections");

        connectionsDb = request.result;
        renderConnections();
    };
}

function addConnectionsDbToStore(request) {
    request.onupgradeneeded = (e) => {
        // grab reference to db
        const db = e.target.result;

        const objectStore = db.createObjectStore(
            "connections", { keyPath: "id", autoIncrement: true}
        );
        objectStore.createIndex("name", "name", { unique: false });
        objectStore.createIndex("email", "email", { unique: false });
        objectStore.createIndex("phone", "phone", { unique: false });
    }
}

/* Save connections section */

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
        removeWhiteSpace(nameInput, emailInput, phoneInput);

        // validate form inputs
        if (isValidFormInputs(nameInput, emailInput, phoneInput)) {
            // add new connection with form inputs
            const newConnection = {
                "name": nameInput.value,
                "email": emailInput.value,
                "phone": phoneInput.value
            };


            // save new connection data to indexedDB
            saveConnectionToDb(newConnection);
            resetForm();
            removeBtn.style.display = "inline-block";
        }
    });
}

function removeWhiteSpace(nameInput, emailInput, phoneInput) {
    nameInput.value = nameInput.value.trim();
    emailInput.value = emailInput.value.trim();
    phoneInput.value = phoneInput.value.trim();
}

function saveConnectionToDb(newConnection) {
    handleSave(newConnection);
}

function handleSave(connection) {
    const transaction = connectionsDb.transaction(["connections"], "readwrite");
    handleRequestToSaveData(transaction, connection);
    handleTransaction(transaction);
}

function handleRequestToSaveData(transaction, connection) {
    const objectStore = transaction.objectStore("connections");
    const request = objectStore.add(connection);

    request.onsuccess = () => {
        console.log(`Successfully stored ${connection.name} to db`);
    }
}

/* Form validations section */

function isValidFormInputs(nameInput, emailInput, phoneInput) {
    hideInputErrors(nameInput, emailInput, phoneInput);
    const isNameValid = formValidations.checkName(nameInput);
    const isEmailValid = formValidations.checkEmail(emailInput);
    const isPhoneValid = formValidations.checkPhone(phoneInput);
    
    return isNameValid && isEmailValid && isPhoneValid;
}

function hideInputErrors(nameInput, emailInput, phoneInput) {
    const nameInputError = DOM.getInputError(nameInput);
    const emailInputError = DOM.getInputError(emailInput);
    const phoneInputError = DOM.getInputError(phoneInput);
    nameInputError.style.display = "none";
    emailInputError.style.display = "none";
    phoneInputError.style.display = "none";
}

/* Remove all connections section */

function removeConnectionsOnClick() {
    handleRemove();
}

function handleRemove() {
    // remove all connections from db
    const removeBtn = DOM.getRemoveBtn();

    // clear database on click
    removeBtn.addEventListener("click", () => {
        const request = window.indexedDB.open("connections", 1);

        request.onsuccess = () => {
            connectionsDb = request.result;

            clearConnectionsDb();
        }
    });
}

function clearConnectionsDb() {
    const transaction = connectionsDb.transaction(["connections"], "readwrite");
    handleTransaction(transaction);
    handleRequestToClearData(transaction);
}

function handleRequestToClearData(transaction) {
    const objectStore = transaction.objectStore("connections");

    // request to clear all data
    const objectStoreRequest = objectStore.clear();

    objectStoreRequest.onsuccess = () => {
        console.log("Connections database cleared");
    };
}

/* Create connecion cards section */

function createNewConnectionCard(cursor, list) {
    handleCreatingConnectionCard(cursor, list);
}

function handleCreatingConnectionCard(cursor, list) {
    // create elements for card
    const card = document.createElement("div");
    card.className = "connection-card";
    const name = document.createElement("p");
    const email = document.createElement("p");
    const phone = document.createElement("p");

    appendCardToList(card, name, email, phone, list);
    setCardData(name, email, phone, cursor);

    // set the id on connection card 
    card.setAttribute("data-connection-id", cursor.value.id);
    
    addRemoveBtnToCard(card);
}

function appendCardToList(card, name, email, phone, list) {
    // append card elements to list
    card.appendChild(name);
    card.appendChild(email);
    card.appendChild(phone);
    list.appendChild(card);
}

function setCardData(name, email, phone, cursor) {
    // set card data to new connection input
    name.textContent = cursor.value.name;
    email.textContent = cursor.value.email;
    phone.textContent = cursor.value.phone;
}

function addRemoveBtnToCard(card) {
    // create and append a remove button to each card
    const deleteButton = document.createElement("button");
    card.appendChild(deleteButton);
    deleteButton.textContent = "Remove";
    deleteButton.addEventListener("click", removeConnection);
}

/* Remove a connection section */

function removeConnection(e) {
    const connectionId = Number(e.target.parentNode.getAttribute("data-connection-id"));
    const transaction = connectionsDb.transaction(["connections"], "readwrite");
    const objectStore = transaction.objectStore("connections");

    objectStore.delete(connectionId);

    handleRemoveConnectionTransaction(transaction, e, connectionId);
}

function handleRemoveConnectionTransaction(transaction, e, connectionId) {
    transaction.oncomplete = () => {
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
        const list = DOM.getList();

        console.log(`Connection ${connectionId} is removed`);

        if (!list.firstChild) {
            displayNoConnections(list);
        }
    }
}

/* General functions section */

function handleTransaction(transaction) {
    transaction.oncomplete = () => {
        console.log("Transaction completed");
        renderConnections();
    };

    transaction.onerror = () => {
        console.log(`Transaction not open, ${transaction.error}`);
    };
}

function resetForm(inputs) {
    DOM.getName().value = "";
    DOM.getEmail().value = "";
    DOM.getPhone().value = "";
}

function renderConnections() {
     // grab container and list from dom
    const list = DOM.getList();

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    const objectStore = connectionsDb
        .transaction("connections")
        .objectStore("connections");
    
    objectStore.openCursor().onsuccess = (e) => {
        const cursor = e.target.result;

        if (cursor) {
            // add new connection data to a card
            createNewConnectionCard(cursor, list);
            cursor.continue();
        } else if (!list.firstChild) {
            displayNoConnections(list);
        }
    }
}

function displayNoConnections(list) {
    const error = document.createElement("p");
    error.textContent = "No connections store";
    list.appendChild(error);
}

/* Modules for form validations and dom querying methods */

const formValidations = (
    function() {
        return {
            checkName: function(nameInput) {
                let isValidLength = this.validateLength(nameInput);
                return isValidLength;                
            },
            checkEmail: function(emailInput) {
                let isValidEmail = this.validateFormat(emailInput);
                return isValidEmail;  
            },
            checkPhone: function(phoneInput) {
                let isValidPhone = this.validateFormat(phoneInput);
                return isValidPhone;  
            },
            validateLength: function(input) {
                if (input.value.length < 1) {
                    this.displayError(input, "blank");
                    return false;
                }
                return true;
            },
            validateFormat: function(input) {
                let regEx;
                let isValidFormat = false;

                if (input.name === "email") {
                    regEx =
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                } else if (input.name === "phone") {
                    regEx = /^\d{10}$/;
                } 
                isValidFormat = regEx.test(input.value);

                if (!isValidFormat) {
                    this.displayError(input, "format");
                }
                return isValidFormat;
            },
            displayError: function(input, errorType) {
                const inputError = DOM.getInputError(input);
                inputError.style.display = "block";
                inputError.textContent = 
                    errorType === "blank"
                    ? `${input.name} cannot be blank`
                    : `${input.name} must be valid format`;
            }
        }
})();

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
            },
            getInputError: function(input) {
                return document.querySelector(`.${input.name}-input-error`);
            }
        }
})();
