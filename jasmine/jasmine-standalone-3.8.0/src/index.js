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
    const connections = [];
    let connectionsFromLocalStorage = [];

    saveConnectionsOnClick(connections);
    connectionsFromLocalStorage = getConnections();


    // append connections to dom as a list
    if (connectionsFromLocalStorage) {
        render(connectionsFromLocalStorage);
    }
});

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
        const nameInput = inputs.getName().value;
        const emailInput = inputs.getEmail().value;
        const phoneInput = inputs.getPhone().value;

        // store inputs in an array
        connections.push({
            name: nameInput,
            email: emailInput,
            phone: phoneInput
        });
        console.log(connections)
        // save inputs in localStorage
        localStorage.setItem("connections", JSON.stringify(connections));
    });
}

function render(connections) {
    // create a new list, li and grab its container
    const list = createConnectionsList();
    let li = document.createElement("li");
    const container = document.querySelector(".connections-list-container");

    // render connections to the dom as an unordered list
    connections.map(connection => {
        li.innerHTML = `<a href="#">${connection.name}</a>`;
        list.appendChild(li);
    });

    container.appendChild(list);
}

function getConnections() {
    // get connections from local storage and return them
    return JSON.parse(localStorage.getItem("connections"));
}

function createConnectionsList() {
    const ul = document.createElement("ul");
    ul.className = "connections-list";
    return ul;
}

function printConnections(connections) {
    return connections;
}