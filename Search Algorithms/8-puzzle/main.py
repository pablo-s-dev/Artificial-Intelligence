import sys
sys.path.append("..")

from search_algorithms import a_star_search, breadth_first_search, depth_first_search, greedy_search, uniform_cost_search, iterative_deepening_search
import numpy as np


LAST_H_IDX = 2
LAST_V_IDX = 2


TARGET_MATRIX = (
    (1, 2, 3),
    (4, 5, 6),
    (7, 8, 0)
)


def count_inversions(state_matrix: tuple) -> int:

    """
    Computes the number of inversions in a given state matrix.

    Parameters
    ----------
    state_matrix : tuple
        A 2D tuple representing the current state of the puzzle.

    Returns
    -------
    int
        The number of inversions in the state matrix.
    """

    state_matrix = np.array(state_matrix).flatten()

    inversions = 0

    for i in range(8):
        for j in range(i + 1, 9):
            if state_matrix[i] and state_matrix[j] and state_matrix[i] > state_matrix[j]:
                inversions += 1
    return inversions

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
    
    inversions = count_inversions(state_matrix)

    return inversions % 2 == 0

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

    state_matrix = np.array(state[0], dtype=np.int8)

    return np.count_nonzero(state_matrix - TARGET_MATRIX)

# Pre-computed target positions
TARGET_POS = {TARGET_MATRIX[i][j]: np.array([i, j]) for i in range(3) for j in range(3)}


def get_manhattan_dist(state):
    """
    Computes the heuristic of a given
    state based on the Manhattan distance
    of each piece to its target position.

    Parameters

    state : tuple
        A tuple containing the current state matrix and the position of the void.
        The state matrix is a 2D numpy array representing the current state of the puzzle.
        The void position is a tuple representing the position of the void in the state matrix.

    Returns

    int
        The heuristic value of the state. This is computed as the sum of the Manhattan distances
        of each piece in the current state to its target position. The target position is defined
        by the TARGET_MATRIX.
    """

    state_matrix = np.array(state[0], dtype=np.int8)

    manhattan_dist = 0


    for i in range(3):
        for j in range(3):
            if state_matrix[i][j] != 0: 

                target_pos = TARGET_POS[state_matrix[i][j]]

                manhattan_dist += abs(i - target_pos[0]) + abs(j - target_pos[1])

    return manhattan_dist

def make_move(matrix, old_void_pos, new_void_pos):
    """
    Makes a move in the puzzle by swapping the void position with the new position.
    
    Parameters

    matrix : 2D tuple
        The current state matrix of the puzzle.
    
    old_void_pos : tuple
        The current position of the void in the matrix.
    
    new_void_pos : tuple
        The new position of the void in the matrix.

    Returns

    2D tuple

    """
    new_matrix = [list(row) for row in matrix]

    new_matrix[old_void_pos[0]][old_void_pos[1]] = new_matrix[new_void_pos[0]][new_void_pos[1]]
    new_matrix[new_void_pos[0]][new_void_pos[1]] = 0

    return tuple(map(tuple, new_matrix))

def generate_random_puzzle():
    """
    Generates a random solvable 8-puzzle game.

    Returns

    tuple
        A tuple containing the state matrix and the position of the void.
    """

    while True:

        state_matrix = np.random.permutation(9).reshape(3, 3)

        if is_solvable(state_matrix):
            break

    void_pos = np.where(state_matrix == 0)

    return (tuple(map(tuple, state_matrix)), (void_pos[0][0], void_pos[1][0]))

def get_next_valid_moves(root_state):

    """
    Generates the possible moves from the current state of the puzzle.
    
    Parameters

    root_state : tuple
        A tuple containing the current state matrix and the position of the void.
        The state matrix is a 2D numpy array representing the current state of the puzzle.
        The void position is a tuple representing the position of the void in the state matrix.

    Returns

    list
        A list of tuples, each containing a child state and the cost of the action to reach that state.
    """

    root_matrix = np.array(root_state[0],  dtype=np.int8)

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
            ( (child_matrix, new_void_pos), action_cost)
        )

    if can_go_right:


        new_void_pos = (root_void_x + 1, root_void_y)
        child_matrix = make_move(root_matrix, root_void_pos, new_void_pos)


        children.append(
            ( (child_matrix, new_void_pos), action_cost)
        )


    if can_go_top:

        new_void_pos = (root_void_x, root_void_y - 1)

        child_matrix = make_move(root_matrix, root_void_pos, new_void_pos)

        children.append(
            ( (child_matrix, new_void_pos), action_cost)
        )


    if can_go_bottom:

        new_void_pos = (root_void_x, root_void_y + 1)

        child_matrix = make_move(root_matrix, root_void_pos, new_void_pos)

        children.append(
            ( (child_matrix, new_void_pos), action_cost)
        )


    return children


def main():

    start_matrix, start_void_pos = generate_random_puzzle()

    step_by_step = False
    # Convert the state matrix back to a list for readability
    result = next(breadth_first_search(
        start_state= (start_matrix, start_void_pos),
        target_state=(TARGET_MATRIX, (2, 2)),
        successor_fun=get_next_valid_moves,
        step_by_step=step_by_step
    ))

    print("\nDone!\n")


    if step_by_step is False:
        with open("bfs-results.txt", "w") as f:
            f.write("Results: \n-----------\n")
            f.write(f"Start state: {start_matrix}\n")
            f.write(f"Target state: {TARGET_MATRIX}\n")
            f.write(f"Solution: \n")
            for key, val in result.items():

                f.write(f"{key}: {val}\n")
        
        print("Results saved to results.txt")

    else:

        print(f"Start state: {start_matrix}")
        print(f"Target state: {TARGET_MATRIX}")
        print(f"Solution: \n")

        for key, val in result.items():

            print(f"{key}: {val}")


    
            

main()