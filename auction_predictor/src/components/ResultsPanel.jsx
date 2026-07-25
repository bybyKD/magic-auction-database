import React, { useState } from 'react';
import { TYPE_ICONS } from '../logic/constants';
import './ResultsPanel.css';

const ResultsPanel = ({
  appraisals,
  hasKnownBlocks,
  currentRound,
  totalRevealedEV,
  hiddenBoardEV,
  totalBoardEV,
  paintedBlocksCount,
  remainingGenericHiddenBlocks,
  instantWinMultiplier,
  instantWinBid,
  aiPredictedBid,
  aiConfidence,
  commanderInfo,
  selectedCommander,
  suggestions,
  groupConfidence,
}) => {
  const [expandedIndices, setExpandedIndices] = useState(new Set());

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  if (!hasKnownBlocks) {
    return (
      <div className="empty-results">
        <div className="empty-icon">🎨</div>
        <h3>No items painted</h3>
        <p>Load your brush from the left and paint the grid to see predictions.</p>
      </div>
    );
  }

  if (appraisals.length === 0) {
    return (
      <div className="empty-results">
        <div className="empty-icon">🔍</div>
        <h3>Calculating...</h3>
        <p>Waiting for valid items...</p>
      </div>
    );
  }

  const toggleExpand = (index) => {
    const newSet = new Set(expandedIndices);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setExpandedIndices(newSet);
  };

  return (
    <div className="results-container">
      <div className="master-dashboard">
        <div className="master-header">
          <h3>Master Board Summary</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {selectedCommander && selectedCommander !== 'None' && commanderInfo && (
              <span
                className="commander-badge"
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: `${commanderInfo.infoScore > 0.3 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
                  border: `1px solid ${commanderInfo.infoScore > 0.3 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  color: commanderInfo.infoScore > 0.3 ? '#10b981' : '#ef4444',
                }}
              >
                {selectedCommander} — {Math.round(commanderInfo.infoScore * 100)}% Info
              </span>
            )}
            <span className="group-count-badge">
              {appraisals.length} Item Group(s)
            </span>
          </div>
        </div>

        <div className="master-stats-grid">
          <div className="master-stat-box">
            <span className="stat-label">REVEALED VALUE</span>
            <div className="stat-value highlight-gold">
              <span className="gold-icon">💰</span>{' '}
              {formatPrice(totalRevealedEV)}
            </div>
            <span className="stat-subtext">
              {paintedBlocksCount} blocks painted
            </span>
          </div>

          <div className="master-stat-box">
            <span className="stat-label">HIDDEN ESTIMATE</span>
            <div className="stat-value highlight-gray">
              <span className="gold-icon">💰</span>{' '}
              {formatPrice(hiddenBoardEV)}
            </div>
            <span className="stat-subtext">
              {remainingGenericHiddenBlocks} empty blocks
            </span>
          </div>

          <div className="master-stat-box full-width">
            <span className="stat-label">TOTAL BOARD EXPECTED VALUE</span>
            <div className="stat-value highlight-gold large-text">
              <span className="gold-icon">💰</span>{' '}
              {formatPrice(totalBoardEV)}
            </div>
          </div>

          <div
            className="master-stat-box full-width"
            style={{ display: 'flex', gap: '20px' }}
          >
            <div style={{ flex: 1 }}>
              <span className="stat-label">
                MATH INSTANT WIN (Round {currentRound})
              </span>
              <div className="stat-value highlight-green large-text">
                <span className="gold-icon">💰</span>{' '}
                {formatPrice(instantWinBid)}
              </div>
              <span className="stat-subtext">
                Requires {instantWinMultiplier}x mathematical baseline
              </span>
            </div>

            <div
              style={{
                flex: 1,
                borderLeft: '1px solid rgba(255,255,255,0.1)',
                paddingLeft: '20px',
              }}
            >
              <span className="stat-label">AI PREDICTED OPPONENT BID</span>
              <div
                className="stat-value large-text"
                style={{ color: aiPredictedBid ? '#b581ff' : '#888' }}
              >
                <span className="gold-icon">💰</span>{' '}
                {aiPredictedBid
                  ? formatPrice(Math.floor(aiPredictedBid))
                  : 'Train AI First'}
              </div>
              <span className="stat-subtext">
                {aiPredictedBid
                  ? 'Based on actual human behavior dataset'
                  : 'Click AI Dashboard above to train'}
              </span>
            </div>

            <div
              style={{
                flex: 1,
                borderLeft: '1px solid rgba(255,255,255,0.1)',
                paddingLeft: '20px',
              }}
            >
              <span className="stat-label">OVERALL AI CONFIDENCE</span>
              <div
                className="stat-value large-text"
                style={{
                  color:
                    aiConfidence !== null
                      ? aiConfidence > 75
                        ? '#00ff80'
                        : aiConfidence > 40
                        ? '#ffb703'
                        : '#ff4d4d'
                      : '#888',
                }}
              >
                {aiConfidence !== null ? `${aiConfidence}%` : '---'}
              </div>
              <span className="stat-subtext">
                {aiConfidence !== null ? 'Based on historical accuracy' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="divider">
        <span className="divider-text">INDIVIDUAL GROUP BREAKDOWNS</span>
      </div>

      {suggestions && suggestions.length > 0 && (
        <div className="suggestions-section">
          <h4 className="suggestions-title">💡 Suggestions</h4>
          <div className="suggestions-list">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className={`suggestion-item suggestion-${s.priority}`}
              >
                <span className={`suggestion-dot ${s.color ? s.color.toLowerCase() : ''}`}></span>
                <span>{s.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {appraisals.map((appraisal, index) => {
        const isExpanded = expandedIndices.has(index);
        const {
          kb,
          ev,
          safeBid,
          heroProb,
          heroSnipe,
          totalPlacements,
          possibleItems,
          group,
          confidence,
        } = appraisal;

        let headerText = 'Unknown Square';
        if (kb.color !== 'All' && kb.type !== 'All') {
          headerText = `${kb.color} ${kb.type}`;
        } else if (kb.color !== 'All') {
          headerText = `${kb.color} Item`;
        } else if (kb.type !== 'All') {
          headerText = `${kb.type}`;
        }

        const icon = TYPE_ICONS[kb.type] || '❔';

        return (
          <div key={index} className="appraisal-block">
            <div className="appraisal-header">
              <div className="header-left">
                <span className="appraisal-icon">{icon}</span>
                <div className="header-title-area">
                  <h4>{headerText}</h4>
                  <span className="location-tag">
                    {group.length > 1
                      ? `Group of ${group.length} squares`
                      : `Row ${kb.r + 1}, Col ${kb.c + 1}`}
                  </span>
                  {kb.size !== 'All' && (
                    <span className="size-tag-mini">{kb.size}</span>
                  )}
                </div>
              </div>
              <div className="header-right">
                {groupConfidence && groupConfidence.has(index) && (
                  <span
                    className="confidence-indicator"
                    style={{
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      marginRight: '8px',
                      background:
                        groupConfidence.get(index).level === 'high'
                          ? 'rgba(16,185,129,0.15)'
                          : groupConfidence.get(index).level === 'medium'
                          ? 'rgba(245,158,11,0.15)'
                          : 'rgba(239,68,68,0.15)',
                      color:
                        groupConfidence.get(index).level === 'high'
                          ? '#10b981'
                          : groupConfidence.get(index).level === 'medium'
                          ? '#f59e0b'
                          : '#ef4444',
                    }}
                  >
                    {groupConfidence.get(index).confidence}%
                  </span>
                )}
                <span className="placement-count">
                  {formatPrice(totalPlacements)} Possibilities
                </span>
              </div>
            </div>

            {totalPlacements === 0 ? (
              <div className="no-matches">
                <p>No valid items fit in this spot with these constraints.</p>
              </div>
            ) : (
              <div className="appraisal-content">
                <div className="main-stats">
                  <div className="stat-card">
                    <span className="stat-label">MATH CONFIDENCE</span>
                    <span className="stat-value">{confidence}%</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">EXPECTED VALUE</span>
                    <span className="stat-value">{formatPrice(ev)}</span>
                  </div>
                  <div className="stat-card highlight">
                    <span className="stat-label">REC. BID</span>
                    <span className="stat-value">{formatPrice(safeBid)}</span>
                  </div>
                </div>

                {heroProb > 0 && (
                  <div className="hero-alert">
                    <div className="hero-alert-icon">⚠️</div>
                    <div className="hero-alert-text">
                      <span className="hero-title">
                        Hero Figurine Chance: {heroProb.toFixed(1)}%
                      </span>
                      <span className="hero-desc">
                        Max potential value: {formatPrice(heroSnipe)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="expand-section">
                  <button
                    className="expand-btn"
                    onClick={() => toggleExpand(index)}
                  >
                    {isExpanded
                      ? 'Hide Possible Items ▲'
                      : 'View Possible Items ▼'}
                  </button>

                  {isExpanded && (
                    <div className="items-list">
                      {possibleItems.slice(0, 100).map((item, i) => (
                        <div key={i} className="item-row">
                          <div className="item-info">
                            <span className="item-name">{item.name}</span>
                            <span className="item-details">
                              {item.shape} • {item.validPlacements} placements
                            </span>
                          </div>
                          <span className="item-price">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      ))}
                      {possibleItems.length > 100 && (
                        <div className="items-more">
                          ...and {possibleItems.length - 100} more items
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ResultsPanel;
