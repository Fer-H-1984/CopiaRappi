/**
 * Valida que los numeros ingresados sean numericos y positivos.
 * 
 * @returns true si los numeros cumplen los requisitos, false de no ser asi.
 */

export function validateParameters(id: any, page?: any, limit?: any): boolean {
    const isNonNegativeNumeric = (v: any): boolean => {
        if (v === undefined || v === null || v === '') return true; // treat missing params as valid
        const n = Number(v);
        return typeof n === 'number' && !Number.isNaN(n) && Number.isFinite(n) && n >= 0;
    };

    if (id !== undefined && id !== null && id !== '') {
        if (!isNonNegativeNumeric(id)) return false;
    }

    if (page !== undefined && page !== null && page !== '') {
        if (!isNonNegativeNumeric(page)) return false;
    }
    if (limit !== undefined && limit !== null && limit !== '') {
        if (!isNonNegativeNumeric(limit)) return false;
    }

    return true;
}