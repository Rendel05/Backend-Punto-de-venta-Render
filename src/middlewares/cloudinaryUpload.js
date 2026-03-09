import cloudinary from '../config/cloudinary.js'
import streamifier from 'streamifier'

export const uploadToCloudinary = (req, res, next) => {

  if (!req.file) {
    return next()
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: "products" },
    (error, result) => {

      if (error) {
        return res.status(500).json({ message: "Error subiendo imagen" })
      }

      req.image_url = result.secure_url
      req.image_public_id = result.public_id

      next()
    }
  )

  streamifier.createReadStream(req.file.buffer).pipe(stream)
}