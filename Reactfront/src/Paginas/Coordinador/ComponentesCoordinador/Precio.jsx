import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


function Precio() {
  return (
    <div style={{ marginTop: '40px' }}>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <Card.Title style={{ color: '#1ECCCC' }}>Ingresar precio de horas</Card.Title>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col>
              <Card.Text>
                Valor actual
              </Card.Text>
            </Col>
            <Col>
              <ListGroup>
                <ListGroup.Item> $7000</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col xs="auto" className="d-flex justify-content-between">
              <Button type="submit" className='color-btn'>Guardar</Button>
              <Form.Control
                type="text"
                placeholder="$7000"
                className="mr-sm-2 custom-input-small"
              />

            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Precio;
