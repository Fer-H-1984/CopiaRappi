/**
 * Valida que los numeros ingresados sean numericos y positivos.
 * 
 * @returns true si los numeros cumplen los requisitos, false de no ser asi.
 */

export function validateParameters(params: any, keys: string[]): boolean {
  for (const key of keys) {
    const value = params[key];

    // debe existir
    if (value === undefined || value === null || value === '') {
      return false;
    }

    // debe ser número válido
    if (isNaN(Number(value))) {
      return false;
    }

    // debe ser positivo o cero
    if (Number(value) < 0) {
      return false;
    }
  }

  return true;
}
