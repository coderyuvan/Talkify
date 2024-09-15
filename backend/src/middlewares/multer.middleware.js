import multer from "multer";

//  json,url sb configure app.js m kr lie bt file upload sirf multer m hota h
 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
       
      cb(null, file.originalname)
    }
  })
  
 export const upload = multer({ 
    storage,
})