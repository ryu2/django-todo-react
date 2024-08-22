
import React, {useState} from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

export function ActivityFinder(props) {
  const [activityState, setActivityState] = useState(props);

  return (
      <Modal isOpen={true} toggle={props.toggleFinder}>
        <ModalHeader toggle={props.toggleFinder}>Find Activities</ModalHeader>
        <ModalBody  style={{ cursor: props.gettingData ? 'wait' : 'default' }}>
          <Form> 
            <FormGroup>
              <Label for="location-title">Location of activities</Label>
              <Input
                type="text"
                id="location-title"
                name="location"
                value={activityState.location}
                onChange={(e) => setActivityState(prev => ({...prev, location: e.target.value}))}
                placeholder='example: "London" or "Paris, France"'
              />
            </FormGroup>
            <FormGroup>
              <Label for="location-duration">How long will you be staying?</Label>
              <Input
                type="text"
                id="location-duration"
                name="duration"
                value={activityState.duration}
                onChange={(e) => setActivityState(prev => ({...prev, duration: e.target.value}))}
                placeholder='example: "2 days" or "3 hours"'
              />
            </FormGroup>
            <FormGroup>
              <Label for="interests">Describe any special activities or circumstances to refine your search (optional)</Label>
              <Input
                type="textarea"
                id="interests"
                name="interests"
                value={activityState.interests}
                onChange={(e) => setActivityState(prev => ({...prev, interests: e.target.value}))}
                placeholder='example: "I enjoy a mix of culture, history, good food and outdoor activities" or "Celebrate a 10 year anniversary."'
              />
            </FormGroup>
            <FormGroup>
              <Label for="limit">Limit activities to:</Label>
              <Input
                type="number"
                id="limit"
                name="limit"
                value={activityState.limit}
                onChange={(e) => setActivityState(prev => ({...prev, limit: e.target.value}))}
                pattern="\d+"
                placeholder="Enter number of activites"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            style={{ cursor: props.gettingData ? 'wait' : 'default' }}
            color="success"
            onClick={() => props.onFind(activityState.location, activityState.duration, activityState.interests, activityState.limit)}
          >
            Find Activities
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

