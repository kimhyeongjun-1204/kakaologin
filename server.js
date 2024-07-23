const config = require('/Coding/kakaologin/config/config'); 
const {KAKAO: {RESTAPIKEY,REDIRECT_URI}} = config; 
const express = require('express');
const axios = require('axios'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3001;  

const app = express();  

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors());  

app.get('/api/oauth/kakao', async (req, res) => {
    const code = req.query.code;
    console.log(`api: ${RESTAPIKEY}, redirect: ${REDIRECT_URI}`)
    console.log(code); 
    try { 
        // Access token 가져오기
        const res1 = await axios.post('https://kauth.kakao.com/oauth/token', {}, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            params:{
                grant_type: 'authorization_code',
                client_id: RESTAPIKEY,
                code: code,
                redirect_uri: REDIRECT_URI, 
            }
        });
        
        // Access token을 이용해 정보 가져오기
        const res2 = await axios.post('https://kapi.kakao.com/v2/user/me', {}, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Authorization': 'Bearer ' + res1.data.access_token
            }
        });
        console.log(res2.data);
        
        //     const data = res2.data;
        //     const row = (await db.query(`select * from user where snsPrimaryKey=? and snsType="kakao"`, [data.id]))[0];
        //     if (row) {
    //         // 회원가입된 유저
    //         req.session.userId = row.id;
    //         req.session.save(() => { });
    //         res.redirect('http://localhost:4100');
    //         return;
    //     } 
    //         res.redirect('http://localhost:4100/oauth/signup?token=' + (data.properties && data.properties.nickname ? '&name=' + encodeURIComponent(data.properties.nickname) : ''));
    
} catch(e) {
    console.log(e);
    res.status(400).end('Sorry, Login Error!');
}
}); 

app.listen(port, () => {
  console.log(`Board app listening on port ${port}`);
})  