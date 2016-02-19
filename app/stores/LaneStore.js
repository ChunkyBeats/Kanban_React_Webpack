import uuid from 'node-uuid';
import alt from '../libs/alt';
import LaneActions from '../actions/LaneActions';
import update from 'react-addons-update';

class LaneStore {
  constructor() {
    this.bindActions(LaneActions);

    this.lanes = [];
  }

  create(lane) {
    const lanes = this.lanes;

    lane.id = uuid.v4();
    lane.notes = lane.notes || [];

    this.setState({
      lanes: lanes.concat(lane)
    });
  }

  update(updatedLane) {
    const lanes = this.lanes.map(lane => {
      if(lane.id === updatedLane.id) {
        return Object.assign({}, lane, updatedLane);
      }
      return lane;
    });
    this.setState({lanes});
  }

  delete(id) {
    this.setState({
      lanes: this.lanes.filter(lane => lane.id !== id)
    });
  }

  attachToLane(params) {
    // Object being sent from Lane.jsx is an object {laneId, noteId},
    // Need to use those props from params.  Was including laneId and noteId
    //  in an array under laneId before, still unsure why
    const lanes = this.lanes.map(lane => {
      if(lane.notes.includes(params.noteId)) {
        lane.notes = lane.notes.filter(note => note !== params.noteId);
      }

      if(lane.id === params.laneId) {
        if(lane.notes.includes(params.noteId)) {
          console.warn('Already attached note to lane', lanes);
        }
        else {
          lane.notes.push(params.noteId);
        }
      }
      return lane;
    });

    this.setState({lanes});
  }

  detachFromLane({laneId, noteId}) {
    const lanes = this.lanes.map(lane => {
      if(lane.id === laneId) {
        lane.notes = lane.notes.filter(note => note !== noteId);
      }

      return lane;
    });

    this.setState({lanes});
  }

  move({sourceId, targetId}) {
    const lanes = this.lanes;
    const sourceLane = lanes.filter(lane =>
      lane.notes.includes(sourceId))[0];
    const targetLane = lanes.filter(lane =>
      lane.notes.includes(targetId))[0];
    const sourceNoteIndex = sourceLane.notes.indexOf(sourceId);
    const targetNoteIndex = targetLane.notes.indexOf(targetId);

    if(sourceLane === targetLane) {
      // Move at once to avoid complications
      sourceLane.notes = update(sourceLane.notes, {
        $splice: [
          [sourceNoteIndex, 1],
          [targetNoteIndex, 0, sourceId]
        ]
      });
    }
    else {
      // Get rid of the source
      sourceLane.notes.splice(sourceNoteIndex, 1);
      // And move it to the target
      targetLane.notes.splice(targetNoteIndex, 0, sourceId);
    }
    this.setState({lanes});
  }
}

export default alt.createStore(LaneStore, 'LaneStore');
