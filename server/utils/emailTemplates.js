const recoveryEmailTemplate = (recoveryLink) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Account Recovery</title>
    </head>
    <body style="margin:0; padding:0; background:#0b1220; font-family:Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="max-width:520px; background:#161d29; border-radius:12px; padding:32px;">
              
              <tr>
                <td align="center">
                  <h2 style="color:#ffffff; margin-bottom:16px;">
                    Account Recovery Requested
                  </h2>
                </td>
              </tr>

              <tr>
                <td style="color:#cbd5e1; font-size:14px; line-height:1.6;">
                  We received a request to recover your StudyNotion account.
                  Click the button below to confirm this action.
                </td>
              </tr>

              <tr>
                <td align="center" style="padding:24px 0;">
                  <a href="${recoveryLink}"
                    style="
                      display:inline-block;
                      padding:12px 24px;
                      background:#facc15;
                      color:#000000;
                      text-decoration:none;
                      border-radius:8px;
                      font-weight:600;
                    ">
                    Recover Account
                  </a>
                </td>
              </tr>

              <tr>
                <td style="color:#94a3b8; font-size:13px; line-height:1.6;">
                  This link will expire in 15 minutes.
                  If you did not request this, you can safely ignore this email.
                </td>
              </tr>

              <tr>
                <td style="padding-top:24px; text-align:center; color:#64748b; font-size:12px;">
                  © ${new Date().getFullYear()} StudyNotion
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

module.exports = recoveryEmailTemplate;
