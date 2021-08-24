/*
    TODO:

    - add event listeners to handle user input
    - setup save button
    - store connections in localStorage on submit

    functions:
        - getName(), getEmail(), getPhone(), getForm()
        - handleSave()

 */

document.addEventListener("DOMContentLoaded", () => {
    // let connectionsFromLocalStorage = [];
    let connections = [];
    const connectionsFromLocalStorage = getConnections();
     // append connections to dom as a list
     if (connectionsFromLocalStorage) {
        console.log('c ', connections)
        console.log('c from ls ', connectionsFromLocalStorage)
        connections = connectionsFromLocalStorage;
        render(connections);
    }
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

    // handle saving connection
    saveBtn.addEventListener("click", () => {
        // get user inputs from form
        const inputs = getInputs();
        const nameInput = inputs.getName();
        const emailInput = inputs.getEmail();
        const phoneInput = inputs.getPhone();

        // store inputs in an array
        connections.push({
            "name": nameInput.value,
            "email": emailInput.value,
            "phone": phoneInput.value
        });
        console.log('connections ', connections)
        resetForm(inputs);
        // save inputs in localStorage
        localStorage.setItem("connections", JSON.stringify(connections));
        render(connections);
    });
}

function resetForm(inputs) {
    inputs.getName().value = "";
    inputs.getEmail().value = "";
    inputs.getPhone().value = "";
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


function createConnectionsList() {
    const ul = document.createElement("ul");
    ul.className = "connections-list";
    return ul;
}

function printConnections(connections) {
    return connections;
}