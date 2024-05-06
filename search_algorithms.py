from heapdict import heapdict
import timeit
def uniform_cost_search(graph, start_key: str, target_key: str, step_by_step: bool = False):

    """
    """

    t0 = timeit.default_timer()
    
    steps = 0
    
    # Keeps track of the shortest known distances and predecessors
    node_info = {
        start_key: {
            'cost': 0,
            'prev': None
        }
    }

    action = ''
    
    frontier = heapdict()

    frontier[start_key] = 0

    while frontier:
        

        
        print(f"Frontier has {len(frontier)} nodes.")

        root_key, root_cost = frontier.popitem()

        print(f"Frontier has {len(frontier)} nodes.")


        if root_key == target_key:

            path = []

            node_key = root_key

            while node_key:

                path.append(node_key)
                node_key = node_info[node_key].get('prev', None)


            return {
                'path': list(reversed(path)),
                'cost': root_cost,
                'time': timeit.default_timer() - t0,
                'steps': steps,
                'depth': len(path) - 1,
                'frontier': list(frontier.keys()),
                'state': root_key,
                'explored': list(node_info.keys()),
                'action': ''
            }


        # Expanding the root tree
        for child_key, child_cost in graph[root_key].items():

            cur_cost = root_cost + child_cost

            # Did we just found a (better) path to this node?
            if child_key not in node_info or node_info[child_key]['cost'] > cur_cost:

                frontier[child_key] = cur_cost

                node_info[child_key] = {
                    'cost': cur_cost,
                    'prev': root_key,
                }

        

        if step_by_step:

            next_key, next_cost = frontier.peekitem()

            if next_key:
                action = f"Visit node {next_key} with cost {next_cost}."
            else:
                action = ""

            path = []

            node_key = root_key

            print(len(path) - 1)

            while node_key:

                path.append(node_key)
                node_key = node_info[node_key].get('prev', None)

            depth = len(path) - 1

            yield {
                'path': list(reversed(path)),
                'cost': root_cost,
                'steps': steps,
                'depth': depth,
                'frontier': list(frontier.keys()),
                'action': action,
                'state': root_key,
                'explored': list(set(([info['prev'] for info in node_info.values() if info['prev'] is not None])))
            }

        steps += 1
        

    return None

        