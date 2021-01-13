export default class Combination {
  combinations: number[] = [];

  orderNumber: number;

  constructor(orderNumber: number, ...combinations: number[]) {
    this.combinations = combinations;
    this.orderNumber = orderNumber;
  }

  getFormattedCombination() {
    const formattedCombinations = this.combinations
      .map((el) => `X${el}`)
      .join(',');

    return `{${formattedCombinations}}`;
  }
}
