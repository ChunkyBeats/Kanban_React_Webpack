import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';

import LaneActions from '../actions/LaneActions';

export default class Lane extends React.Component {
  constructor() {
    super();
    this.addNote = this.addNote.bind(this);
  }

  render() {
    const {lane, ...props} = this.props;

    return (
      <div {...props}>
        <div className="lane-header">
          <div className="lane-add-note">
            <button onClick={this.addNote}>+</button>
          </div>
          <div className="lane-name">{lane.name}</div>
        </div>
        <AltContainer
          stores={[NoteStore]}
          inject={{
            notes: () => NoteStore.getNotesByIds(lane.notes)
            // notes: () => NoteStore.getState().notes || []
          }}>
          <Notes onEdit={this.editNote} onDelete={this.deleteNote} />
        </AltContainer>
      </div>
    );
  }

  editNote(id, task) {
    if(!task.trim()) {
      return;
    }
    NoteActions.update({id, task});
  }

  addNote = (e) => {
    // Cannot get the id of this.props.lane.id -> made by uuid
    // Not getting set in props? Does it need to?
    const laneId = this.props.lane.id;
    const note = NoteActions.create({task: 'New Task'});
    console.log("note id", note.id);
    console.log("bleh", this.props.lane.id);

    LaneActions.attachToLane({
      landId: laneId,
      noteId: note.id
    });
  };

  deleteNote = (noteId, e) => {
    e.stopPropagation();

    const laneId = this.props.lane.id;

    LaneActions.detachFromLane({laneId, noteId});
    NoteActions.delete(noteId);
  };
}
