import cloudinary from '#configs/cloudinary.config.js'

//upload from url image
const uploadImageFromUtl = async () => {
  try {
    const urlImage = 'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mgt6a6oy4rv227@resize_w900_nl.webp'
    const folderName = 'product/shopId'
    const newFileName = 'testdemo'

    const result = await cloudinary.uploader.upload(
      urlImage,
      { public_id: newFileName, folder: folderName },
    )
    return result
  } catch (error) {
    console.log(error)
  }
}

const uploadImageFromLocal = async ({ path, folderName = 'product/shopId' }) => {
  try {
    const result = await cloudinary.uploader.upload(path, { public_id: 'thumb', folder: folderName })
    return {
      image_url: result.secure_url,
      shopId: result.shopId,
      thumn_size: cloudinary.url(result.public_id, { height: 100, width: 100, format: 'jpg' })
    }
  } catch (error) {
    console.log(error)
  }
}

const uploadMultiImageFromLocal = async ({ files, folderName = 'product/shopId' }) => {
  try {
    if (!files.length) return
    const uploadedUrl = []
    for (const file of files) {
      //nen de vo promise
      const result = await cloudinary.uploader.upload(file.path, { folder: folderName })
      uploadedUrl.push({
        image_url: result.secure_url,
        shopId: result.shopId,
        thumn_size: cloudinary.url(result.public_id, { height: 100, width: 100, format: 'jpg' })
      })
    }

    return uploadedUrl
  } catch (error) {
    console.log(error)
  }
}

export default {
  uploadImageFromUtl,
  uploadImageFromLocal,
  uploadMultiImageFromLocal
}