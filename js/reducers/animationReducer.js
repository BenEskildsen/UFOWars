// @flow

const {config} = require('../config');

import type {GameState, Action} from '../types';

const animationReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'STEP_ANIMATION': {
      // update animations
      const nextExplosions = [];
      for (const explosion of state.explosions) {
        if (explosion.age <= 0) {
          continue;
        }
        nextExplosions.push({
          ...explosion,
          age: explosion.age - 1,
          radius: explosion.radius + explosion.rate,
        });
      }

      return {
        ...state,
        explosions: nextExplosions,
      };
    }

  }
};

module.exports = {animationReducer};
