export const orderConfirmation = (userName, orderId, items, amount) => {
    const itemsList = items.map(item => `<li>${item.name} - ${item.quantity} x ₦${item.price}</li>`).join('');

    return `
        <h1>Order Confirmation</h1>
        <p>Dear ${userName},</p>
        <p>Thank you for your order! Your order ID is <strong>${orderId}</strong>.</p>
        <p>Here are the details of your order:</p>
        <ul>
            ${itemsList}
        </ul>
        <p><strong>Total:</strong> ₦${amount}</p>
        <p>We will notify you once your order is being processed.</p>
        <p>Thank you for shopping with us!</p>
    `;
};
