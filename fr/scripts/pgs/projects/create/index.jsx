export default function choosetocreate({React, ReactD, glob, DynamicComponentCommunicator}){

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
                DynamicComponentCommunicator.getNSwitchComponent("/login");
            }
          }) })
    
return (
    <>
     <h1 className="text-center font-semibold">Pick to choose</h1>
    <div>
    <button
      className={`moving-shine-button flex items-center mx-auto space-x-2 py-2 px-4 rounded shadow-md text-white #17b757 justify-center p-8 `}
      style={{ backgroundColor: "#17b757" }}
      onClick={() => switchURL("/projects/create/modrinth")}
    >
       
      <img src="/assets/images/modrinthl.svg" alt="Modrinth logo" className="w-6 h-6" style={{color: "#1bd96a"}} />
      <span>
        Create with your modrinth mods!
      </span>
    </button>
    <button
      className={`moving-shine-gen-button flex items-center mx-auto space-x-2 py-2 px-4 rounded shadow-md text-white #17b757 justify-center p-8 `}
      style={{ backgroundColor: "#4817ce" }}
      onClick={() => switchURL("/projects/create/manual")}
    >
    
      <span>
       Manually create a project
      </span>
    </button>
    </div>
   
    </>
)

}