const express = require("express");
const user = require("../../../../../../globs/modals/account/user");
const project = require("../../../../../../globs/modals/mods/project");
const prepVtoDC_Labrinth = require("../../utils/prepVersions");
const yEnc = require("../../../../../utils/yENC");
const app = express.Router();
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

app.get("/scan", async (req, res) => {
    if(req.cookies["$msc.tk"] != null){
        
    const userD = await user.findOne({
        acToken: req.cookies["$msc.tk"]
    });
    
    if(userD == null)return res.send({
        bad: "Account not found"
    });
    
    if(userD.acType != "labrinth" && userD.connections.find((db) => db.type == "labrinth") == null){
        return res.send({
            bad: "Not an labrinth account"
        });
    }

   
    const uId = userD.acType == "labrinth" ? userD.username : await getLBName(yEnc.decode(userD.connections.find((db) => db.type == "labrinth").aToken));

    const response2 = await fetch(`https://api.modrinth.com/v2/user/${uId}/projects`, {
        method: 'GET',
        headers: {
        'User-Agent': "SkellyBuilds/ServerDG/0.2.1 (munashed@teamazury.xyz)",
        },
    });

    if(response2.ok){
        let uAr = [];
        const wa = await response2.json();
        Promise.all(wa.map(async (objP) => {
            let objC = {};

            if(objP.status != "approved") return; // No impersonators or fakes
            const bla = await project.findOne({slug: objP.slug})
            if(bla == null){
                objC.slug = objP.slug;
                objC.title = objP.title;
                objC.description = objP.description;
                objC.iconURL = objP.icon_url;
                uAr.push(objC);
            }

        })).then(() => {
            res.send({
                ok: "ok",
                uAr
            })
        })



    } else {
        return res.send({
            bad: "Unable to get projects"
        });
    }

    } else {
        res.send({
            bad: "Login to an account"
        })
    }
})

app.post("/copyncreate", async (req, res) => {
    if(req.cookies["$msc.tk"] != null){
        const slug = req.body.slug;
        console.log(slug)
        
        if(await project.findOne({slug: slug}) != null){
            return res.send({
                bad: "Mod already exists?"
            })
        }

        const userD = await user.findOne({
            acToken: req.cookies["$msc.tk"]
        });
        
        if(userD == null)return res.send({
            bad: "Account not found"
        });
        
        if(userD.acType != "labrinth" && userD.connections.find((db) => db.type == "labrinth") == null){
            return res.send({
                bad: "Not an labrinth account"
            });
        }

   
    
        const uId = userD.acType == "labrinth" ? userD.username : await getLBName(yEnc.decode(userD.connections.find((db) => db.type == "labrinth").aToken));

        const response = await fetch(`https://api.modrinth.com/v2/user/${uId}/projects`, {
            method: 'GET',
            headers: {
            'User-Agent': "SkellyBuilds/ServerDG/0.2.1 (munashed@teamazury.xyz)",
            },
        });

        if(!response.ok){
            return res.send({
                bad: "Unable to communicate with labrinth"
            });
        }

        const pDa = await response.json();
        let isThM = false;
        pDa.forEach((mod) => {
            if(mod.slug == slug) isThM = true;
        });

        if(!isThM){
            return res.send({
                bad: "This is not your project"
            });
        }

        const response2 = await fetch(`https://api.modrinth.com/v2/project/${slug}`, {
            method: 'GET',
            headers: {
            'User-Agent': "SkellyBuilds/ServerDG/0.2.1 (munashed@teamazury.xyz)",
            },
        });

        if(response2.ok){
            const reData = await response2.json();
            const id = Math.floor(Math.random() * Date.now()).toString(12);

            if(reData.status != "approved") return res.send({
                bad: "Mod Digital Certificate only allows approved modrinth mods! Please wait until your mod is approved"
            });

            const members = [{
                username: userD.username,
                id: userD.id,
                role: 0,
            }]
            new project({
                slug: slug,
                type: "labrinth",
                title: reData.title,
                description: reData.description,
                id: id,
                versions: reData.versions,
                status: 1, // 1 = BUSY
                DCVers: [],
                members: members
            }).save();


            

           await prepVtoDC_Labrinth(reData.versions, slug).then(() => {
            res.send({
                ok: "Mod has been created!",
                id: id
            });
           });

        } else {
            return res.send({
                bad: "Unable to get project"
            })
        }
    
    } else {
        return res.send({
            bad: "Login to an account"
        })
    }
});


// THIS WILL RESET ANY USER MODIFICATIONS IN FAVOR OF RESYNC. 
// USE Version RESYNC ENDPOINTS TO NOT LOSE DATA
app.post("/resync", async (req, res) => {
    if(req.cookies["$msc.tk"] == null) return res.send({
        bad: "Login to a modrinth account"
    });
    
    const slug = req.body.slug;
    console.log(slug)
    
    if(await project.findOne({slug: slug}) == null){
        return res.send({
            bad: "Mod doesn't exist!"
        })
    }

    let prj = await project.findOne({slug: slug});

    if(prj.type != "labrinth") return res.send({
        bad: "Not a modrinth mod!"
    })

    const userD = await user.findOne({
        acToken: req.cookies["$msc.tk"]
    });
    
    if(userD == null)return res.send({
        bad: "Account not found"
    });

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

        prj.title = reData.title;
        prj.description = reData.description;
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
            ok: "Successfullly resynced the whole project!"
        });

    }
})

module.exports = app;