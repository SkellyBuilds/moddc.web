const express = require("express");
const user = require("../../../../../../globs/modals/account/user");
const project = require("../../../../../../globs/modals/mods/project");
const app = express.Router();
const prepVtoDC_Labrinth = require("../../utils/prepVersions");
const sleep = require("../../utils/sleep");

async function getLBName(auth){
    const response2 = await fetch("https://api.modrinth.com/v2/user", {
        method: 'GET',
        headers: {
        'Authorization': auth,
        'User-Agent': "SkellyBuilds/ServerDG/0.2.1 (munashed@teamazury.xyz)",
        },
    });

    if(response2.ok){
        return response2.json().username;
    } else {
        return "null"
    }
}

app.post("/resync", async (req, res) => {
    if(req.cookies["$msc.tk"] == null) return res.send({
        bad: "Login to a modrinth account"
    });
    
    const slug = req.body.slug;
    
    if(await project.findOne({slug: slug}) == null){
        return res.send({
            bad: "Mod doesn't exist!"
        })
    }

    let prj = await project.findOne({slug: slug});

    const userD = await user.findOne({
        acToken: req.cookies["$msc.tk"]
    });
    
    if(userD == null)return res.send({
        bad: "Account not found"
    });
    
    if(prj.type != "labrinth") return res.send({
        bad: "Not a modrinth mod!"
    })

    if(prj.members.find((data) => data.id == userD.id && data.role < 2) == null){
        return res.send({
            bad: "You do not have any permissions to resync this modrinth project"
        });
    }

    const uId = userD.acType == "labrinth" ? userD.username : await getLBName(yEnc.decode(userD.connections.find((db) => db.type == "labrinth").aToken));

    const response2 = await fetch(`https://api.modrinth.com/v2/project/${slug}`, {
        method: 'GET',
        headers: {
        'User-Agent': "SkellyBuilds/ServerDG/0.2.1 (munashed@teamazury.xyz)",
        },
    });

    if(response2.ok){
        const reData = await response2.json();
        prj.versions = reData.versions;
        prj.status = 1;
        prj.save();

        prepVtoDC_Labrinth(reData.versions, slug);

        while(true){
            prj = await project.findOne({slug: slug});
            if(prj != null){
            if(prj.status != 0){ 
                sleep(250);
                continue;
            } else break;
            } else sleep(250)
        }

       return res.send({
            ok: "Resynchronizing your mods has been successful!"
        });

    } else return res.send({
        bad: "Unable to commmunicate to modrinth"
    })
    
})


module.exports = app;