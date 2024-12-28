const styles = {
  main: `font-family: open sans;
    font-size: 1rem;
    margin: 3rem auto;
    padding: 2rem;
    width: 32rem;
    color: #302f2f;
    border: 1px solid #cac7c7;
    border-radius: 1px;
    box-shadow: 1px 1px #888888;`,
  p: `margin: 1rem 0;
    text-align: justify;
    text-justify: inter-word;`,
  th: `font-weight: bold;
    border: 1px solid #333;
    padding: .5rem;
    text-align: left;
    width: 40%;`,
  td: `border: 1px solid #333;
    padding: .5rem;`,
};
const siteName = "Wesley Shirley Christian";
const siteUrl = "https://wesleyshirley.com";
const siteEmail = "support@wesleyshirley.com";
const logoUrl = "https://wesleyshirley.com/logo-white.png";

const defaultOptions = (sendTo, details) => {
  return {
    from: `${siteName} <alert@1kcapital.org>`,
    to: sendTo, // list of receivers
    subject: details.subject,
    text: `Empty Email`, // plain text body
    html: `
        <div style="${styles.main}">
          <img src="${logoUrl}" alt="" height="60px" />
          <hr />
          <h3 style="text-align: center">${details.subject}</h3>

          ${details.body}
        
          
          <p style="text-align: center; margin: 3rem 0 0 0; font-size: 0.8rem">
          DISCLAIMER: this message was automatically generated via ${siteName} Trust secured online channel, 
          please do not reply this message. all correspondent should be address to customer Services.
          Follow here: ${siteUrl}/<br />
          To Login and access your account<br /><br />
          &copy;2023 ${siteName} Trust Bank All rights reserved
        </p>
        </div>`, // html body
  };
};

const createAccount = (user) => {
  return {
    email: user.email,
    subject: `Account Opening - Welcome to ${siteName}`,
    body: `Dear <strong>${user.fullName}</strong>, 
    <p style="${styles.p}">
      Thank you for choosing Wesley Shirley Christian for your trading needs. We
      are excited to have you as our new customer and we look forward to
      providing you with exceptional trading services.
    </p>

    <p style="${styles.p}">Below is your account details:</p>

    <table style="width: 100%;">
      <tbody>
        <tr>
          <th style="${styles.th}">Account Name</th>
          <td style="${styles.td}">${user.fullName}</td>
        </tr>
        <tr>
          <th style="${styles.th}">Account Number</th>
          <td style="${styles.td}">${user.email}</td>
        </tr>
        <tr>
          <th style="${styles.th}">Account Password</th>
          <td style="${styles.td}">${user.password}</td>
        </tr>
        <tr>
          <th style="${styles.th}">Currency</th>
          <td style="${styles.td}">${user.cur}</td>
        </tr>
        <tr>
          <th style="${styles.th}">Initial balance</th>
          <td style="${styles.td}">${user.realBal}</td>
        </tr>
      </tbody>
    </table>


    <p style="${styles.p}">
      As a reminder, our online trading platform is available 24/7 to help you
      manage your account from anywhere in the world. To log in to your
      account, please <a href="${siteUrl}">visit our trading Dashboard</a>
      and enter your login credentials.
    </p>

    <p style="${styles.p}">
      If you have questions regarding any other
      aspect of your account, please do not hesitate to contact our online
      customer service team or send an email to <a href="mailto:${siteEmail}">
      ${siteEmail}</a>.
      We are always here to assist you in any way we can. Thank you for
      choosing Wesley Shirley Christian. We appreciate your business and look
      forward to serving you.
    </p>

    <p style="${styles.p}">
      Once again, we thank you for choosing Wesley Shirley Christian as your
      trading partner. We look forward to serving you in the years to come.
    </p>`,
  };
};

const blockAccount = (user) => {
  return {
    email: user.email,
    subject: "Account Suspension Notice!",
    body: `Dear <strong>${user.fullName}</strong>,
    <p style="${styles.p}">We wish to notify you that your account has been suspended<br />
    Kindly contact our customer care service desk via <a href="mailto:${siteEmail}">
    ${siteEmail}</a> for details of this action and unsuspension proceedure.
    </p>`,
  };
};

const activateUser = (user) => {
  return {
    email: user.email,
    subject: "Account Activatin Successful",
    body: `Dear <strong>${user.fullName}</strong>,
    <p style="${styles.p}">
    We wish to notify you that your account verification has been approved. You can now login for full access
    </p>`,
  };
};

const contactUser = (adminOptions) => {
  return {
    email: adminOptions.email,
    subject: adminOptions.subject,
    body: `${adminOptions.message}. ${adminOptions.detail}`, // html body
  };
};

const approveTransaction = (user, transaction) => {
  return {
    email: user.email,
    subject: "Transfer Request Approved",
    body: `Dear <strong>${user.fullName}</strong>,
    <p style="${styles.p}">
    Your ${transaction.type} transaction request of ${user.cur} ${transaction.amount} has been processed and approved!
    </p>`,
  };
};

const creditAccount = (user) => {
  return {
    email: user.email,
    subject: "Credit Alert!",
    body: `Dear <strong>${user.fullName}</strong>,
    <p style="${styles.p}">
          You have received money into your account, login for more details
    }. Your new account balance is <strong>${user.realBal}</strong></p>`,
  };
};

const getRegCode = (user) => {
  return {
    email: user.email,
    subject: "Email Verification Code",
    body: `Hi <strong>${user.fullName}</strong>,
    <p style="${styles.p}">Your verification code is:</p>
    <h2>${user.securityCode}</h2>
    <p style="${styles.p}">This code will expire in 5 minutes.
    </p>`,
  };
};

const resetUserPassword = (user) => {
  return {
    email: user.email,
    subject: "Activated - Account Suspension Lifted",
    body: `<p style="${styles.p}">
    Your Password has been reset successfully.<br />
    New Password is: ${user.password}
    </p>`,
  };
};

const contactUsForm = (enteredData) => {
  return {
    subject: `${enteredData.subject} - [Contact Form]`,
    body: `<p><strong>Sender: </strong>${enteredData.fullName} - ${enteredData.email}</p>
    <p>${enteredData.message}</p>`,
  };
};

module.exports = {
  defaultOptions,
  createAccount,
  blockAccount,
  activateUser,
  contactUser,
  approveTransaction,
  creditAccount,
  getRegCode,
  resetUserPassword,
  contactUsForm,
};
