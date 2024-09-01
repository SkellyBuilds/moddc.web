
import ProgressCircle from "../comps/animations/ProgressBar";
import NavigationBar from "../comps/app/topbar";
import { glob } from "../globs";

const DynamicComponentLoader = ({React, ReactD}) => {
    const [Component, setComponent] = glob.React.useState(null);
    let pathname = window.location.pathname;
    const [OGpathname, setOGP]= glob.React.useState(window.location.pathname);
    const [pathname2, setPathname2] = glob.React.useState(pathname);
    const [isF, setF] = glob.React.useState(true);
    const [isPr, setPr] = glob.React.useState(false);
    const [isFor, setFor] = glob.React.useState(false);
    const [prevPath, setPrevPath] = React.useState(null); 
    const [chillLoad, setCL] = React.useState(false); 
    const [componentArray, setCompAr] = React.useState([]);
    const [compid, setCompId] = React.useState(null);
    const [historyI, setHistoryI] = React.useState(0);
    const [compIdA, setCompIdAr] = React.useState([]);
    const [isParmU, setParmU] = glob.React.useState(false);
    const parmA = React.useRef([]);
    const [modeS, setModeS] = glob.React.useState(0);
    const persistentVariable = React.useRef(OGpathname);


    const resetArray = () => {
        parmA.current = [];  // Reset the array immediately
    };

    try {

    React.useEffect(() => {
      persistentVariable.current = OGpathname;
    }, []);

    const getRouteWithParamsReplaced = (pathname) => {
        let pattern = findRoutePattern(pathname);
        
        if (!pattern || pattern == null){
            if(pathname.substring(0, pathname.lastIndexOf("/")) != "/index"){
                pathname = pathname.substring(0, pathname.lastIndexOf("/"));
            }
            return pathname;
        } // Return original pathname if no pattern matches

        if(pattern.substring(0, pathname.lastIndexOf("/")) != "/index"){
            pathname = pathname.substring(0, pathname.lastIndexOf("/"));
        }
    
        const regexPattern = pattern.replace(/\[([^\]]+)\]/g, '([^/]+)');
        let match = pathname.match(new RegExp(`^${regexPattern}$`));
        
        if (!match){
            pathname = pathname + "/index";
            match = pathname.match(new RegExp(`^${regexPattern}$`));
            if(match == null) return pattern;

        let paramIndex = 0;
        const result = pattern.replace(/\[([^\]]+)\]/g, () => match[++paramIndex]);
        setParmU(true);

            
        match.forEach((url, index) => {
            if(index == 0){
                parmA.current = [];
                return;
            }
            parmA.current.push(url);
        });

            return pattern;



        } else {

        let paramIndex = 0;
        const result = pattern.replace(/\[([^\]]+)\]/g, () => match[++paramIndex]);
        setParmU(true);

     

        match.forEach((url, index) => {
            if(index == 0){
                parmA.current = [];
                return;
            }
            parmA.current.push(url);
        });
    
        return pattern;
        }

    };

    const getRouteAsync = async (pathname) => {
        let path = null;
    //        setParmA([])
            setTimeout(() => {
                path = getRouteWithParamsReplaced(pathname);
                // Further logic that depends on `parmA` being cleared
            }, 75);

    }

    const getAdvPath = async (da) => {
        if(da == null){
            return;
                   } else {
        
                    if(da.indexOf("app/") != -1){
                        da = da.replace("app/", "");
                    } else {
                        da = da.replace("app", "");
                    }
                  
                    if(da == "/"){
                        da = "/index";
                    }

                    if(glob.pgsM[da] == null){
                        da = da + "/index"
                        if(glob.pgsM[da] == null){
                            return null;
                        }
                    }

                    return da;
                }
    }

    const getAdvPathR = (da) => {
        if(da == null){
            return;
                   } else {
        
                    if(da.indexOf("app/") != -1){
                        da = da.replace("app/", "");
                    } else {
                        da = da.replace("app", "");
                    }
                  
                    if(da == "/"){
                        da = "/index";
                    }

                    if(glob.pgsM[da] == null){

                        da = da + "/index";

                        if(glob.pgsM[da] == null){
                            // might be an parameter
                           let wa = getRouteWithParamsReplaced(da);
                  
                           setParmU(true);
                           if(glob.pgsM[wa] == null){
                  
                                 wa = wa + "/index"; 
                                 return wa;
                           } else {
                            return wa;
                           }
                        

                        }
                    } //else {
                    //     setParmU(false);
                    // }

                    return da;
                }
    }

    function getKeyByValue(obj, value) {
        for (const [key, val] of Object.entries(obj)) {
            if (val === value) {
                return key;
            }
        }
        return null; // or undefined, or any other default value you want to return if the key isn't found
    }
    


    const extractParams = (pattern, path) => {
        const paramNames = [];
        const regexPattern = pattern.replace(/\[([^\]]+)\]/g, (_, paramName) => {
            paramNames.push(paramName);
            return '([^/]+)';
        });
    
        const match = path.match(new RegExp(`^${regexPattern}$`));
        if (!match) return null;
    
        return paramNames.reduce((params, paramName, i) => {
            params[paramName] = match[i + 1];
            return params;
        }, {});
    };

    const findRoutePattern = (pathname) => {

        if(glob.pgsM[pathname] == null){

        for (let pattern in glob.pgsM) {
            const regexPattern = pattern.replace(/\[([^\]]+)\]/g, '([^/]+)');
            const match = pathname.match(new RegExp(`^${regexPattern}$`));
   



            if (match) {
                const paramNames = [...pattern.matchAll(/\[([^\]]+)\]/g)].map(m => m[1]);

                // Extract corresponding values from the pathname
                const paramValues = match.slice(1);
    
                // Create an object that maps parameter names to their values
                const params = paramNames.reduce((acc, paramName, index) => {
                    acc[`${paramName}`] = paramValues[index];
                    return acc;
                }, {});

            if(match.length > 1){
                let waP = pathname;
                match.forEach((string, index) => {
                    if(index == 0) return;
                    const i = waP.lastIndexOf("/");
                    if(waP.substring(i, waP.length) == "/index"){
                        waP = waP.substring(0, i);
                    }

                    waP = waP.replace(string, `[${getKeyByValue(params, string)}]`);
                    if(glob.pgsM[waP] != null){
                       
                        pattern = waP;
                        return;
                        }
                })
           
            }

                return pattern;
            }
        }
        return null;
    } else return null;
    };
    
    // const findRoutePattern = (pathname) => {
    //     for (const pattern in glob.pgsM) {
    //         // Convert pattern to regex
    //         const regexPattern = pattern.replace(/\[([^\]]+)\]/g, '([^/]+)');
    
    //         // Match pathname against the pattern
    //         const match = pathname.match(new RegExp(`^${regexPattern}$`));
    
    //         if (match) {
    //             // Extract matched components
    //             const matchedComponents = match;
    
    //             // Check if the matched components are known components
    //             const isComponentName = matchedComponents.every(component => {
    //                 if(component == matchedComponents[1]) return;
    //                 const wa = glob.pgsM.find((e) => e.includes(matchedComponents[0].substring(0, matchedComponents[0].indexOf(matchedComponents[1]))));
    //                 Object.keys(glob.pgsM).includes(component)
    //             }
                   
    //             );
    
    //             // If all matched components are valid, return the pattern
    //             if (isComponentName) {
    //                 return pattern;
    //             } else return "ISACOMPONENT"
    //         }
    //     }
    //     return null;
    // };

    
    

    
    // const getParamA = (pathname) => {
    //     const pattern = findRoutePattern(getAdvPathR(pathname));
    //     if (!pattern) return []; // Return original pathname if no pattern matches
    
    //     const regexPattern = pattern.replace(/\[([^\]]+)\]/g, '([^/]+)');
    //     const match = pathname.match(new RegExp(`^${regexPattern}$`));
        
    //     if (!match) return [];


    // }

    let DCLCTC_Object = {
        convertToAdvPath: getAdvPathR,
        getNSwitchComponent: async (path) => {
            setComponent(() => null)
            let ogP = path;
            let isParmU2 = false;

            if(glob.pgsM[path] == null){
                isParmU2 = true;
                path = getAdvPathR(path);
                if(glob.pgsM[path] == null){
                console.error(`${path} Is not a valid component!`);
                return;
                }
            }



            getRouteWithParamsReplaced(ogP);

                const newIndex = historyI + 1;
                setHistoryI(newIndex);
    
                if(!isParmU && !isParmU2){
                if(path != "/index" && path.includes("/index")){
                window.history.pushState({ index: newIndex,pathName: path }, window.location.origin+"/app"+path.replace("/index", ""),window.location.origin+"/app"+path.replace("/index", ""));
                } else window.history.pushState({index: newIndex,pathName: path }, window.location.origin+"/app"+path,window.location.origin+"/app"+path);
                } else {
                    if(ogP != "/index" && ogP.includes("/index")){
                        window.history.pushState({ index: newIndex,pathName: ogP }, window.location.origin+"/app"+ogP.replace("/index", ""),window.location.origin+"/app"+ogP.replace("/index", ""));
                        } else window.history.pushState({index: newIndex,pathName: ogP }, window.location.origin+"/app"+ogP,window.location.origin+"/app"+ogP);
                }
    
                return setComponent(() => glob.pgsM[path]);
         
           
          
        },
        switchComponent: async (componentD, path) => {
            //setParmA([])
            if(componentD == null){
                console.error(`${path} Is not a valid component!`);
                return;
            }

            const newIndex = historyI + 1;
            setHistoryI(newIndex);
            if(path != "/index" && path.includes("/index")){

                window.history.pushState({ index: newIndex,pathName: path }, window.location.origin+"/app"+path.replace("/index", ""),window.location.origin+"/app"+path.replace("/index", ""));
                } else window.history.pushState({ index: newIndex, pathName: path}, window.location.origin+"/app"+path,window.location.origin+"/app"+path);
            
            return setComponent(() => componentD);
        },
        getDynamicPath: pathname2,
       // getOriginPath: getAdvPathR(pathname2),
        params: parmA.current,
        mode: modeS
    }


    React.useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
           setModeS(1);
        } else setModeS(0);
    }, [])
   




    React.useEffect(() => {
        // Check if the state has changed
        if (prevPath !== window.location.pathname) {
            // Save the current value as the previous value before updating
           let da = window.location.pathname;

           if(da == null){
    return;
           } else {

            if(da.indexOf("app/") != -1){
                da = da.replace("app/", "");
            } else {
                da = da.replace("app", "");
            }
          
            if(da == "/"){
                da = "/index";
            }

            setPrevPath(da);
        }
        }
    }, [window.location.pathname]);

    React.useEffect(() => {
        let lastResult = "";
        let isInt = false;
        let chH = false;



      const loadComponent = async () => {
        if(!isFor && !isPr){
            
        }

        if(chillLoad){
            pathname = pathname2

            if(pathname == null){
                return;
            }
            
          if(pathname.indexOf("app/") != -1){
            pathname = pathname.replace("app/", "");
        } else {
        pathname = pathname.replace("app", "");
        }
      
        if(pathname == "/"){
            pathname = "/index";
        }



      // if a folder has a index.jsx file
      // paths like /folder should work fine

      const component = glob.pgsM[pathname];
      if (component) {
        setComponent(() => component);
      } else {
          // could be a folder
          const foldComp = glob.pgsM[pathname + "/index"];
          if(foldComp){
              setComponent(() => foldComp);
          } else {
        setComponent(() => glob.pgsM["/404"]);
          }
      }

      if(!isFor) lastResult = pathname2;

      if(!isF && pathname != "/index" && !isPr){
     
          lastResult = pathname2;


      window.history.pushState({}, window.location.origin+"/app"+pathname,window.location.origin+"/app"+pathname);
      }
        } else {


            if(pathname == null){
                return;
            }
            


        if(isF){
            setPathname2(pathname);
            setF(false)
        } else pathname = pathname2

        if(pathname == null){
            pathname = window.location.pathname;
        }

        let pathOG = pathname;

        pathname = getAdvPathR(pathname);


        //   if(pathname.indexOf("app/") != -1){
        //       pathname = pathname.replace("app/", "");
        //   } else {
        //   pathname = pathname.replace("app", "");
        //   }
        
        //   if(pathname == "/"){
        //       pathname = "/index";
        //   }


        // if a folder has a index.jsx file
        // paths like /folder should work fine
  
        const component = glob.pgsM[pathname];
        if (component) {
          setComponent(() => component);
        } else {
            // could be a folder
            const foldComp = glob.pgsM[pathname + "/index"];
            if(foldComp){
                setComponent(() => foldComp);
            } else {
          setComponent(() => glob.pgsM["/404"]);
            }
        }

        if(!isFor) lastResult = pathname2;

        if(!isF && pathname != "/index" && !isPr){
       
            lastResult = pathname2;
                const newIndex = historyI + 1;
                setHistoryI(newIndex);
 
        window.history.pushState({index: newIndex}, window.location.origin+"/app"+pathname2,window.location.origin+"/app"+pathname2);
        }

        if(isF){
            if(isParmU){
                setPathname2(pathOG);
                pathname = pathname2;
            }

        } else {
            if(isParmU){
                setPathname2(pathOG);
            } else setPathname2(pathname);

        }
        if(isPr){
            setPr(false);
        }
        if(isFor){
            setFor(false);
        }
        setCL(true)
        setTimeout(() => {
            setCL(false)
        }, 1025)
   
    }

      };

      loadComponent();
    
    }, [pathname2]);


    React.useEffect(() => {


      window.addEventListener('popstate', async (event) => {

            let newHistoryIndex = event.state?.index ?? 0;
            let historyPath = event.state?.pathName ?? "NUL";

            if(historyPath == "NUL"){
                historyPath = getAdvPathR(persistentVariable.current);
            }

            const wa = componentArray.indexOf(glob.pgsM[historyPath]);


            if(wa != -1){
                return setComponent(() => componentArray[componentArray.indexOf(glob.pgsM[historyPath])])
            }
         else if(glob.pgsM[historyPath] == null){
            historyPath = getAdvPathR(historyPath);
            setComponent(() => glob.pgsM[historyPath]);
           } else {
            setComponent(() => glob.pgsM[historyPath]);
           }
          
    });




    })

    React.useEffect(() => {
        
        if(Component == null) return;

        if(componentArray.find((wa) => wa == Component) == null){
            componentArray.push(Component);
        }
        
    }, [Component])



    // React.useEffect(() => {
    //     setComponent(null);
    // })
   


    return (
        <>
         <NavigationBar React={React} ReactD={ReactD} glob={glob} DynamicComponentCommunicator={DCLCTC_Object} />
         {Component ? 
         <>
         <div className="py-6 px-3">
         <Component React={React} ReactD={ReactD} glob={glob} DynamicComponentCommunicator={DCLCTC_Object} /> 
         </div>
         </>:   
      <ProgressCircle/>
      
        }
        </>
           
    );

} catch (e) {
    throw e;
}
  };




export const useComponentLoader = () => {

};

  export default DynamicComponentLoader;