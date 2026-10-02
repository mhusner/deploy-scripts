const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const config = require('../config');

const ses = new SESClient({ region: config.aws.region });

async function sendInvoiceEmail(to, invoice) {
  const cmd = new SendEmailCommand({
    Source: config.aws.sesFrom,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: `Invoice ${invoice.number}` },
      Body: {
        Text: {
          Data: `Hello,\n\nplease find your invoice ${invoice.number} ` +
                `for ${invoice.amount} ${invoice.currency}.\n\nNorthwind Billing`,
        },
      },
    },
  });
  return ses.send(cmd);
}

module.exports = { sendInvoiceEmail };
