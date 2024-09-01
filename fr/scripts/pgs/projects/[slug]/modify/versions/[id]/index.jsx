import ProgressCircle from "../../../../../../comps/animations/ProgressBar";

export default function test({React, ReactD, glob, DynamicComponentCommunicator}){

    const dcc = DynamicComponentCommunicator;
     
    let slug = 0;
    let versionid = 0;
  
      const [data, setData] = React.useState(null);
      const [dataA, setDataA] = React.useState(null);
      const [dataV, setDataV] = React.useState(null);
      const [loading, setLoading] = React.useState(true);
      const [error, setError] = React.useState(null);

//       React.useEffect(() => {
//         if(document == null) return;

        

//         if(document.querySelector('form') != null){
//    // Example usage: Call uploadFile when a form is submitted
//    document.querySelector('form').addEventListener('submit', function(event) {
//     event.preventDefault();
//     uploadFile();
// });
//         }        
     
//     }, [])

async function uploadFile() {

    const wa = document.getElementById("submitC")

    if(wa){
        wa.disabled = true;
    }

    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    if (!file) {
        console.error('No file selected.');
        wa.disabled = true;
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(glob.apiurlP+'projects/versions/cwf?slug='+DynamicComponentCommunicator.params[0]+'&versionid='+DynamicComponentCommunicator.params[1], {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        if(result.ok){
            DynamicComponentCommunicator.getNSwitchComponent("/projects/"+DynamicComponentCommunicator.params[0]+"/versions/"+DynamicComponentCommunicator.params[1]);
        } else {
            setError("This is related to overwriting your version on the server side! Something went wrong! "+result.bad);
            if(wa) wa.disabled = false;
        }

       
    } catch (error) {
        setError("This is related to overwriting your version on the client side! Something went wrong! "+error);
        if(wa) wa.disabled = false;
    }
}

  
  
      React.useEffect(() => {
        if(dcc.params.length >= 1){
          slug = dcc.params[0];
          versionid = dcc.params[1];
      }
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
        setDataA(data);
      }).catch(error => {
        setError(error);
      });
      fetch(glob.apiurlP+"projects/versions/g?versionid="+versionid) // too lazy to change the variable dont be confused 
      .then(response => {
        if (!response.ok) {
          console.log("something went wrong")
        }
        return response.json();
      })
      .then(data => {
        setDataV(data);
      })
      .catch(error => {
        setError(error);
      });
      fetch(glob.apiurlP+"projects/g?slug="+slug)
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
        setError(error);
        setLoading(false);
      });
        }, []);

    
  
        if(loading) return <>
            <ProgressCircle text={
                <>
                Loading this data seems to be taking a bit. Please wait? Still experiencing issues? Report on
                <a href='https://github.com/skellybuilds/moddc.web/issues'> GitHub</a>.
                </>
            } />
                           </>
      
      if (error) return <p>Welp, Error: {error.message}</p>;

        
      return (
<>
    {
         data.ok && dataA != null && dataV != null && dataV.ok ?
            <>
            {
                data.members.find((data) => data.username == dataA.username) != null ?
                <>
                Modifying version: {dataV.fileName} <br />
                You can only modify your file data. The version id will remain the same but everything else will change!
                <br />
                <input type="file" name="file" accept=".jar" /> <br />
                <button id="submitC" className="text-white bg-red-500 disabled:bg-red-800" onClick={uploadFile}>Upload & overwrite</button>
                </>
                : <p>You can't modify this project</p>
            }
            </>
            : <p>Unable to load your project or this version doesn't exist!.</p> 
        }

</>
      )
}