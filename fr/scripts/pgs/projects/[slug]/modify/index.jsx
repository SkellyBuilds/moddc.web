export default function modifyMain({React, ReactD, glob, DynamicComponentCommunicator}){
    const dcc = DynamicComponentCommunicator;
     
    let slug = 0;
  
      const [data, setData] = React.useState(null);
      const [dataA, setDataA] = React.useState(null);
      const [loading, setLoading] = React.useState(true);
      const [error, setError] = React.useState(null);
      const [loadV, setLoadV] = React.useState(null);
      const [sortVL, setSortVL] = React.useState(false);



  
  
      React.useEffect(() => {
        if(dcc.params.length >= 1){
          slug = dcc.params[0];
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
          Busy loading this project...
                           </>
      
      if (error) return <p>Welp, Error: {error.message}</p>;
  
      return (
        <>
        {
            data.ok && dataA != null ?
            <>
            {
                data.members.find((data) => data.username == dataA.username) != null ?
                <>
                What do you want to modify?
                <br />
                <a className="cursor-pointer text-green-500" onClick={() => DynamicComponentCommunicator.getNSwitchComponent("/projects/"+DynamicComponentCommunicator.params[0]+"/modify/versions")}>{"Modify/Create a version"}</a>
                </>
                : <p>You can't modify this project</p>
            }
            </>
            : <p>Unable to load your project.</p> 
        }
        </>
      )
        
}