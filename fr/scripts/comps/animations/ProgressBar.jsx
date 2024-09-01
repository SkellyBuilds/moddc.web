import React from 'react';

const ProgressCircle = ({
    text
}) => {

    const [opacity, setOpacity] = React.useState(0); // Initial opacity for long loading text

    React.useEffect(() => {
       setTimeout(() => {
        const id = setInterval(() => {
            setOpacity(prevOpacity => {
              if (prevOpacity >= 1) return 1;
              return Number(prevOpacity + 0.25);
            });
          }, 75); // Update opacity every 500ms
      
          // Cleanup the interval on component unmount
          return () => {
            clearInterval(id);
          };
       }, 5000) 
       
      }, []);

    return (
        <div className="flex items-center justify-center h-screen">
      <svg className="animate-spin -ml-1 mr-3 h-32 w-32 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    {opacity > 0 ? <p style={{ opacity }} className="text-lg text-white">
       {text == null ? <>
        This seems to be taking a while. Refresh the page? Still happening, report this to  
        <a href='https://github.com/skellybuilds/moddc.web/issues'> GitHub</a>.
       </> : <>
       {text}
       </>} 
      </p> : <></>}

        </div>
      );
};

export default ProgressCircle;