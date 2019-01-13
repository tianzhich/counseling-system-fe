const { Project } = require('ts-simple-ast')
const _ = require('lodash/string')
const path = require('path')
const ts = require('typescript')

const project = new Project();
const srcDir = path.join(__dirname, '..', 'src', 'common');

async function addRoute(featureName) {
  const FeatureName = _.upperFirst(featureName);
  try {
    const srcFile = project.addExistingSourceFile(`${srcDir}/routeConfig.ts`);
    srcFile.addImportDeclaration({
      defaultImport: `${FeatureName}Route`,
      moduleSpecifier: `../features/${featureName}/route`
    })
    const routeVar = srcFile.getVariableStatementOrThrow('childRoutes');
    // console.log(routeVar.getChildCount());
    const routeArr = routeVar.getLastChildByKindOrThrow(ts.SyntaxKind.ArrayLiteralExpression);
    routeArr.addElement(`${FeatureName}Route`);

    await project.save();
    console.log("Add route successful");
  } catch(err) {
    console.log(err);
  }
  
}

module.exports = addRoute;