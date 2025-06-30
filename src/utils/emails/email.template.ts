export function generateOTPTemplate(otp: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Verify Your Email - Social App</title>
        <style>
          body {
            font-family: 'Helvetica Neue', sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }
          .logo {
            text-align: center;
            margin-bottom: 20px;
          }
          .logo h1 {
            color: #4CAF50;
            margin: 0;
          }
          .title {
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            color: #333333;
          }
          .message {
            font-size: 16px;
            color: #555555;
            margin: 20px 0;
            text-align: center;
          }
          .otp {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #ffffff;
            background-color: #4CAF50;
            text-align: center;
            padding: 15px 20px;
            border-radius: 8px;
            margin: 20px auto;
            width: fit-content;
          }
          .footer {
            text-align: center;
            font-size: 13px;
            color: #999999;
            margin-top: 40px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <h1>Social App</h1>
          </div>
          <div class="title">Email Verification</div>
          <div class="message">
            Please use the code below to verify your email address.<br/>
            This code is valid for the next 10 minutes.
          </div>
          <div class="otp">${otp}</div>
          <div class="message">
            If you didn’t request this, please ignore this email.
          </div>
          <div class="footer">© 2025 Social App Inc. All rights reserved.</div>
        </div>
      </body>
      </html>
    `;
}