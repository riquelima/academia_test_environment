export const maskCPF = (value: string): string => {
  if (!value) return "";
  return value
    .replace(/\D/g, '') // Remove non-digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14); // Max length 14 (999.999.999-99)
};

export const maskPhone = (value: string): string => {
  if (!value) return "";
  return value
    .replace(/\D/g, '') // Remove non-digits
    .replace(/^(\d{2})(\d)/, '($1) $2') // (XX) XXXXX-XXXX
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
    .slice(0, 15); // Max length 15 ((XX) XXXXX-XXXX)
};
