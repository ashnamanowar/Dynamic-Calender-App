import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const EventModal = ({
  showModal,
  setShowModal,
  selectedDay,
  events,
  setEvents,
  currentEvent,
  setCurrentEvent,
  handleEventChange,
  handleAddEvent,
  handleDeleteEvent
}) => {
  const handleClose = () => setShowModal(false);

  const getBulletColor = (category) => {
    switch (category) {
      case 'work':
        return 'pink';
      case 'personal':
        return 'green';
      case 'others':
        return 'yellow';
      default:
        return 'black';
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Manage Events for day {selectedDay} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="eventName">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={currentEvent.name}
              onChange={handleEventChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="eventStartTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="time"
              name="startTime"
              value={currentEvent.startTime}
              onChange={handleEventChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="eventEndTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="time"
              name="endTime"
              value={currentEvent.endTime}
              onChange={handleEventChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="eventDescription">
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={currentEvent.description}
              onChange={handleEventChange}
            />
          </Form.Group>

          <Form.Group controlId="eventCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              name="category"
              value={currentEvent.category}
              onChange={handleEventChange}
              required
            >
              <option value="">Select Category</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="others">Others</option>
            </Form.Control>
          </Form.Group>

          <Button variant="primary" onClick={handleAddEvent}>
            Add Event
          </Button>
        </Form>

        <h5 className="mt-4">Existing Events</h5>
        {events[selectedDay] && events[selectedDay].map((event, index) => (
          <div key={index} className="border p-2 my-2">
            <div><strong>{event.name}</strong></div>
            <div>{event.startTime} - {event.endTime}</div>
            <div>{event.description}</div>
            <Button variant="danger" onClick={() => handleDeleteEvent(index)} size="sm" className="mt-2">
              Delete Event
            </Button>
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
};

export default EventModal;
