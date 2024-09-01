export default function versionIdIndex({React, ReactD, glob, DynamicComponentCommunicator}){

    const dcc = DynamicComponentCommunicator;
     
    let slug = 0;
  
      const [data, setData] = React.useState(null);
      const [loading, setLoading] = React.useState(true);
      const [error, setError] = React.useState(null);
  
  
      React.useEffect(() => {
        console.log(dcc.params)
        if(dcc.params.length > 0){
          slug = dcc.params[1];
      }
      
          fetch(glob.apiurlP+"projects/versions/g?versionid="+slug)
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
            {data.ok ? <> 
                FileName: {data.fileName}
                  <br />
                  Versionid: {data.versionId}
                  <br />
                  Hashes: <br />
                  Sha512 - {data.hashes.sha512}<br />
                  Sha1 - {data.hashes.sha1}
                  <br />
                  <br />
              <br />Basic UI will do for now. Focus on back end.
            </> : <>
            Version id was not found :(
            </>}
  
  
          </>
      )
  }