import React from 'react';
import commandersData from '../data/commanders.json';
import './CommanderAssistant.css';

const CommanderAssistant = ({ selectedCommander, currentRound }) => {
  if (selectedCommander === 'None') {
    return null;
  }

  const commander = commandersData.find(c => c.name === selectedCommander);
  if (!commander) return null;

  return (
    <div className="commander-assistant-panel glass-panel">
      <div className="commander-header">
        <h3 className="commander-name">{commander.name}</h3>
        <span className="commander-title">{commander.title}</span>
      </div>
      <div className="commander-round-info">
        <span className="round-badge">Round {currentRound}</span>
        <p className="commander-desc">{commander.description}</p>
      </div>
    </div>
  );
};

export default CommanderAssistant;
