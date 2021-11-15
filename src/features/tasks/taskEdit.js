import React, {useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {deleteTask, selectStarById, updateTask} from '../stars/starsSlice'
import {
  getProjectData,
  getTaskType,
  selectModules,
  selectProjects,
  selectTaskTypes,
  setTabMode
} from '../tasks/tasksSlice'
import Confirmation from '../util/Confirmation'

const TaskEdit = ({starId, taskId, weekStart}) => {

  const star = useSelector(state => selectStarById(state, starId))
  const t = star.tasks[star.tasks.findIndex(i => i.id === taskId)]
  const dateformat = (date) => {
    var d = new Date(date)
    //d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  }
  const [project, setProject] = useState('')
  const [module, setModule] = useState('')
  const [sprint, setSprint] = useState('')
  const [taskdesc, setTaskDesc] = useState('')
  const [tasktype, setTaskType] = useState('')
  const [tasknotes, setTaskNotes] = useState('')
  const [hours, setHours] = useState('')
  const [date, setDate] = useState('')
  const [showConfirmation, setShowConfirmation] = useState()
  const [progress, setProgress] = useState(true)
  const dispatch = useDispatch()
  const loadingStatus = useSelector(state => state.tasks.status)
  const divRef = useRef(null);

  useEffect(() => {
    if (loadingStatus == 'succeeded') {
      dispatch(getProjectData())
      dispatch(getTaskType())
    }
    setProject(t.project)
    setModule(t.module)
    setSprint(t.sprint)
    setTaskDesc(t.task_desc)
    setTaskType(t.task_type)
    setTaskNotes(t.task_notes)
    setHours(t.hours)
    setDate(dateformat(t.task_date))
    setShowConfirmation(false)
    console.log(progress)
    setTimeout(()=>{
      setProgress(false)
    },1000)
    setProgress(true)
    divRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [loadingStatus, taskId])

  const projects = useSelector(state => selectProjects(state))
  const modules = useSelector(state => selectModules(state, project))
  const taskTypes = useSelector(state => selectTaskTypes(state))

  const weekst=new Date(weekStart) 
  weekst.setDate(weekst.getDate() + 1)
  const weekend=new Date(weekStart)
  weekend.setDate(weekend.getDate() + 7)


  const handleUpdate = (e) => {
    console.log("Updating task, taskid " + taskId)
    if (hours==='' || date === '' || taskdesc === '') {
      alert('Please enter the input fields')
    }else{
      const obj = {
        id: taskId,
        project: project,
        module: module,
        sprint: sprint,
        task_desc: taskdesc,
        taskType: tasktype,
        taskNotes: tasknotes,
        hours: hours,
        task_date: date,
        starId: starId
      }
      dispatch(updateTask(obj))
      dispatch(setTabMode({starId: starId, mode: 'view'}));
    }
    e.preventDefault();
    
  }
  const handleDelete = (e) => {
    setShowConfirmation(true)
    e.preventDefault()
  }

  const processDelete = (e) => {
    console.log("DELETE operation taskid " + taskId)
    const obj = {
      id: taskId,
      star_id: starId
    }
    dispatch(deleteTask(obj))
    dispatch(setTabMode({starId: starId, mode: 'view'}));
    // e.preventDefault();
  }

  return (<>
    <h4 className="clearfix" ref={divRef}>
      <b className="pull-left mt-10 mb-10">Edit task</b>  { progress && <p style={{color:'green', margin:'10px'}}>&#10003; Task Selected </p>}
    </h4>
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
          }> {/* <option value="ezauto">eZAuto</option>
              <option value="eztvel">eZTravel</option>
              <option value="cyberior">Cyberior</option>
              <option value="homecare">HomeCare</option> */}
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
            style={
              {marginRight: '15px'}
            }
            onClick={
              (e) => handleUpdate(e)
          }>Update</button>
          <button className="btn save-btn"
            onClick={
              (e) => handleDelete(e)
          }>Delete</button>
        </div>
      </div>
      {
      showConfirmation && <Confirmation show={showConfirmation}
        title="Confirmation"
        onYes={
          () => {
            processDelete()
            setShowConfirmation(false)
          }
        }
        onNo={
          () => {
            setShowConfirmation(false)
          }
      }>
        Do you really want to Delete ?
      </Confirmation>
    } </form>

  </>)
}

export default TaskEdit
