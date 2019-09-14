const convertToImage = function(result) {
  return {
    imageId: parseInt(result["image_id"]),
    listId: parseInt(result["list_id"]),
    url: result["url"],
    imageOrder: result["image_order"]
  };
};

module.exports = { convertToImage };
