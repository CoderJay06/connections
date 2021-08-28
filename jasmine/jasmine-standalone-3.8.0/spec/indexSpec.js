/* functions to test:

        - getName(), getEmail(), getPhone(), getForm(), getButton()
        - handleSave()
*/


describe("printConnections()", () => {
    it("Prints all connections", () => {
        // arrange
        const connections = ["Jay", "Bob", "Joe", "Jane"];

        // act
        const result = printConnections(connections);

        // assert
        expect(result).toEqual(["Jay", "Bob", "Joe", "Jane"]);
    })
});

describe("getForm()", () => {
    it("Gets form from the dom", () => {
        // act
        const result = getForm();

        // assert
        expect(result.id).toBe("connections-form");
    })
});

describe("getInputs()", () => {
    let input;
    beforeEach(() => {
        input = getInputs();
    });

    it("gets name input", () => {
        const result = input.getName();

        expect(result.name).toBe("name");
    });

    it("gets email input", () => {
        const result = input.getEmail();

        expect(result.name).toBe("email");
    });

    it("gets phone input", () => {
        const result = input.getPhone();

        expect(result.name).toBe("phone");
    });
});

describe("getButton()", () => {
    it("Gets button element from the dom", () => {
        // act
        const result = getButton();

        // assert
        expect(result.innerText).toBe("Save Connection");
    })
});

describe("createConnectionsList()", () => {
    it("Creates a new ul element for connections", () => {
        const result = createConnectionsList();

        expect(result.className).toBe("connections-list");
    })
});

describe("getConnections()", () => {
    it("Gets connections from localStorage", () => {
        const result = getConnections();

        expect(typeof result).toBe("object");
    })
});
