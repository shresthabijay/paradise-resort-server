const axios =require("axios")

const config=require("./server.config")

module.exports=(token,amount)=>{
    const token_verification_url="https://khalti.com/api/v2/payment/verify/"

    return axios.post(token_verification_url,{
        token:token,
        amount:amount
    },{
        headers:{"Authorization":`Key ${config.khalti.secretkey}`
    }
})
} 