import { Matrix } from 'ml-matrix';

import ClassicMethodOfTheSmallestSquares from './ClassicMethodOfTheSmallestSquares';
import Combination from './Combination';
import CombinationCapacity from './CombinationCapacity';

class MatrixBoiler {
  matrix!: Matrix;

  r0: number[][] = [];

  r: number[][] = [];

  combinations: Combination[] = [];

  combinationCapacities: CombinationCapacity[] = [];

  lineParamsMethod: ClassicMethodOfTheSmallestSquares = new ClassicMethodOfTheSmallestSquares();

  /** ilosc potencjalnych zmiennych objasniajacych */
  l = 0;

  isDataComplete = true;

  isDataInitialized = false;

  explainVariables: number[] = [];

  estimatedYs: number[] = [];

  averageYs = 0;

  fiSquared = 0;

  rSquared = 0;

  su = 0;

  vsPercentage = 0;

  private checkDataComplexity(data: number[][]) {
    const lineLengths = data.map((line) => line.length);

    this.isDataComplete = lineLengths.every((v) => v === lineLengths[0]);
  }

  initializeLineParamsMethod() {
    // const matrixOfMaxIntegralCombination = this.getMaxIntegralCombinationCapacity().relatedCombination.combinations.map(
    //   (combination) => this.matrix([], combination).map((el: number[]) => el[0])
    // );

    const matrixOfMaxIntegralCombination = this.matrix.subMatrixColumn(
      this.getMaxIntegralCombinationCapacity().relatedCombination.combinations
    );

    matrixOfMaxIntegralCombination.addColumn(
      matrixOfMaxIntegralCombination.columns,
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    );

    this.lineParamsMethod = new ClassicMethodOfTheSmallestSquares(
      // matrix(matrixOfMaxIntegralCombination).trans(),
      matrixOfMaxIntegralCombination,
      this.matrix.getColumnVector(0)
      // this.matrix([], 0)
    );
  }

  getMaxIntegralCombinationCapacity() {
    return this.combinationCapacities
      .filter((c) =>
        this.explainVariables.includes(c.relatedCombination.combinations.length)
      )
      .reduce((a, b) => (b.integralCapacity > a.integralCapacity ? b : a));
  }

  getNumberOfCols = () => this.matrix.columns;

  getCombinationsByElementCount = (count: number) =>
    this.combinations.filter((el) => el.combinations.length === count);

  generateCombinations() {
    let i = 1;
    this.combinations.push(new Combination(i, 1));
    i += 1;
    this.combinations.push(new Combination(i, 2));
    i += 1;
    this.combinations.push(new Combination(i, 3));
    i += 1;
    this.combinations.push(new Combination(i, 4));
    i += 1;
    this.combinations.push(new Combination(i, 1, 2));
    i += 1;
    this.combinations.push(new Combination(i, 1, 3));
    i += 1;
    this.combinations.push(new Combination(i, 1, 4));
    i += 1;
    this.combinations.push(new Combination(i, 2, 3));
    i += 1;
    this.combinations.push(new Combination(i, 2, 4));
    i += 1;
    this.combinations.push(new Combination(i, 3, 4));
    i += 1;
    this.combinations.push(new Combination(i, 1, 2, 3));
    i += 1;
    this.combinations.push(new Combination(i, 1, 2, 4));
    i += 1;
    this.combinations.push(new Combination(i, 1, 3, 4));
    i += 1;
    this.combinations.push(new Combination(i, 2, 3, 4));
    i += 1;
    this.combinations.push(new Combination(i, 1, 2, 3, 4));
  }

  generateCombinationIndividualCapacity() {
    this.combinationCapacities = this.combinations.map(
      (combination) => new CombinationCapacity(this.r0, this.r, combination)
    );
  }

  countL() {
    this.l = 2 ** (this.getNumberOfCols() - 1) - 1;
  }

  countR0() {
    const numberOfCols = this.getNumberOfCols();

    for (let i = 1; i < numberOfCols; i += 1) {
      this.r0.push([this.countPearsonCorrel(0, i)]);
    }
  }

  countR() {
    const numberOfCols = this.getNumberOfCols() - 1;

    for (let i = 0; i < numberOfCols; i += 1) {
      const cols: number[] = [];

      for (let j = 0; j < numberOfCols; j += 1) {
        if (i === j) {
          cols.push(1);
        } else if (j > i) {
          cols.push(this.countPearsonCorrel(i + 1, j + 1));
        } else {
          cols.push(this.countPearsonCorrel(j + 1, i + 1));
        }
      }

      this.r.push(cols);
    }
  }

  countPearsonCorrel(firstIndex: number, secondIndex: number): number {
    const firstArray = this.getValuesFromCol(firstIndex);
    const secondArray = this.getValuesFromCol(secondIndex);
    const firstAverage = firstArray.reduce((a, b) => a + b) / firstArray.length;
    const secondAverage =
      secondArray.reduce((a, b) => a + b) / firstArray.length;

    const firstDifferences = firstArray.map((val) => val - firstAverage);
    const secondDifferences = secondArray.map((val) => val - secondAverage);

    const sumOfMultipliedFirstAndSecondDifferences = firstDifferences
      .map((val, index) => val * secondDifferences[index])
      .reduce((a, b) => a + b);

    const sumOfPowsOfFirstDifferences = firstDifferences
      .map((val) => val * val)
      .reduce((a, b) => a + b);

    const sumOfPowsOfSecondDifferences = secondDifferences
      .map((val) => val * val)
      .reduce((a, b) => a + b);

    const result =
      sumOfMultipliedFirstAndSecondDifferences /
      Math.sqrt(sumOfPowsOfFirstDifferences * sumOfPowsOfSecondDifferences);

    return result;
  }

  getValuesFromCol(colNumber: number) {
    return this.getValues().map((line) => line[colNumber]);
  }

  getValues(): number[][] {
    if (typeof this.matrix !== 'undefined') {
      return this.matrix.to2DArray();
    }

    return [];
  }

  getHeaders(): string[] {
    if (typeof this.matrix !== 'undefined') {
      return this.matrix
        .getRow(0)
        .map((_col: number, i: number) => (i === 0 ? 'y' : `x${i}`));
    }

    return [];
  }

  setMatrix(arr: number[][]): MatrixBoiler {
    this.checkDataComplexity(arr);

    try {
      this.matrix = new Matrix(arr);
    } catch (e) {
      this.isDataComplete = false;
    }

    if (this.isDataComplete) {
      this.countR0();
      this.countR();
      this.countL();
      this.generateCombinations();
      this.generateCombinationIndividualCapacity();
      this.initializeLineParamsMethod();
      this.calcAndSetEstimatedYs();
      this.calcAndSetAverageY();
      this.calcFiSquared();
      this.calcRSquared();
      this.calcSu();
      this.calcVsPercentage();
    }

    this.isDataInitialized = true;

    return this;
  }

  setMatrixFromString(str: string): MatrixBoiler {
    this.setMatrix(MatrixBoiler.parseFileContent(str));

    return this;
  }

  setExplainVariables(explainVariables: number[]) {
    this.explainVariables = explainVariables;

    return this;
  }

  calcAndSetEstimatedYs() {
    const {
      combinations,
    } = this.getMaxIntegralCombinationCapacity().relatedCombination;

    for (let rowIndex = 0; rowIndex < this.matrix.rows; rowIndex += 1) {
      this.estimatedYs.push(
        this.lineParamsMethod.estimator
          .getColumn(0)
          .map((value, index, arr) => {
            if (index < arr.length - 1) {
              return value * this.matrix.get(rowIndex, combinations[index]);
            }

            return value;
          })
          .reduce((previousValue, currentValue) => previousValue + currentValue)
      );
    }
  }

  calcAndSetAverageY() {
    this.averageYs =
      this.matrix
        .getColumn(0)
        .reduce((previousValue, currentValue) => previousValue + currentValue) /
      this.matrix.rows;
  }

  calcFiSquared() {
    const top = this.matrix
      .getColumn(0)
      .map((value, index) => (value - this.estimatedYs[index]) ** 2)
      .reduce((previousValue, currentValue) => previousValue + currentValue);

    const bottom = this.matrix
      .getColumn(0)
      .map((value) => (value - this.averageYs) ** 2)
      .reduce((previousValue, currentValue) => previousValue + currentValue);

    this.fiSquared = top / bottom;
  }

  calcRSquared() {
    this.rSquared = 1 - this.fiSquared;
  }

  calcSu() {
    this.su = Math.sqrt(this.lineParamsMethod.wariation);
  }

  calcVsPercentage() {
    this.vsPercentage = (this.su / this.averageYs) * 100;
  }

  static parseFileContent(fileContent: string): number[][] {
    return fileContent
      .split('\n')
      .map((line) => line.split(' ').map((value) => parseFloat(value)))
      .filter((line) => line.length > 1);
  }

  static initializeFromFileContent(
    fileContent: string,
    explainVariables: number[]
  ) {
    return new MatrixBoiler()
      .setExplainVariables(explainVariables)
      .setMatrixFromString(fileContent);
  }
}

export default MatrixBoiler;
