const convertToList = function(result) {
  return {
    listId: parseInt(result['list_id']),
    folderId: parseInt(result['folder_id']),
    name: result['name'],
    location: result['location'],
    memo: result['memo'],
    image: result['image'],
    reg_date: result['reg_date'],
    want_count: parseInt(result['want_count']),
    like_count: parseInt(result['like_count']),
  }
};

module.exports = { convertToList };