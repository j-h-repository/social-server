import bcrypt from "bcrypt"

//to generate hashed password
export const hashPassword=(password)=>{
    return new Promise((resolve,reject)=>{
        bcrypt.hash(password, 12,function(err,hash){
            if(err){reject(err)}
        resolve(hash)
            })
    })
}

export const comparePassword = (password, hashed)=>{
return bcrypt.compare(password,hashed); 
}
