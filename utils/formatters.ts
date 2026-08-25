// utils/formatters.ts

export function formatCurrency(value: number, currency: string = 'BRL'): string {
    const validCurrency = currency === 'R$' ? 'BRL' : currency
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: validCurrency,
    }).format(value)
}

export function formatPhone(phone: string): string {
    return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
}
