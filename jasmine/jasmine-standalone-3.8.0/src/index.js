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
    // set up a module to hold dom elements
    const form = getForm();
    const connections = [];

    saveConnectionsOnClick(connections);
});

function getForm() {
    return document.getElementById("connections-form");
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

function printConnections(connections) {
    return connections;
}