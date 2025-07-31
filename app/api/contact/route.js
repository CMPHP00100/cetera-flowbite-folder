// app/api/contact.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

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

    // 2. Send mail using Microsoft Graph API
    const mailRes = await fetch('https://graph.microsoft.com/v1.0/users/' + process.env.OUTLOOK_EMAIL_FROM + '/sendMail', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          subject: 'New Contact Form Submission',
          body: {
            contentType: 'HTML',
            content: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`,
          },
          toRecipients: [
            {
              emailAddress: {
                address: process.env.OUTLOOK_EMAIL_TO,
              },
            },
          ],
          replyTo: [
            {
              emailAddress: {
                address: email,
                name: name,
              },
            },
          ],
        },
        saveToSentItems: 'false',
      }),
    });

    if (!mailRes.ok) {
      const errorText = await mailRes.text();
      throw new Error(`Failed to send mail: ${mailRes.statusText} - ${errorText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Email send failed' }, { status: 500 });
  }
}
