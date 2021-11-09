import React, {useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {nanoid} from '@reduxjs/toolkit'
import {addTask} from '../stars/starsSlice'
import {
  getProjectData,
  getTaskType,
  selectModules,
  selectProjects,
  selectTasksStatus,
  selectTaskTypes
} from './tasksSlice'

const AddTask = ({starId, weekStart}) => {

  const [project, setProject] = useState('')
  const [module, setModule] = useState('')
  const [sprint, setSprint] = useState('')
  const [taskdesc, setTaskDesc] = useState('')
  const [tasktype, setTaskType] = useState('')
  const [tasknotes, setTaskNotes] = useState('')
  const [hours, setHours] = useState()
  const [date, setDate] = useState()
  const divRef = useRef(null);

  const loadingStatus = useSelector(state => state.tasks.status)
  const dispatch = useDispatch()
  
  const weekst=new Date(weekStart) 
  weekst.setDate(weekst.getDate() + 1)
  const weekend=new Date(weekStart)
  weekend.setDate(weekend.getDate() + 7)

  useEffect(() => {
    if (loadingStatus == 'succeeded') {
      dispatch(getProjectData())
      dispatch(getTaskType())
    }
    divRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [loadingStatus])

  const projects = useSelector(state => selectProjects(state))
  const modules = useSelector(state => selectModules(state, project))
  const taskTypes = useSelector(state => selectTaskTypes(state))

  const handle1 = (e) => {
    if (project == '' || project == -1 || hours==undefined || date == undefined || tasktype == '' || tasktype == '-1' || taskdesc == '') {
      alert('Please enter all the input fields')
    } else {
      console.log("POST operation " + starId)
      const obj = {
        project: project,
        module: module,
        sprint: sprint,
        task_desc: taskdesc,
        taskNotes: tasknotes,
        taskType: tasktype,
        hours: hours,
        task_date: date,
        star_id: starId
      }
      dispatch(addTask(obj))
    }
    e.preventDefault();
  }

  return (<>
    <h4 className="clearfix" ref={divRef}>
      <b className="pull-left mt-10">Add task</b>
    </h4>
    <>
    <form className="form1 text-left pt-all">
      <div className="form-group clearfix pt-20">
        <div className="col-lg-6 col-md-6">
          <label className="ladel-titel pt-0">Project :</label>
          <select className="select-inputs"
            value={project}
            onChange={
              (e) => {
                setProject(e.target.value);
              }
          }> {/*  <option value="ezauto">eZAuto</option>
            <option value="eztvel">eZTravel</option>
            <option value="cyberior">Cyberior</option>
            <option value="homecare">HomeCare</option> */}
            <option value="-1">--</option>
            {
            projects.map((i) => {
              return <option> {i}</option>
          })
          } </select>
        </div>
        <div className="col-lg-6 col-md-6">
          <label className="ladel-titel pt-0">Module :</label>
          <select className="select-inputs"
            value={module}
            onChange={
              (e) => setModule(e.target.value)
          }> {/* <option value="vendorSearch">Vendor Search</option>
            <option value="custcreate">Customer Creation</option>
            <option value="custload">Customer Upload</option>
            <option value="vendorregister">Vendor Registration</option> */}
            {
            modules.map((i) => {
              return <option> {i}</option>
          })
          } </select>
        </div>
      </div>
      <div className="form-group clearfix pt-20">
        <div className="col-lg-8 col-md-8">
          <label className="ladel-titel pt-0">Task :</label>
          <input className="inputs-form"
            value={taskdesc}
            type="text"
            onChange={
              (e) => setTaskDesc(e.target.value)
            }/>
        </div>
        <div className="col-lg-4 col-md-4">
          <label className="ladel-titel pt-0">Sprint :</label>
          <input className="inputs-form"
            value={sprint}
            type="text"
            onChange={
              (e) => setSprint(e.target.value)
            }/>
        </div>
      </div>


      <div className="form-group clearfix pt-20">
        <div className="col-lg-6 col-md-6">
          <label className="ladel-titel pt-0">Task Type :</label>
          <select className="select-inputs"
            value={tasktype}
            onChange={
              (e) => setTaskType(e.target.value)
          }> {/* <option value="vendorSearch">Vendor Search</option>
               <option value="custcreate">Customer Creation</option>
               <option value="custload">Customer Upload</option>
               <option value="vendorregister">Vendor Registration</option> */}
            <option value="-1">--</option>
            {
            taskTypes.map((i) => {
              return <option> {i}</option>
          })
          } </select>
        </div>
        <div className="col-lg-3 col-md-3">
          <label className="ladel-titel pt-0">Date :</label>
          <input className="inputs-form picker" type="date" min={weekst.toISOString().split('T')[0]} max={weekend.toISOString().split('T')[0]}
            value={date}
            onChange={
              (e) => setDate(e.target.value)
            }/>
        </div>
        <div className="col-lg-3 col-md-3">
          <label className="ladel-titel pt-0">Hours :</label>
          <input className="inputs-form" type="number" step="any"
            value={hours}
            min="0"
            max="24"
            onChange={
              (e) => setHours(e.target.value)
            }/>
        </div>
      </div>
      <div className="form-group clearfix pt-20">
        <div className="col-lg-12">
          <label className="ladel-titel pt-0">Task Notes :</label>
          <textarea className="inputs-textarea"
            value={tasknotes}
            type="text"
            onChange={
              (e) => setTaskNotes(e.target.value)
          }></textarea>
        </div>

      </div>
      <div className="form-group clearfix pt-20 text-center">
        <div className="col-lg-12">
          <button className="btn save-btn"
            onClick={
              (e) => handle1(e)
          }>Save</button>
        </div>
      </div>

    </form></>
  </>)
}

export default AddTask
