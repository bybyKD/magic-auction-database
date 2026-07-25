const STORAGE_KEY = 'magic_auction_ml_dataset';

export const HOUSES = {
  'Eruditio': 0.25,
  'Dawnlight': 0.5,
  'World': 0.75,
  'Cosmic': 1.0
};

// Normalize monetary values based on a very high ceiling (5M)
export const MAX_MONEY = 5000000;

export const normalizeMoney = (value) => {
  return Math.min(1.0, Math.max(0.0, value / MAX_MONEY));
};

export const denormalizeMoney = (value) => {
  return value * MAX_MONEY;
};

// Generate realistic dummy data based on common "YouTube Meta" strategies:
// Round 1-2: People bid highly aggressively (often 70-80% of EV)
// Round 3-4: People bid more cautiously (60-70% of EV)
// Round 5: People bid strictly just to win (often 90% of EV)
// Hero items push bids much higher.
const generateDummyData = () => {
  const data = [];
  
  const addMatch = (round, house, paintedBlocks, revealedEV, hiddenEV, winningBid, actualValue) => {
    data.push({
      input: {
        round: round / 5.0,
        house: HOUSES[house] || 0.5,
        paintedBlocks: paintedBlocks / 48.0,
        revealedEV: normalizeMoney(revealedEV),
        hiddenEV: normalizeMoney(hiddenEV)
      },
      output: {
        bid: normalizeMoney(winningBid),
        actualValue: normalizeMoney(actualValue)
      }
    });
  };

  // Dummy data simulating different board states
  // R1 Eruditio
  addMatch(1, 'Eruditio', 12, 4500, 10000, 9500, 15000); 
  addMatch(1, 'Eruditio', 4, 1500, 15000, 3500, 11000);
  // R3 Eruditio
  addMatch(3, 'Eruditio', 24, 12000, 5000, 11000, 16000); 
  // R5 Eruditio
  addMatch(5, 'Eruditio', 48, 25000, 0, 22000, 25000); 

  // World (High values)
  addMatch(1, 'World', 10, 80000, 400000, 420000, 550000);
  addMatch(2, 'World', 20, 150000, 250000, 250000, 380000);
  addMatch(3, 'World', 35, 450000, 100000, 520000, 500000);
  addMatch(5, 'World', 48, 1200000, 0, 1100000, 1200000);
  
  // Cosmic (Very High values)
  addMatch(1, 'Cosmic', 8, 150000, 1500000, 1600000, 2100000);
  addMatch(4, 'Cosmic', 40, 1100000, 200000, 950000, 1400000);
  addMatch(5, 'Cosmic', 48, 3500000, 0, 3100000, 3500000);

  return data;
};

export class DatasetManager {
  constructor() {
    this.dataset = this.loadDataset();
  }

  loadDataset() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load ML dataset", e);
    }
    // Fallback to dummy data
    const dummy = generateDummyData();
    this.saveDataset(dummy);
    return dummy;
  }

  saveDataset(data = this.dataset) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save ML dataset", e);
    }
  }

  addMatch(round, house, paintedBlocks, revealedEV, hiddenEV, winningBid, actualValue) {
    this.dataset.push({
      input: {
        round: round / 5.0,
        house: HOUSES[house] || 0.5,
        paintedBlocks: paintedBlocks / 48.0,
        revealedEV: normalizeMoney(revealedEV),
        hiddenEV: normalizeMoney(hiddenEV)
      },
      output: {
        bid: normalizeMoney(winningBid),
        actualValue: normalizeMoney(actualValue)
      }
    });
    this.saveDataset();
  }
  
  getDataset() {
    return this.dataset;
  }
  
  clearDataset() {
    this.dataset = generateDummyData();
    this.saveDataset();
  }
}

export const datasetManager = new DatasetManager();
