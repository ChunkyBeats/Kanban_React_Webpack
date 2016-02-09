import React from 'react';

export default class Note extends React.Component {
  constructor(props) {
    super(props);

    // Track 'editing' state
    this.state = {
      editing: false
    };
  }

  render () {
    // Render the component differently based on state
    if(this.state.editing) {
      return this.renderEdit();
    }

    return this.renderNote();
  }

  renderEdit = () => {
    /* Deal with blur and input handlers here.  These map to DOM events.
       Set selection to input end using a callback as a ref
       Which gets triggered after the component is mounted. */
    return <input type="text"
      ref={
        (e) => e ? e.selectionStart = this.props.task.length : null
      }
      autoFocus={true}
      defaultValue={this.props.task}
      onBlur={this.finishEdit}
      onKeyPress={this.checkEnter} />
  };

  renderNote = () => {
    // If user clicks normal Note, trigger editing logic.

    // return <div onClick={this.edit}>{this.props.task}</div>;
    const onDelete = this.props.onDelete;

    return (
      <div onClick={this.edit}>
        <span className="task">{this.props.task}</span>
        {onDelete ? this.renderDelete() : null}
      </div>
    );
  };

  renderDelete = () => {
    return <button
      className="delete-note"
      onClick={this.props.onDelete}>x</button>;
  };

  edit = () => {
    // Enters edit mode.
    this.setState({
      editing: true
    });
  };

  checkEnter = (e) => {
    // User hits 'enter', lets finish up.
    if (e.key === 'Enter') {
      this.finishEdit(e);
    }
  };

  finishEdit = (e) => {
    /* 'Note' will trigger an optional 'onEdit' callback once it
        has a new value.  We will use this to communicate the change to 'App'. */
    const value = e.target.value;

    if(this.props.onEdit && value.trim()) {
      this.props.onEdit(value);

      // Exit edit mode
      this.setState({
        editing: false
      });
    }
  };
}
