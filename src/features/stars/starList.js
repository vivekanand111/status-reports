import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {
  fetchStars,
  selectStarIds,
  selectStars,
  StarStatus,
  submitStar
} from './starsSlice';
import TaskList from '../tasks/taskList';
import {initViewModes} from '../tasks/tasksSlice';
import Confirmation from '../util/Confirmation';

const StarList = ({uid}) => {

  let indexPlus;

  const [activeIndex, setActiveIndex] = useState(0);
  // const [state, setstate] = useState(initialState)
  const dispatch = useDispatch()
  const loadingStatus = useSelector(state => state.stars.status)
  // console.log(loadingStatus)
  // console.log(useSelector(selectStars))
  const data = Object.entries(useSelector(selectStars))
  const starIds = useSelector(state => selectStarIds(state))

  const error = useSelector(state => state.stars.error)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    if (loadingStatus == StarStatus.IDLE) {
      dispatch(fetchStars(uid))
    }
  }, [loadingStatus, data])


  const selectStarHandler = (e, index, starId) => {
    console.log("selectStarHandler " + starId)
    setActiveIndex(index);
    if (activeIndex === index) {
      setActiveIndex(-1)
    }
    dispatch({type: 'tasks/setCurStarId', payload: starId})
    if (showConfirmation) {
      setShowConfirmation(false)
    }
    e.preventDefault();
  }
  const processSubmit = (starId, status) => {
    if (status === 'Open') {
      dispatch(submitStar(starId))
    }
    setActiveIndex(-1)
  }
  const submitHandle = (e) => {
    setShowConfirmation(true)
    e.preventDefault();
  }

  const indexCount = (index) => {
    indexPlus = index + 1;
    return indexPlus;
  }


  let content = 'Loading...'

  if (loadingStatus == StarStatus.FAILED) {
    content = <h1>No Data Available</h1>
  }
  if (loadingStatus === StarStatus.SUCCEEDED) { // console.log(data)
    dispatch(initViewModes(starIds))
    // console.log(data)
    if (data.length === 0) {
      content = <h1>No data Available</h1>
    } else {
      content = <form> {
        data.map(([index, star]) => (
          <div key={index}>
            <h3>
              <button id="button1"
                onClick={
                  (e) => selectStarHandler(e, index, star.id)
                }
                className={
                  activeIndex === index ? 'active' : 'inactive'
                }
                aria-expanded={
                  activeIndex === index ? 'true' : 'false'
                }
                aria-controls={
                  'sect-' + indexCount(index)
                }
                aria-disabled={
                  activeIndex === index ? 'true' : 'false'
                }
                tabIndex={
                  indexCount(index)
              }>
                <span className="title-wrapper">
                  {
                  'Week starting ' + star.weekStart + ' ' + star.status
                }
                  <span className={
                    activeIndex === index ? 'minus' : 'plus'
                  }></span>
                </span>
              </button>
            </h3>
            {
            activeIndex === index && showConfirmation && <Confirmation show={showConfirmation}
              title="Confirmation"
              onYes={
                () => {
                  processSubmit(star.id, star.status)
                  setShowConfirmation(false)
                }
              }
              onNo={
                () => {
                  setShowConfirmation(false)
                }
            }>
              Do you really want to Submit ? <br/>Once submitted you can not edit the report.
            </Confirmation>
          }
            <div id={
                'sect-' + indexCount(index)
              }
              className={
                activeIndex === index ? 'panel-open' : 'panel-close'
            }>

              <TaskList starId={
                star.id
              }/> {
              activeIndex === index && star.status == "Open" && <button className="btn submit-btn"
                style={
                  {float: "right"}
                }
                onClick={
                  (e) => submitHandle(e)
              }>Submit</button>
            } </div>

          </div>
        ))
      } </form>
    }
  }
  return (
    <div>{content}</div>
  );
}

export default StarList;
