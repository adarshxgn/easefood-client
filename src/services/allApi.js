import { BASE_URL } from "./baseUrl"
import { commonApi } from "./commonApi"

//register API
export const signUpApi = async (payload) => {
    return await commonApi("POST", `${BASE_URL}/api/signup/`, payload, "")
    
}

//signin Api
export const signInApi = async (sellerLogin) => {
    return await commonApi("POST", `${BASE_URL}/api/signin/`, sellerLogin, "")
    
}

//API For Add Category
export const addFoodCategoryApi = async (addCategory,reqHeader) => {
  return await commonApi("POST", `${BASE_URL}/api/foodcat/`, addCategory, reqHeader)
  
}
//API For View Category
export const getFoodCategoryApi = async (getCategory,reqHeader) => {
  return await commonApi("GET", `${BASE_URL}/api/foodcat/`, getCategory, reqHeader)
  
}
//API For Add Food
export const addFoodListApi = async (addDish,reqHeader) => {
  return await commonApi("POST", `${BASE_URL}/api/food/`, addDish, reqHeader)
  
}
//API For View Food 
export const getFoodListApi = async (getDish,reqHeader) => {
  return await commonApi("GET", `${BASE_URL}/api/food/`, getDish, reqHeader)
  
}

// get all oders api
export const getAllOdersAPI = async (getOder,reqHeader) =>{
  return await commonApi("GET", `${BASE_URL}/api/cart,`, getOder , reqHeader)
}
//API For EDIT Food
export const editFoodListApi = async (foodId, editDish, reqHeader) => {
  return await commonApi("PUT", `${BASE_URL}/api/food/${foodId}/`, editDish, reqHeader);
};
//API For delete Food
export const deleteFoodListApi = async (foodId, reqHeader) => {
  return await commonApi("DELETE", `${BASE_URL}/api/food/${foodId}/`, null, reqHeader);
};

// api for add table
export const addTableApi = async (addTable,reqHeader)=>{
  return await commonApi ("POST", `${BASE_URL}/api/table/add`,addTable,reqHeader)
}

// api for edit table
export const editTableApi = async (tableId,editTable,reqHeader)=>{
  return await commonApi ("PUT", `${BASE_URL}/api/table/${tableId}/change/`,editTable,reqHeader)
}
// api for delete table

export const deleteTableApi = async (tableId,reqHeader)=>{
  return await commonApi ("DELETE", `${BASE_URL}/api/table/${tableId}/delete/`,{},reqHeader)
}

// geta all table 

export const getTableApi = async (getTable,reqHeader)=>{
  return await commonApi ("GET", `${BASE_URL}/api/table/add`,getTable,reqHeader)
}

//API For Add category
export const addCategoryApi = async (addCategory,reqHeader) => {
  return await commonApi("POST", `${BASE_URL}/api/foodcat/`, addCategory, reqHeader)
}

//API For edit category
export const editCategoryApi = async (categoryId,editCategory,reqHeader) => {
  return await commonApi("PUT", `${BASE_URL}/api/foodcat/${categoryId}/`, editCategory, reqHeader)
}
//API For delete category
export const deleteCategoryApi = async (categoryId,reqHeader) => {
  return await commonApi("DELETE", `${BASE_URL}/api/foodcat/${categoryId}/`, null, reqHeader)
}
// get category 

export const getCategoryApi = async (getCategory,reqHeader)=>{
  return await commonApi ("GET", `${BASE_URL}/api/foodcat/`,getCategory,reqHeader)
}
export const sendOtpApi = async (payload) => {
  return await commonApi("POST", `${BASE_URL}/api/send-otp/`, payload, "")
}

export const verifyOtpApi = async (payload) => {
  return await commonApi("POST", `${BASE_URL}/api/otp/`, payload, "")
}

export const refreshAccessToken = async (refreshToken) => {
    const payload = { refresh_token: refreshToken };
  
    try {
      const response = await commonApi("POST", `${BASE_URL}/api/token/refresh`, payload);
      return response; // Return the response to be used in ProtectedRoute
    } catch (error) {
      return error; // Return the error if any
    }
  };

