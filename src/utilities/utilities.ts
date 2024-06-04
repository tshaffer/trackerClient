export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

export const formatPercentage = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

export const daysBetween = (date1String: string, date2String: string) => {
  const d1: any = new Date(date1String);
  const d2: any = new Date(date2String);
  return Math.floor((d2 - d1) / (1000 * 3600 * 24));
}

export const expensesPerMonth = (totalAmount: number, startDate: string, endDate: string): string => {
  const days = daysBetween(startDate, endDate);
  return formatCurrency(totalAmount / (days / 30));
}