import Combination from './Combination';

interface IIndividualCapacity {
  k: number;
  j: number;
  value: number;
}

export default class CombinationCapacity {
  relatedCombination: Combination;

  individualCapacities: IIndividualCapacity[];

  integralCapacity: number;

  constructor(r0: number[][], r: number[][], relatedCombination: Combination) {
    this.relatedCombination = relatedCombination;
    this.individualCapacities = [];
    this.integralCapacity = 0;

    this.initializeIndividualCapacities(r0, r);
    this.initializeIntegralCapacity();
  }

  initializeIndividualCapacities(r0: number[][], r: number[][]) {
    const k = this.relatedCombination.orderNumber;
    const mk = this.relatedCombination.combinations.length;

    this.individualCapacities = this.relatedCombination.combinations.map(
      (j) => {
        const top = r0[j - 1][0] ** 2;
        const bottom: number[] = [1];

        for (let l = 1; l <= mk; l += 1) {
          if (l !== j) {
            bottom.push(Math.abs(r[l - 1][j - 1]));
          }
        }
        const bottomSum = bottom.reduce((a, b) => a + b);

        return {
          k,
          j,
          value: top / bottomSum,
        };
      }
    );
  }

  initializeIntegralCapacity() {
    this.integralCapacity = this.individualCapacities
      .map((capacity) => capacity.value)
      .reduce((a, b) => a + b);
  }
}
