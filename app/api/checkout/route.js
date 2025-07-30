// app/api/checkout/route.js
export async function POST(request) {
  try {
    const { paymentData, orderData } = await request.json();

    console.log("New Order:", { 
      customer: orderData.customer, 
      cart: orderData.items, 
      total: orderData.totals.total,
      payment: { ...paymentData, cardNumber: paymentData.cardNumber.replace(/\d(?=\d{4})/g, '*') }
    });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const cardNumber = paymentData.cardNumber;
    
    // Simulate different error scenarios based on card number endings
    if (cardNumber.includes('0002')) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Your card was declined by your bank. Please contact your card issuer or try a different payment method.'
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    if (cardNumber.includes('0003')) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Insufficient funds available. Please check your account balance or use a different payment method.'
        }),
        {
          status: 402,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    if (cardNumber.includes('0004')) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Your card has expired. Please update your payment information.'
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    if (cardNumber.includes('0005')) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid card information. Please check your card number, expiry date, and CVV.'
        }),
        {
          status: 422,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    if (cardNumber.includes('0006')) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Transaction limit exceeded. Please contact your card issuer or try a smaller amount.'
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    if (cardNumber.includes('0007')) {
      // Simulate server error
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Payment system temporarily unavailable. Please try again in a few minutes.'
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Successful payment
    return new Response(
      JSON.stringify({
        success: true,
        transactionId: 'TXN_' + Date.now(),
        authCode: 'AUTH_' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        message: 'Payment processed successfully'
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error('Checkout API error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        message: "Payment system error. Please try again later." 
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}