import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../store';
import MatrixBoiler from './MatrixBoiler';

const matrixBiolerSlice = createSlice({
  name: 'matrix',
  initialState: {
    matrix: new MatrixBoiler(),
    input: '',
    explainVariables: [2, 3],
  },
  reducers: {
    setInput: (state, action: PayloadAction<string>) => {
      state.input = action.payload;
    },
    setMatrixBoiler: (state, action: PayloadAction<MatrixBoiler>) => {
      state.matrix = action.payload;
    },
    unsetMatrixBoiler: (state) => {
      state.matrix = new MatrixBoiler();
    },
    setExplainVariables: (state, action: PayloadAction<number[]>) => {
      state.explainVariables = action.payload;
    },
  },
});

export const {
  setMatrixBoiler,
  unsetMatrixBoiler,
  setInput,
  setExplainVariables,
} = matrixBiolerSlice.actions;

export default matrixBiolerSlice.reducer;

export const selectMatrixBoiler = (state: RootState) => state.matrix.matrix;

export const selectInput = (state: RootState) => state.matrix.input;

export const selectExplainVariables = (state: RootState) =>
  state.matrix.explainVariables;
