export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(amount)
}

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('es-AR')
}

export const getCurrentMonthYear = () => {
  const now = new Date()
  return {
    mes: now.getMonth() + 1,
    año: now.getFullYear()
  }
}

export const validateRequired = (value: any, fieldName: string): string => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} es requerido`
  }
  return ''
}

export const validatePositiveNumber = (value: number, fieldName: string): string => {
  if (value <= 0) {
    return `${fieldName} debe ser mayor a 0`
  }
  return ''
}