  
   export const orderConfirmation = ({ userName, orderId, items, amount, deliveryFee, paymentMethod, userAddress, userPhone }) => `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
    <!-- Header -->
    <div style="background-color: #4CAF50; padding: 20px; text-align: center; color: #fff;">
      <h1 style="margin: 0; font-size: 24px;">Thank You for Your Purchase!</h1>
      <p style="margin: 5px 0; font-size: 16px;">Order Confirmation - #${orderId}</p>
    </div>

    <!-- Customer Greeting -->
    <div style="padding: 20px;">
      <p style="font-size: 16px;">Hi ${userName},</p>
      <p style="font-size: 16px;">Thank you for shopping with us! Your order has been received and is currently being processed.</p>
    </div>

    <!-- Order Summary -->
    <div style="padding: 0 20px;">
      <h2 style="font-size: 18px; color: #4CAF50; margin-bottom: 10px;">Order Summary</h2>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Payment Method:</strong> ${paymentMethod}</p>
    </div>

    <!-- Shipping Details -->
    <div style="padding: 20px;">
      <h3 style="font-size: 16px; color: #333; margin-bottom: 5px;">Shipping Address</h3>
      <p style="margin: 5px 0;">${userAddress}</p>
      <p style="margin: 5px 0;">Contact: ${userPhone}</p>
    </div>

    <!-- Items Table -->
    <div style="padding: 20px;">
      <h3 style="font-size: 16px; color: #333; margin-bottom: 10px;">Items Ordered</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8f8f8;">
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
            <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Quantity</th>
            <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name} (${item.size})</td>
              <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${item.quantity}</td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">₦${item.price.toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Total Summary -->
    <div style="padding: 20px;">
      <p style="font-size: 16px; margin: 10px 0;"><strong>Subtotal:</strong> ₦${amount.toLocaleString()}</p>
      <p style="font-size: 16px; margin: 10px 0;"><strong>Delivery Fee:</strong> ₦${deliveryFee.toLocaleString()}</p>
      <h2 style="font-size: 18px; color: #4CAF50; margin-top: 20px; margin-bottom: 10px;">Total: ₦${(amount + deliveryFee).toLocaleString()}</h2>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8f8f8; padding: 20px; text-align: center; color: #777;">
      <p style="margin: 5px 0;">If you have any questions, contact our support team at <a href="mailto:paragon@gmail.com" style="color: #4CAF50; text-decoration: none;">support@yourstore.com</a></p>
      <p style="margin: 5px 0;">Thank you for choosing our store!</p>
    </div>
  </div>
`;

