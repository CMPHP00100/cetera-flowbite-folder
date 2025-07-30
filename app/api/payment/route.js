// pages/api/process-payment.js (or app/api/payment/route.js)
import { ApiContracts, ApiControllers } from 'authorizenet';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { paymentData, orderData } = req.body;

  try {
    // Create merchant authentication
    const merchantAuth = new ApiContracts.MerchantAuthenticationType();
    merchantAuth.setName(process.env.NEXT_PUBLIC_AUTHNET_API_LOGIN_ID);
    merchantAuth.setTransactionKey(process.env.NEXT_PUBLIC_AUTHNET_TRANSACTION_KEY);

    // Create credit card info
    const creditCard = new ApiContracts.CreditCardType();
    creditCard.setCardNumber(paymentData.cardNumber.replace(/\s/g, ''));
    creditCard.setExpirationDate(paymentData.expiryDate.replace('/', ''));
    creditCard.setCardCode(paymentData.cvv);

    // Create payment type
    const paymentType = new ApiContracts.PaymentType();
    paymentType.setCreditCard(creditCard);

    // Create customer info
    const customer = new ApiContracts.CustomerDataType();
    customer.setEmail(orderData.customer.email);

    // Create billing address
    const billTo = new ApiContracts.CustomerAddressType();
    billTo.setFirstName(orderData.customer.firstName);
    billTo.setLastName(orderData.customer.lastName);
    billTo.setAddress(paymentData.sameAsShipping ? orderData.shipping.address : paymentData.billingAddress);
    billTo.setCity(paymentData.sameAsShipping ? orderData.shipping.city : paymentData.billingCity);
    billTo.setState(paymentData.sameAsShipping ? orderData.shipping.state : paymentData.billingState);
    billTo.setZip(paymentData.sameAsShipping ? orderData.shipping.zipCode : paymentData.billingZip);
    billTo.setCountry('US');
    billTo.setPhoneNumber(orderData.customer.phone);

    // Create shipping address
    const shipTo = new ApiContracts.CustomerAddressType();
    shipTo.setFirstName(orderData.customer.firstName);
    shipTo.setLastName(orderData.customer.lastName);
    shipTo.setAddress(orderData.shipping.address);
    shipTo.setCity(orderData.shipping.city);
    shipTo.setState(orderData.shipping.state);
    shipTo.setZip(orderData.shipping.zipCode);
    shipTo.setCountry('US');

    // Create transaction request
    const transactionRequest = new ApiContracts.TransactionRequestType();
    transactionRequest.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
    transactionRequest.setAmount(orderData.totals.total);
    transactionRequest.setPayment(paymentType);
    transactionRequest.setCustomer(customer);
    transactionRequest.setBillTo(billTo);
    transactionRequest.setShipTo(shipTo);

    // Create the payment request
    const createRequest = new ApiContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuth);
    createRequest.setTransactionRequest(transactionRequest);

    // Process the transaction
    const ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
    
    return new Promise((resolve) => {
      ctrl.execute(() => {
        const apiResponse = ctrl.getResponse();
        const response = new ApiContracts.CreateTransactionResponse(apiResponse);

        if (response.getMessages().getResultCode() === ApiContracts.MessageTypeEnum.OK) {
          const transactionResponse = response.getTransactionResponse();
          
          if (transactionResponse.getMessages() != null) {
            resolve(res.status(200).json({
              success: true,
              transactionId: transactionResponse.getTransId(),
              authCode: transactionResponse.getAuthCode(),
              message: 'Payment processed successfully'
            }));
          } else {
            resolve(res.status(400).json({
              success: false,
              message: transactionResponse.getErrors().getError()[0].getErrorText()
            }));
          }
        } else {
          resolve(res.status(400).json({
            success: false,
            message: response.getMessages().getMessage()[0].getText()
          }));
        }
      });
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}