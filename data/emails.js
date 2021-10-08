const balanceDueSubject = "Balance due for {classType} {lastname}";
const balanceDueBody =
  'Please pay your balance of ${amount} for {title} at the link below:<a href="/balance?amount={amount}&firstname={firstname}&lastname={lastname}"> Pay your balance securely here</a>';

module.exports = {
  balanceDueSubject,
  balanceDueBody,
};
