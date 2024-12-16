import { asyncHandler }  from "../utils/asynchandler.js"
import {ApiError} from "../utils/Apierror.js"
import { User }  from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
const registerUser = asyncHandler( async (req, res) => {
   // getting user details from frontend
   // validation - not empty
   // checking if user already exists
   // checking for images, check for avatar
   // uploading them to cloudinary
   // creating user object - create entry in db
   // removing password and refresh token field from response
   // check user creation
   // return res




 const {username, fullname, email, password} =   req.body
 console.log("email: ", email);

 if([fullname, email, username, password].some((field) => field?.trim() === "")){
    throw new ApiError(400, "All fields are required")
 }

const existedUser = await User.findOne({
    $or: [{username}, {password}]
 })
    if(existedUser){
        throw new ApiError(409, "User with email or password already existed")
    }

  const avatarLocalPath =   req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if(!avatarLocalPath){
   throw new ApiError(400, "Avatar file is required")
  }


const avatar =  await  uploadOnCloudinary(avatarLocalPath)
 const coverImage = await uploadOnCloudinary(coverImageLocalPath)


  if(!avatar){
   throw new ApiError(400, "Avatar files is required")
  }

const user =  await User.create({
   fullname,
   avatar: avatar.url,
   coverImage: coverImage?.url || "",
   email,
   password,
   username: username.toLowerCase()
  })
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )

   if(!createdUser){
      throw new ApiError(500, "Something went wrong while registering the user")
   }

   return res.status(201).json(new ApiResponse(200, createdUser,"User registered successfully"))
})
      
            

export { 
    registerUser,
 }