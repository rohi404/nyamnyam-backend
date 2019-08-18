const convertToReview = function(result) {
  return {
    Id: parseInt(result['id']),
    userId: parseInt(result['user_id']),
    listId: parseInt(result['list_id']),
    content: result['content'],
    image: result['image'],
    reg_date: result['reg_date'],
  }
};

module.exports = { convertToReview };