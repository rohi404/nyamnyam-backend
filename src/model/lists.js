const convertToList = function(result) {
  return {
    listId: parseInt(result['list_id']),
    folderId: parseInt(result['folder_id']),
    name: result['name'],
    location: result['location'],
    memo: result['memo'],
    image: result['image'],
    reg_date: result['reg_date'],
  }
};

module.exports = { convertToList };