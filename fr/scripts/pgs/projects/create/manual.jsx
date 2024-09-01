import ProgressCircle from "../../../comps/animations/ProgressBar";

export default function manualProjectIn({React, ReactD, glob, DynamicComponentCommunicator}){
    const [data, setData] = React.useState(null);
    // const [dataC, setCData] = React.useState(null);
     const [loading, setLoading] = React.useState(true);
     const [working, setWorking] = React.useState(false);
     const [error, setError] = React.useState(null);
     const [errorC, setErrorC] = React.useState(null);
     const [isInv, setIsInv] = React.useState(null);

     const createTheProject = () => {
        setLoading(true);

        const slug = document.getElementById("slug").value;
        const shortDesc = document.getElementById("shortDesc").value || "";

        if(slug == "" || slug == null ){
            setErrorC("Enter a slug")
            setTimeout(() => {
                setErrorC("")
            }, 2225)
            setLoading(false)
            return;
        }

        fetch(glob.apiurlP+"projects/c", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                slug: slug,
                description: shortDesc
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
        fetch(glob.apiurlP+"users/g")
        .then(response => {
          if (!response.ok) {
            console.log("something went wrong")
          }
          return response.json();
        })
        .then(data => {
          if(data.bad){
              DynamicComponentCommunicator.getNSwitchComponent("/login");
          }
          fetch(glob.apiurlP+"projects/gfp?id="+data.id)
          .then(response => {
            if (!response.ok) {
              console.log("something went wrong")
            }
            return response.json();
          })
          .then(data => {
            if(data.bad){
                setIsInv(true)
            }
            setLoading(false);
          })
          .catch(error => {
            setErrorC(error);
            setWorking(false);
          });
        })
        

      }, []);

      if(isInv) return <>
      <h1 className="text-red-800 text-center text-xl">You need to create a modrinth project before making a manual one!</h1>
                    </>

      if(loading) return <>
       <ProgressCircle />
                         </>
    
    if (error){
        DynamicComponentCommunicator.getNSwitchComponent("/login");
    }


  
    return (
        <>
        Your slug/project name <span className="text-red-900">*</span>: <br />
        <textarea className="text-black" id="slug"></textarea>  <br />
        A short description:  <br />
        <textarea className="text-black" id="shortDesc"></textarea> <br />
        <button
      className={`moving-shine-gen-button flex space-x-2 py-2 px-4 rounded shadow-md text-white #17b757 justify-center p-8 `}
      style={{ backgroundColor: "#4817ce" }}
      onClick={createTheProject}
    >
       
      <span>
        Create with your modrinth mods!
      </span>
    </button>
        <p className="text-red">{errorC}</p>
        </>
    )
}