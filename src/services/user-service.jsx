import { myAxios } from "./helper";
export const signUp=(user)=>{
    return myAxios.post('/signup',user).then((response)=>response.data)
}
export const loginUser= (user)=>{
    return myAxios.post('/login',user).then((res)=>res.data);
}