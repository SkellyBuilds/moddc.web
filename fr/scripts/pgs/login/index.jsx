export default function login({React, ReactD, glob, DynamicComponentCommunicator}){
    
    const changeURL = (url) => {
        window.location.href =url;
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
            if(data.ok){
                DynamicComponentCommunicator.getNSwitchComponent("/account");
            }
          }) })
    return (
        <>
         <h1 className="text-center font-semibold">Select which to login</h1>
        <div>
        <button
          className={`moving-shine-button flex items-center mx-auto space-x-2 py-2 px-4 rounded shadow-md text-white #17b757 justify-center p-8 `}
          style={{ backgroundColor: "#17b757" }}
          onClick={() => changeURL("/api/1/labrinth/o2/auth")}
        >
           
          <img src="/assets/images/modrinthl.svg" alt="Modrinth logo" className="w-6 h-6" style={{color: "#1bd96a"}} />
          <span>
            Login with modrinth!
          </span>
        </button>
        </div>
       
        </>
    )
}