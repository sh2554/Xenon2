(function(){importScripts(`https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js`);let e=null,t=null;async function n(){e=await loadPyodide({indexURL:`https://cdn.jsdelivr.net/pyodide/v0.27.7/full/`}),globalThis.__xenon_stdin__=e=>(e&&self.postMessage({type:`stdout`,text:String(e)}),self.postMessage({type:`stdin_request`}),new Promise(e=>{t=n=>{t=null,e(n??``)}})),await e.runPythonAsync(`
import builtins
import js

async def _xenon_input(prompt=''):
    line = await js.__xenon_stdin__(str(prompt) if prompt else '')
    if line is None:
        return ''
    return str(line).rstrip('\\n')

builtins.input = _xenon_input
`),self.postMessage({type:`ready`})}function r(){let t=e.globals.toJs(),n=[];for(let[e,r]of t.entries()){if(e.startsWith(`__`)||typeof r==`function`||r&&r._type===`module`||e===`random`||e.startsWith(`_xenon`))continue;let t=``,i=``;try{r===null?(t=`None`,i=`NoneType`):typeof r==`object`&&r.toJs?(t=JSON.stringify(r.toJs()),i=r.type||`object`):(t=String(r),i=typeof r)}catch{t=`[Complex Object]`,i=`object`}n.push({name:e,value:t,type:i})}return n}self.onmessage=async i=>{let{type:a,code:o}=i.data;if(a===`init`){try{await n()}catch(e){self.postMessage({type:`error`,error:`Failed to load Pyodide: `+e.message})}return}if(a===`stdin_response`){if(t){let e=t;t=null,e(i.data.value??``)}return}if(a===`run`){if(!e){self.postMessage({type:`error`,error:`Pyodide not initialised yet.`});return}t=null,e.setStdout({batched:e=>self.postMessage({type:`stdout`,text:e})}),e.setStderr({batched:e=>self.postMessage({type:`stderr`,text:e})});try{await e.runPythonAsync(`import random`),globalThis.__xenon_user_code__=o,await e.runPythonAsync(`
import ast as _ast

class _XenonInputTransformer(_ast.NodeTransformer):
    def visit_Call(self, node):
        self.generic_visit(node)
        func = node.func
        if isinstance(func, _ast.Name) and func.id == 'input':
            return _ast.copy_location(_ast.Await(value=node), node)
        return node

import js as _js
_raw = _js.__xenon_user_code__
_tree = _ast.parse(_raw, mode='exec')
_tree = _XenonInputTransformer().visit(_tree)
_ast.fix_missing_locations(_tree)
_lines = _ast.unparse(_tree).splitlines()
_indented = '\\n'.join(('    ' + ln if ln.strip() else ln) for ln in _lines)
_xenon_transformed = 'async def __xenon_main__():\\n' + _indented + '\\nawait __xenon_main__()'
del _XenonInputTransformer, _raw, _tree, _lines, _indented
`);let t=e.globals.get(`_xenon_transformed`);await e.runPythonAsync(t),self.postMessage({type:`done`,variables:r()})}catch(e){self.postMessage({type:`error`,error:String(e)})}}}})();