/**
 * Generates random IBAN address
 * @returns generated IBAN address
 */
export function generateIbanAddress() {
    const countryCode = "GB";
    let checkDigits = "99"; // Random two digits
    const bankCode = "WEST"; // Bank Identifier
    const sortCode = Math.random().toString().slice(2, 8); // Random 6 digits
    const accountNumber = Math.random().toString().slice(2, 10); // Random 8 digits
    const iban = `${bankCode}${sortCode}${accountNumber}${countryCode}${checkDigits}`;

    // Make valid iban number by checking  IBAN Checksum.
    const rest = BigInt(replaceLettersWithDigits(iban)) % BigInt(97);

    checkDigits = (Number(checkDigits) - Number(rest) + 1).toString();

    if (Number(checkDigits) < 10) checkDigits = checkDigits.padStart(2, "0");

    return `${countryCode}${checkDigits}${bankCode}${sortCode}${accountNumber}`;
}

/**
 * Replaces letters with digits from string
 *
 * @param input
 * @returns string
 */

function replaceLettersWithDigits(input: string): string {
    return input
        .toUpperCase()
        .split("")
        .map((char) => {
            if (/[A-Z]/.test(char)) {
                // Convert letter to corresponding two-digit number
                return (char.charCodeAt(0) - 55).toString(); // A=65 -> 10, B=66 -> 11, ..., Z=90 -> 35
            }
            return char;
        })
        .join("");
}

/**
 * Checks IBAN number if it is valid
 *
 * @param {string} input  iban number
 * @returns true if input is valid, false otherwise
 */

export function isValidIBANNumber(input: string) {
    const CODE_LENGTHS = {
        AD: 24,
        AE: 23,
        AT: 20,
        AZ: 28,
        BA: 20,
        BE: 16,
        BG: 22,
        BH: 22,
        BR: 29,
        CH: 21,
        CR: 22,
        CY: 28,
        CZ: 24,
        DE: 22,
        DK: 18,
        DO: 28,
        EE: 20,
        ES: 24,
        FI: 18,
        FO: 18,
        FR: 27,
        GB: 22,
        GI: 23,
        GL: 18,
        GR: 27,
        GT: 28,
        HR: 21,
        HU: 28,
        IE: 22,
        IL: 23,
        IS: 26,
        IT: 27,
        JO: 30,
        KW: 30,
        KZ: 20,
        LB: 28,
        LI: 21,
        LT: 20,
        LU: 20,
        LV: 21,
        MC: 27,
        MD: 24,
        ME: 22,
        MK: 19,
        MR: 27,
        MT: 31,
        MU: 30,
        NL: 18,
        NO: 15,
        PK: 24,
        PL: 28,
        PS: 29,
        PT: 25,
        QA: 29,
        RO: 24,
        RS: 22,
        SA: 24,
        SE: 24,
        SI: 19,
        SK: 24,
        SM: 27,
        TN: 24,
        TR: 26,
        AL: 28,
        BY: 28,

        EG: 29,
        GE: 22,
        IQ: 23,
        LC: 32,
        SC: 31,
        ST: 25,
        SV: 28,
        TL: 23,
        UA: 29,
        VA: 22,
        VG: 24,
        XK: 20,
    };
    const iban = String(input)
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, ""); // keep only alphanumeric characters
    const code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/); // match and capture (1) the country code, (2) the check digits, and (3) the rest
    // check syntax and length
    if (!code || iban.length !== CODE_LENGTHS[code[1]]) {
        return false;
    }
    // rearrange country code and check digits, and convert chars to ints
    const digits = (code[3] + code[1] + code[2]).replace(
        /[A-Z]/g,
        function (letter) {
            return (letter.charCodeAt(0) - 55).toString();
        }
    );
    // final check
    return mod97(digits) === 1;
}

function mod97(string) {
    let checksum = string.slice(0, 2);
    let fragment: string;
    for (let offset = 2; offset < string.length; offset += 7) {
        fragment = String(checksum) + string.substring(offset, offset + 7);
        checksum = parseInt(fragment, 10) % 97;
    }
    return checksum;
}
