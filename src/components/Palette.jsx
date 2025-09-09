import React from 'react';


export default function Palette({ onDragStart }) {
  const Item = ({ color, label, payload }) => (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, payload)}
      style={{
        border: `2px solid ${color}`,
        borderRadius: 12,
        padding: '8px 16px',
        marginBottom: 10,
        cursor: 'grab',
        userSelect: 'none',
        background: '#fff',
        width: 160,
      }}
    >
      {label}
    </div>
  );

  return (
    <aside style={{ width: 220, padding: 16, borderRight: '1px solid #eee' }}>
      <h4 style={{ margin: '8px 0 12px' }}>Palette</h4>

      <Item
        color="#22c55e"
        label="Start"
        payload={{ rfType: 'input', label: 'Start', kind: 'start' }}
      />
      <Item
        color="#3b82f6"
        label="Process"
        payload={{ rfType: 'default', label: 'Process', kind: 'process' }}
      />
      <Item
        color="#f97316"
        label="Decision"
        payload={{ rfType: 'decision', label: 'Decision', kind: 'decision' }}
      />
      <Item
        color="#ec4899"
        label="Custom"
        payload={{ rfType: 'customPink', label: 'Custom', kind: 'custom' }}
      />
      {}
      <Item
        color="#22c55e"
        label="Stop"
        payload={{ rfType: 'stop', label: 'Stop', kind: 'stop' }}
      />
    </aside>
  );
}
