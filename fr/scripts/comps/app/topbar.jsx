import Cookies from "js-cookie"
import ProgressCircle from "../animations/ProgressBar";

export default function NavigationBar({React, ReactD, glob, DynamicComponentCommunicator}){



    const handleClick = () => {
        const account = DynamicComponentCommunicator.convertToAdvPath("/account");
        if(account != null){
        DynamicComponentCommunicator.getNSwitchComponent(account);
        }
    
        
    };

    const switchURL = (url) => {
        const account = DynamicComponentCommunicator.convertToAdvPath(url);
        if(account != null){
        DynamicComponentCommunicator.getNSwitchComponent(account);
        }
    
        
    };

    const switchURLQuick = (url) => {
        DynamicComponentCommunicator.getNSwitchComponent(url);
    };



   React.useEffect(() => {
        if (typeof localStorage == "undefined") return;
    window.onscroll = function() {scrollFunction()}

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            // fade in the new style
            document.getElementById("navbar").style.background = "rgba(82, 82, 82, 0.24)";
            document.getElementById("navbar").style.transition = "background 0.5s ease 0s, backdrop-filter 0.5s ease 0s";
            document.getElementById("navbar").style.transition = "background 0.5s ease 0s, -webkit-backdrop-filter 0.5s ease 0s";
            setTimeout(function() {
                document.getElementById("navbar").style.backdropFilter = "blur(10px)";
            }, 100);
        } else {
            document.getElementById("navbar").style.background = "transparent";
            document.getElementById("navbar").style.backdropFilter = "blur(0px)";
        }
    }
    }, []);

    const [Adata, setAData] = React.useState(null);
    const [loadingA, setLoadingA] = React.useState(true);
    const [errorA, setErrorA] = React.useState(null);

    React.useEffect(() => {

        fetch(glob.apiurlP+"users/g")
          .then(response => {
            if (!response.ok) {
              console.log("something went wrong")
            }
            
            return response.json();
          })
          .then(data => {
            glob.uToken = Cookies.get("$msc.tk") || null;
            setAData(data);
            setLoadingA(false);
          })
          .catch(error => {
            setErrorA(error);
            setLoadingA(false);
          });


   
      }, []);

return (
    <>
    <div id="navbar" className="sticky top-0">
    <div className="flex items-center space-x-6 top-0 ease-in-out mx-auto flex items-center justify-between">
    <a className="flex items-center space-x-3 cursor-pointer navtitle" onClick={() => switchURLQuick("/")}>
    <h1 className="text-xl text-white font-semibold ext-4xl text-center text-white cursor-pointer">Mod Digital Certificates</h1>
    </a>
    {
        Adata != null ? <>
        {
            Adata.ok ? <>
              <a className="ease-in-out delay-150 text-center text-xl hover:scale-8 cursor-pointer" onClick={() => switchURLQuick("/account")}>
    <img
    src={Adata.metadata[0].avUrl}
    alt="Your icon"
    className="w-12 h-12 rounded-full"
    ></img>
    </a>
            </> : <>
            <a className="ease-in-out delay-150 text-green-800 text-center text-xl hover:scale-8 cursor-pointer" onClick={() => switchURLQuick("/login")}>
            Login to your account
            </a>
            </> 
        }
        </>
   : <>
    <span className="w-8 h-8">
        <ProgressCircle />
    </span>
    </> } 
        
    </div>
  
   
    <div class="flex space-x-4 justify-center">
        <p className="text-center text-white cursor-pointer"><a onClick={() => switchURLQuick("/projects")}> Your projects   </a></p>
        </div>
    </div>    
  
   
    </>
)

}