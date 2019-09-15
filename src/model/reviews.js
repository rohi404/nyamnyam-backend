const convertToReview = function(result) {
  return {
    Id: parseInt(result["id"]),
    userKey: parseInt(result["user_key"]),
    listId: parseInt(result["list_id"]),
    content: result["content"],
    image: result["image"],
    reg_date: result["reg_date"]
  };
};

module.exports = { convertToReview };
