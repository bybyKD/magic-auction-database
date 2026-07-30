import React, { useState, useEffect } from 'react';
import { auctionBrain } from '../ml/AuctionBrain';
import { datasetManager } from '../ml/DatasetManager';
import './ResultsPanel.css';

const TOTAL_EPOCHS = 100;

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
    setLoss(null);
    await auctionBrain.train((currentEpoch, currentLoss) => {
      setEpoch(currentEpoch + 1);
      setLoss(currentLoss);
    });
    setIsTraining(false);
  };

  const handleClear = () => {
    datasetManager.clearDataset();
    setTrainingDataCount(datasetManager.getDataset().length);
    auctionBrain.isTrained = false;
    setLoss(null);
  };

  const progress = isTraining ? (epoch / TOTAL_EPOCHS) * 100 : 0;

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
              {isTraining ? `Training... (${epoch}/${TOTAL_EPOCHS})` : 'Train Neural Network'}
            </button>
            <button className="guide-btn" onClick={handleClear} disabled={isTraining} style={{ background: '#444' }}>
              Reset to Factory Defaults
            </button>
          </div>
          {isTraining && (
            <div style={{ marginTop: '12px' }}>
              <div style={{
                height: '8px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #3b82f6, #a855f7)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>
                Epoch {epoch} — Loss: {loss ? (loss * 100).toFixed(4) : '...'}%
              </p>
            </div>
          )}
        </div>

        {!isTraining && loss !== null && (
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
