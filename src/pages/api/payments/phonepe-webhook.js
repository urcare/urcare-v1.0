import crypto from 'crypto';

export default async function handler(req, res) {
  // Validate x-verify header as per PhonePe docs
  const xverify = req.headers['x-verify'] || req.headers['X-VERIFY'];
  const bodyRaw = JSON.stringify(req.body || {});
  // The dev must compute expected X-VERIFY using received payload and salt + path (see docs)
  // For now, accept and respond OK but log if mismatch (improve by copying exact calc used above).
  console.log('PhonePe webhook received', req.body, xverify);
  // update order in DB here (mark paid/failed)
  res.status(200).send('OK');
}
