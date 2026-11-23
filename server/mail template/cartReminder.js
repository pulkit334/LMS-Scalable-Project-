// utils/emailTemplates.js

/**
 * Generate beautiful HTML email for cart reminder
 */
exports.generateCartReminderEmail = (user, cart, frontendUrl) => {
  const courseList = cart.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #eee;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr> 
              <td width="80" style="padding-right: 15px;">
                ${item.thumbnail ? `<img src="${item.thumbnail}" width="80" height="80" style="border-radius: 8px; object-fit: cover;" alt="${item.title}">` : ''}
              </td>
              <td>
                <div style="font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 5px;">
                  ${item.title}
                </div>
                <div style="font-size: 18px; font-weight: 700; color: #059669;">
                  ₹${item.price}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cart Reminder</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                🛒 Your Cart is Waiting!
              </h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">
                Complete your learning journey
              </p>
            </td>
          </tr>
          
          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 22px; font-weight: 600;">
                Hi ${user.firstName || "there"}! 👋
              </h2>
              <p style="margin: 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                You have <strong style="color: #059669;">${cart.itemCount} course${cart.itemCount > 1 ? "s" : ""}</strong> waiting in your cart. Don't let this opportunity slip away!
              </p>
            </td>
          </tr>
          
          <!-- Course List -->
          <tr>
            <td style="padding: 0 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
                ${courseList}
              </table>
            </td>
          </tr>
          
          <!-- Total -->
          <tr>
            <td style="padding: 20px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: right; padding: 15px 20px; background-color: #f0fdf4; border-radius: 8px; border: 2px dashed #059669;">
                    <span style="font-size: 16px; color: #6b7280; margin-right: 15px;">Total:</span>
                    <span style="font-size: 24px; font-weight: 700; color: #059669;">₹${cart.totalPrice}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 10px 30px 30px 30px; text-align: center;">
              <a href="/cart" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 18px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
                Complete Your Purchase 🚀
              </a>
            </td>
          </tr>
          
          <!-- Why Complete -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px;">
                <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px; font-weight: 600;">
                  ⚡ Why complete now?
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 14px; line-height: 1.8;">
                  <li>Start learning immediately</li>
                  <li>Lifetime access to all courses</li>
                  <li>Certificate of completion</li>
                  <li>30-day money-back guarantee</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Happy Learning! 📚
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                - Notions-X Team
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `;
};