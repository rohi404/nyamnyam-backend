const convertToCheck = function(result) {
  return {
    checkId: parseInt(result['id']),
    userId: parseInt(result['user_id']),
    listId: parseInt(result['list_id']),
    wantCheck: parseInt(result['want_check']),
    likeCheck: parseInt(result['like_check']),
  }
};

module.exports = { convertToCheck };