const convertToImage = function(result) {
  return {
    imageId: parseInt(result["image_id"]),
    listId: parseInt(result["list_id"]),
    url: result["url"]
  };
};

module.exports = { convertToImage };
