import React, { useState, useRef } from "react";
import initGraph from "./utils/createGraph";
import { Stage, Layer, Arrow, Circle, Text } from "react-konva";
import verifyStrongConnectivity from "./utils/verifyConnectivity";

import "./App.css";

function App() {
  const [vertex, setVertex] = useState(0);
  const [edges, setEdges] = useState(null);
  const [edgesCount, setEdgesCount] = useState(0);
  const [graph_matrix, setGraph_matrix] = useState(null);
  const [reverse_graph_matrix, setReverse_Graph_matrix] = useState(null);
  const [selectedVertex, setSelectedVertex] = useState(null);
  const [showReverse, setShowReverse] = useState(false);
  const [reachedVertex, setReachedVertex] = useState([]);
  const [reachedVertexReverse, setReachedVertexReverse] = useState([]);
  const [isFinishedGraph, setIsFinishedGraph] = useState(false);

  const [randomGraphStyle, setRandomStyle] = useState([]);

  function createGraph() {
    if (vertex <= 0) {
      //MENSAGEM NÃO VERTICE NÃO PODE SER MENOR QUE 0
      console.log("Numero de vertex inválido!");
      return;
    }
    if (edges > vertex * (vertex - 1) && edges > 0) {
      //REGRA: ARESTAS <= VERTICES * (VERTICES-1)
      console.log("Numero de artestas inválido!");
      return;
    }

    const graph = initGraph(vertex);
    setGraph_matrix(graph);
    generateGraphStyle(vertex);
  }

  const generateGraphStyle = (vertex) => {
    const styleArray = [];
    for (let i = 0; i < vertex; i++) {
      styleArray.push({
        top: Math.floor(Math.random() * 800),
        left: Math.floor(Math.random() * 800),
        position: "absolute",
      });
    }
    setRandomStyle(styleArray);
  };

  function calculateVertexDistance(origin, destination) {
    const vertex1 = randomGraphStyle[origin];
    const vertex2 = randomGraphStyle[destination];
    console.log(vertex1, vertex2);

    const vertex1X = vertex1.left;
    const vertex1Y = vertex1.top;

    const vertex2X = vertex2.left;
    const vertex2Y = vertex2.top;

    const distance = Math.sqrt(
      Math.pow(vertex1X - vertex2X, 2) + Math.pow(vertex1Y - vertex2Y, 2)
    );
    console.log(distance);
  }

  function connectVertex(origin, destination) {
    const isAlredyConnected = verifyConnectivity(origin, destination);
    if (isAlredyConnected) {
      console.log("JÁ TÁ CONECTADO!!");
      return;
    }
    let newGraph = graph_matrix;
    if (destination < graph_matrix.length) {
      newGraph[origin][destination] = 1;
      setGraph_matrix(newGraph);
      setEdgesCount(edgesCount - 1);
      calculateVertexDistance(origin, destination);
    } else {
      console.log("POSIÇÃO NÃO EXISTENTE");
    }
  }

  function connectVertexBothDirection(origin, destination) {
    let newGraph = graph_matrix;

    if (destination < graph_matrix.length) {
      let isOriginNotConnected = !verifyConnectivity(origin, destination);
      let isDestinationNotConnected = !verifyConnectivity(destination, origin);

      if (isOriginNotConnected && isDestinationNotConnected) {
        newGraph[origin][destination] = 1;
        newGraph[destination][origin] = 1;
        setGraph_matrix(newGraph);
        setEdgesCount(edgesCount - 2);
      } else if (isOriginNotConnected) {
        newGraph[origin][destination] = 1;
        setGraph_matrix(newGraph);
        setEdgesCount(edgesCount - 1);
      } else if (isDestinationNotConnected) {
        newGraph[destination][origin] = 1;
        setGraph_matrix(newGraph);
        setEdgesCount(edgesCount - 1);
      }
    } else {
      console.log("POSIÇÃO NÃO EXISTENTE");
    }
  }

  function removeConnection(origin, destination) {
    let newGraph = graph_matrix;
    let aux = edgesCount;
    const isAlredyConnected = verifyConnectivity(origin, destination);
    if (!isAlredyConnected) {
      console.log("NÃO TÁ CONECTADO!!");
      return;
    }
    if (destination < graph_matrix.length) {
      newGraph[origin][destination] = 999;
      setGraph_matrix(newGraph);
      aux++;
      setEdgesCount(aux);
      calculateVertexDistance(origin, destination);
    } else {
      console.log("POSIÇÃO NÃO EXISTENTE");
    }
  }

  function verifyConnectivity(origin, destination) {
    if (graph_matrix[origin][destination] === 1) {
      return true;
    }
    return false;
  }

  function finishGraph() {
    setIsFinishedGraph(true);
    let graph = graph_matrix;
    let {
      isStrongConnected,
      graphBFS,
      graphReverseBFS,
      graphReverse,
    } = verifyStrongConnectivity(graph, vertex);
    setReverse_Graph_matrix(graphReverse);
    setReachedVertexReverse(graphReverseBFS);
    setReachedVertex(graphBFS);
    if (isStrongConnected) {
      console.log("Este Grafo é fortemente conectado!");
    } else {
      console.log("Este Grafo não é fortemente conectado");
    }
    return;
  }

  const getArrowColor = (i) => {
    if (showReverse) {
      if (isFinishedGraph) {
        if (i == 0) {
          return "#08f26e";
        }
        return reachedVertexReverse.includes(i) ? "#08f26e" : "red";
      } else {
        return "black";
      }
    } else {
      if (isFinishedGraph) {
        if (i == 0) {
          return "#08f26e";
        }
        return reachedVertex.includes(i) ? "#08f26e" : "red";
      } else {
        return "black";
      }
    }
  };

  const renderEdges = (graph) => {
    const connectedEdges = [];

    for (let i = 0; i < vertex; i++) {
      for (let j = 0; j < vertex; j++) {
        if (graph[i][j] === 1) {
          connectedEdges.push(
            <Arrow
              points={[
                randomGraphStyle[i].left,
                randomGraphStyle[i].top,
                randomGraphStyle[j].left,
                randomGraphStyle[j].top,
              ]}
              fill={getArrowColor(i)}
              stroke={getArrowColor(i)}
            />
          );
        }
      }
    }
    return connectedEdges;
  };

  const getCircleColor = (i) => {
    if (showReverse) {
      if (i === 0) {
        return "#08f26e";
      } else {
        return reachedVertexReverse.includes(i) ? "#08f26e" : "red";
      }
    } else {
      if (i === 0) {
        return "#08f26e";
      } else {
        return reachedVertex.includes(i) ? "#08f26e" : "red";
      }
    }
  };

  const renderVertex = (graph) => {
    const vertexes = graph.map((vertex, i) => (
      <>
        <Circle
          radius={5}
          x={randomGraphStyle[i].left}
          y={randomGraphStyle[i].top}
          stroke="black"
          fill={getCircleColor(i)}
        />
        <Text
          x={randomGraphStyle[i].left - 3}
          y={randomGraphStyle[i].top + 10}
          text={i}
          fontSize={20}
          fontStyle="bold"
        />
      </>
    ));

    return vertexes;
  };
  const renderGraph = () => (
    <>
      {!isFinishedGraph && (
        <button onClick={() => generateGraphStyle(vertex)}>Reordenar</button>
      )}
      <Stage width={900} height={900}>
        <Layer>
          {renderEdges(graph_matrix)}
          {renderVertex(graph_matrix)}
        </Layer>
      </Stage>
    </>
  );

  const renderReverseGraph = () => (
    <>
      <Stage width={900} height={900}>
        <Layer>
          {renderEdges(reverse_graph_matrix)}
          {renderVertex(reverse_graph_matrix)}
        </Layer>
      </Stage>
    </>
  );
  const renderGraphInputs = () => (
    <div style={{ marginRight: 100 }}>
      <h3>{`Número restantes de arestas: ${edgesCount}`}</h3>
      <button onClick={() => finishGraph()}>Finalizar Grafo</button>
      {graph_matrix.map((grapth_vertex, i) => (
        <div key={i}>
          <p>Vértice número {i}</p>
          <div>
            <input onChange={(e) => setSelectedVertex(e.target.value)} />
            <button onClick={() => connectVertex(i, selectedVertex)}>
              Conectar
            </button>
            <button
              onClick={() => connectVertexBothDirection(i, selectedVertex)}
            >
              Conexão dupla
            </button>
            <button onClick={() => removeConnection(i, selectedVertex)}>
              Desconectar
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGraphInfoForm = () => (
    <div>
      <input
        type="text"
        placeholder="Numero de vértices"
        onChange={(e) => {
          setVertex(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Numero arestas"
        onChange={(e) => {
          setEdges(e.target.value);
          setEdgesCount(e.target.value);
        }}
      />

      <button onClick={createGraph}>Enviar</button>
    </div>
  );

  const renderShowReverseButton = () => (
    <button onClick={() => setShowReverse(!showReverse)}>
      Mostrar inversa
    </button>
  );

  return (
    <div>
      {!graph_matrix && renderGraphInfoForm()}
      {graph_matrix && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          {!isFinishedGraph && renderGraphInputs()}
          {isFinishedGraph && renderShowReverseButton()}
          {showReverse ? renderReverseGraph() : renderGraph()}
        </div>
      )}
    </div>
  );
}

export default App;
