import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SelectButton } from 'primereact/selectbutton';
import { v4 as uuidv4 } from 'uuid';
import ReactHtmlParser from 'react-html-parser';

import {
  selectMatrixBoiler,
  setMatrixBoiler,
  setExplainVariables,
  selectExplainVariables,
  selectInput,
} from '../../utils/matrixBoilerSlice';

import Combination from '../../utils/Combination';
import MatrixBoiler from '../../utils/MatrixBoiler';

// import styles from './Calculations.css';

export default function Calculations() {
  const matrixBoiler = useSelector(selectMatrixBoiler);

  const explainVariables = useSelector(selectExplainVariables);

  const fileContent = useSelector(selectInput);

  const dispatch = useDispatch();

  const dynamicRColumns: ReactElement[] = [];

  for (let i = 0; i < matrixBoiler.r.length; i += 1) {
    dynamicRColumns.push(
      <Column
        key={uuidv4()}
        field={`${i}`}
        header=""
        body={(rowData: number[]) => {
          return rowData[i].toFixed(4);
        }}
      />
    );
  }

  const combinationsByElementCount: Combination[][] = [];

  for (let i = 1; i <= matrixBoiler.r.length; i += 1) {
    combinationsByElementCount.push(
      matrixBoiler.getCombinationsByElementCount(i)
    );
  }

  if (matrixBoiler.isDataInitialized && matrixBoiler.isDataComplete) {
    const maxIntegralCombinationCapacity = matrixBoiler.getMaxIntegralCombinationCapacity();

    return (
      <>
        <h2>Wybór zmiennych objaśniających</h2>
        <SelectButton
          value={explainVariables}
          options={[
            { label: 'Automatycznie', value: [2, 3] },
            { label: '2-elementowe', value: [2] },
            { label: '3-elementowe', value: [3] },
          ]}
          onChange={(e) => {
            dispatch(setExplainVariables(e.value));
            dispatch(
              setMatrixBoiler(
                MatrixBoiler.initializeFromFileContent(fileContent, e.value)
              )
            );
          }}
        />
        <h1>Obliczenia</h1>
        <div className="p-grid">
          <div className="p-col-2">
            <DataTable
              className="p-datatable-gridlines"
              value={matrixBoiler.r0}
            >
              <Column
                field="0"
                header={
                  <>
                    R<sub>0</sub>
                  </>
                }
                body={(rowData: { '0': number }) => rowData[0].toFixed(4)}
              />
            </DataTable>
          </div>

          <div className="p-col-10">
            <h3 className="p-my-0">R</h3>

            <DataTable className="p-datatable-gridlines" value={matrixBoiler.r}>
              {dynamicRColumns}
            </DataTable>
          </div>

          <div className="p-col-12 p-text-center">
            <p>
              <strong>
                L = 2<sup>p</sup> - 1
              </strong>{' '}
              = {matrixBoiler.l}
            </p>

            <h3>Kombinacje jednoelementowe</h3>

            {combinationsByElementCount[0].map((el) => {
              return (
                <span key={uuidv4()} className="p-mr-3">
                  K<sub>{el.orderNumber}</sub>={el.getFormattedCombination()}
                </span>
              );
            })}

            <h3>Kombinacje dwuelementowe</h3>

            {combinationsByElementCount[1].map((el) => {
              return (
                <span key={uuidv4()} className="p-mr-3">
                  K<sub>{el.orderNumber}</sub>={el.getFormattedCombination()}
                </span>
              );
            })}

            <h3>Kombinacje trójelementowe</h3>

            {combinationsByElementCount[2].map((el) => {
              return (
                <span key={uuidv4()} className="p-mr-3">
                  K<sub>{el.orderNumber}</sub>={el.getFormattedCombination()}
                </span>
              );
            })}

            <h3>Kombinacje czteroelementowe</h3>

            {combinationsByElementCount[3].map((el) => {
              return (
                <span key={uuidv4()} className="p-mr-3">
                  K<sub>{el.orderNumber}</sub>={el.getFormattedCombination()}
                </span>
              );
            })}
          </div>

          <div className="p-col-12">
            <h2>Pojemności indywidualne</h2>
            <div className="p-grid">
              {matrixBoiler.combinationCapacities.map((capacity) =>
                capacity.individualCapacities.map((el) => (
                  <div key={uuidv4()} className="p-col-3">
                    h
                    <sub>
                      {el.k}
                      {el.j}
                    </sub>{' '}
                    = {el.value.toFixed(4)}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-col-12">
            <h2>Pojemności integralne</h2>
            <div className="p-grid">
              {matrixBoiler.combinationCapacities.map((capacity) => (
                <p key={uuidv4()} className="p-col-12 p-my-0 p-text-center">
                  H<sub>{capacity.relatedCombination.orderNumber}</sub> ={' '}
                  {capacity.individualCapacities.map((el, i, all) => (
                    <>
                      h
                      <sub>
                        {el.k}
                        {el.j}
                      </sub>
                      {i !== all.length - 1 && ' + '}
                    </>
                  ))}{' '}
                  ={' '}
                  {capacity.individualCapacities.map((el, i, all) => (
                    <>
                      {el.value.toFixed(4)}
                      {i !== all.length - 1 && ' + '}
                    </>
                  ))}{' '}
                  = {capacity.integralCapacity.toFixed(4)}
                </p>
              ))}
            </div>
          </div>

          <div className="p-col-12">
            <h2>Maksymalna pojemność integralna</h2>
            <p className="p-text-center">
              K
              <sub>
                {maxIntegralCombinationCapacity.relatedCombination.orderNumber}
              </sub>{' '}
              ={' '}
              {maxIntegralCombinationCapacity.relatedCombination.getFormattedCombination()}
              , H
              <sub>
                {maxIntegralCombinationCapacity.relatedCombination.orderNumber}
              </sub>{' '}
              = {maxIntegralCombinationCapacity.integralCapacity.toFixed(4)}
            </p>
          </div>
          <div className="p-col-12">
            <h2>Szacunki parametrów strukturalnych (metoda KMNK)</h2>
          </div>

          <div className="p-offset-1 p-col-6">
            <h3>X</h3>
            <DataTable
              className="p-datatable-gridlines"
              value={matrixBoiler.lineParamsMethod.matrixX.to2DArray()}
            >
              {matrixBoiler.lineParamsMethod.matrixX
                .getRow(0)
                .map((_col: number, index: number) => (
                  <Column
                    key={uuidv4()}
                    field={`${index}`}
                    header=""
                    body={(rowData: number[]) => {
                      return rowData[index].toFixed(2);
                    }}
                  />
                ))}
            </DataTable>
          </div>

          <div className="p-offset-1 p-col-2">
            <h3>Y</h3>
            <DataTable
              className="p-datatable-gridlines"
              value={matrixBoiler.lineParamsMethod.matrixY.to2DArray()}
            >
              {matrixBoiler.lineParamsMethod.matrixY
                .getRow(0)
                .map((_col: number, index: number) => (
                  <Column
                    key={uuidv4()}
                    field={`${index}`}
                    header=""
                    body={(rowData: number[]) => {
                      return rowData[index].toFixed(2);
                    }}
                  />
                ))}
            </DataTable>
          </div>

          <div className="p-offset-2" />

          <div className="p-offset-1 p-col-6">
            <h3>
              X<sup>T</sup>X
            </h3>
            <DataTable
              className="p-datatable-gridlines"
              value={matrixBoiler.lineParamsMethod.transposedAndMultipliedX.to2DArray()}
            >
              {matrixBoiler.lineParamsMethod.transposedAndMultipliedX
                .getRow(0)
                .map((_col: number, index: number) => (
                  <Column
                    key={uuidv4()}
                    field={`${index}`}
                    header=""
                    body={(rowData: number[]) => {
                      return rowData[index].toFixed(2);
                    }}
                  />
                ))}
            </DataTable>
          </div>

          <div className="p-offset-1 p-col-2">
            <h3>
              X<sup>T</sup>y
            </h3>
            <DataTable
              className="p-datatable-gridlines"
              value={matrixBoiler.lineParamsMethod.transposedXAndMultipliedByY.to2DArray()}
            >
              {matrixBoiler.lineParamsMethod.transposedXAndMultipliedByY
                .getRow(0)
                .map((_col: number, index: number) => (
                  <Column
                    key={uuidv4()}
                    field={`${index}`}
                    header=""
                    body={(rowData: number[]) => {
                      return rowData[index].toFixed(2);
                    }}
                  />
                ))}
            </DataTable>
          </div>

          <div className="p-offset-2" />

          <div className="p-col-12">
            <p className="p-text-center">
              det(X<sup>T</sup>X) ={' '}
              {matrixBoiler.lineParamsMethod.determinantOfTransposedAndMultipliedX.toFixed(
                4
              )}
            </p>
          </div>

          <div className="p-offset-3 p-col-6">
            <h3>
              (X<sup>T</sup>X)<sup>-1</sup>
            </h3>
            <DataTable
              className="p-datatable-gridlines"
              value={matrixBoiler.lineParamsMethod.inversedTransposed.to2DArray()}
            >
              {matrixBoiler.lineParamsMethod.inversedTransposed
                .getRow(0)
                .map((_col: number, index: number) => (
                  <Column
                    key={uuidv4()}
                    field={`${index}`}
                    header=""
                    body={(rowData: number[]) => {
                      return rowData[index].toFixed(2);
                    }}
                  />
                ))}
            </DataTable>
          </div>

          <div className="p-offset-3" />

          <div className="p-col-12">
            <h3>
              a = (X<sup>T</sup>X)<sup>-1</sup>X<sup>T</sup>y
            </h3>
            <div className="p-grid p-align-center">
              <div className="p-offset-1 p-col-5">
                <DataTable
                  className="p-datatable-gridlines"
                  value={matrixBoiler.lineParamsMethod.inversedTransposed.to2DArray()}
                >
                  {matrixBoiler.lineParamsMethod.inversedTransposed
                    .getRow(0)
                    .map((_col: number, index: number) => (
                      <Column
                        key={uuidv4()}
                        field={`${index}`}
                        header=""
                        body={(rowData: number[]) => {
                          return rowData[index].toFixed(2);
                        }}
                      />
                    ))}
                </DataTable>
              </div>
              <div className="p-col-2">
                <DataTable
                  className="p-datatable-gridlines"
                  value={matrixBoiler.lineParamsMethod.transposedXAndMultipliedByY.to2DArray()}
                >
                  {matrixBoiler.lineParamsMethod.transposedXAndMultipliedByY
                    .getRow(0)
                    .map((_col: number, index: number) => (
                      <Column
                        key={uuidv4()}
                        field={`${index}`}
                        header=""
                        body={(rowData: number[]) => {
                          return rowData[index].toFixed(2);
                        }}
                      />
                    ))}
                </DataTable>
              </div>
              <div className="p-col-1 p-text-center">=</div>
              <div className="p-col-2">
                <DataTable
                  className="p-datatable-gridlines"
                  value={matrixBoiler.lineParamsMethod.estimator.to2DArray()}
                >
                  {matrixBoiler.lineParamsMethod.estimator
                    .getRow(0)
                    .map((_col: number, index: number) => (
                      <Column
                        key={uuidv4()}
                        field={`${index}`}
                        header=""
                        body={(rowData: number[]) => {
                          return rowData[index].toFixed(4);
                        }}
                      />
                    ))}
                </DataTable>
              </div>
            </div>
          </div>

          <div className="p-col-12 p-text-center">
            <h3 className="p-text-left">Wariancja składnika resztowego</h3>
            <p className="p-d-block">
              S<sub>u</sub>
              <sup>2</sup> = (1 / (n - k))[y<sup>T</sup>y - i<sup>T</sup>Xa]
            </p>
            <div className="p-grid p-align-center">
              <div className="p-col-4">
                S<sub>u</sub>
                <sup>2</sup> = (1 / ({matrixBoiler.lineParamsMethod.n} -{' '}
                {matrixBoiler.lineParamsMethod.k}))(
                {matrixBoiler.lineParamsMethod.transposedAndMultipliedY.get(
                  0,
                  0
                )}{' '}
                -
              </div>
              <div className="p-col-5">
                <DataTable
                  className="p-datatable-gridlines"
                  value={matrixBoiler.lineParamsMethod.transposedYAndMultipliedByX.to2DArray()}
                >
                  {matrixBoiler.lineParamsMethod.transposedYAndMultipliedByX
                    .getRow(0)
                    .map((_col: number, index: number) => (
                      <Column
                        key={uuidv4()}
                        field={`${index}`}
                        header=""
                        body={(rowData: number[]) => {
                          return rowData[index].toFixed(3);
                        }}
                      />
                    ))}
                </DataTable>
              </div>
              <div className="p-col-2">
                <DataTable
                  className="p-datatable-gridlines"
                  value={matrixBoiler.lineParamsMethod.estimator.to2DArray()}
                >
                  {matrixBoiler.lineParamsMethod.estimator
                    .getRow(0)
                    .map((_col: number, index: number) => (
                      <Column
                        key={uuidv4()}
                        field={`${index}`}
                        header=""
                        body={(rowData: number[]) => {
                          return rowData[index].toFixed(3);
                        }}
                      />
                    ))}
                </DataTable>
              </div>
              <div className="p-col-1">)</div>
            </div>
            <p className="p-d-block">
              S<sub>u</sub>
              <sup>2</sup> ={' '}
              {matrixBoiler.lineParamsMethod.wariation.toFixed(4)}
            </p>
          </div>

          <div className="p-col-12">
            <h2>Oszacowana macierz wariancji i kowariancji</h2>
            <div className="p-grid p-align-center">
              <div className="p-col-2">
                <p className="p-text-right">
                  D<sup>2</sup>(a) ={' '}
                  {matrixBoiler.lineParamsMethod.wariation.toFixed(4)}
                </p>
              </div>
              <div className="p-col-4">
                <DataTable
                  className="p-datatable-gridlines"
                  value={matrixBoiler.lineParamsMethod.inversedTransposed.to2DArray()}
                >
                  {matrixBoiler.lineParamsMethod.inversedTransposed
                    .getRow(0)
                    .map((_col: number, index: number) => (
                      <Column
                        key={uuidv4()}
                        field={`${index}`}
                        header=""
                        body={(rowData: number[]) => {
                          return rowData[index].toFixed(2);
                        }}
                      />
                    ))}
                </DataTable>
              </div>
              <div className="p-col-1 p-text-center">=</div>
              <div className="p-col-5">
                <DataTable
                  className="p-datatable-gridlines"
                  value={matrixBoiler.lineParamsMethod.predictedWariationAndCowariationMatrix.to2DArray()}
                >
                  {matrixBoiler.lineParamsMethod.predictedWariationAndCowariationMatrix
                    .getRow(0)
                    .map((_col: number, index: number) => (
                      <Column
                        key={uuidv4()}
                        field={`${index}`}
                        header=""
                        body={(rowData: number[]) => {
                          return rowData[index].toFixed(4);
                        }}
                      />
                    ))}
                </DataTable>
              </div>
            </div>
          </div>

          <div className="p-col-12 p-text-center">
            <h3 className="p-text-left">Średnie błędy szacunku parametrów</h3>
            {matrixBoiler.lineParamsMethod.d.map((d, index) => (
              <p key={uuidv4()}>
                D(a<sub>{index + 1}</sub>) = {d.toFixed(4)}
              </p>
            ))}
          </div>

          <div className="p-col-12">
            <h3>Oszacowany model</h3>
            <div className="p-text-center">
              y<sub>i</sub>
              <sup>*</sup> ={' '}
              {matrixBoiler.lineParamsMethod.estimator
                .getColumn(0)
                .map((col, index, columns) => {
                  let valueToReturn =
                    // eslint-disable-next-line no-nested-ternary
                    index > 0 && col > 0
                      ? ` + ${col.toFixed(4)}`
                      : col < 0
                      ? ` - ${Math.abs(col).toFixed(4)}`
                      : col.toFixed(4);

                  if (index < columns.length - 1) {
                    valueToReturn += `x<sub>${maxIntegralCombinationCapacity.relatedCombination.combinations[index]}i</sub>`;
                  }

                  return (
                    <span key={uuidv4()}>{ReactHtmlParser(valueToReturn)}</span>
                  );
                })}
            </div>
            <div className="p-text-center">
              <span className="p-ml-3" />
              {matrixBoiler.lineParamsMethod.d.map((el) => (
                <span className="p-ml-4" key={uuidv4()}>
                  ({el.toFixed(4)})
                </span>
              ))}
            </div>
          </div>
          <div className="p-col-12">
            <h2>Weryfikacja modelu</h2>
            <div className="p-grid">
              <div className="p-offset-1 p-col-2">
                <DataTable
                  className="p-datatable-gridlines"
                  value={matrixBoiler.matrix.getColumn(0)}
                >
                  <Column
                    key={uuidv4()}
                    header="Y"
                    body={(rowData: number) => {
                      return rowData.toFixed(4);
                    }}
                  />
                </DataTable>
              </div>
              <div className="p-col-2">
                <DataTable
                  className="p-datatable-gridlines"
                  value={matrixBoiler.estimatedYs}
                >
                  <Column
                    key={uuidv4()}
                    header={
                      <>
                        Y<sub>i</sub>
                        <sup>*</sup>
                      </>
                    }
                    body={(rowData: number) => {
                      return rowData.toFixed(4);
                    }}
                  />
                </DataTable>
              </div>
              <div className="p-offset-2 p-col-5 p-pt-5">
                <p className="p-display-block p-text-bold">
                  śr. y = {matrixBoiler.averageYs.toFixed(4)}
                </p>
                <p className="p-display-block p-text-bold">
                  fi<sup>2</sup> = {matrixBoiler.fiSquared.toFixed(4)}
                </p>
                <p className="p-display-block p-text-bold">
                  R<sup>2</sup>
                  <sub>w</sub> = {matrixBoiler.rSquared.toFixed(4)}
                </p>
                <p className="p-display-block p-text-bold">
                  S<sub>u</sub> = {matrixBoiler.su.toFixed(4)}
                </p>
                <p className="p-display-block p-text-bold">
                  v<sub>s</sub> = {matrixBoiler.vsPercentage.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Obliczenia</h1>
      <h2>Brak danych lub plik niewłaściwy</h2>
    </>
  );
}
