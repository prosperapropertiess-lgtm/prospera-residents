import { registerHooks } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, extname } from 'node:path';
import ts from 'typescript';
const root=resolve(import.meta.dirname,'..');
registerHooks({
  resolve(specifier,context,nextResolve){
    if(specifier.startsWith('@/') || (specifier.startsWith('.') && context.parentURL?.startsWith('file:') && !specifier.includes('node_modules'))){
      const base=specifier.startsWith('@/')?pathToFileURL(resolve(root,specifier.slice(2))).href:new URL(specifier,context.parentURL).href;
      for(const suffix of ['', '.ts','.tsx']){const target=base+suffix;if(/\.tsx?$/.test(target)&&existsSync(fileURLToPath(target)))return {url:target,shortCircuit:true};}
    }
    return nextResolve(specifier,context);
  },
  load(url,context,nextLoad){
    if(url.startsWith('file:')&&['.ts','.tsx'].includes(extname(fileURLToPath(url)))&&!url.includes('/node_modules/')){
      const source=ts.transpileModule(readFileSync(fileURLToPath(url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
      return {format:'module',source,shortCircuit:true};
    }
    return nextLoad(url,context);
  }
});
