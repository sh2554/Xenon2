(function(){importScripts(`https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js`);let e=null,t=!1,n=null,r=null,i=``,a=null;async function o(t){r=t,n=new Int32Array(t),new Uint8Array(t,8),e=await loadPyodide({indexURL:`https://cdn.jsdelivr.net/pyodide/v0.27.7/full/`}),e.setStdin({isatty:!1,stdin:()=>{if(i.length===0){self.postMessage({type:`stdin_request`}),Atomics.wait(n,0,0);let e=Atomics.load(n,1),t=new Uint8Array(r,8,e);i=new TextDecoder().decode(t),Atomics.store(n,0,0)}if(i.length>0){let e=i.charAt(0);return i=i.substring(1),e}return null}}),self.postMessage({type:`ready`})}async function s(){e=await loadPyodide({indexURL:`https://cdn.jsdelivr.net/pyodide/v0.27.7/full/`}),globalThis.__xenon_stdin__=e=>(e&&self.postMessage({type:`stdout`,text:String(e)}),self.postMessage({type:`stdin_request`}),new Promise(e=>{a=e})),await e.runPythonAsync(`
import builtins
import js

async def _xenon_input(prompt=''):
    return await js.__xenon_stdin__(str(prompt) if prompt else '')

builtins.input = _xenon_input
`),self.postMessage({type:`ready`})}function c(){let t=e.globals.toJs(),n=[];for(let[e,r]of t.entries()){if(e.startsWith(`__`)||typeof r==`function`||r&&r._type===`module`||e===`random`||e.startsWith(`_xenon`))continue;let t=``,i=``;try{r===null?(t=`None`,i=`NoneType`):typeof r==`object`&&r.toJs?(t=JSON.stringify(r.toJs()),i=r.type||`object`):(t=String(r),i=typeof r)}catch{t=`[Complex Object]`,i=`object`}n.push({name:e,value:t,type:i})}return n}self.onmessage=async n=>{let{type:r,code:l,sab:u}=n.data;if(r===`init`){try{u==null?(t=!1,await s()):(t=!0,await o(u))}catch(e){self.postMessage({type:`error`,error:`Failed to load Pyodide: `+e.message})}return}if(r===`stdin_response`){if(a){let e=a;a=null,e(n.data.value??``)}return}if(r===`run`){if(!e){self.postMessage({type:`error`,error:`Pyodide not initialised yet.`});return}i=``,a=null,e.setStdout({batched:e=>self.postMessage({type:`stdout`,text:e})}),e.setStderr({batched:e=>self.postMessage({type:`stderr`,text:e})});try{if(t)e.runPython(`import random`),e.runPython(l);else{await e.runPythonAsync(`import random`),globalThis.__xenon_user_code__=l,await e.runPythonAsync(`
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
_tree = _ast.parse(_raw)
_tree = _XenonInputTransformer().visit(_tree)
_ast.fix_missing_locations(_tree)
_xenon_transformed = _ast.unparse(_tree)
del _XenonInputTransformer, _raw, _tree
`);let t=e.globals.get(`_xenon_transformed`);await e.runPythonAsync(t)}self.postMessage({type:`done`,variables:c()})}catch(e){self.postMessage({type:`error`,error:String(e)})}}}})();