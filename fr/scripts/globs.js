export let glob = {};

import componentsMap from "./utils/pgMapper.js"
//import compMap from "./utils/compMapper.js"

glob.React = "NUL"
glob.ReactDOM = "NUL";
glob.ReactDOMCl = "NUL";

// Create global vars for depends
import(/* webpackChunkName: "react" */
/* webpackMode: "lazy" */
/* webpackExports: ["default", "named"] */
/* webpackFetchPriority: "high" */"react").then((data) => {
   glob.React = data;
})
import(/* webpackChunkName: "dom" */
/* webpackMode: "lazy" */
/* webpackExports: ["default", "named"] */
/* webpackFetchPriority: "high" */"react-dom").then((data) => {
   glob.ReactDOM = data;
})


import(/* webpackChunkName: "dom" */
/* webpackMode: "lazy" */
/* webpackExports: ["default", "named"] */
/* webpackFetchPriority: "high" */"react-dom/client").then((data) => {
   glob.ReactDOMCl = data;
})

glob.pgsM = componentsMap;
//glob.cmP = compMap;
glob.ClId = "934105280038440961";
glob.pageA = "NUL";
glob.apiV = "v1";
glob.lang = "eng"; // eng is default
let fileLang = import(/* webpackChunkName: "langF" */
/* webpackMode: "lazy" */
/* webpackExports: ["default", "named"] */
/* webpackFetchPriority: "high" */"./lang.js").then((data) => {
   glob.lanF = data;
})

glob.CompMgr = {};
glob.uAccount = {};
glob.uToken = null;
glob.apiurlP = "http://localhost:82/api/1/"

// Custom for page systems 

if(typeof window !== "undefined") {
   glob.wami = window.location.pathname.split("/").pop(); // Wami = WhereAmi?
   glob.userT = window.localStorage.getItem("uToken");
   if(window.localStorage.getItem("sdbLang") !== null) {
      glob.lang = window.localStorage.getItem("sdbLang"); // change the language to the one set.
   }
  // glob.deviceId = window.localStorage.getItem("deviceId"); // if cleared, user will have to relogin
} else {
   glob.wami = null;
   glob.userT = null;
   glob.deviceId = null;
}