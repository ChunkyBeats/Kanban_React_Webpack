import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

class NoteStore {
  constructor() {
    this.bindActions(NoteActions);
    this.notes = [];
  }
  create(note){
    const notes = this.notes;

    note.id = uuid.v4();

    this.setState({
      notes: notes.concat(note)
    });
  }
  update(updatedNote) {
    const notes = this.notes.map(note => {
      if(note.id === updatedNote.id) {
        /* Object.assign used to patch note data.  It mutates the target
           (first parameter). To avoid, {} is used as its target and apply
           data on it */
        return Object.assign({}, note, updatedNote);
      }
      return note;
    });
    // {notes} here is ES6 "property shorthand" and equals {notes: notes}
    this.setState({notes})

  }
  delete(id) {
    this.setState({
      notes: this.notes.filter(note => note.id !== id)
    });
  }
}

export default alt.createStore(NoteStore, 'NoteStore');
