const random = function(n1, n2) {
  return parseInt(Math.random() * (n2 - n1 + 1)) + n1;
};

const authNo = function(n) {
  let value = "";
  for (let i = 0; i < n; i++) {
    value += random(0, 9);
  }
  return value;
};

module.exports = authNo;
