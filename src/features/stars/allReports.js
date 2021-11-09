import React, {useState, useRef, useMemo, useEffect} from 'react'
import Select from 'react-select';

import ReactDataGrid from "react-data-grid";
import {useDispatch, useSelector} from 'react-redux';
import {client} from '../../api/client';
import {getProjectData, selectProjects} from '../tasks/tasksSlice';
import {exportToCsv, exportToXlsx} from '../util/exportUtils';

const defaultColumnProperties = {
  resizable: true,
  // width: 125
};
const dateformat = (date) => {
  var d = new Date(date)
  return d.toISOString().split('T')[0]
}

function getComparator(sortColumn) {
  switch (sortColumn) {
    case 'user_id':
    case 'task_desc':
    case 'task_date':
    case 'project':
      return(a, b) => {
        if (a[sortColumn] == null) {
          a[sortColumn] = ''
        }
        if (b[sortColumn] == null) {
          b[sortColumn] = ''
        }
        return a[sortColumn].localeCompare(b[sortColumn]);
      };
    case 'id':
    case 'hours':
      return(a, b) => {
        if (a[sortColumn] == null) {
          a[sortColumn] = ''
        }
        if (b[sortColumn] == null) {
          b[sortColumn] = ''
        }
        return a[sortColumn] - b[sortColumn];
      };
    default:
      throw new Error(`unsupported sortColumn: "${sortColumn}"`);
  }
}

function ExportButton({onExport, len, children}) {
  const [exporting, setExporting] = useState(false);
  return (
    <button className="btn exel-btn mWeb-fullwidth"
      disabled={
        exporting || len === 0
      }
      onClick={
        async () => {
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

const AllReports = () => {

  const [rows, setRows] = useState([]);
  const [sortColumns, setSortColumns] = useState([])
  const [value, setValue] = useState('10');
  const [selectedOption, setSelectedOption] = useState([])
  const gridRef = useRef(null);

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getProjectData())
  }, [])

  const projects = useSelector(state => selectProjects(state))
  const options = []
  projects.map((i) => {
    options.push({value: i, label: i})
  })

  const ROW_COUNT = 50;
  const columns = [
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
      key: 'task_desc',
      name: 'Task'
    }, {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const start = e.target.start.value
    const end = e.target.end.value
    const selectedProjects = []
    selectedOption.map(i => {
      selectedProjects.push(i.value)
    })
    // const selectedProjects=[...e.target.projects.selectedOptions].map(o => o.value)
    // console.log(selectedProjects)
    const response = await client.post("https://softforceapps.com:3000/api/adminReport", {
      startDate: start,
      toDate: end
    })
    console.log(response)
    let res = []
    response.map(i => {
      selectedProjects.map(j => {
        if (i.project == j) {
          res.push(i)
        }
      })
    })
    if (selectedProjects.length === 0) {
      res = response
    }
    res.map((i, j) => {
      i.id = j;
      i.task_date = dateformat(i.task_date)
    })
    setRows(res)
  }
  const handleChange = (selectedOption) => { // console.log(selectedOption)
    setSelectedOption(selectedOption)
  }

  const sortedRows = useMemo(() => {
    if (sortColumns.length === 0) 
      return rows;
    


    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      for (const sort of sortColumns) {
        const comparator = getComparator(sort.columnKey);
        const compResult = comparator(a, b);
        if (compResult !== 0) {
          return sort.direction === 'ASC' ? compResult : - compResult;
        }
      }
      return 0;
    });
    return sortedRows;
  }, [rows, sortColumns]);

  const gridElement = (
    <ReactDataGrid columns={allColumns}
      rows={sortedRows}
      rowsCount={ROW_COUNT}
      defaultColumnOptions={
        {
          sortable: true,
          resizable: true
        }
      }
      sortColumns={sortColumns}
      onSortColumnsChange={setSortColumns}/>
  )
  return (
    <> {/* <form onSubmit={handleSubmit}>
        <label>Start date:</label>
        <input type="date" name="start"/>&nbsp;

        <label>End date:</label>
        <input type="date" name="end"/>&nbsp;

        <button type="submit">Go</button>
      </form> */}
      <form onSubmit={handleSubmit}>
        <div className="row">

          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 text-left">
            <div className="form-group clearfix">
              <label className="ladel-titel">Start date:</label>
              <input className="form-control inputs-form picker" type="date" name="start"/>
            </div>
          </div>

          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 text-left">
            <div className="form-group clearfix">
              <label className="ladel-titel">End date:</label>
              <input className="form-control inputs-form picker" type="date" name="end"/>
            </div>
          </div>

          <div className="col-xs-12 col-sm-10 col-md-5 col-lg-5 text-left">
            <div className="form-group clearfix">
              <label className="ladel-titel">Projects:</label>
              <Select closeMenuOnSelect={false}
                value={selectedOption}
                onChange={handleChange}
                options={options}
                isMulti/>
            </div>
          </div>

          <div className="col-xs-12 col-sm-2 col-md-1 col-lg-1 mt-25">
            <div className="form-group clearfix">
              <button className="btn gobtn" type="submit">Go</button>
            </div>
          </div>
        </div>
      </form>
      <div></div>
      <div>
        <br/>
        <ReactDataGrid columns={columns}
          rows={sortedRows}
          rowsCount={ROW_COUNT}
          defaultColumnOptions={
            {
              sortable: true,
              resizable: true
            }
          }
          sortColumns={sortColumns}
          onSortColumnsChange={setSortColumns}
          ref={gridRef}/>
        <br/>
        <div className="row mt-20">
          <div className="col-xs-12  col-sm-6 col-md-6  col-lg-6">
            {/* <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4">
              <ExportButton len={
                  rows.length
                }
                onExport={
                  () => exportToCsv(gridElement, 'Reports.csv')
              }>
                Export to CSV
              </ExportButton>
            </div> */}
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4">
              <ExportButton len={
                  rows.length
                }
                onExport={
                  () => exportToXlsx(gridElement, 'Reports.xlsx')
              }>
                Export to XSLX
              </ExportButton>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 Mweb-mt-20">
            <div className="col-xs-7 col-sm-7 col-md-7  col-lg-8 text-right">
              <span>Row index:
              </span>
              <input className="select-numbers" type="number"
                value={value}
                onChange={
                  (event) => setValue(event.target.value)
                }/>
            </div>
            <div className="col-xs-5 col-sm-5 col-md-5  col-lg-4">
              <button className="btn logout-btn mWeb-fullwidth" type="button"
                onClick={
                  () => gridRef.current.scrollToRow(Number(value))
              }>
                Scroll to row
              </button>
            </div>
          </div>
        </div>
      </div>
      <br/>
    </>
  )

}
export default AllReports
