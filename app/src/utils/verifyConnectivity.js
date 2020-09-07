function verifyStrongConnectivity(graph, v, isFW) {
  //Floyd-Warshall
  if (isFW) return floydWarshall(graph, v);
  //BFS
  let isStrongConnected = true;
  const graphReverse = revertGraph(graph);

  const graphBFS = BFS(graph, 0, v);
  const graphReverseBFS = BFS(graphReverse, 0, v);

  if (graphBFS.length !== graphReverseBFS.length || graphBFS.length !== v - 1) {
    isStrongConnected = false;
  }
  return { isStrongConnected, graphBFS, graphReverseBFS, graphReverse };
}

const revertGraph = (graph) => {
  let reverse = [];
  for (let i = 0; i < graph.length; i++) {
    reverse.push([]);
    for (let j = 0; j < graph.length; j++) {
      reverse[i].push(graph[j][i]);
    }
  }
  return reverse;
};

function floydWarshall(graph, v) {
  let i, j, k;
  for (k = 0; k < v; k++) {
    for (i = 0; i < v; i++) {
      for (j = 0; j < v; j++) {
        if (graph[i][k] + graph[k][j] < graph[i][j]) {
          graph[i][j] = graph[i][k] + graph[k][j];
        }
      }
    }
  }
  for (i = 0; i < v; i++) {
    for (j = 0; j < v; j++) {
      if (graph[i][j] === 999) {
        return false;
      }
    }
  }
  return true;
}

function BFS(graph, i, v) {
  let queue = [];
  let visited = [];
  let bfsTree = [];
  let u;
  for (let j = i; j < v; j++) {
    queue.push(graph[j]);
    visited[j] = 1;
    while (queue.length) {
      u = queue.pop();
      u.forEach((vertex, k) => {
        if (vertex === 1 && visited[k] !== 1) {
          visited[k] = 1;
          queue.push(graph[k]);
          bfsTree.push(k);
        }
      });
    }
  }
  return bfsTree;
}

export default verifyStrongConnectivity;
