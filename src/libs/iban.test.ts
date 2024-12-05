import { generateIbanAddress, isValidIBANNumber } from "./iban";

describe("IBAN Generator and Validator", () => {
    // Test the generateIbanAddress function
    describe("generateIbanAddress", () => {
        it("should generate a valid IBAN address", () => {
            const iban = generateIbanAddress();
            expect(iban).toMatch(/^GB\d{2}WEST\d{6}\d{8}$/); // Check format
            expect(isValidIBANNumber(iban)).toBe(true); // Check validity
        });
    });

    // Test the isValidIBANNumber function
    describe("isValidIBANNumber", () => {
        it("should validate correct IBANs", () => {
            expect(isValidIBANNumber("GB08WEST28138575659341")).toBe(true);
            expect(isValidIBANNumber("DE89370400440532013000")).toBe(true); // Valid German IBAN
        });

        it("should reject incorrect IBANs", () => {
            expect(isValidIBANNumber("GB00WEST12345698765432")).toBe(false); // Invalid check digits
            expect(isValidIBANNumber("DE445001051754073249XX")).toBe(false); // Invalid characters
        });

        it("should reject IBANs with incorrect lengths", () => {
            expect(isValidIBANNumber("GB33WEST123456987654")).toBe(false); // Too short
            expect(isValidIBANNumber("GB33WEST1234569876543210")).toBe(false); // Too long
        });
    });
});
