
from data import romania_graph
from search_algorithms import uniform_cost_search, breadth_first_search
from pyscript import window, document, when

def get_city_edges(city):
    return romania_graph[city].items()

start_select = document.querySelector('#start_select')
target_select = document.querySelector('#target_select')
algorithm_select = document.querySelector('#algorithm_select')
step_by_step_checkbox = document.querySelector('#step_by_step_checkbox')
spans = document.querySelectorAll('.result-span')
result = None

@when('click', '#find_path_btn')
def compute_sol_handler(e):	

    global result


    start = start_select.value
    target = target_select.value
    algorithm = algorithm_select.value
    step_by_step = step_by_step_checkbox.checked

    step_result = None

    if result and step_by_step:
        try:
            step_result = next(result)
        except StopIteration:
            pass

    args = {
        'start_state': start,
        'target_state': target,
        'step_by_step': step_by_step,
        'successor_fun': get_city_edges
    }

    if step_result is None or step_by_step is False:
        match (algorithm):
            case 'ucs':
                result = uniform_cost_search(**args)
                step_result = next(result)
            case 'bfs':
                result = breadth_first_search(**args)
                step_result = next(result)
                pass


    
    if step_result:
        window.update_ui(step_result)

@when('click', '#reset_btn')
def reset():
    global result
    result = None
    window.reset_graph()
    window.reset_stats()


print('Script loaded')

loading_div = document.querySelector('#loading')
loading_div.remove()