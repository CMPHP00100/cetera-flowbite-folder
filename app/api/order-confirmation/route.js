// app/api/order-confirmation/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { orderData } = await request.json();

    // 1. Get access token using client_credentials
    const tokenRes = await fetch(`https://login.microsoftonline.com/${process.env.OUTLOOK_TENANT_ID}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.OUTLOOK_CLIENT_ID,
        client_secret: process.env.OUTLOOK_CLIENT_SECRET,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
      }),
    });

    const tokenText = await tokenRes.text();
    let tokenData;

    try {
      tokenData = JSON.parse(tokenText);
    } catch (err) {
      console.error('Failed to parse token response:', tokenText);
      throw new Error('Invalid token response');
    }

    if (!tokenRes.ok) {
      console.error('Token request failed:', tokenData);
      throw new Error(`Token error: ${tokenData.error_description || 'Unknown error'}`);
    }

    const accessToken = tokenData.access_token;

    // 2. Generate email HTML content
    const emailHtml = generateOrderConfirmationEmail(orderData);

    // 3. Send order confirmation email using Microsoft Graph API
    const mailRes = await fetch('https://graph.microsoft.com/v1.0/users/' + process.env.OUTLOOK_EMAIL_FROM + '/sendMail', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          subject: `Order Confirmation - ${orderData.id}`,
          body: {
            contentType: 'HTML',
            content: emailHtml,
          },
          toRecipients: [
            {
              emailAddress: {
                address: orderData.customer.email,
                name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
              },
            },
          ],
          replyTo: [
            {
              emailAddress: {
                address: process.env.OUTLOOK_EMAIL_FROM,
                name: 'Customer Service',
              },
            },
          ],
        },
        saveToSentItems: 'true', // Save confirmation emails to sent items
      }),
    });

    if (!mailRes.ok) {
      const errorText = await mailRes.text();
      console.error('Mail send failed:', errorText);
      throw new Error(`Failed to send confirmation email: ${mailRes.statusText} - ${errorText}`);
    }

    console.log('✅ Order confirmation email sent successfully to:', orderData.customer.email);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Order confirmation email error:', error);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}

function generateOrderConfirmationEmail(orderData) {
  const {
    id,
    customer,
    shipping,
    items,
    totals,
    date,
    transactionId,
    status
  } = orderData;

  const orderDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - ${id}</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0; 
          background-color: #f5f5f5; 
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: white; 
          box-shadow: 0 0 10px rgba(0,0,0,0.1); 
        }
        .header { 
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); 
          color: #1e3a8a; 
          padding: 30px 20px; 
          text-align: center; 
        }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
        .content { padding: 30px 20px; }
        .status-badge { 
          display: inline-block; 
          padding: 6px 12px; 
          background-color: #10b981; 
          color: #1e3a8a; 
          border-radius: 20px; 
          font-size: 12px; 
          font-weight: 600; 
          text-transform: uppercase; 
          margin-bottom: 20px; 
        }
        .order-details { 
          background-color: #f8fafc; 
          padding: 20px; 
          margin: 20px 0; 
          border-radius: 8px; 
          border-left: 4px solid #1e3a8a; 
        }
        .order-details h3 { 
          margin: 0 0 15px 0; 
          color: #1e3a8a; 
          font-size: 18px; 
        }
        .detail-row { 
          display: flex; 
          justify-content: space-between; 
          padding: 8px 0; 
          border-bottom: 1px solid #e2e8f0; 
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: 600; color: #4a5568; }
        .detail-value { color: #2d3748; }
        .items-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 15px 0; 
        }
        .items-table th, .items-table td { 
          padding: 12px; 
          text-align: left; 
          border-bottom: 1px solid #e2e8f0; 
        }
        .items-table th { 
          background-color: #f1f5f9; 
          font-weight: 600; 
          color: #475569; 
          font-size: 14px; 
        }
        .item-name { font-weight: 500; }
        .item-price { text-align: right; font-weight: 600; }
        .totals-section { 
          background-color: #1e3a8a; 
          color: white; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0; 
        }
        .total-row { 
          display: flex; 
          justify-content: space-between; 
          padding: 5px 0; 
        }
        .total-row.final { 
          border-top: 2px solid rgba(255,255,255,0.3); 
          margin-top: 10px; 
          padding-top: 15px; 
          font-size: 18px; 
          font-weight: 700; 
        }
        .shipping-info { 
          background-color: #eff6ff; 
          padding: 15px; 
          border-radius: 6px; 
          border: 1px solid #dbeafe; 
        }
        .next-steps { 
          background-color: #f0fdf4; 
          padding: 20px; 
          border-radius: 8px; 
          border-left: 4px solid #10b981; 
          margin: 20px 0; 
        }
        .next-steps h3 { color: #065f46; margin: 0 0 15px 0; }
        .next-steps ul { margin: 0; padding-left: 20px; }
        .next-steps li { margin: 8px 0; color: #047857; }
        .cta-button { 
          display: inline-block; 
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 6px; 
          font-weight: 600; 
          margin: 15px 0; 
        }
        .footer { 
          background-color: #f8fafc; 
          text-align: center; 
          padding: 30px 20px; 
          color: #64748b; 
          font-size: 14px; 
          border-top: 1px solid #e2e8f0; 
        }
        .footer p { margin: 5px 0; }
        @media (max-width: 600px) {
          .container { margin: 0; }
          .content { padding: 20px 15px; }
          .detail-row { flex-direction: column; }
          .detail-row .detail-value { margin-top: 5px; font-weight: 600; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Order Confirmed!</h1>
          <p>Thank you for your purchase, ${customer.firstName}!</p>
        </div>
        
        <div class="content">
          <div class="status-badge">${status || 'Processing'}</div>
          
          <p style="font-size: 16px; margin-bottom: 25px;">
            We've received your order and are preparing it for shipment. 
            Here are your order details:
          </p>
          
          <div class="order-details">
            <h3>📋 Order Information</h3>
            <div class="detail-row">
              <span class="detail-label">Order Number:</span>
              <span class="detail-value">${id}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Order Date:</span>
              <span class="detail-value">${orderDate}</span>
            </div>
            ${transactionId ? `
            <div class="detail-row">
              <span class="detail-label">Transaction ID:</span>
              <span class="detail-value">${transactionId}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="order-details">
            <h3>📦 Shipping Address</h3>
            <div class="shipping-info">
              <strong>${customer.firstName} ${customer.lastName}</strong><br>
              ${shipping.address}<br>
              ${shipping.city}, ${shipping.state} ${shipping.zipCode}<br>
              ${shipping.country || 'US'}
            </div>
          </div>
          
          <div class="order-details">
            <h3>🛍️ Order Items</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(item => `
                  <tr>
                    <td class="item-name">${item.displayName || item.name}</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td class="item-price">$${(item.prc || 0).toFixed(2)}</td>
                    <td class="item-price">$${((item.prc || 0) * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="totals-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>$${totals.subtotal.toFixed(2)}</span>
            </div>
            ${totals.discount > 0 ? `
              <div class="total-row" style="color: #10b981;">
                <span>Discount${totals.coupon ? ` (${totals.coupon})` : ''}:</span>
                <span>-$${totals.discount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="total-row">
              <span>Shipping:</span>
              <span>$${totals.shipping.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Tax:</span>
              <span>$${totals.tax.toFixed(2)}</span>
            </div>
            <div class="total-row final">
              <span>Total Paid:</span>
              <span>$${totals.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="next-steps">
            <h3>🚀 What's Next?</h3>
            <ul>
              <li><strong>Processing:</strong> We'll prepare your order within 1-2 business days</li>
              <li><strong>Shipping:</strong> You'll receive tracking information once your order ships</li>
              <li><strong>Delivery:</strong> Estimated delivery based on your selected shipping method</li>
              <li><strong>Support:</strong> Contact us anytime if you have questions</li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/orders/${id}" class="cta-button">
              Track Your Order
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Thank you for choosing us!</strong></p>
          <p>Questions? Reply to this email or contact our support team.</p>
          <p style="margin-top: 15px; font-size: 12px;">
            This is an automated message. Please do not reply directly to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}