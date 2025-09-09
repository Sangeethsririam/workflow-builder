import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  ConnectionLineType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  nodesChanged,
  edgesChanged,
  connectEdge,
  addNode,
  selectNode,
  updateSelectedNode,
  deleteSelectedNode,
  setAll,
} from './features/workflowSlice.js';
import { saveWorkflow, loadWorkflow } from './services/mockApi.js';
import Palette from './components/Palette.jsx';
import PropertiesPanel from './components/PropertiesPanel.jsx';
import Toolbar from './components/Toolbar.jsx';
import DecisionNode from './components/DecisionNode.jsx';
import CustomPinkNode from './components/CustomPinkNode.jsx';
import StopNode from './components/StopNode.jsx';

const nodeTypes = {
  decision: DecisionNode,
  customPink: CustomPinkNode,
  stop: StopNode,
};


function InnerFlow({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onSelectionChange,
  dispatch,
  addNodeAction,
}) {
  const { screenToFlowPosition } = useReactFlow();

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData('application/reactflow');
      if (!raw) return;
      const { rfType, label, kind } = JSON.parse(raw);
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      dispatch(addNodeAction({ rfType, label, position, kind }));
    },
    [dispatch, addNodeAction, screenToFlowPosition]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <main className="canvas" style={{ flex: 1, minHeight: 0 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        nodesConnectable
        elementsSelectable
        connectionLineType={ConnectionLineType.Step}
        fitView
        style={{ width: '100%', height: '100%' }}
      >
        <MiniMap pannable zoomable />
        <Controls />
        <Background variant="dots" gap={16} size={1} />
      </ReactFlow>
    </main>
  );
}

export default function App() {
  const dispatch = useDispatch();
  const nodes = useSelector((s) => s.workflow.nodes);
  const edges = useSelector((s) => s.workflow.edges);
  const selectedNodeId = useSelector((s) => s.workflow.selectedNodeId);
  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  // RF <-> Redux
  const onNodesChange = useCallback(
    (changes) => dispatch(nodesChanged(changes)),
    [dispatch]
  );
  const onEdgesChange = useCallback(
    (changes) => dispatch(edgesChanged(changes)),
    [dispatch]
  );
  const onConnect = useCallback(
    (params) => dispatch(connectEdge(params)),
    [dispatch]
  );

  // Palette drag support
  const onDragStart = useCallback((event, item) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(item));
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  // Selection -> Redux
  const onSelectionChange = useCallback(
    ({ nodes }) => {
      dispatch(selectNode(nodes?.[0]?.id || null));
    },
    [dispatch]
  );

  // Properties panel handlers
  const onPropChange = useCallback(
    (patch) => dispatch(updateSelectedNode({ patch })),
    [dispatch]
  );
  const onDelete = useCallback(() => dispatch(deleteSelectedNode()), [dispatch]);

  // Persistence
  const doSave = useCallback(async () => {
    const res = await saveWorkflow(nodes, edges);
    alert('Saved at ' + new Date(res.savedAt).toLocaleString());
  }, [nodes, edges]);

  const doLoad = useCallback(async () => {
    const res = await loadWorkflow();
    if (!res) return alert('Nothing saved yet.');
    dispatch(setAll({ nodes: res.nodes, edges: res.edges }));
  }, [dispatch]);

  // Called by Toolbar after Dagre computes positions
  const onApplyLayout = useCallback(
    ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
      dispatch(setAll({ nodes: layoutedNodes, edges: layoutedEdges }));
    },
    [dispatch]
  );

  // Safe Delete key (never trigger when typing)
  useEffect(() => {
    const onKey = (e) => {
      const ae = document.activeElement;
      const isTyping =
        ae &&
        (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable);

      if (!isTyping && e.key === 'Delete') {
        e.preventDefault();
        onDelete();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDelete]);

  return (
    <div className="app-root" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Toolbar now receives nodes/edges and a layout applier */}
      <Toolbar
        onSave={doSave}
        onLoad={doLoad}
        nodes={nodes}
        edges={edges}
        onApplyLayout={onApplyLayout}
      />

      <div className="layout" style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Palette onDragStart={onDragStart} />
        <ReactFlowProvider>
          <InnerFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            dispatch={dispatch}
            addNodeAction={addNode}
          />
        </ReactFlowProvider>
        <PropertiesPanel
          selectedNode={selectedNode}
          onChange={onPropChange}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
