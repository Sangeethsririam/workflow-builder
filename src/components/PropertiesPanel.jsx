import React from 'react';

export default function PropertiesPanel({ selectedNode, onChange, onDelete }) {
  if (!selectedNode) {
    return (
      <aside className="panel-right">
        <div className="panel-title">Properties</div>
        <p className="muted">Select a node to edit its properties.</p>
      </aside>
    );
  }
  const { data } = selectedNode;
  return (
    <aside className="panel-right">
      <div className="panel-title">Properties</div>
      <div className="field">
        <label>Label</label>
        <input
          value={data.label || ''}
          onChange={(e) => onChange({ label: e.target.value })}
        />
      </div>
      <div className="field">
        <label>Description</label>
        <textarea
          rows={4}
          value={data.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>
      <button className="danger" onClick={onDelete}>Delete Node</button>
    </aside>
  );
}
