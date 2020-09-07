import React, { useState } from "react";
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
  const [destinyVertex, setDestinyVertex] = useState(0);
  const [originVertex, setOriginVertex] = useState(0);
  const [showReverse, setShowReverse] = useState(false);
  const [reachedVertex, setReachedVertex] = useState([]);
  const [reachedVertexReverse, setReachedVertexReverse] = useState([]);
  const [isFinishedGraph, setIsFinishedGraph] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const [randomGraphStyle, setRandomStyle] = useState([]);

  function createGraph() {
    if (vertex <= 0) {
      //MENSAGEM NÃO VERTICE NÃO PODE SER MENOR QUE 0
      alert("Número de vétices inválido!");
      return;
    }
    if (edges > vertex * (vertex - 1) && edges > 0) {
      //REGRA: ARESTAS <= VERTICES * (VERTICES-1)
      alert(
        "Número de artestas inválido!\n Lembre: nArestas é menor ou igual à nVertices*(nVertices-1)"
      );
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

  function connectVertex(origin, destination) {
    const isAlredyConnected = verifyConnectivity(origin, destination);
    if (isAlredyConnected) {
      alert("Esses vértices já estão conectados");
      return;
    }

    if (origin === destination) {
      alert("Um vértice não pode se ligar a ele mesmo");
      return;
    }
    let newGraph = graph_matrix;
    if (destination < graph_matrix.length) {
      newGraph[origin][destination] = 1;
      setGraph_matrix(newGraph);
      setEdgesCount(edgesCount - 1);
      setDestinyVertex(0);
      setOriginVertex(0);
    } else {
      alert("Essa posição não existe!");
    }
  }

  function connectVertexBothDirection(origin, destination) {
    let newGraph = graph_matrix;

    if (origin === destination) {
      alert("Não pode ligar nele mesmo");
      return;
    }
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
      setDestinyVertex(0);
      setOriginVertex(0);
    } else {
      alert("POSIÇÃO NÃO EXISTENTE");
    }
  }

  function removeConnection(origin, destination) {
    let newGraph = graph_matrix;
    let aux = edgesCount;
    const isAlredyConnected = verifyConnectivity(origin, destination);
    if (!isAlredyConnected) {
      alert("Vétices não conectados, não é possível desconectá-los.");
      return;
    }
    if (destination < graph_matrix.length) {
      newGraph[origin][destination] = 999;
      setGraph_matrix(newGraph);
      aux++;
      setEdgesCount(aux);
    } else {
      alert("POSIÇÃO NÃO EXISTENTE");
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
      setResultMessage("Este Grafo é fortemente conectado!");
    } else {
      setResultMessage("Este Grafo não é fortemente conectado.");
    }
    return;
  }

  const getArrowColor = (i) => {
    if (showReverse) {
      if (isFinishedGraph) {
        if (i === 0) {
          return "#08f26e";
        }
        return reachedVertexReverse.includes(i) ? "#08f26e" : "red";
      } else {
        return "black";
      }
    } else {
      if (isFinishedGraph) {
        if (i === 0) {
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
    <div className="graph-container">
      {!isFinishedGraph && (
        <div
          className="reorderButton"
          onClick={() => generateGraphStyle(vertex)}
        >
          Reordenar grafo
        </div>
      )}
      <Stage width={900} height={900} className="graphView">
        <Layer>
          {renderEdges(graph_matrix)}
          {renderVertex(graph_matrix)}
        </Layer>
      </Stage>
    </div>
  );

  const renderReverseGraph = () => (
    <>
      <Stage width={900} height={900} className="graphView">
        <Layer>
          {renderEdges(reverse_graph_matrix)}
          {renderVertex(reverse_graph_matrix)}
        </Layer>
      </Stage>
    </>
  );
  const renderGraphInputs = () => (
    <div className="graphInputContainer">
      <h3>{`Total de arestas: ${edgesCount}`}</h3>

      <div className="graphInputs">
        <div>
          <label>Vértice origem</label>
          <select
            value={originVertex}
            onChange={(e) => {
              setOriginVertex(e.target.value);
            }}
          >
            {graph_matrix.map((graph, i) => (
              <option value={i} label={i} />
            ))}
          </select>
          <label>Vértice destino</label>
          <select
            value={destinyVertex}
            onChange={(e) => {
              setDestinyVertex(e.target.value);
            }}
          >
            {graph_matrix.map((graph, i) => (
              <option value={i} label={i} />
            ))}
          </select>
        </div>
        <button onClick={() => connectVertex(originVertex, destinyVertex)}>
          Conectar
        </button>
        <button
          onClick={() =>
            connectVertexBothDirection(originVertex, destinyVertex)
          }
        >
          Conexão dupla
        </button>
        <button onClick={() => removeConnection(originVertex, destinyVertex)}>
          Desconectar
        </button>
      </div>

      <button onClick={() => finishGraph()}>Testar conectividade</button>
    </div>
  );

  const renderGraphInfoForm = () => (
    <div className="inputFormContainer">
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

      <div className="send-button" onClick={createGraph}>
        Enviar
      </div>
    </div>
  );

  const renderShowReverseButton = () => (
    <button onClick={() => setShowReverse(!showReverse)}>
      Mostrar inversa
    </button>
  );

  const renderResultMessage = () => <h1>{resultMessage}</h1>;

  const renderPageHeader = () => (
    <>
      <h1>Grafo Conectado</h1>
      <div>
        Esse projeto testa a conectividade de seu grafo! Entre o número de
        vértice e de arestas, conecte os vérices e teste a conectividade.
      </div>
    </>
  );

  return (
    <div className="container">
      {!isFinishedGraph && renderPageHeader()}
      {!graph_matrix && renderGraphInfoForm()}
      {graph_matrix && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {isFinishedGraph && renderResultMessage()}
          {!isFinishedGraph && renderGraphInputs()}
          {isFinishedGraph && renderShowReverseButton()}
          {showReverse ? renderReverseGraph() : renderGraph()}
        </div>
      )}
    </div>
  );
}

export default App;
