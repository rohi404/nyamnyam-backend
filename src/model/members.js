const convertToMember = function(result) {
  return {
    Id: parseInt(result["id"]),
    userKey: parseInt(result["user_key"]),
    folderId: parseInt(result["folder_id"])
  };
};

module.exports = { convertToMember };
