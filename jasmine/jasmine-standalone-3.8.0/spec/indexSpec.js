/* functions to test:

        - getName(), getEmail(), getPhone(), getForm()
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
        console.log(result)
        // assert
        expect(result.id).toBe("connections-form");
    })
});

