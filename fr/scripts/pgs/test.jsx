export default function debugMode({React, ReactD, glob, DynamicComponentCommunicator}){

if(DynamicComponentCommunicator.mode == 1){

    React.useEffect(() => {
        async function uploadFile() {
            const fileInput = document.querySelector('input[type="file"]');
            const file = fileInput.files[0];
        
            if (!file) {
                console.error('No file selected.');
                return;
            }
        
            const formData = new FormData();
            formData.append('file', file);
        
            try {
                const response = await fetch('http://localhost:82/api/1/projects/versions/cwf?slug=scmc', {
                    method: 'POST',
                    body: formData,
                });
        
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }
        
                const result = await response.json();
                console.log('File uploaded successfully:', result);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
        
        // Example usage: Call uploadFile when a form is submitted
        document.querySelector('form').addEventListener('submit', function(event) {
            event.preventDefault();
            uploadFile();
        });
    }, [])

    return (
        <>
        Test Version Api
          <form>
        <input type="file" name="file" accept=".jar" />
        <button type="submit">Upload</button>
         </form>
        </>
    )
} else {
    React.useEffect(() => {
        DynamicComponentCommunicator.getNSwitchComponent("/404")
    })

}
}