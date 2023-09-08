const {User} = require("../models")



exports.estateAgentApproval = async (req, res) => {

    // 바꾸려는 user_id 설정 
    // let 바꾸려는user_id/
    // const user_id = user_id
    
    // mutate 로 서버에서 요청 보낸 것 받기
    const { user_id } = req.body;

    try {
        await User.update(
            {
                certificate_user : 0
            },
            {
                where : {
                    user_id : user_id
                }
            }
        )
        return res.json({message : "성공"})
    } catch (error) {
        console.log(error)
        return res.json(error)
    }
}


exports.estateAgentDisapproval = async(req, res) => {
        // mutate 로 서버에서 요청 보낸 것 받기
        const { user_id } = req.body;

        try {
            await User.update(
                {
                    certificate_user : 2
                },
                {
                    where : {
                        user_id : user_id
                    }
                }
            )
            return res.json({message : "성공"})
        } catch (error) {
            console.log(error)
            return res.json(error)
        }
}




exports.getUserList = async(req, res) => {

    // if(req.acc_decoded.user_id !== "admin"){
    //     return res.status(403).json({message : "관리자 권한이 없습니다."})
    // }
    
    try {
        
        const userListData = await User.findAll({
            // where : {}
        })

        // console.log("userListData" , userListData)
        return res.json({ userListData })

    } catch (error) {
        console.log("getUserList 에서 오류 " , error)
        
    }
}
