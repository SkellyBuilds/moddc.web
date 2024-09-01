const requireComponent = require.context(
    // The relative path of the components folder
    '../comps',
    // Whether or not to look in subfolders
    true

  );
  
  const compMap = {};

  requireComponent.keys().forEach(fileName => {
    // Get the component config
    const componentConfig = requireComponent(fileName);
  
    // Get the PascalCase name of the component
    const componentName = fileName
      .replace(/^\.\/(.*)\.\w+$/, '$1'); 
  
    // Add the component to the map
    compMap[`/${componentName.toLowerCase()}`] = componentConfig.default || componentConfig;
  });
  
  export default compMap;