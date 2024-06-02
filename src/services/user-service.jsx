import { myAxios } from "./helper";
export const checkEmail = async (email) => {
    return await myAxios.get('/check-email', { params: { email } })
  };
export const signUp=(user)=>{
    return myAxios.post('/signup',user).then((response)=>response.data)
}
export const loginUser= (user)=>{
    return myAxios.post('/login',user).then((res)=>res.data);
}




// other functions like loginUser and signUp should also be here
