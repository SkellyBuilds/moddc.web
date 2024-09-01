const express = require("express");
const configGB = require("../../../../../../config.gl");
const user = require("../../../../../../globs/modals/account/user");
const yEnc = require("../../../../../utils/yENC");
const app = express.Router();

app.get("/auth", (req, res) => { 
const url = `https://modrinth.com/auth/authorize?client_id=${configGB.LabrClId}&redirect_uri=${configGB.LabrRed}&scope=${configGB.LabrScopes}`

res.redirect(url);

})


app.get("/cb", async (req, res) => {
  
    const headers = {
        'Authorization': configGB.LabrClSe,
        'User-Agent': "SkellyBuilds/ServerDG/0.2.1 (munashed@teamazury.xyz)",
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    const bodyD = {
        grant_type: "authorization_code",
        client_id: configGB.LabrClId,
        code: req.query.code,
        redirect_uri: configGB.LabrRed,

    }

    const url = `https://api.modrinth.com/_internal/oauth/token`

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: new URLSearchParams(bodyD).toString()
    });

    if(!response.ok){
        res.redirect("auth");
        return;
    }

    const data = await response.json();

        const url2 = `https://api.modrinth.com/v2/user`

        const response2 = await fetch(url2, {
            method: 'GET',
            headers: {
            'Authorization': data.access_token,
            'User-Agent': "SkellyBuilds/ServerDG/0.2.1 (munashed@teamazury.xyz)",
            },
        });

if(response2.ok){
    const data3 = await response2.json();
    let acTk;

    if(await user.findOne({username: data3.username.toLowerCase()}) != null){
        const data5 = await user.findOne({username: data3.username.toLowerCase()});
        
        if(data5.connections.findIndex(((ra) => ra.type = "labrinth")) != -1){
            data5.connections.splice(data5.connections.findIndex(((ra) => ra.type = "labrinth")), 1);
        }
        data5.connections.push({
            type: "labrinth",
            aToken: yEnc.encode(data.access_token),
            expOn: data.expires_in
        })
        data5.save();

     res.cookie('$msc.tk', data5.acToken, { maxAge: 1814400000, httpOnly: false });
     acTk = data5.acToken;
    } else {
    const id = (await user.find()).length+1;
    
    const msT = Date.now();
     acTk = btoa(id+msT+data3.username);
    new user({
        connections: [
            {
                type: "labrinth",
                aToken: yEnc.encode(data.access_token),
                expOn: data.expires_in
            }
        ],
        acType: "labrinth",
        id: id,
        username: data3.username.toLowerCase(),
        metadata: {
            email: data3.email,
            displayN: data3.name,
            avUrl: data3.avatar_url,
            bio: data3.bio
        },
        projects: [], // user will have to scan and add projects manually
        acToken: acTk
    }).save();
}

    res.cookie('$msc.tk', acTk, { maxAge: 1814400000, httpOnly: false });
    res.redirect("/app/account")
} else {
    const data3 = await response2.json();
    res.redirect("auth");

}

})

module.exports = app;