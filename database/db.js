const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const DBconnection =async ()=>{
    const MONGODB_URL=process.env.MONGODB_URI;
    try {
        await mongoose.connect(MONGODB_URL,{useNewUrlParser:true});
        console.log("DB connection established!");
        
    } catch (error) {
        console.log("error to mongoose:"+error);    
        
    }

    


};
module.exports={DBconnection};