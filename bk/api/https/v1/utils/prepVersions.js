const project = require("../../../../../globs/modals/mods/project");


async function prepVtoDC_Labrinth(VerArray, modN){
const fvArray = [];
VerArray.forEach(async (vId) => {

    const response = await fetch(`https://api.modrinth.com/v2/version/${vId}`, {
        method: 'GET',
        headers: {
        'User-Agent': "SkellyBuilds/ServerDG/0.2.1 (munashed@teamazury.xyz)",
        },
    });

    if(!response.ok){
        console.log("failed to prepare version "+vId);
    } else {
const vData = await response.json();
const vObj = {};

vData.files.reverse().forEach((fData) => {
    if(fData.primary){
        vObj.hashes = fData.hashes;
        vObj.fileName = fData.filename;
        vObj.url = fData.url;
        vObj.versionId = Math.floor(Math.random() * Date.now()).toString(12).substring(0, 8);;
    }
});

fvArray.push(vObj)

    }
})


setTimeout(async () => {
    console.log(modN);
    const pj = await project.findOne({slug: modN});
    if(pj != null){
    pj.DCVers = fvArray;
    pj.status = 0;
    pj.save();
    } else {
        console.log("Unable to find mod project");
    }
}, 1250)


}

module.exports = prepVtoDC_Labrinth;