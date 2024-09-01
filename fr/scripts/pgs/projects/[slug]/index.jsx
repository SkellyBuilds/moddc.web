import ProgressCircle from "../../../comps/animations/ProgressBar";

export default function projectIndex({React, ReactD, glob, DynamicComponentCommunicator}){

    const dcc = DynamicComponentCommunicator;
     
    let slug = 0;
  
      const [data, setData] = React.useState(null);
      const [loading, setLoading] = React.useState(true);
      const [error, setError] = React.useState(null);
      const [loadV, setLoadV] = React.useState(null);
      const [sortVL, setSortVL] = React.useState(false);
      const [isMemb, setMemb] = React.useState(false);

    
  
  
      React.useEffect(() => {
        if(dcc.params.length >= 1){
          slug = dcc.params[0];
      }
      
          fetch(glob.apiurlP+"projects/g?slug="+slug)
            .then(response => {
              if (!response.ok) {
                console.log("something went wrong")
              }
              return response.json();
            })
            .then(data => {
              if(data.bad){
                DynamicComponentCommunicator.getNSwitchComponent("/404");
              }
              setData(data);
              fetch(glob.apiurlP+"users/g")
              .then(response => {
                if (!response.ok) {
                  console.log("something went wrong")
                }
                return response.json();
              })
              .then(data2 => {
          
                if(data2.bad){
                     setMemb(false);
                } else {
                if(data.members.find((data3) => data3.username == data2.username) != null){
                  setMemb(true)
                }
                setLoading(false);
              }
              }).catch(error => {
                setError(error);
              });
  
            })
            .catch(error => {
              setError(error);
              setLoading(false);
            });
          
        }, []);
  
        if(loading) return <>
         <ProgressCircle />
                           </>
      
      if (error) return <p>Welp, Error: {error.message}</p>;

      const reversedArray = [...data.DCVers].reverse();
  
      return (
        
          <>
            {data.ok == "ok" ? <> 
              <h1 className="text-xl "><span className="font-semibold">{data.slug}</span>'s metadata:</h1>
              <br />
              {data.status == 1 ?
              <>
              <span className="text-green-500">Busy loading your versions. Feel free to refresh to check.</span>
              <br />
              </>
              : <></>}
              Title: {data.title}
              <br />
              Description: {data.description}
              <br />
              Id: {data.id}
              <br />
              <a className="cursor-pointer text-cyan-500" onClick={() => setLoadV(!loadV)}>{loadV ? "Unload your versions" : "Load your versions"}</a>
              <br />
              {
                isMemb ? <>
 <a className="cursor-pointer text-green-500" onClick={() => DynamicComponentCommunicator.getNSwitchComponent("/projects/"+DynamicComponentCommunicator.params[0]+"/modify")}>{"Modify this project"}</a>
 <br />
                </> : ""
              }
              {data.DCVers.length > 1 && loadV ?
              <>
     <a className="cursor-pointer text-green-500" onClick={() => setSortVL(!sortVL)}>{sortVL ? "Sort from oldest" : "Sort from latest"}</a>

              {sortVL ? reversedArray.map((data) => {
            return (
                  <>
                   <details style={{ whiteSpace: 'pre-wrap' }}>
                    <summary>
                    {data.fileName}
                    </summary>
                    FileName: {data.fileName}
                  <br />
                  Versionid: {data.versionId}
                  <br />
                  Hashes: <br />
                  Sha512 - {data.hashes.sha512}<br />
                  Sha1 - {data.hashes.sha1}
                  <br />
                   </details>
                  <br />
                  </>
            )
}) : data.DCVers.map((data) => {
  return (
        <>
         <details style={{ whiteSpace: 'pre-wrap' }}>
          <summary>
          {data.fileName}
          </summary>
          FileName: {data.fileName}
        <br />
        Versionid: {data.versionId}
        <br />
        Hashes: <br />
        Sha512 - {data.hashes.sha512}<br />
        Sha1 - {data.hashes.sha1}
        <br />
         </details>
        <br />
        </>
  )
})}
              </> : <></>}
              <br />
              Members:
              {data.members.map((member) => {
                return (
                  <>
                    <br />
                  Username: {member.username}
                  <br />
                  Id: {member.id}
                  <br />
                  Role: {
                    member.role == 0 ? "Owner" :  member.role == 1 ? "Admin" : member.role == 2 ? "Collaborator" : "Unknown"
                  }
                    <br />
                  </>
                )
              })}
  
              <br />
            </> : <>
            Could not find the project
            </>}
  
  
          </>
      )
  }