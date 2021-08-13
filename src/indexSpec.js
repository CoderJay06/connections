const printConnections = require('../src/index.js');


describe("printConnections()", () => {
    it("Prints all connections", () => {
        // arrange
        const connections = ["Jay", "Bob", "Joe", "Jane"];

        // act
        const result = printConnections(connections);

        // assert
        expect(result).toBe(["Jay", "Bob", "Joe", "Jane"]);
    })
})