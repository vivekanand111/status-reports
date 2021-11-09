import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {selectStarById, selectStarIds} from '../stars/starsSlice'
import {selectViewMode, selectTasksStatus, setTaskEditMode, setTabMode} from './tasksSlice'


import ReactDataGrid, {SelectColumn} from "react-data-grid";
import AddTask from './addTask'
import TaskEdit from './taskEdit'
import { exportToXlsx } from '../util/exportUtils';

// import {CellActionsFormatter, ImageFormatter} from '/react-data-grid/components/Formatters';

// const CellActionsFormatter = require('../components/CellFormatter.js')
const defaultColumnProperties = {
  resizable: true,
  //width: 120
};

function ExportButton({onExport, len, children}) {
  const [exporting, setExporting] = useState(false);
  return (
    <button className="btn gap1 exel-btn"
      disabled={
        exporting || len === 0
      }
      onClick={
        async (e) => {
          e.preventDefault();
          setExporting(true);
          await onExport();
          setExporting(false);
        }
    }>
      {
      exporting ? 'Exporting' : children
    } </button>
  );
}

const TaskList = ({starId}) => { // console.log('In TaskList component[' + starId + "]")

  const loadingStatus = useSelector(state => selectTasksStatus(state))
  const viewMode = useSelector(state => selectViewMode(state, starId))

  // console.log('viewMode = ' + viewMode + ', loadingStatus=' + loadingStatus)
  const dispatch = useDispatch()

  const [selectedTaskId, setSelectedTaskId] = useState();
  const [selectedIndexes, setSelectedIndexes] = useState([])

  const star = useSelector(state => selectStarById(state, starId))

  const [selectedTaskRow, setSelectedTaskRow] = useState();
  const rows = star.tasks
  // console.log("hi ",star.tasks[0].date)
  //let selectedRows = new Set()
  const [selectedRows,setSelectedRows ]= useState(new Set())

  const handleAddClose = (e, tabMode) => {
    setSelectedRows(new Set())
    dispatch(setTabMode({starId: starId, mode: tabMode}))
  }

  const selectTask = (selectedRowsIp) => {
    console.log("in SelectTask")
    // console.log(selectedRows.entries().next())
    //const tabMode = viewMode === 'edit' ? 'view' : 'edit'
    console.log(selectedRowsIp.size)
    setSelectedRows(new Set())
    dispatch(setTabMode({starId: starId, mode: 'view'}))
    if(rows.length!==0){
      if(selectedRowsIp.size==1 || selectedRowsIp.size==2 && selectedRows.size!==0){
        //const rowsIter = selectedRowsIp.entries()
        console.log(selectedRowsIp)
        const last=Array.from(selectedRowsIp).pop()
        const taskId = last //rowsIter.next().value[0]
        /* if(selectedRowsIp.size==2){
          selectedRowsIp.delete(selectedRowsIp.entries().next().value[0])
        } */
        setSelectedRows(new Set().add(taskId))
        //console.log(selectedRows)
        console.log(" Star Id = " + starId + " Task Id = " + taskId)
        let rowIndexes = [rows[0]]
        setSelectedTaskRow(taskId)
        setSelectedIndexes(rowIndexes)
        dispatch(setTabMode({starId: starId, mode: 'edit'}))
      }
    }
    if(star.status!=='Open'){
      setSelectedRows(new Set())
    }
  }

  const ROW_COUNT = 50;
  const columns = [
    SelectColumn,
    {
      key: 'task_desc',
      name: 'Task'
    },
    {
      key: 'task_type',
      name: 'Type'
    },
    {
      key: 'sprint',
      name: 'Sprint'
    },
    {
      key: 'task_date',
      name: 'Date'
    }, {
      key: 'hours',
      name: 'Hours'
    }
  ].map(c => ({
    ...c,
    ... defaultColumnProperties
  }));;

  const allColumns = [
    {
      key: 'id',
      name: 'S.no.'
    },
    {
      key: 'project',
      name: 'Project',
      sortable: true
    },
    {
      key: 'user_id',
      name: 'Employee'
    },
    {
      key: 'task_type',
      name: 'Type'
    }, {
      key: 'task_desc',
      name: 'Task'
    }, {
      key: 'task_date',
      name: 'Date'
    }, {
      key: 'hours',
      name: 'Hours'
    }, {
      key: 'module',
      name: 'Module'
    }, {
      key: 'sprint',
      name: 'Sprint'
    }, {
      key: 'task_notes',
      name: 'Notes'
    }
  ].map(c => ({
    ...c,
    ... defaultColumnProperties
  }));;

  const gridElement = (
    <ReactDataGrid 
      columns={allColumns}
      rows={rows}
      rowsCount={ROW_COUNT}
      defaultColumnOptions={
        {
          sortable: true,
          resizable: true
        }
      }
    />
  )

  const rowKeyGetter = (row) => {
    return row.id;
  }
  const aMode = 'add'
  const vMode = 'view'
  const eMode = 'edit'
  return (
    <>
      <div><ReactDataGrid columns={columns}
          rows={rows}
          rowKeyGetter={rowKeyGetter}
          rowsCount={ROW_COUNT}
          minHeight={500}
          defaultColumnOptions={
            {
              sortable: true,
              resizable: true
            }
          }
          selectedRows={selectedRows}
          onSelectedRowsChange={selectTask}

          onColumnResize={
            (idx, width) => console.log(`Column ${idx} has been resized to ${width}`)
          }/>
      </div>
    {
      viewMode === vMode && star.status === "Open" && <button className="btn addtask-btn"
        onClick={
          (e) => handleAddClose(e, aMode)
      }>Add task</button>
    }
    { viewMode === vMode || star.status !== "Open" ?
      <ExportButton len={ rows.length }
        onExport={
          () => exportToXlsx(gridElement, 'Reports.xlsx')
        }>
        Download
      </ExportButton> : <></>
    }
    {
      viewMode === aMode && <>
        <button className="btn closetask-btn"
          onClick={
            (e) => handleAddClose(e, vMode)
        }>Close</button>
        <AddTask starId={starId} weekStart={star.weekStart}/>
      </>
    }
    {
      viewMode === eMode && star.status === "Open" && <>
      <button className="btn closetask-btn"
        onClick={
          (e) => handleAddClose(e, vMode)
      }>Close</button>
      <TaskEdit starId={starId} weekStart={star.weekStart}
        taskId={selectedTaskRow}/></>
    } </>
  )

}
export default TaskList
