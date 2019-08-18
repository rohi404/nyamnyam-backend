const convertToMember = function(result) {
  return {
    Id: parseInt(result['id']),
    userId: parseInt(result['user_id']),
    folderId: parseInt(result['folder_id']),
  }
};

module.exports = { convertToMember };