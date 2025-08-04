// app/api/send-order-confirmation/route.js
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { orderData } = await request.json();

    // Calculate item totals
    const itemsHtml = orderData.items.map(item => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; text-align: left;">
          <div style="font-weight: 500;">${item.displayName || item.name}</div>
          ${item.selectedColor ? `<div style="color: #666; font-size: 14px;">Color: ${item.selectedColor}</div>` : ''}
        </td>
        <td style="padding: 12px; text-align: center;">$${(typeof item.prc === 'number' ? item.prc : parseFloat(item.prc || 0)).toFixed(2)}</td>
        <td style="padding: 12px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right; font-weight: 500;">$${((typeof item.prc === 'number' ? item.prc : parseFloat(item.prc || 0)) * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
            <h1 style="color: #2c3e50; margin: 0;">Order Confirmation</h1>
            <p style="color: #666; margin: 10px 0 0 0;">Thank you for your order!</p>
          </div>

          <!-- Order Details -->
          <div style="margin-bottom: 30px;">
            <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Order Details</h2>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p style="margin: 5px 0;"><strong>Order Number:</strong> ${orderData.id}</p>
              <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(orderData.date).toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #27ae60; font-weight: bold;">${orderData.status}</span></p>
            </div>
          </div>

          <!-- Customer Information -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #2c3e50;">Customer Information</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${orderData.customer.email}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${orderData.customer.phone}</p>
          </div>

          <!-- Shipping Address -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #2c3e50;">Shipping Address</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
              <p style="margin: 0;">${orderData.customer.firstName} ${orderData.customer.lastName}</p>
              <p style="margin: 5px 0 0 0;">${orderData.shipping.address}</p>
              <p style="margin: 5px 0 0 0;">${orderData.shipping.city}, ${orderData.shipping.state} ${orderData.shipping.zipCode}</p>
              <p style="margin: 5px 0 0 0;">${orderData.shipping.country}</p>
            </div>
          </div>

          <!-- Order Items -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #2c3e50;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; background-color: white; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Price</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <!-- Order Summary -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #2c3e50;">Order Summary</h3>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Subtotal:</span>
                <span>$${parseFloat(orderData.totals.subtotal || 0).toFixed(2)}</span>
              </div>
              ${orderData.totals.discount > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #27ae60;">
                  <span>Discount (${orderData.totals.coupon}):</span>
                  <span>-$${((parseFloat(orderData.totals.subtotal || 0) * parseFloat(orderData.totals.discount || 0)) / 100).toFixed(2)}</span>
                </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Shipping:</span>
                <span>$${parseFloat(orderData.totals.shipping || 0).toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span>Tax:</span>
                <span>$${parseFloat(orderData.totals.tax || 0).toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; border-top: 2px solid #3498db; padding-top: 15px;">
                <span>Total:</span>
                <span style="color: #2c3e50;">$${parseFloat(orderData.totals.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #2c3e50;">Payment Method</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
              <p style="margin: 0;">Credit Card ending in ****${orderData.payment.cardNumber.slice(-4)}</p>
              <p style="margin: 5px 0 0 0;">${orderData.payment.cardName}</p>
            </div>
          </div>

          <!-- Shipping Method -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #2c3e50;">Shipping Method</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
              <p style="margin: 0;">
                ${orderData.shipping.shippingMethod === 'standard' ? 'Standard Shipping (5-7 business days)' : 
                  orderData.shipping.shippingMethod === 'express' ? 'Express Shipping (2-3 business days)' : 
                  'Overnight Shipping (1 business day)'}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin-top: 30px;">
            <p style="margin: 0; color: #666;">Thank you for your business!</p>
            <p style="margin: 10px 0 0 0; color: #666;">You will receive tracking information once your order ships.</p>
            <div style="margin-top: 20px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/orders/${orderData.id}" 
                 style="display: inline-block; background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                View Order Details
              </a>
            </div>
          </div>

          <!-- Contact Info -->
          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              Questions about your order? Contact us at support@yourstore.com
            </p>
          </div>

        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Your Store <orders@yourstore.com>', // Replace with your verified domain
      to: [orderData.customer.email],
      subject: `Order Confirmation - ${orderData.id}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Email send error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}