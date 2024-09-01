export default function usersId_Index({React, ReactD, glob, DynamicComponentCommunicator}){

  const dcc = DynamicComponentCommunicator;
   
  let uId = 0;

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);


    React.useEffect(() => {
      if(dcc.params.length >= 1){
        if(isNaN(Number(dcc.params[0]))){
          dcc.getNSwitchComponent("/404");
        }
        uId = Number(dcc.params[0]);
    }

        fetch(glob.apiurlP+"users/g?id="+uId)
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
    
    if (error) return <p>Welp, Error: {error.message}</p>;

    console.log(data);

    return (
      
        <>
          {data.ok == "ok" ? <> 
            {data.username}'s metadata:
            <br />
            Username: {data.username}
            <br />
            Icon: <img src={data.metadata[0].avUrl} />
            <br />
            Id: {data.id}

            <br />Basic UI will do for now. Focus on back end.
          </> : <>
          User id was not found :(
          </>}


        </>
    )
}