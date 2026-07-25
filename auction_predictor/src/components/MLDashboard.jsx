import React, { useState, useEffect } from 'react';
import { auctionBrain } from '../ml/AuctionBrain';
import { datasetManager } from '../ml/DatasetManager';
import './ResultsPanel.css'; // Reuse existing styles

const MLDashboard = ({ onClose }) => {
  const [trainingDataCount, setTrainingDataCount] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(null);

  useEffect(() => {
    setTrainingDataCount(datasetManager.getDataset().length);
  }, []);

  const handleTrain = async () => {
    setIsTraining(true);
    await auctionBrain.train((currentEpoch, currentLoss) => {
      setEpoch(currentEpoch);
      setLoss(currentLoss);
    });
    setIsTraining(false);
  };

  const handleClear = () => {
    datasetManager.clearDataset();
    setTrainingDataCount(datasetManager.getDataset().length);
    auctionBrain.isTrained = false;
  };

  return (
    <div className="guide-modal-overlay">
      <div className="guide-modal" style={{ maxWidth: '600px' }}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">🤖 AI Training Dashboard</h2>
        
        <div className="guide-section">
          <h3>Dataset Status</h3>
          <p>Your AI currently has <strong>{trainingDataCount}</strong> matches in its local memory.</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button className="guide-btn color-btn" onClick={handleTrain} disabled={isTraining}>
              {isTraining ? `Training... (Epoch ${epoch})` : 'Train Neural Network'}
            </button>
            <button className="guide-btn" onClick={handleClear} disabled={isTraining} style={{ background: '#444' }}>
              Reset to Factory Defaults
            </button>
          </div>
        </div>

        {loss !== null && (
          <div className="guide-section" style={{ background: 'rgba(0, 255, 128, 0.1)', border: '1px solid #00ff80' }}>
            <h3 style={{ color: '#00ff80' }}>✓ Training Complete</h3>
            <p>Final Loss (Mean Squared Error): {(loss * 100).toFixed(4)}%</p>
            <p>The AI is now actively predicting opponent bids on your main board!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MLDashboard;
