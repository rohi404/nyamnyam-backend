const convertToFolder = function(result) {
  return {
    folderId: parseInt(result['folder_id']),
    userId: result['user_id'],
    leader: parseInt(result['leader']),
    name: result['name'],
    emoji: result['emoji'],
    color: result['color'],
    link: result['link'],
    reg_date: result['reg_date'],
  }
};

module.export = convertToFolder;