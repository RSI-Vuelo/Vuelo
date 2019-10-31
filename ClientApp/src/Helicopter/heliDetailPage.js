import React, { useState } from "react";
import { Input, Button, Form, notification, List, Col, Row } from "antd";
import { useLocation } from "react-router";
import Config from "../config/app.local.config";
import Banner from '../NavHeader/banner';


const HeliDetailPage = () => {
  let location = useLocation();
  const heli = location.state.helicopter;
  const [heliUrl] = useState(heli.url);
  const [model, setmodel] = useState(heli.model);
  const [type, setType] = useState(heli.type);
  const [capacityWeight, setCapacityWeight] = useState(heli.capacityWeight);
  const [crewMax, setCrewMax] = useState(heli.crewMax);
  const [crewMin, setCrewMin] = useState(heli.crewMin);
  const [fuselageLength, setFuselageLength] = useState(heli.fuselageLength);
  const [heliHeight, setHeliHeight] = useState(heli.height);
  const [rotorDiam, setRotorDiameter] = useState(heli.rotorDiameter);
  const [maxSpeed, setMaxSpeed] = useState(heli.maxSpeed);
  const [auth] = useState(localStorage.getItem("token") || "");

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  };

  function deleteHeli() {
    fetch(`${Config.helicopterServiceUrl}${heli._id}`, {
      method: `DELETE`
    })
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
      })
      .catch(err => {
        notification["error"]({
          message: "Oh No! Something went wrong!",
          description: `Sorry about that! Your Helicopter was not deleted`
        });
      });
  }

  function updateHelicopter() {

    const heli = { type, model, capacityWeight, crewMax, crewMin, fuselageLength, heliHeight, rotorDiam, maxSpeed };


    fetch(`${Config.helicopterServiceUrl}`, {
      method: `PUT`,
      body: JSON.stringify(heli)
    })
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
      })
      .catch(err => {
        handleError(err);
      });
  }

  function handleError(err) {
    notification["error"]({
      message: "Oh No! Something went wrong!",
      description: `Sorry about that! It will be back up and running in a jiffy! We were unable to add your class to the list.`
    });
  }

  return (
    <>
      <div className='mainContent'>
        <Banner />
        {auth ? (
          <>
            <h6 className="big-title">Edit Helicopter</h6>
            <Form
              {...formItemLayout}
              onSubmit={event => {
                event.preventDefault();
                updateHelicopter();
              }}
            >
              <Form.Item label="Type">
                <Input
                  type="text"
                  placeholder="Type"
                  name="type"
                  value={type}
                  onChange={e => setType(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Model">
                <Input
                  type="text"
                  placeholder="Model"
                  name="model"
                  value={model}
                  onChange={e => setmodel(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Capacity Weight">
                <Input
                  type="text"
                  placeholder="Capacity Weight"
                  name="capacityWeight"
                  value={capacityWeight}
                  onChange={e => setCapacityWeight(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Crew Maximum">
                <Input
                  type="text"
                  placeholder="Crew Maximum"
                  name="crewMax"
                  value={crewMax}
                  onChange={e => setCrewMax(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Crew Minimum">
                <Input
                  type="text"
                  placeholder="Crew Minimum"
                  name="crewMin"
                  value={crewMin}
                  onChange={e => setCrewMin(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Fuselage Length">
                <Input
                  type="text"
                  placeholder="Fuselage Length"
                  name="fuselageLength"
                  value={fuselageLength}
                  onChange={e => setFuselageLength(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Helicopter Height">
                <Input
                  type="text"
                  placeholder="Helicopter Height"
                  name="heliHeight"
                  value={heliHeight}
                  onChange={e => setHeliHeight(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Rotor Diameter">
                <Input
                  type="text"
                  placeholder="Rotor Diameter"
                  name="rotorDiam"
                  value={rotorDiam}
                  onChange={e => setRotorDiameter(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Max Speed">
                <Input
                  type="text"
                  placeholder="Max Speed"
                  name=""
                  value={maxSpeed}
                  onChange={e => setMaxSpeed(e.target.value)}
                />
              </Form.Item>
              <span>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="action-button"
                >
                  Submit
              </Button>
                <Button
                  type="danger"
                  onClick={deleteHeli}
                  className="action-button"
                >
                  Delete
              </Button>
              </span>
            </Form>
          </>
        ) : (
            <>
              <Row>
                <Col span={24}>
                  <h6 className="big-title">
                    {type} {model}
                  </h6>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <img src={heliUrl} className="detailImg" alt={model} />
                </Col>
                <Col span={8}>
                  <List
                    bordered
                    styles={{
                      fontSize: "50px"
                    }}
                    itemLayout="horizontal"
                    grid={{
                      gutter: 40,
                      xs: 1,
                      sm: 2,
                      md: 3,
                      lg: 4,
                      xl: 4
                    }}
                  >
                    <List.Item>
                      <p>{`Type: ${type}`}</p>
                    </List.Item>
                    <List.Item>
                      <p>{`Model: ${model}`}</p>
                    </List.Item>
                    <List.Item>
                      <p>{`Capacity Weight: ${capacityWeight}`}</p>
                    </List.Item>
                    <List.Item>
                      <p>{`Crew Maximum: ${crewMax}`}</p>
                    </List.Item>
                    <List.Item>
                      <p>{`Crew Minimum: ${crewMin}`}</p>
                    </List.Item>
                    <List.Item>
                      <p>{`Fuselage Length: ${fuselageLength}`}</p>
                    </List.Item>
                    <List.Item>
                      <p>{`Helicopter Height: ${heliHeight}`}</p>
                    </List.Item>
                    <List.Item>
                      <p>{`Rotor Diameter: ${rotorDiam}`}</p>
                    </List.Item>
                    <List.Item>
                      <p>{`Max Speed: ${maxSpeed}`}</p>
                    </List.Item>
                  </List>
                </Col>
              </Row>
            </>
          )}
      </div>
    </>
  );
};
export default HeliDetailPage;
