
import { createSlice } from '@reduxjs/toolkit';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';


function createNode({ id, rfType, label, position, kind }) {

  let type = rfType || 'default';
  if (kind === 'start') type = 'input';
  if (kind === 'process') type = 'default';
  if (kind === 'decision') type = 'decision';
  if (kind === 'custom') type = 'customPink';
  if (kind === 'stop') type = 'stop';

  return {
    id,
    type,
    position: position || { x: 0, y: 0 },
    data: {
      label: label || (kind ? kind[0].toUpperCase() + kind.slice(1) : 'Node'),
      description: '',
    },
 
  };
}

const initialState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
  counter: 1, 
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    // React Flow -> Redux
    nodesChanged(state, action) {
      state.nodes = applyNodeChanges(action.payload, state.nodes);
    },
    edgesChanged(state, action) {
      state.edges = applyEdgeChanges(action.payload, state.edges);
    },

    // When user draws an edge on the canvas
    connectEdge(state, action) {
      const { source, sourceHandle, targetHandle } = action.payload || {};

      // Auto labels for Decision left/right branches
      let label;
      if (sourceHandle === 's-right' || targetHandle === 't-right') label = 'Yes';
      if (sourceHandle === 's-left' || targetHandle === 't-left') label = 'No';

      // Enforce only 1 branch per side for Decision (left or right)
      if (sourceHandle === 's-left' || sourceHandle === 's-right') {
        state.edges = state.edges.filter(
          (e) => !(e.source === source && e.sourceHandle === sourceHandle)
        );
      }

      // Add edge with STEP type (tree-like), no animation by default
      state.edges = addEdge(
        { ...action.payload, type: 'step', animated: false, label },
        state.edges
      );
    },

    addNode(state, action) {
      const { rfType, label, position, kind } = action.payload || {};
      const id = `n${state.counter++}`;
      const node = createNode({ id, rfType, label, position, kind });
      state.nodes.push(node);
      state.selectedNodeId = id;
    },

    selectNode(state, action) {
      state.selectedNodeId = action.payload || null;
    },

    updateSelectedNode(state, action) {
      const patch = action.payload?.patch || {};
      const idx = state.nodes.findIndex((n) => n.id === state.selectedNodeId);
      if (idx === -1) return;

      const node = state.nodes[idx];
      state.nodes[idx] = {
        ...node,
        data: {
          ...node.data,
          ...patch,
        },
      };
    },

    deleteSelectedNode(state) {
      const id = state.selectedNodeId;
      if (!id) return;
   
      state.nodes = state.nodes.filter((n) => n.id !== id);
      
      state.edges = state.edges.filter((e) => e.source !== id && e.target !== id);
      state.selectedNodeId = null;
    },

  
    setAll(state, action) {
      const nextNodes = action.payload?.nodes ?? [];
      const nextEdges = action.payload?.edges ?? [];

      state.nodes = nextNodes;
      state.edges = nextEdges.map((e) => ({
        type: 'step',          
        animated: false,
        ...e,                  
        type: 'step',          
      }));

      
      state.selectedNodeId = null;

    
      const numericIds = state.nodes
        .map((n) => Number(String(n.id).replace(/\D/g, '')))
        .filter((n) => !Number.isNaN(n));
      const maxId = numericIds.length ? Math.max(...numericIds) : 0;
      state.counter = Math.max(state.counter, maxId + 1);
    },
  },
});

export const {
  nodesChanged,
  edgesChanged,
  connectEdge,
  addNode,
  selectNode,
  updateSelectedNode,
  deleteSelectedNode,
  setAll,
} = workflowSlice.actions;

export default workflowSlice.reducer;
