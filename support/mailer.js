async function sendEmail(subject, body) {
  console.log("sendEmail called");
  return { success: true };
}

module.exports = { sendEmail };