const dom = require("../src/index.js");

describe("DOM module", () => {
    it("getForm() returns form", () => {
        const result = dom.getForm();

        expect(result.id).toBe("connections-form");
    });


});