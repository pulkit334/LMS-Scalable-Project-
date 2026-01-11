exports.PaymentSuccessEmail = (name, amount, orderId, paymentId) => {
  return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Payment Confirmation</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }

            img{
				mix-blend-mode: color-burn;
				border-radius:50%;
			}
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #FFD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
<body style="margin:0; padding:0; background:#f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4; padding:20px;">
    <tr>
      <td align="center">

        <!-- CARD -->
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff; padding:24px; border-radius:8px; font-family:Arial, sans-serif;">

          <tr>
            <td align="center" style="font-size:22px; font-weight:bold; padding-bottom:16px;">
              Course Payment Confirmation
            </td>
          </tr>

          <tr>
            <td style="font-size:16px; padding-bottom:12px;">
              Dear <b>${name}</b>,
            </td>
          </tr>

          <tr>
            <td style="font-size:16px; padding-bottom:12px;">
              We have received a payment of
              <b style="font-size:18px;">₹${amount}</b>
            </td>
          </tr>

          <tr>
            <td style="font-size:14px; padding-bottom:8px;">
              Payment ID: <b>${paymentId}</b>
            </td>
          </tr>

          <tr>
            <td style="font-size:14px; padding-bottom:16px;">
              Order ID: <b>${orderId}</b>
            </td>
          </tr>

          <tr>
            <td style="font-size:13px; color:#777;">
              If you need help, contact us at
              <a href="mailto:info@ietagradummy.com">info@ietagradummy.com</a>
            </td>
          </tr>

        </table>
        <!-- CARD END -->

      </td>
    </tr>
  </table>
</body>

    
    </html>`;
};
