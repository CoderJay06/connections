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
    getForm();
    getInputs();
});

function getForm() {
    return document.getElementById("connections-form");
}

function getInputs() {
    const inputs = (function() {
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
    return inputs;
}

function getButton() {
    return document.querySelector(".save-btn");
}

function printConnections(connections) {
    return connections;
}