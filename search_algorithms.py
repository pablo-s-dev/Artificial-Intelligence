from heapdict import heapdict
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
    expansions: the number of expanded nodes
    depth: the depth of the path
    frontier: the states in the frontier
    state: the target state
    explored: the states explored
    action: the action taken to reach the target state

    """

    
    # Keeps track of the shortest known distances and predecessors
    node_info = {
        start_state: {
            'cost': 0,
            'prev': None
        }
    }

    expansions = 0

    action = ''

    # Only for logging purposes, not used in the algorithm, we use node_info instead
    explored = set()
    
    frontier = heapdict()

    frontier[start_state] = 0

    while frontier:


        root_state, root_cost = frontier.popitem()

        explored.add(root_state)

        if root_state == target_state:

            path = []

            node_state = root_state

            while node_state:

                path.append(node_state)
                node_state = node_info[node_state].get('prev', None)

            yield {
                'path': list(reversed(path)),
                'cost': root_cost,
                'depth': len(path) - 1,
                'frontier': list(frontier.keys()),
                'state': root_state,
                'explored': explored,
                'expansions': expansions,
                'action': '',
            }
            return

        # Expanding the root tree
        children = successor_fun(root_state)

        for child_state, action_cost in children:

            child_cost = root_cost + action_cost

            # new or better path to this node
            if child_state not in node_info or node_info[child_state]['cost'] > child_cost:

                frontier[child_state] = child_cost

                node_info[child_state] = {
                    'cost': child_cost,
                    'prev': root_state,
                }

        expansions += 1
        

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


            yield {
                'path': list(reversed(path)),
                'cost': root_cost,
                'depth': depth,
                'frontier': list(frontier.keys()),
                'action': action,
                'state': root_state,
                'explored': explored,
                'expansions': expansions
            }


    return

def breadth_first_search(start_state: Hashable, target_state: Hashable, successor_fun: Callable, step_by_step: bool = False, ):

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
    expansions: the number of expanded nodes
    depth: the depth of the path
    frontier: the states in the frontier
    state: the target state
    explored: the states explored
    action: the action taken to reach the target state

    """
    expansions = 0

    # Keeps track of the shortest known distances and predecessors
    node_info = {
        start_state: {
            'cost': 0,
            'prev': None
        }
    }

    action = ''

    explored = set()
    
    frontier = []

    frontier.append(start_state)

    while frontier:


        root_state = frontier.pop(0)
        root_cost = node_info[root_state]['cost']

        
        explored.add(root_state)

        if root_state == target_state:

            path = []

            node_state = root_state

            while node_state:

                path.append(node_state)
                node_state = node_info[node_state].get('prev', None)

            yield {
                'path': list(reversed(path)),
                'cost': root_cost,
                'depth': len(path) - 1,
                'frontier': frontier,
                'state': root_state,
                'explored': explored,
                'expansions': expansions,
                'action': '',
            }
            return

        # Expanding the root tree
        children = successor_fun(root_state)

        for child_state, action_cost in children:

            child_cost = root_cost + action_cost

            # new or better path to this node
            if child_state not in node_info or node_info[child_state]['cost'] > child_cost:

                frontier.append(child_state)

                node_info[child_state] = {
                    'cost': child_cost,
                    'prev': root_state,
                }

        expansions += 1
        

        if step_by_step:

            next_state = frontier[0]
            next_cost = node_info[next_state]['cost']

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

            yield {
                'path': list(reversed(path)),
                'cost': root_cost,
                'depth': depth,
                'frontier': frontier,
                'action': action,
                'state': root_state,
                'explored': explored,
                'expansions': expansions
            }
        
    return

def greedy_search(start_state: Hashable, target_state: Hashable, successor_fun: Callable, step_by_step: bool = False, ):

    print(f"Searching from {start_state} to {target_state}.")

    """
    Greedy Search Algorithm

    Args:

    start_state: any hashable object
    target_state: any hashable object
    successor_fun: a function that returns the successors of a given state
    step_by_step: a boolean flag to return the search steps

    Returns:

    A dictionary with the following keys

    path: a list of states from start to target
    cost: the cost of the path
    expansions: the number of expanded nodes
    depth: the depth of the path
    frontier: the states in the frontier
    state: the target state
    explored: the states explored
    action: the action taken to reach the target state

    """

    
    # Keeps track of the shortest known distances and predecessors
    node_info = {
        start_state: {
            'cost': 0,
            'prev': None
        }
    }

    expansions = 0

    action = ''

    # Only for logging purposes, not used in the algorithm, we use node_info instead
    explored = set()
    
    frontier = heapdict()

    frontier[start_state] = 0

    while frontier:


        root_state, root_heuristic = frontier.popitem()
        root_cost = node_info[root_state]['cost']

        explored.add(root_state)

        if root_state == target_state:

            path = []

            node_state = root_state

            while node_state:

                path.append(node_state)
                node_state = node_info[node_state].get('prev', None)

            yield {
                'path': list(reversed(path)),
                'cost': root_cost,
                'depth': len(path) - 1,
                'frontier': list(frontier.keys()),
                'state': root_state,
                'explored': explored,
                'expansions': expansions,
                'action': '',
            }
            return

        # Expanding the root tree
        children = successor_fun(root_state)

        for child_state, action_cost, child_heuristic in children:

            child_cost = root_cost + action_cost

            # new or better path to this node
            if child_state not in node_info or node_info[child_state]['cost'] > child_cost:

                frontier[child_state] = child_heuristic

                node_info[child_state] = {
                    'cost': child_cost,
                    'prev': root_state,
                }

        expansions += 1
        

        if step_by_step:

            next_state, next_heuristic = frontier.peekitem()
            next_cost = node_info[next_state]['cost']

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


            yield {
                'path': list(reversed(path)),
                'cost': root_cost,
                'depth': depth,
                'frontier': list(frontier.keys()),
                'action': action,
                'state': root_state,
                'explored': explored,
                'expansions': expansions
            }


    return


def a_star_search(start_state: Hashable, start_heuristic, target_state: Hashable, successor_fun: Callable, step_by_step: bool = False, ):

    print(f"Searching from {start_state} to {target_state}.")

    """
    A* Search Algorithm

    Args:

    start_state: any hashable object
    target_state: any hashable object
    successor_fun: a function that returns the successors of a given state
    step_by_step: a boolean flag to return the search steps

    Returns:

    A dictionary with the following keys

    path: a list of states from start to target
    cost: the cost of the path
    expansions: the number of expanded nodes
    depth: the depth of the path
    frontier: the states in the frontier
    state: the target state
    explored: the states explored
    action: the action taken to reach the target state

    """

    
    # Keeps track of the shortest known distances and predecessors
    node_info = {
        start_state: {
            'cost': 0,
            'prev': None,
            'f': start_heuristic
        }
    }

    expansions = 0

    action = ''

    # Only for logging purposes, not used in the algorithm, we use node_info instead
    explored = set()
    
    frontier = heapdict()

    frontier[start_state] = 0

    while frontier:


        root_state, root_f = frontier.popitem()
        root_cost = node_info[root_state]['cost']

        explored.add(root_state)

        if root_state == target_state:

            path = []

            node_state = root_state

            while node_state:

                path.append(node_state)
                node_state = node_info[node_state].get('prev', None)

            yield {
                'path': list(reversed(path)),
                'cost': root_cost,
                'depth': len(path) - 1,
                'frontier': list(frontier.keys()),
                'state': root_state,
                'explored': explored,
                'expansions': expansions,
                'action': '',
            }
            return

        # Expanding the root tree
        children = successor_fun(root_state)

        for child_state, action_cost, child_heuristic in children:

            child_cost = root_cost + action_cost

            child_f = child_cost + child_heuristic

            # new or better path to this node
            if child_state not in node_info or node_info[child_state]['f'] > child_f:

                frontier[child_state] = child_f

                node_info[child_state] = {
                    'cost': child_cost,
                    'prev': root_state,
                    'f': child_f
                }

        expansions += 1
        

        if step_by_step:

            next_state, next_f = frontier.peekitem()
            next_cost = node_info[next_state]['cost']

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


            yield {
                'path': list(reversed(path)),
                'cost': root_cost,
                'depth': depth,
                'frontier': list(frontier.keys()),
                'action': action,
                'state': root_state,
                'explored': explored,
                'expansions': expansions
            }


    return

def depth_first_search(start_state: Hashable, target_state: Hashable, successor_fun: Callable, step_by_step: bool = False, ):
    
    print(f"Searching from {start_state} to {target_state}.")

    """
    Depth First Search Algorithm

    Args:

    start_state: any hashable object
    target_state: any hashable object
    successor_fun: a function that returns the successors of a given state
    step_by_step: a boolean flag to return the search steps

    Returns:

    A dictionary with the following keys

    path: a list of states from start to target
    cost: the cost of the path
    expansions: the number of expanded nodes
    depth: the depth of the path
    frontier: the states in the frontier
    state: the target state
    explored: the states explored
    action: the action taken to reach the target state

    """
    expansions = 0

    # Keeps track of the shortest known distances and predecessors
    node_info = {
        start_state: {
            'cost': 0,
            'prev': None
        }
    }

    action = ''

    explored = set()
    
    frontier = []

    frontier.append(start_state)

    while frontier:


        root_state = frontier.pop()
        root_cost = node_info[root_state]['cost']

        
        explored.add(root_state)

        if root_state == target_state:

            path = []

            node_state = root_state

            while node_state:

                path.append(node_state)
                node_state = node_info[node_state].get('prev', None)

            yield {
                'path': list(reversed(path)),
                'cost': root_cost,
                'depth': len(path) - 1,
                'frontier': frontier,
                'state': root_state,
                'explored': explored,
                'expansions': expansions,
                'action': '',
            }
            return

        # Expanding the root tree
        children = successor_fun(root_state)

        for child_state, action_cost in children:

            child_cost = root_cost + action_cost

            # new or better path to this node
            if child_state not in node_info or node_info[child_state]['cost'] > child_cost:

                frontier.append(child_state)

                node_info[child_state] = {
                    'cost': child_cost,
                    'prev': root_state,
                }

        expansions += 1
        

        if step_by_step:

            next_state = frontier[0]
            next_cost = node_info[next_state]['cost']

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

            yield {
                'path': list(reversed(path)),
                'cost': root_cost,
                'depth': depth,
                'frontier': frontier,
                'action': action,
                'state': root_state,
                'explored': explored,
                'expansions': expansions
            }
        
    return
