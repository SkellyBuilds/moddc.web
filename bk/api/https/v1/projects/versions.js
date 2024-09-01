const express = require("express");
const user = require("../../../../../globs/modals/account/user");
const project = require("../../../../../globs/modals/mods/project");
const app = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {calculateHash} = require("../utils/crypto.js");



// All mods manuallly uploaded are temporary, i'm not rich
const uploader = multer({ dest: './temp' }); // Temporary storage for uploaded files


app.get("/g", async (req, res) => {
    if(req.query.versionid){
       const data =  await project.findOne({
            DCVers: {
                $elemMatch: { versionId: req.query.versionid }
            }
        })

        if(data){

            if(data.DCVers.length < 1) return res.send({
                bad: "No versions found!"
            });

            const faa =      data.DCVers.find((wa) => wa.versionId == req.query.versionid);
            faa.ok = "Version OK";

        return res.send(
            faa
        );

        } else {
            return res.send({
                bad: "Can't find version!"
            })
        }
    } else {
        // going for latest
        if(req.query.slug){
            const data =  await project.findOne({
                slug: req.query.slug
            });

            if(data){
                
                if(data.DCVers.length < 1) return res.send({
                    bad: "No versions found from slug! Resync if you are using a third party repository"
                });

            return res.send(
                data.DCVers[data.DCVers.length-1]
            );

            } else {
                return res.send({
                    bad: "Can't find latest version from slug!"
                })
            }

        } else return res.send({
            bad: "Add a query?"
        })
    }
});

app.post("/cwf", uploader.single('file'), async (req, res) => {

    if(req.file == null) return res.send({
        bad: "File required!"
    })

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const versionId = req.query.versionid;

   
    if(req.cookies["$msc.tk"] == null){
        if(req.query.token != null){
            req.cookies["$msc.tk"] = req.query.token;
        } else return res.send({
            bad: "Login to an account!"
        })
    }
    
    const slug = req.query["slug"];
    
    if(await project.findOne({slug: slug}) == null){
        fs.unlinkSync("./temp/"+req.file.filename);
        return res.send({
            bad: "Mod doesn't exist!"
        })
    }

    let prj = await project.findOne({slug: slug});


    const userD = await user.findOne({
        acToken: req.cookies["$msc.tk"]
    });
    
    if(userD == null){ 
        fs.unlinkSync("./temp/"+req.file.filename);
    
        return res.send({
        bad: "Account not found"
    });
}
    

    if(prj.members.find((data) => data.id == userD.id && data.role < 2) == null){
        fs.unlinkSync("./temp/"+req.file.filename);
        return res.send({
            bad: "You do not have any permissions to add a version to this project"
        });
    }

    if(prj.DCVers.find((data) => data.fileName == req.file.originalname) != null || prj.DCVers.find((data) => data.versionId == versionId) != null){
       
        let data2;
        
        if(versionId != null){
            data2 = prj.DCVers.findIndex((data) => data.versionId == versionId);
        } else data2 = prj.DCVers.findIndex((data) => data.fileName == req.file.originalname);


        if(data2 == -1) return res.send({
            bad: "Unable to locate data."
        })

        try {
            const fileHash1 = await calculateHash(filePath, "sha1");
            const fileHash512 = await calculateHash(filePath, "sha512");
            const id = prj.DCVers[data2].versionId;
    
            const fObj = {
                hashes: {
                    sha1: fileHash1,
                    sha512: fileHash512
                },
                fileName: originalName,
                url: null,
                versionId: id
            }
    
            prj.DCVers[data2] = fObj;
    
            fs.unlinkSync("./temp/"+req.file.filename);
    
            prj.save();
    
            res.send({
                ok: "Overwrited version "+id+" to "+slug,
                vId: id
            });
            
    
        } catch (e){
            fs.unlinkSync("./temp/"+req.file.filename);
    
            console.log("Unable to overwrite version \n "+e);
          return  res.send({
                bad: "Unable to overwrite version"
            });
        }
    } else {
    try {
        const fileHash1 = await calculateHash(filePath, "sha1");
        const fileHash512 = await calculateHash(filePath, "sha512");
        const id = Math.floor(Math.random() * Date.now()).toString(12).substring(0, 8);

        const fObj = {
            hashes: {
                sha1: fileHash1,
                sha512: fileHash512
            },
            fileName: originalName,
            url: null,
            versionId: id
        }

        prj.DCVers.push(fObj);

       fs.unlinkSync("./temp/"+req.file.filename);

        prj.save();

        res.send({
            ok: "Added version "+id+" to "+slug,
            vId: id
        });
        

    } catch (e){
        fs.unlinkSync("./temp/"+req.file.filename);
    
        console.log("Unable to create version \n "+e);
      return  res.send({
            bad: "Unable to create version"
        });
    }
}
});

/**
 * Comparison between two bodies related to versions
 * Server - From the database
 * Client - From the request body
 */
app.post("/compare", async (req, res) => {

})

module.exports = app;