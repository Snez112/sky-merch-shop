export function isValidGenerateCode(code: string): boolean {
  const value = code.trim();
  return /^([a-zA-Z0-9]{4}(?:-[a-zA-Z0-9]{4}){2}|[a-zA-Z0-9]{12})$/.test(value);
}

export function generateCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
}
