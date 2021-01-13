import { Matrix, inverse, determinant } from 'ml-matrix';

export default class ClassicMethodOfTheSmallestSquares {
  matrixX!: Matrix;

  matrixY!: Matrix;

  transposedAndMultipliedX!: Matrix;

  transposedXAndMultipliedByY!: Matrix;

  determinantOfTransposedAndMultipliedX = 0;

  inversedTransposed!: Matrix;

  estimator!: Matrix;

  transposedAndMultipliedY!: Matrix;

  transposedYAndMultipliedByX!: Matrix;

  transposedYAndMultipliedByXAndEstimator!: Matrix;

  wariation = 0;

  n = 0;

  k = 0;

  predictedWariationAndCowariationMatrix!: Matrix;

  d: number[] = [];

  constructor(arrX: Matrix | null = null, arrY: Matrix | null = null) {
    if (arrX === null || arrY === null) return;

    this.matrixY = arrY;
    this.matrixX = arrX;

    this.setTransposedAndMultipliedX();
  }

  setTransposedAndMultipliedX() {
    const transposedX = this.matrixX.transpose();
    const transposedY = this.matrixY.transpose();

    this.transposedAndMultipliedX = transposedX.mmul(this.matrixX);

    this.transposedXAndMultipliedByY = transposedX.mmul(this.matrixY);

    this.determinantOfTransposedAndMultipliedX = determinant(
      this.transposedAndMultipliedX
    );

    this.inversedTransposed = inverse(this.transposedAndMultipliedX);

    this.estimator = this.inversedTransposed.mmul(
      this.transposedXAndMultipliedByY
    );

    this.transposedAndMultipliedY = transposedY.mmul(this.matrixY);

    this.transposedYAndMultipliedByX = transposedY.mmul(this.matrixX);

    this.transposedYAndMultipliedByXAndEstimator = this.transposedYAndMultipliedByX.mmul(
      this.estimator
    );

    this.n = this.matrixX.rows;

    this.k = this.matrixX.columns;

    this.wariation =
      (1 / (this.n - this.k)) *
      (this.transposedAndMultipliedY.get(0, 0) -
        this.transposedYAndMultipliedByXAndEstimator.get(0, 0));

    this.predictedWariationAndCowariationMatrix = this.inversedTransposed
      .clone()
      .mul(this.wariation);

    for (let i = 0; i < this.k; i += 1) {
      this.d.push(
        Math.sqrt(this.predictedWariationAndCowariationMatrix.get(i, i))
      );
    }
  }
}
