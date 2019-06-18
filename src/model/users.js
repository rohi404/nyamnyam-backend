const convertToUser = function(result) {
  return {
    userId: parseInt(result['user_id']),
    id: result['id'],
    password: result['password'],
    nickname: result['nickname'],
    image: result['image'],
    background: result['background'],
    reg_date: result['reg_date'],
  }
};

module.exports = { convertToUser };