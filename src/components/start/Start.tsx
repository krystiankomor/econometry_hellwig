import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Message } from 'primereact/message';
import { v4 as uuidv4 } from 'uuid';

import MatrixBoiler from '../../utils/MatrixBoiler';

import {
  unsetMatrixBoiler,
  selectMatrixBoiler,
  setMatrixBoiler,
  setInput,
  selectExplainVariables,
} from '../../utils/matrixBoilerSlice';

const electron = window.require('electron');
const { remote } = electron;
const { dialog } = remote;
const fs = require('fs');

function selectFile(): string | null {
  const fileUri = dialog.showOpenDialogSync({
    filters: [{ name: 'Pliki tekstowe', extensions: ['text', 'txt'] }],
    properties: ['openFile'],
  });

  if (typeof fileUri === 'undefined') return null;

  return fs.readFileSync(fileUri[0], 'utf8') || null;
}

export default function Start(): JSX.Element {
  const dispatch = useDispatch();
  const matrixBoiler = useSelector(selectMatrixBoiler);
  const explainVariables = useSelector(selectExplainVariables);

  const dynamicColumns = matrixBoiler
    .getHeaders()
    .map((col: string, i: number) => (
      <Column
        key={uuidv4()}
        field={`${i}`}
        header={col}
        body={(rowData: number[]) =>
          typeof rowData[i] === 'number' ? rowData[i].toFixed(2) : rowData[i]
        }
      />
    ));

  return (
    <>
      <h1>Start</h1>

      <Button
        label="Wybierz plik"
        icon="pi pi-plus"
        className="p-mr-5"
        onClick={() => {
          const matrixFromFile = selectFile();

          if (matrixFromFile !== null) {
            dispatch(setInput(matrixFromFile));
            dispatch(
              setMatrixBoiler(
                MatrixBoiler.initializeFromFileContent(
                  matrixFromFile,
                  explainVariables
                )
              )
            );
          }
        }}
      />

      {matrixBoiler.isDataInitialized && !matrixBoiler.isDataComplete && (
        <Message severity="error" text="Brakuje danych w pliku" />
      )}

      {matrixBoiler.isDataInitialized && matrixBoiler.isDataComplete && (
        <Message severity="success" text="Plik poprawny" />
      )}

      <Button
        label="Reset"
        icon="pi pi-refresh"
        className="p-ml-5"
        onClick={() => {
          dispatch(unsetMatrixBoiler());
        }}
      />

      <h2>Zawartość pliku</h2>
      <DataTable
        className="p-datatable-gridlines"
        value={matrixBoiler.getValues()}
      >
        {dynamicColumns}
      </DataTable>
    </>
  );
}
