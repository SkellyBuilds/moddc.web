import ProgressCircle from "../../comps/animations/ProgressBar";

export default function yourprojects({React, ReactD, glob, DynamicComponentCommunicator}){
    

    const [Aid, setAId] = React.useState(null);
    const [loadingA, setLoadingA] = React.useState(true);
    const [errorA, setErrorA] = React.useState(null);
    const [Adata, setAData] = React.useState(null);

    const switchURL = (url) => {
        DynamicComponentCommunicator.getNSwitchComponent(url);
    };

    React.useEffect(() => {

        fetch(glob.apiurlP+"users/g")
          .then(response => {
            if (!response.ok) {
              console.log("something went wrong")
            }
            
            return response.json();
          })
          .then(data => {

            if(data.bad){
                switchURL("/login")
            }

            setAId(data.id);



            console.log(data.id);
            fetch(glob.apiurlP+"projects/gfp?id="+data.id)
            .then(response => {
              if (!response.ok) {
                console.log("something went wrong")
              }
              
           return  response.json();
            
            })
            .then(data => {
             console.log(data);
              setAData(data);
              setLoadingA(false);
            })
            .catch(error => {
              setErrorA(error);
              setLoadingA(false);
            });
          })
          .catch(error => {
            setErrorA(error);
            setLoadingA(false);
          }); 

       
      }, []);



    
    return (
        <>
        
        {
            !loadingA && Adata.ok ? <> 
            Your projects:
            <br />
            {Adata.projects.map((dataM) => {
                return (
                    <>
                     <div className="flex flex-col items-center bg-gray-500 hover:bg-gray-600 cursor-pointer" onClick={() => switchURL("/projects/"+dataM.slug)} >
      <span className="text-lg font-semibold mb-2">{dataM.slug}</span>
      <span className="text-white py-2 px-4 rounded shadow-md">
        {dataM.description}
      </span>
        </div>
                   </>
                )
            })}
            </> :
            <ProgressCircle />
        }
        
        </>
    )
}