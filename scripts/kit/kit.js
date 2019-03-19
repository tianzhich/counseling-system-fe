#! /usr/bin/env node

const fse = require('fs-extra');
const path = require('path');
const _ = require('lodash/string')
const commander = require('commander')
const ast = require('./ts-ast')

const templatesDir = path.join(__dirname, 'templates');
const targetDir = path.join(__dirname, '..', '..', 'src', 'features');

async function addFeatureItem(srcPath, targetPath, option) {
    let res;
    try {
        await fse.ensureFile(srcPath)
        res = await fse.readFile(srcPath, 'utf-8')
        
        // avoid override
        const exists = await fse.pathExists(targetPath)
        if(exists) {
            console.log(`${targetPath} is already added!`);
            return
        }2

        await fse.outputFile(targetPath, _.template(res)(option), {
            encoding: "utf-8"
        })
        console.log(`Add ${srcPath} success!`);
    } catch (err) {
        console.error(err)
    }
}

async function addFeature(name) {
    const renderOpt = {
        featureName: name,
        featureUpperName: _.upperFirst(name)
    }

    const componentTmpl = `${templatesDir}/Component.tsx.tmpl`;
    const component = `${targetDir}/${name}/${_.upperFirst(name)}.tsx`;
    addFeatureItem(componentTmpl, component, renderOpt);

    const indexTmpl = `${templatesDir}/index.ts.tmpl`;
    const index = `${targetDir}/${name}/index.ts`;
    addFeatureItem(indexTmpl, index, renderOpt);

    const routeTmpl = `${templatesDir}/route.ts.tmpl`;
    const route = `${targetDir}/${name}/route.ts`;
    addFeatureItem(routeTmpl, route, renderOpt);
}

commander
    .version(require('../../package.json').version)
    .command('add <feature>')
    .action((featureName) => {
        // add features
        addFeature(featureName);
        // manipulate some ts file like route
        ast(featureName);
    })

commander.parse(process.argv);