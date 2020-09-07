function verifyStrongConnectivity(graph, v, isFW) {
  console.log("verifyStrongConnectivity", graph);
  //Floyd-Warshall
  if (isFW) return floydWarshall(graph, v);
  //BFS
  let bfsTree;
  let SC = true;
  const graphReverse = reverseGraph(graph);
  graph.forEach((vertex, i) => {
    bfsTree = BFS(graph, i, v);
    if (bfsTree.length !== v - 1) SC = false;
  });
  return SC;
}

function reverseGraph(graph) {
  console.log("graph", graph);
  const graphLength = graph.length;
  const reverse = graph;
  for (let i = 0; i < graphLength; i++) {
    for (let j = 0; j < graphLength; j++) {
      reverse[j][i] = graph[i][j];
    }
  }

  console.log("reverse", reverse);
}

function floydWarshall(graph, v) {
  console.log(graph[0][0], v);
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
      console.log(u);
      u.forEach((v, k) => {
        if (v == 1 && visited[k] !== 1) {
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
