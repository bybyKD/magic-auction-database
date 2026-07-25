const STORAGE_KEY = 'magic_auction_ml_dataset';

export const HOUSES = {
  'Eruditio': 0.25,
  'Dawnlight': 0.5,
  'World': 0.75,
  'Cosmic': 1.0
};

export const MAX_MONEY = 5000000;

export const normalizeMoney = (value) => {
  return Math.min(1.0, Math.max(0.0, value / MAX_MONEY));
};

export const denormalizeMoney = (value) => {
  return value * MAX_MONEY;
};

// Realistic dummy data simulating actual Magic Auction outcomes.
// Behavioral patterns:
//   R1-2: Aggressive bidding (70-80% of EV), higher variance
//   R3-4: Cautious bidding (60-70% of EV), tighter clustering
//   R5:   Pure competition (85-95% of EV), near-max bids
//   High-info commanders (Layla, Aurora R5): bids closer to true EV
//   Low-info commanders: wider variance, more conservative bids
const generateDummyData = () => {
  const data = [];
  
  const addMatch = (round, house, paintedBlocks, revealedEV, hiddenEV, winningBid, actualValue, commanderInfoScore = 0) => {
    data.push({
      input: {
        round: round / 5.0,
        house: HOUSES[house] || 0.5,
        paintedBlocks: paintedBlocks / 48.0,
        revealedEV: normalizeMoney(revealedEV),
        hiddenEV: normalizeMoney(hiddenEV),
        commanderInfoScore: commanderInfoScore
      },
      output: {
        bid: normalizeMoney(winningBid),
        actualValue: normalizeMoney(actualValue)
      }
    });
  };

  // ===================== ERUDITIO (Low value, 100-50000 range) =====================
  // No commander
  addMatch(1, 'Eruditio', 12, 4500, 10000, 9500, 15000, 0);
  addMatch(1, 'Eruditio', 4, 1500, 15000, 3500, 11000, 0);
  addMatch(2, 'Eruditio', 16, 6000, 8000, 7500, 13000, 0);
  addMatch(3, 'Eruditio', 24, 12000, 5000, 11000, 16000, 0);
  addMatch(4, 'Eruditio', 36, 18000, 2000, 16000, 20000, 0);
  addMatch(5, 'Eruditio', 48, 25000, 0, 22000, 25000, 0);

  // Eruditio with Layla (high info)
  addMatch(1, 'Eruditio', 10, 3800, 12000, 10500, 15000, 0.19);
  addMatch(3, 'Eruditio', 28, 14000, 4000, 14500, 17000, 0.31);
  addMatch(5, 'Eruditio', 46, 23000, 500, 23500, 24500, 0.44);

  // Eruditio with Minotaur (low info)
  addMatch(2, 'Eruditio', 14, 5000, 9000, 6000, 13000, 0.10);
  addMatch(4, 'Eruditio', 32, 16000, 3000, 13000, 19000, 0.17);

  // Eruditio with Johnson (R3 info spike)
  addMatch(2, 'Eruditio', 18, 7000, 7000, 7000, 13000, 0.08);
  addMatch(3, 'Eruditio', 22, 11000, 6000, 13000, 16000, 0.50);

  // Eruditio with Harley (quantity info only)
  addMatch(1, 'Eruditio', 8, 3000, 13000, 5500, 14000, 0.10);
  addMatch(4, 'Eruditio', 34, 17000, 2500, 14000, 19000, 0.10);

  // ===================== DAWNLIGHT (Mid-low value) =====================
  // No commander
  addMatch(1, 'Dawnlight', 10, 15000, 30000, 22000, 42000, 0);
  addMatch(2, 'Dawnlight', 18, 28000, 18000, 28000, 45000, 0);
  addMatch(3, 'Dawnlight', 26, 42000, 8000, 38000, 50000, 0);
  addMatch(5, 'Dawnlight', 48, 65000, 0, 58000, 65000, 0);

  // Dawnlight with Alice (quality reveals)
  addMatch(1, 'Dawnlight', 8, 12000, 35000, 25000, 44000, 0.13);
  addMatch(3, 'Dawnlight', 24, 38000, 12000, 42000, 50000, 0.17);

  // Dawnlight with Lunox (many quality reveals)
  addMatch(2, 'Dawnlight', 16, 25000, 22000, 32000, 45000, 0.29);
  addMatch(5, 'Dawnlight', 42, 58000, 2000, 56000, 62000, 0.54);

  // Dawnlight with Wanwan (sequential reveals)
  addMatch(1, 'Dawnlight', 6, 10000, 40000, 18000, 46000, 0.05);
  addMatch(3, 'Dawnlight', 20, 32000, 15000, 35000, 48000, 0.19);

  // ===================== WORLD (Mid-high value) =====================
  // No commander
  addMatch(1, 'World', 10, 80000, 400000, 420000, 550000, 0);
  addMatch(2, 'World', 20, 150000, 250000, 250000, 380000, 0);
  addMatch(3, 'World', 35, 450000, 100000, 520000, 500000, 0);
  addMatch(4, 'World', 42, 520000, 50000, 480000, 550000, 0);
  addMatch(5, 'World', 48, 1200000, 0, 1100000, 1200000, 0);

  // World with Aurora (R5 massive info)
  addMatch(3, 'World', 30, 350000, 150000, 380000, 500000, 0);
  addMatch(5, 'World', 46, 1150000, 20000, 1180000, 1200000, 0.70);

  // World with Vale (progressive color reveals)
  addMatch(1, 'World', 8, 70000, 450000, 350000, 520000, 0.10);
  addMatch(3, 'World', 28, 300000, 180000, 350000, 480000, 0.30);
  addMatch(5, 'World', 44, 950000, 50000, 980000, 1000000, 0.40);

  // World with Chou (sequential full reveals)
  addMatch(2, 'World', 16, 120000, 300000, 220000, 400000, 0.10);
  addMatch(4, 'World', 38, 480000, 60000, 500000, 540000, 0.31);

  // World with Lancelot (column-based reveals)
  addMatch(1, 'World', 6, 55000, 480000, 300000, 530000, 0.06);
  addMatch(4, 'World', 36, 420000, 80000, 440000, 500000, 0.38);

  // ===================== COSMIC (Very high value) =====================
  // No commander
  addMatch(1, 'Cosmic', 8, 150000, 1500000, 1600000, 2100000, 0);
  addMatch(2, 'Cosmic', 18, 400000, 1000000, 800000, 1500000, 0);
  addMatch(3, 'Cosmic', 30, 800000, 500000, 900000, 1400000, 0);
  addMatch(4, 'Cosmic', 40, 1100000, 200000, 950000, 1400000, 0);
  addMatch(5, 'Cosmic', 48, 3500000, 0, 3100000, 3500000, 0);

  // Cosmic with Layla (high info = confident bids)
  addMatch(1, 'Cosmic', 12, 250000, 1300000, 1500000, 1900000, 0.19);
  addMatch(3, 'Cosmic', 32, 900000, 400000, 1100000, 1400000, 0.31);
  addMatch(5, 'Cosmic', 45, 3200000, 100000, 3350000, 3400000, 0.44);

  // Cosmic with Aurora (R5 info bomb)
  addMatch(4, 'Cosmic', 38, 1000000, 250000, 900000, 1350000, 0);
  addMatch(5, 'Cosmic', 47, 3400000, 30000, 3450000, 3500000, 0.70);

  // Cosmic with Johnson (R3 size reveal)
  addMatch(2, 'Cosmic', 16, 350000, 1100000, 750000, 1500000, 0.08);
  addMatch(3, 'Cosmic', 28, 750000, 550000, 1000000, 1400000, 0.50);

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

  addMatch(round, house, paintedBlocks, revealedEV, hiddenEV, winningBid, actualValue, commanderInfoScore = 0) {
    this.dataset.push({
      input: {
        round: round / 5.0,
        house: HOUSES[house] || 0.5,
        paintedBlocks: paintedBlocks / 48.0,
        revealedEV: normalizeMoney(revealedEV),
        hiddenEV: normalizeMoney(hiddenEV),
        commanderInfoScore: commanderInfoScore
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
