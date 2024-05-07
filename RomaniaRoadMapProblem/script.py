from data import romania_graph
from search_algorithms import uniform_cost_search
from pyodide.ffi import JsProxy

def exec_py(func, kargs):
    if isinstance(kargs, JsProxy):
        kargs = kargs.to_py()
        print(kargs)
    match func:
        case 'uniform_cost_search':
            return uniform_cost_search(romania_graph, **kargs)


from js import createObject
from pyodide.ffi import create_proxy
createObject(create_proxy(globals()), "pyodideGlobals")