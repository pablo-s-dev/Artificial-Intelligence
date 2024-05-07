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
