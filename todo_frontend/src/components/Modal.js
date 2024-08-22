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

export function CustomModal(props) {
  const [modalState, setModalState] = useState(props.activeItem);

  return (
    <Modal isOpen={true} toggle={props.toggle}>
      <ModalHeader toggle={props.toggle}>Todo Item</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="todo-title">Title</Label>
            <Input
              type="text"
              id="todo-title"
              name="title"
              value={modalState.title}
              onChange={(e) => setModalState(prev => ({...prev, title: e.target.value}))}
              placeholder="Enter Todo Title"
            />
          </FormGroup>
          <FormGroup>
            <Label for="todo-description">Description</Label>
            <Input
              type="text"
              id="todo-description"
              name="description"
              value={modalState.description}
              onChange={(e) => setModalState(prev => ({...prev, description: e.target.value}))}
              placeholder="Enter Todo description"
            />
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                name="completed"
                checked={modalState.completed}
                onChange={(e) => setModalState(prev => ({...prev, completed: e.target.checked}))}
              />
              Completed
            </Label>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={() => props.onSave(modalState)}
        >
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
}
