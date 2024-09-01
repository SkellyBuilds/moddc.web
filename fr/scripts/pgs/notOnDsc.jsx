//import React, { useEffect } from 'react';
//import ReactDOM from 'react-dom';

//import { createRoot } from 'react-dom/client';
//import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
let React;
let ReactD;

export default function NotOnDscPg({React, ReactD, glob}) {
  React = glob.React;
  ReactD = glob.ReactDOMCl;

    return (
      <>

                    <div className="clamHeader">
                       
                        <h1  className=" text-gray-800"><span>{glob.lanF[glob.lang].notOnDsc.title}</span></h1>
                        <p>{glob.lanF[glob.lang].notOnDsc.desc}</p>
                    </div>       
                </>
            );
    };

 