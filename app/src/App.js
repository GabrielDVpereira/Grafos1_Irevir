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
  const [selectedVertex, setSelectedVertex] = useState(null);
  
  const randomGraphStyle = useRef([]);
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
    randomGraphStyle.current = styleArray;
  };

  function calculateVertexDistance(origin, destination) {
    const vertex1 = randomGraphStyle.current[origin];
    const vertex2 = randomGraphStyle.current[destination];
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

  function removeConnection(origin, destination){
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

  function finishGraph(){
    let graph = graph_matrix;
    console.log("Grafo",graph);
    let isConnected = verifyStrongConnectivity(graph, vertex);
    if(isConnected){
      console.log("Este Grafo é fortemente conectado!")
    } else {
      console.log("Este Grafo não é fortemente conectado");
    }
    return;
  }

  const renderEdges = () => {
    const connectedEdges = [];

    for (let i = 0; i < vertex; i++) {
      for (let j = 0; j < vertex; j++) {
        if (graph_matrix[i][j] === 1) {
          connectedEdges.push(
            <Arrow
              points={[
                randomGraphStyle.current[i].left,
                randomGraphStyle.current[i].top,
                randomGraphStyle.current[j].left,
                randomGraphStyle.current[j].top,
              ]}
              fill="black"
              stroke="black"
            />
          );
        }
      }
    }
    return connectedEdges;
  };
  const renderVertex = () => {
    const vertexes = graph_matrix.map((vertex, i) => (
      <>
        <Circle
          radius={5}
          x={randomGraphStyle.current[i].left}
          y={randomGraphStyle.current[i].top}
          stroke="black"
          fill="red"
        />
        <Text
          x={randomGraphStyle.current[i].left - 3}
          y={randomGraphStyle.current[i].top + 10}
          text={i}
          fontSize={20}
          fontStyle="bold"
        />
      </>
    ));

    return vertexes;
  };
  const renderGraph = () => (
    <Stage width={900} height={900}>
      <Layer>
        {renderEdges()}
        {renderVertex()}
      </Layer>
    </Stage>
  );
  const renderGraphInputs = () => (
    
    <div style={{ marginRight: 100 }}>
      <h3>{`Número restantes de arestas: ${edgesCount}`}</h3>
      <button onClick={() => finishGraph()}>
        Finalizar Grafo
      </button>
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
          {renderGraphInputs()}
          {renderGraph()}
        </div>
      )}
    </div>
  );
}

export default App;
