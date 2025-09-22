export const moneyDisplay = (amount: number) => 
    Number(amount).toLocaleString("vi-VN", { style: "currency", currency: "VND" })