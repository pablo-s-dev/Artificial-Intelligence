from heapdict import heapdict
import timeit
from typing import Callable, Hashable

def uniform_cost_search(start_state: Hashable, target_state: Hashable, successor_fun: Callable, step_by_step: bool = False, ):

    print(f"Searching from {start_state} to {target_state}.")

    """
    Uniform Cost Search Algorithm

    Args:

    start_state: any hashable object
    target_state: any hashable object
    successor_fun: a function that returns the successors of a given state
    step_by_step: a boolean flag to return the search steps

    Returns:

    A dictionary with the following keys

    path: a list of states from start to target
    cost: the cost of the path
    time: the time taken to find the path
    steps: the number of iterations
    depth: the depth of the path
    frontier: the states in the frontier
    state: the target state
    explored: the states explored
    action: the action taken to reach the target state

    """

    t0 = timeit.default_timer()
    
    steps = 0   
    
    # Keeps track of the shortest known distances and predecessors
    node_info = {
        start_state: {
            'cost': 0,
            'prev': None
        }
    }

    action = ''
    
    frontier = heapdict()

    frontier[start_state] = 0

    while frontier:

        root_state, root_cost = frontier.popitem()

        if root_state == target_state:

            path = []

            node_state = root_state

            while node_state:

                path.append(node_state)
                node_state = node_info[node_state].get('prev', None)

            explored = list(node_info.keys())
            yield {
                'path': list(reversed(path)),
                'cost': root_cost,
                'time': timeit.default_timer() - t0,
                'steps': steps,
                'depth': len(path) - 1,
                'frontier': list(frontier.keys()),
                'state': root_state,
                'explored': explored,
                'expansions': len(explored),
                'action': '',
            }
            return

        # Expanding the root tree
        children = successor_fun(root_state)

        for child_state, child_cost in children:

            cur_cost = root_cost + child_cost

            # Did we just found a (better) path to this node?
            if child_state not in node_info or node_info[child_state]['cost'] > cur_cost:

                frontier[child_state] = cur_cost

                node_info[child_state] = {
                    'cost': cur_cost,
                    'prev': root_state,
                }

        

        if step_by_step:

            next_state, next_cost = frontier.peekitem()

            if next_state:
                action = f"Visit node {next_state} with cost {next_cost}."
            else:
                action = ""

            path = []

            node_state = root_state

            while node_state:

                path.append(node_state)
                node_state = node_info[node_state].get('prev', None)

            depth = len(path) - 1

            explored = list(node_info.keys())

            yield {
                'path': list(reversed(path)),
                'cost': root_cost,
                'steps': steps,
                'depth': depth,
                'frontier': list(frontier.keys()),
                'action': action,
                'state': root_state,
                'explored': explored,
                'expansions': len(explored)
            }


    return
