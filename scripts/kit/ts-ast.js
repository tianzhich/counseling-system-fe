const { Project } = require('ts-simple-ast')
const _ = require('lodash/string')
const path = require('path')

const project = new Project();
const srcDir = path.join(__dirname, '..', '..', 'src', 'common');

async function addRoute(featureName) {
  const FeatureName = _.upperFirst(featureName);
  try {
    const srcFile = project.addExistingSourceFile(`${srcDir}/routeConfig.ts`);
    srcFile.addImportDeclaration({
      defaultImport: `${FeatureName}Route`,
      moduleSpecifier: `../features/${featureName}/route`
    })
    const routeVar = srcFile.getVariableStatementOrThrow('childRoutes');

    let newRoutes = [];

    routeVar.getDeclarations().forEach((decl, i) => {
      decl.getInitializer().forEachChild(node => {
        newRoutes.push(node.getText());
      })
      decl.setInitializer(`[${newRoutes.join(', ')}, ${FeatureName}Route]`);
    })

    await project.save();
    console.log("Add route successful");
  } catch(err) {
    console.log(err);
  }
  
}

module.exports = addRoute;