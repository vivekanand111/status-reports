import React from "react";
import "./modal.css";
export default class Confirmation extends React.Component {
  Constructor(props) {
    super.Constructor(props)
  }
  onYes = e => {
    this.props.onYes && this.props.onYes();
  };
  onNo = e => {
    this.props.onNo && this.props.onNo();
  };
  render() {

    console.log('In render of confirmation dialog [' + this.props.show + ']')
    if (!this.props.show) {
      return null;
    } else {
      console.log(this.props.children)
      return (
        <div className="modal">
          <div className="modal-main">
            <div className="confirming">
              <h2 className='mtitle'>{
                this.props.title
              }</h2>
              <div className="mtext"> {
                this.props.children
              }</div>
              <div class="actions">
                <button class="toggle-button" className="buttonyes"
                  onClick={
                    this.onYes
                }>
                  Yes
                </button>
                <span> </span>
                <button class="toggle-button" className="buttonyes"
                  onClick={
                    this.onNo
                }>
                  No
                </button>
              </div>
              <br/>
            </div>
          </div>
        </div>
      )
    }
  }
}
