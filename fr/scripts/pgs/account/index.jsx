export default function account({React, ReactD, glob, DynamicComponentCommunicator}){

    if(typeof React == undefined){
        return;
    }
    
   

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);



    React.useEffect(() => {
        fetch(glob.apiurlP+"users/g")
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
        Busy loading your account details...  
                         </>
    
    if (error){
        DynamicComponentCommunicator.getNSwitchComponent("/login");
    }

    return (
      
        <>
          {data.ok == "ok" ? <> 
            Your account metadata:
            <br />
            Username: {data.username}
            <br />
            Icon: <img src={data.metadata[0].avUrl} />
            <br />
            Id: {data.id}

            <br />Basic UI will do for now. Focus on back end.
          </> : <>
         {DynamicComponentCommunicator.getNSwitchComponent("/login")}
          </>}
     

        </>
    )
}