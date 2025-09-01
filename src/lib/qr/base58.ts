const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export function generateBase58(length: number = 5): string {
  let result = '';
  const alphabetLength = BASE58_ALPHABET.length;
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabetLength);
    result += BASE58_ALPHABET[randomIndex];
  }
  
  return result;
}

export function isValidBase58(str: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]+$/.test(str);
}

export function generateUniqueCode(category: string, existingCodes: Set<string>): string {
  let attempts = 0;
  const maxAttempts = 1000;
  
  while (attempts < maxAttempts) {
    const base58Id = generateBase58();
    const code = `${category}${base58Id}`;
    
    if (!existingCodes.has(code)) {
      return code;
    }
    
    attempts++;
  }
  
  throw new Error(`Failed to generate unique code after ${maxAttempts} attempts`);
}