import ProgressCircle from "../../../comps/animations/ProgressBar";

export default function labrinthcreate({React, ReactD, glob}){



    const [data, setData] = React.useState(null);
   // const [dataC, setCData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [working, setWorking] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [errorC, setErrorC] = React.useState(null);




    const createTheProject = (slug) => {
        setWorking(true);

        fetch(glob.apiurlP+"labrinth/yourmods/copyncreate", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                slug: slug
            })
        })
        .then(response => {
          if (!response.ok) {
            console.log("something went wrong")
          }
          return response.json();
        })
        .then(data => {
            if(data.ok){
                window.location.href = "/app/projects/"+slug
            } else {
                setErrorC(data.bad);
            }
          setWorking(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    };

    React.useEffect(() => {
        fetch(glob.apiurlP+"labrinth/yourmods/scan")
          .then(response => {
            if (!response.ok) {
              console.log("something went wrong")
            }
            return response.json();
          })
          .then(data => {
            setData(data);
            setLoading(false);
          })
          .catch(error => {
            setErrorC(error);
            setWorking(false);
          });
      }, []);

      if(loading) return <>
        <ProgressCircle />
                         </>
    
    if (error){
        DynamicComponentCommunicator.getNSwitchComponent("/login");
    }


    return (
        <>
        {
            data.ok ? 
            <>
            Click on the buttons to create
            {

    !working && errorC == null ?
    <>
             {   data.uAr.map((dataP) => {
                    return (
                        <> 
         <div className="flex flex-col items-center bg-gray-500 hover:bg-gray-600 cursor-pointer" onClick={() => createTheProject(dataP.slug)} >
      <span className="text-lg font-semibold mb-2">{dataP.title}</span>
      <span className="text-white py-2 px-4 rounded shadow-md">
        {dataP.description}
      </span>
        </div>
                        </>
                    )
                }) }
                {data.uAr.length == 0 ?? 
                <p>
                    You don't have any projects...
                </p>
                }
                </>
                : <>
                {errorC == null ? <ProgressCircle /> : <> 
                Unable to create your project: {errorC} <br /> 
                Report this at
                <a href='https://github.com/skellybuilds/moddc.web/issues'> GitHub</a>.
                </>}
                </>
            }
            </>
            : <>
            {DynamicComponentCommunicator.getNSwitchComponent("/login")}
            </>
        }
        </>
    )
}