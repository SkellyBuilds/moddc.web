import { glob } from "./globs";

import "../_lc/css/glob.css"
import "tailwindcss/tailwind.css"
import ErrorBoundary from "./comps/necesscities/ErrorHandler";

let React;
let ReactD;

import(/* webpackChunkName: "langF" */
    /* webpackMode: "lazy" */
    /* webpackExports: ["default", "named"] */
    /* webpackFetchPriority: "high" */"./utils/DynCompL.jsx").then((DynamicComponentLoader) => {

        const bla = setInterval(() => {

            React = glob.React;
            ReactD = glob.ReactDOMCl;
            if(typeof ReactD != String || typeof React != String){
            const domNode = document.getElementById('cont_app');
            const  appRoot = ReactD.createRoot(domNode);
            appRoot.render(<>
            <ErrorBoundary>
            <DynamicComponentLoader.default  React={React} ReactD={ReactD}/>
            </ErrorBoundary>
            </>);
            clearInterval(bla);
            }
            
        }, 250)
    })


