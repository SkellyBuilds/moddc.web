const express = require("express");
const project = require("../../../../../globs/modals/mods/project");
const user = require("../../../../../globs/modals/account/user");
const app = express.Router();

app.use("/versions", require("./versions"));

app.get("/g", async (req, res) => {
    const slug = req.query.slug;


    
    if(await project.findOne({slug}) == null){
        return res.send({
            bad: "Mod Project doesn't exists!"
        })
    }
    
    const prj = await project.findOne({slug});
  
    
    return res.send({
        ok: 'ok',
        slug: slug,
        type: prj.type,
        title: prj.title,
        description: prj.description,
        id: prj.id,
        versions: prj.versions,
        DCVers: prj.DCVers,
        members: prj.members
    })
    
    });

app.post("/c", async (req, res) => {
    const slug = req.body.slug;
    const shortDesc = req.body.description || "";

    const userDD = await user.findOne({
        acToken: req.cookies["$msc.tk"]
    });

    if(userDD == null){
        return res.send({
            bad: "Login to any Mod DC Account!"
        })
    }

    if(slug == null) return res.send({
        bad: "Enter a slug"
    });

    const results2 = await project.find();
    let hasP = false;
    results2.forEach((data) => {
        if(data.members.find((data) => data.id == userDD.id) != null) hasP = true;
    })

    if(!hasP){
        return res.send({
            bad: "You require existing modrinth project to create a manual mod!"
        });
    }

    if(await project.findOne({slug: slug}) != null) return res.send({
        bad: "Project already exists"
    });




    const members = [{
        username: userDD.username,
        id: userDD.id,
        role: 0,
    }]

    const id = (await project.find()).length+1;
    new project({
        slug: slug,
        title: slug,
        description: shortDesc,
        id: id,
        type: "manual",
        versions: [],
        status: 0, // 1 = BUSY
        DCVers: [],
        members: members
    }).save();

    res.send({
        ok: slug + " has been created!"
    });
});

app.post("/e", async (req, res) => {
    const slug = req.body.slug;
    const desc = req.body.description || null;
    const title = req.body.title || null;

    const userDD = await user.findOne({
        acToken: req.cookies["$msc.tk"]
    });

    if(userDD == null){
        return res.send({
            bad: "Login to any Mod DC Account!"
        })
    }

    if(slug == null) return res.send({
        bad: "Enter a slug"
    });

    if(await project.findOne({slug: slug}) == null) return res.send({
        bad: "Project already exists"
    });

    if(prj.members.find((data) => data.id == userD.id && data.role < 2) == null){
        return res.send({
            bad: "You do not have any permissions to resync this modrinth project"
        });
    }

    

    const prj = await project.findOne({slug: slug});
    // Owner & Admin roles are  0 & 1
    if(prj.members.find((data) => data.id == userDD.id && data.role < 2) == null){
        return res.send({
            bad: "You do not have any permissions to edit this project"
        });
    }

    prj.description = desc ?? prj.description;
    prj.title = title ?? prj.title;
    prj.save();

    return res.send({
        ok: "Successfully editted "+slug
    })

})

/**
 * Get from Profile Id
 * Get projects that a user is a member of and their roles related to it.
 */
app.get("/gfp", async (req, res) => {
    const uId = req.query.id;

    const results = await project.find();

    const fArray = [];

    if(results != null && results.length > 0){
        results.forEach((data, index) => {

            if(data.members.find((data) => data.id == uId) == null) return;

            const fObj = {};

            const fMData = data.members[data.members.findIndex((data) => data.id == uId)];
         

            fObj.slug = data.slug;
            fObj.description = data.description;
            fObj.roleId = fMData.role;

            fArray.push(fObj);
        });

        
        const wtf = {
            ok: "ok",
            projects: fArray
        }

        if(fArray.length > 0){
            return res.send(
                wtf
        );
        } else return res.send({
            bad: "No projects found!"
        });



    } else return res.send({
        bad: "No projects found!"
    })
}) 


module.exports = app;