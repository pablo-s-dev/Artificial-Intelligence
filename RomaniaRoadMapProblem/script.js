

const step_btn = document.getElementById('step_btn')
const find_path_btn = document.getElementById('find_path_btn')
const reset_btn = document.getElementById('reset_btn')
const path_el = document.getElementById('path')
const steps_el = document.getElementById('steps')
const cost_el = document.getElementById('cost')
const state_el = document.getElementById('state')
const frontier_el = document.getElementById('frontier')
const explored_el = document.getElementById('explored')
const action_el = document.getElementById('action')
const step_by_step_checkbox = document.getElementById('step_by_step_checkbox')
const depth_el = document.getElementById('depth')
const bars = document.querySelectorAll('.bar')
const graph_wrapper = document.querySelector("#graph-wrapper")

const start_select = document.getElementById('start_select')
const target_select = document.getElementById('target_select')
const algorithm_select = document.getElementById('algorithm_select')


const canvas_net = document.getElementById('mynetwork');

const canvas_height = canvas_net.clientHeight;

const romania_map_nodes = {
    'Arad': [91, 492],
    'Bucharest': [400, 327],
    'Craiova': [253, 288],
    'Drobeta': [165, 299],
    'Eforie': [562, 293],
    'Fagaras': [305, 449],
    'Giurgiu': [375, 270],
    'Hirsova': [534, 351],
    'Iasi': [473, 506],
    'Lugoj': [165, 379],
    'Mehadia': [168, 339],
    'Neamt': [406, 537],
    'Oradea': [131, 571],
    'Pitesti': [320, 368],
    'Rimnicu': [233, 410],
    'Sibiu': [207, 457],
    'Timisoara': [94, 410],
    'Urziceni': [456, 350],
    'Vaslui': [509, 444],
    'Zerind': [108, 531]
}

const romania_graph = {
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

// Create an array of nodes and edges
let nodes = [];
let edges = [];

for (let city in romania_map_nodes) {
    nodes.push({ id: city, label: city, x: romania_map_nodes[city][0], y: canvas_height - romania_map_nodes[city][1], });
}

for (let city in romania_graph) {
    for (let connectedCity in romania_graph[city]) {

        edges.push({ from: city, to: connectedCity, label: String(romania_graph[city][connectedCity]), });
    }
}

// Create a network
let container = document.getElementById('mynetwork');
let data = {
    nodes: new vis.DataSet(nodes),
    edges: new vis.DataSet(edges)
};
let options = {
    physics: {
        enabled: false
    },
    nodes: {
        physics: false,

        shape: 'circle',
        color: {
            border: '#848484',

            background: '#c4c4c4ff',
            highlight: {
                border: '#ffffff',
                background: '#ffffff',

            }
        },
        size: 8,
        font: {
            size: 6,
            color: '#000000',
            align: 'left'
        },
        shadow: true
    },
    edges: {
        font: {
            size: 8,
            align: 'top',
            strokeColor: 'transparent'
        },
        shadow: false,
        color: {
            color: '#e9e9e9',
            highlight: '#ffffff',
            hover: '#848484',
            opacity: 1
        },
    },
    clickToUse: true
}


step_by_step_checkbox.addEventListener('change', (e) => {
    if (e.target.checked) {
        find_path_btn.innerText = "Next Step"
    } else {
        find_path_btn.innerText = "Find Path"
    }
})



function reset_graph() {
    data.nodes.forEach(node => {
        node.color = { background: '#c4c4c4ff', border: '#848484' }
        node.font = { color: '#000000' }
        data.nodes.update(node); // update the node in the DataSet
    })
    data.edges.forEach(edge => {
        edge.color = { color: '#e9e9e9' }
        data.edges.update(edge); // update the edge in the DataSet
    })
}

function highlight_path(path) {

    for (let i = 0; i < path.length; i++) {
        const [r, g, b] = generatePastelColor()
        const random_color = `rgb(${r},${g},${b})`
        const font_color = ensure_contrast(r, g, b)

        let node = data.nodes.get(path[i]); // get the node from the DataSet
        node.color = { background: random_color, border: random_color }
        node.font = { color: font_color }
        data.nodes.update(node); // update the node in the DataSet

        let edge1 = edges.find(edge => edge.from == path[i] && edge.to == path[i + 1]);
        let edge2 = edges.find(edge => edge.to == path[i] && edge.from == path[i + 1]);

        if (edge1 && edge2) {
            edge1.color = { color: '#17161a' }
            edge2.color = { color: '#17161a' }
            data.edges.update(edge1); // update the edge in the DataSet
            data.edges.update(edge2); // update the edge in the DataSet
        }
    }
}

function generatePastelColor() {
    const r = Math.round((Math.random() * 127) + 127);
    const g = Math.round((Math.random() * 127) + 127);
    const b = Math.round((Math.random() * 127) + 127);
    return [r, g, b];
}

function ensure_contrast(r, g, b) {
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

function reset_stats() {
    document.querySelectorAll('.result-span').forEach(span => {
        span.remove()
    })
}

function update_ui(result) {

    reset_graph()

    reset_stats()

    const span_text_content = {
        'path': result.path,
        'expansions': result.expansions,
        'cost': result.cost,
        'state': result.state,
        'frontier': result.frontier.join(', '),
        'explored': Array.from(result.explored).join(', '),
        'action': result.action,
        'path': result.path.join(' 🡺 '),
        'depth': result.depth
    }

    highlight_path(result.path)

    for (let key in span_text_content) {
        const span = document.createElement('span')

        span.className = 'result-span'
        span.innerText = span_text_content[key] ? '\n' + span_text_content[key] : ''
        document.getElementById(key).appendChild(span)
    }
}


let network = new vis.Network(container, data, options);

algorithm_select.addEventListener('change', (e) => {
    const algo = e.target.value

    if (algo == 'astar' || algo == 'greedy') {
        target_select.disabled = true
        target_select.value = 'Bucharest'
    }
    else {
        target_select.disabled = false
    }
})