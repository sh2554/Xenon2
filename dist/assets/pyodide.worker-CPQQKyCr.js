(function(){importScripts(`https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js`);let e=null,t=null;async function n(){e=await loadPyodide({indexURL:`https://cdn.jsdelivr.net/pyodide/v0.27.7/full/`}),globalThis.__xenon_stdin__=e=>(e&&self.postMessage({type:`stdout`,text:String(e)}),self.postMessage({type:`stdin_request`}),new Promise(e=>{t=n=>{t=null,e(n??``)}})),await e.runPythonAsync(`
import builtins
import js

async def _xenon_input(prompt=''):
    line = await js.__xenon_stdin__(str(prompt) if prompt else '')
    if line is None:
        return ''
    return str(line).rstrip('\\n')

builtins.input = _xenon_input
`),self.postMessage({type:`ready`})}function r(){let t=e.globals.toJs(),n=[];for(let[e,r]of t.entries()){if(e.startsWith(`__`)||typeof r==`function`||r&&r._type===`module`||e===`random`||e.startsWith(`_xenon`))continue;let t=``,i=``;try{r===null?(t=`None`,i=`NoneType`):typeof r==`object`&&r.toJs?(t=JSON.stringify(r.toJs()),i=r.type||`object`):(t=String(r),i=typeof r)}catch{t=`[Complex Object]`,i=`object`}n.push({name:e,value:t,type:i})}return n}self.onmessage=async i=>{let{type:a,code:o,canUseTime:s}=i.data;if(a===`init`){try{await n()}catch(e){self.postMessage({type:`error`,error:`Failed to load Pyodide: `+e.message})}return}if(a===`stdin_response`){if(t){let e=t;t=null,e(i.data.value??``)}return}if(a===`run`){if(!e){self.postMessage({type:`error`,error:`Pyodide not initialised yet.`});return}t=null,e.setStdout({batched:e=>self.postMessage({type:`stdout`,text:e})}),e.setStderr({batched:e=>self.postMessage({type:`stderr`,text:e})});try{await e.runPythonAsync(`import random`),s&&(await e.runPythonAsync(`import time`),globalThis.__xenon_sleep__=e=>new Promise(t=>setTimeout(t,e*1e3)),await e.runPythonAsync(`import js
async def _xenon_time_sleep__(seconds):
    await js.__xenon_sleep__(seconds)
`)),globalThis.__xenon_user_code__=o,globalThis.__xenon_can_use_time__=!!s,await e.runPythonAsync(`
import ast as _ast

class _XenonInputTransformer(_ast.NodeTransformer):
    def visit_Call(self, node):
        self.generic_visit(node)
        func = node.func
        if isinstance(func, _ast.Name) and func.id == 'input':
            return _ast.copy_location(_ast.Await(value=node), node)
        return node

class _XenonTimeTransformer(_ast.NodeTransformer):
    def visit_Call(self, node):
        self.generic_visit(node)
        func = node.func
        if isinstance(func, _ast.Attribute) and isinstance(func.value, _ast.Name):
            if func.value.id == 'time' and func.attr == 'sleep':
                new_call = _ast.Call(
                    func=_ast.Name(id='_xenon_time_sleep__', ctx=_ast.Load()),
                    args=node.args,
                    keywords=node.keywords
                )
                return _ast.copy_location(_ast.Await(value=new_call), node)
        return node

import js as _js
_raw = _js.__xenon_user_code__
_tree = _ast.parse(_raw, mode='exec')
_tree = _XenonInputTransformer().visit(_tree)
_can_use_time = _js.__xenon_can_use_time__
if _can_use_time:
    _tree = _XenonTimeTransformer().visit(_tree)
_ast.fix_missing_locations(_tree)
_lines = _ast.unparse(_tree).splitlines()
_indented = '\\n'.join(('    ' + ln if ln.strip() else ln) for ln in _lines)
_xenon_transformed = 'async def __xenon_main__():\\n' + _indented + '\\nawait __xenon_main__()'
del _XenonInputTransformer, _raw, _tree, _lines, _indented, _can_use_time
if '_XenonTimeTransformer' in dir():
    del _XenonTimeTransformer
`);let t=e.globals.get(`_xenon_transformed`);await e.runPythonAsync(t),self.postMessage({type:`done`,variables:r()})}catch(e){self.postMessage({type:`error`,error:String(e)})}}}})();