const convertToUser = function(result) {
  return {
    userKey: parseInt(result["user_key"]),
    userId: result["user_id"],
    password: result["password"],
    nickname: result["nickname"],
    email: result["email"],
    image: result["image"],
    background: result["background"],
    reg_date: result["reg_date"]
  };
};

module.exports = { convertToUser };
