import * as tf from '@tensorflow/tfjs';
import { datasetManager, MAX_MONEY } from './DatasetManager';

export class AuctionBrain {
  constructor() {
    this.model = this.buildModel();
    this.isTraining = false;
    this.isTrained = false;
    this.loss = null;
  }

  buildModel() {
    const model = tf.sequential();
    
    // 6 input features: Round, House, PaintedBlocks, RevealedEV, HiddenEV, CommanderInfoScore
    model.add(tf.layers.dense({ units: 16, inputShape: [6], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    
    // 2 outputs: Predicted Bid, Predicted Actual Value (normalized)
    model.add(tf.layers.dense({ units: 2, activation: 'linear' }));
    
    model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'meanSquaredError'
    });
    
    return model;
  }

  async train(onEpochEnd) {
    if (this.isTraining) return;
    this.isTraining = true;
    
    const data = datasetManager.getDataset();
    if (data.length === 0) {
      this.isTraining = false;
      return;
    }

    const inputs = data.map(d => [
      d.input.round,
      d.input.house,
      d.input.paintedBlocks,
      d.input.revealedEV,
      d.input.hiddenEV,
      d.input.commanderInfoScore
    ]);
    const outputs = data.map(d => [d.output.bid, d.output.actualValue]);

    const inputTensor = tf.tensor2d(inputs);
    const outputTensor = tf.tensor2d(outputs);

    try {
      await this.model.fit(inputTensor, outputTensor, {
        epochs: 100,
        batchSize: 4,
        shuffle: true,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            this.loss = logs.loss;
            if (onEpochEnd) onEpochEnd(epoch, logs.loss);
          }
        }
      });
      this.isTrained = true;
    } catch (e) {
      console.error("Training failed", e);
    } finally {
      inputTensor.dispose();
      outputTensor.dispose();
      this.isTraining = false;
    }
  }

  predict(round, houseNorm, paintedBlocksNorm, revealedEVNorm, hiddenEVNorm, commanderInfoScore = 0) {
    if (!this.isTrained) return null;
    
    return tf.tidy(() => {
      const inputTensor = tf.tensor2d([[
        round / 5.0,
        houseNorm,
        paintedBlocksNorm,
        revealedEVNorm,
        hiddenEVNorm,
        commanderInfoScore
      ]]);
      const prediction = this.model.predict(inputTensor);
      const predictedData = prediction.dataSync();
      return {
        predictedBid: Math.max(0, predictedData[0] * MAX_MONEY),
        predictedActualValue: Math.max(0, predictedData[1] * MAX_MONEY)
      };
    });
  }
}

export const auctionBrain = new AuctionBrain();
