romania_map_nodes = {
    'Arad': (91, 492),
    'Bucharest': (400, 327),
    'Craiova': (253, 288),
    'Drobeta': (165, 299),
    'Eforie': (562, 293),
    'Fagaras': (305, 449),
    'Giurgiu': (375, 270),
    'Hirsova': (534, 350),
    'Iasi': (473, 506),
    'Lugoj': (165, 379),
    'Mehadia': (168, 339),
    'Neamt': (406, 537),
    'Oradea': (131, 571),
    'Pitesti': (320, 368),
    'Rimnicu': (233, 410),
    'Sibiu': (207, 457),
    'Timisoara': (94, 410),
    'Urziceni': (456, 350),
    'Vaslui': (509, 444),
    'Zerind': (108, 531)
}

romania_location_map_full = {
    'Arad' : {'pos': (21.31227,46.18656), 'connections': ['Sibiu','Timisoara','Zerind'] },
    'Sibiu' : {'pos': (24.12558,45.79833), 'connections': ['Fagaras','Rimnicu Vilcea','Oradea'] },
    'Zerind' : {'pos': (21.51742,46.62251), 'connections': ['Oradea'] },
    'Timisoara' : {'pos': (21.20868,45.74887), 'connections': ['Lugoj'] },
    'Oradea' : {'pos': (21.91894,47.04650), 'connections': [] },
    'Fagaras' : {'pos': (24.97310,45.84164), 'connections': ['Bucharest'] },
    'Lugoj' : {'pos': (21.90346,45.69099), 'connections': ['Mehadia'] },
    'Rimnicu' : {'pos': (24.36932,45.09968), 'connections': ['Craiova','Pitesti'] },
    'Mehadia' : {'pos': (22.36452,44.90411), 'connections': ['Dobreta'] },
    'Drobeta' : {'pos': (22.65973,44.63692), 'connections': ['Craiova'] },
    'Craiova' : {'pos': (23.79488,44.33018), 'connections': [] },
    'Pitesti' : {'pos': (24.86918,44.85648), 'connections': ['Bucharest','Craiova'] },
    'Bucharest' : {'pos': (26.10254,44.42677), 'connections': ['Giurgiu','Urziceni'] },
    'Giurgiu' : {'pos': (25.96993,43.90371), 'connections': [] },
    'Urziceni' : {'pos': (26.64112,44.71653), 'connections': ['Hirsova','Vaslui'] },
    'Vaslui' : {'pos': (27.72765,46.64069), 'connections': ['Lasi'] },
    'Iasi' : {'pos':(27.60144,47.15845), 'connections': ['Neamt'] },
    'Neamt' : {'pos': (26.38188,46.97587), 'connections': [] },
    'Hirsova' : {'pos': (27.94566,44.68935), 'connections': ['Eforie'] },
    'Eforie' : {'pos': (28.65273,44.04911), 'connections': [] }
}

romania_graph = {
    'Arad': {
        'Zerind': 75, 
        'Sibiu': 140, 
        'Timisoara': 118
    }, 
    'Bucharest': {
        'Urziceni': 85, 
        'Pitesti': 101, 
        'Giurgiu': 90, 
        'Fagaras': 211
    }, 
    'Craiova': {
        'Drobeta': 120, 
        'Rimnicu': 146, 
        'Pitesti': 138
    }, 
    'Drobeta': {
        'Mehadia': 75, 
        'Craiova': 120
    }, 
    'Eforie': {
        'Hirsova': 86
    }, 
    'Fagaras': {
        'Sibiu': 99, 
        'Bucharest': 211
    }, 
    'Hirsova': {
        'Urziceni': 98, 
        'Eforie': 86
    }, 
    'Iasi': {
        'Vaslui': 92, 
        'Neamt': 87
    }, 
    'Lugoj': {
        'Timisoara': 111, 
        'Mehadia': 70
    }, 
    'Oradea': {
        'Zerind': 71, 
        'Sibiu': 151
    }, 
    'Pitesti': {
        'Rimnicu': 97, 
        'Bucharest': 101, 
        'Craiova': 138
    }, 
    'Rimnicu': {
        'Sibiu': 80, 
        'Craiova': 146, 
        'Pitesti': 97
    }, 
    'Urziceni': {
        'Vaslui': 142, 
        'Bucharest': 85, 
        'Hirsova': 98
    }, 
    'Zerind': {
        'Arad': 75, 
        'Oradea': 71
    }, 
    'Sibiu': {
        'Arad': 140, 
        'Fagaras': 99, 
        'Oradea': 151, 
        'Rimnicu': 80
    }, 
    'Timisoara': {
        'Arad': 118, 
        'Lugoj': 111
    }, 
    'Giurgiu': {
        'Bucharest': 90
    }, 
    'Mehadia': {
        'Drobeta': 75, 
        'Lugoj': 70
    }, 
    'Vaslui': {
        'Iasi': 92, 
        'Urziceni': 142
    }, 
    'Neamt': {
        'Iasi': 87
    }
}



heuristic_values = {
    "Arad": 366, 
    "Zerind": 374, 
    "Timisoara": 329, 
    "Sibiu": 253,
    "Oradea": 380,
    "Lugoj": 244, 
    "Fagaras": 176, 
    "Rimnicu": 193, 
    "Mehadia": 241,
    "Drobeta": 242,
    "Craiova": 160, 
    "Pitesti": 98, 
    "Bucharest": 0, 
    "Giurgiu": 77,
    "Eforie" : 161,
    "Hirsova" : 151,
    "Iasi" : 226,
    "Neamt" : 234,
    "Urziceni" : 80,
    "Vaslui" : 199
}  

"""
import sympy as sp

# Create symbols for each city's coordinates
symbols = {city: (sp.symbols(f'{city}_x'), sp.symbols(f'{city}_y')) for city in romania_graph.keys()}


# Create equations based on the distances
equations = [
    sp.Eq(symbols['Bucharest'][0], 0),
    sp.Eq(symbols['Bucharest'][1], 0),
    #sp.Eq(symbols['Mehadia'][1] - symbols['Bucharest'][1], 0),
    
]

# Get the symbols for the cities
arad_x, arad_y = symbols['Arad']
zerind_x, zerind_y = symbols['Zerind']
oradea_x, oradea_y = symbols['Oradea']

# Add the constraints
#equations.append(sp.Eq((zerind_y - arad_y) / (zerind_x - arad_x), (oradea_y - arad_y) / (oradea_x - arad_x)))


for city, neighbors in romania_graph.items():

    x1, y1 = symbols[city]
    norm = heuristic_values[city]

    equations.append(sp.Eq(x1**2 + y1**2, norm**2))

    for neighbor, distance in neighbors.items():
        x2, y2 = symbols[neighbor]

        equations.append(sp.Eq((x1 - x2)**2 + (y1 - y2)**2, distance**2))

print(*equations)
# Solve the system of equations
solution_set = sp.linsolve(equations, symbols)
print(solution_set)

"""