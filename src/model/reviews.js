const convertToReview = function(result) {
  return {
    Id: parseInt(result['id']),
    userId: parseInt(result['user_id']),
    listId: parseInt(result['list_id']),
    create_date: result['reg_date'],
  }
};

module.exports = { convertToReview };