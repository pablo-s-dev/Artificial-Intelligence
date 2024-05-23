import sys
sys.path.append("..")

from search_algorithms import a_star_search, breadth_first_search, depth_first_search, greedy_search, uniform_cost_search
import numpy as np
import ast



LAST_H_IDX = 2
LAST_V_IDX = 2



TARGET_MATRIX = np.array([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
], np.int8)


def count_inversions(state_matrix: np.ndarray):

    #TODO: implement this function

    return 

def is_solvable(state_matrix: np.ndarray)->bool:
    """
    Computes whether a given state_matrix representing the state of an 8-puzzle game is solvable or not

    Parameters
    ----------
    state_matrix: A np.ndarray representing the tiles configuration

    Returns
    -------
    solvable: bool
    """

def get_unsorted_amount(state: tuple) -> int:

    """
    Computes the heuristic of a given state based on the amount of unordered pieces.

    Parameters
    ----------
    state : tuple
        A tuple containing the current state matrix and the position of the void.
        The state matrix is a 2D numpy array representing the current state of the puzzle.
        The void position is a tuple representing the position of the void in the state matrix.

    Returns 
    -------
    int
        The heuristic value of the state. This is computed as the count of the number of pieces
        in the current state that are not in their target position. The target position is defined
        by the TARGET_MATRIX.
    """

    state_matrix = np.frombuffer(state[0], dtype=np.int8).reshape(TARGET_MATRIX.shape)

    left = np.count_nonzero(state_matrix - TARGET_MATRIX)
    print(state_matrix - TARGET_MATRIX )
    return left

def get_manhattan_dist(state):
    return

def make_move(matrix, old_void_pos, new_void_pos):
    new_matrix = matrix.copy()

    new_matrix[*old_void_pos] = new_matrix[*new_void_pos]
    new_matrix[*new_void_pos] = 0

    return new_matrix

def get_next_valid_moves(root_state):

    # Something like 

    # 0 1 3
    # 4 7 8
    # 9 2 6

    # State has two variables (x1, x2), where x1 is the string represhentation of the pile's positions and x2 is the void position.


    root_matrix = np.frombuffer(root_state[0],  dtype=np.int8).reshape(TARGET_MATRIX.shape)

    root_void_pos = root_state[1]

    root_void_x, root_void_y = root_void_pos

    # horizontal axis
    can_go_left = root_void_x != 0
    can_go_right = root_void_x != LAST_H_IDX

    # vertical axis possibilities
    can_go_top = root_void_y != 0
    can_go_bottom = root_void_y != LAST_V_IDX

    action_cost = 1

    children = []


    if can_go_left:

        new_void_pos = (root_void_x - 1, root_void_y)
        child_matrix = make_move(root_matrix, root_void_pos, new_void_pos)

        children.append(
            ( (child_matrix.tobytes(), new_void_pos), action_cost)
        )

    if can_go_right:


        new_void_pos = (root_void_x + 1, root_void_y)
        child_matrix = make_move(root_matrix, root_void_pos, new_void_pos)


        children.append(
            ( (child_matrix.tobytes(), new_void_pos), action_cost)
        )


    if can_go_top:

        new_void_pos = (root_void_x, root_void_y - 1)

        child_matrix = make_move(root_matrix, root_void_pos, new_void_pos)



        children.append(
            ( (child_matrix.tobytes(), new_void_pos), action_cost)
        )


    if can_go_bottom:

        new_void_pos = (root_void_x, root_void_y + 1)

        child_matrix = make_move(root_matrix, root_void_pos, new_void_pos)

        children.append(
            ( (child_matrix.tobytes(), new_void_pos), action_cost)
        )


    return children

def bytes_to_list(byte_data):
    return np.frombuffer(byte_data, dtype=np.int8).reshape(TARGET_MATRIX.shape).tolist()

def state_to_string(state):
    return str(bytes_to_list(state[0])) + ', ' + str(state[1])

def action_to_string(action):

    print(action)

    if not action:
        return ""

    start = action.find("(b'") + 1
    end = action.find("',") + 1
    byte_string = action[start:end]
    
    print(action.split("b'")[1].split(",")[0], 'utf-8')
    print(bytes(action.split("b'")[1].split(",")[0], 'utf-8'))
    matrix = np.frombuffer(ast.literal_eval(byte_string), dtype=np.int8).reshape(TARGET_MATRIX.shape)

    return action

def main():

    start_matrix = np.array([
        [1, 2, 3],
        [4, 5, 6],
        [7, 0, 8]
    ], np.int8)

    start_void_pos = (2, 1)


    # Convert the state matrix back to a list for readability
    result = next(a_star_search(
        start_state= (start_matrix.tobytes(), start_void_pos),
        target_state=(TARGET_MATRIX.tobytes(), (2, 2)),
        successor_fun=get_next_valid_moves,
        heuristic_fun=get_unsorted_amount
    ))

        # Convert the state matrix back to a list for readability
    result['state'] = bytes_to_list(result['state'][0]), result['state'][1]

    # Convert each state in the path back to a list
    result['path'] = [bytes_to_list(state[0]) for state in result['path']]

    # Convert the frontier and explored sets to strings
    result['frontier'] = [state_to_string(state) for state in result['frontier']]
    result['explored'] = [state_to_string(state) for state in result['explored']]

    result['action'] = action_to_string(result['action'])

    # print(json.dumps(result, indent=4))
    # Bullet point print
    print("\n\nResults: \n-----------\n")
    for key, val in result.items():
        print(f"{key} - {val}\n")

main()