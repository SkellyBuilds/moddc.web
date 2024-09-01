import { glob } from "../globs";

const requireComponent = require.context(
    // The relative path of the components folder
    '../pgs',
    // Whether or not to look in subfolders
    true

  );
  
  const componentsMap = {};

  requireComponent.keys().forEach(fileName => {
    // Get the component config
    const componentConfig = requireComponent(fileName);
  
    // Get the PascalCase name of the component
    const componentName = fileName
      .replace(/^\.\/(.*)\.\w+$/, '$1'); 
  
    // Add the component to the map
    componentsMap[`/${componentName.toLowerCase()}`] = componentConfig.default || componentConfig;
  });
  
  export default componentsMap;