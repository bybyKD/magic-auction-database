import React from 'react';
import gameRules from '../data/game_rules.json';
import commandersData from '../data/commanders.json';
import './StrategyGuide.css';

const StrategyGuide = ({ onClose }) => {
  return (
    <div className="strategy-modal-overlay" onClick={onClose}>
      <div className="strategy-modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <h2 className="modal-title">📖 Magic Auction Strategy Guide</h2>
        
        <section className="guide-section">
          <h3>The Golden Rules of Bidding</h3>
          <p>Winning a bid does NOT mean you won. If you overspend on an item, you will ruin your economy and lose the game. Magic Auction is about <strong>Return on Investment (ROI)</strong>.</p>
          <div className="hero-highlight">
            <h4>⭐ Hero Figurines Priority</h4>
            <p>{gameRules.metaPriorities.heroFigurines.reason} They are highly contested and one of the only items worth overbidding the safe threshold for.</p>
          </div>
          <div className="hero-highlight" style={{ borderLeftColor: '#ff6b6b', background: 'rgba(255, 107, 107, 0.1)' }}>
            <h4 style={{ color: '#ff6b6b' }}>⚡ The Tiebreaker Rule</h4>
            <p>If two players place the exact same bid amount on a board, <strong>the player who locked in their bid first wins</strong>. Calculate your safe bid and lock it in early to win tiebreakers!</p>
          </div>
        </section>

        <section className="guide-section">
          <h3>The 5-Round Instant Win Mechanics</h3>
          <p>You can guarantee an item if your bid exceeds a specific multiplier of the second-highest bid, depending on the round.</p>
          <ul className="round-rules-list">
            {Object.entries(gameRules.rounds).map(([roundNum, data]) => (
              <li key={roundNum}>
                <strong>Round {roundNum}:</strong> {data.description} <span className="multiplier-tag">{data.instantWinMultiplier}x Multiplier</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="guide-section">
          <h3>Commander Auction Meta</h3>
          <p>Commanders function entirely differently in Magic Auction. Use these skills to gain information and leverage your economy.</p>
          <div className="commanders-grid">
            {commandersData.map(cmd => (
              <div key={cmd.name} className="commander-card">
                <div className="cmd-header">
                  <strong>{cmd.name}</strong> 
                  <span className="cmd-title">{cmd.title}</span>
                </div>
                <p className="cmd-desc">{cmd.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StrategyGuide;
