const express = require("express");
const user = require("../../../../../globs/modals/account/user");
const app = express.Router();

app.get("/g", async (req, res) => {
    if(req.query.id || req.query.username){

     
      let userD;
      if(req.query.id == null){
       userD = await user.findOne({
          username: req.query.username
      }); 
      } else {
        if(isNaN(Number(req.query.id))) return res.send({
            bad: "Not a number"
        })
        userD = await user.findOne({
          id: req.query.id,
      });
      }

        if(userD == null) return res.send({
           bad: "User not found!"
        });

        res.send({
            ok: "ok",
            username: userD.username,
            id: userD.id,
            metadata: userD.metadata,
            acType: userD.acType
        });

    } else {
        if(req.get("Authorization") != null || req.cookies["$msc.tk"] != null){
            
            const userD = await user.findOne({
                acToken: req.get("Authorization") || req.cookies["$msc.tk"]
            });
    
            if(userD == null) return res.send({
               bad: "You aren't logged in!"
            });
    
            res.send({
                ok: "ok",
                username: userD.username,
                id: userD.id,
                metadata: userD.metadata,
                acType: userD.acType
            });

        } else {
            res.send({
                bad: "You need to give us something!"
            })
        }
    }
})

module.exports = app;