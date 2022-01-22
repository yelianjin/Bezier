import React, { Component, Fragment } from "react";
import * as PIXI from "pixi.js";
import { Stage, Container, SimpleRope } from "@inlet/react-pixi";
import Bezier from "bezier-js";

// Components
import Shape from "./Shape";

// Math
import { getBezier } from "./math";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      hookers: [
        {
          id: 1,
          x: 0.1,
          y: 0.1
        },
        {
          id: 2,
          x: 0.75,
          y: 0.8
        }
      ],
      containerRef: null,
      position: {},
      bezier: [],
      points: [
        {
          x: 0,
          y: 0
        }
      ]
    };
  }

  componentDidMount() {
    this.getInitialRope();
  }

  getInitialRope = () => {
    const { hookers, width, height } = this.state;

    const bezier = getBezier(
      {
        x: hookers[0].x * width,
        y: hookers[0].y * height
      },
      {
        x: hookers[1].x * width,
        y: hookers[1].y * height
      }
    );

    const line = new Bezier([
      bezier[0].x,
      bezier[0].y,
      bezier[2].x,
      bezier[2].y,
      bezier[3].x,
      bezier[3].y,
      bezier[1].x,
      bezier[1].y
    ]);

    const segment = line.getLUT(16).map(item => new PIXI.Point(item.x, item.y));

    this.setState({
      bezier: segment
    });
  };

  updateHookers = info => {
    const { hookers } = this.state;

    const filteredHookers = hookers.filter(item => item.id !== info.id);

    this.setState({
      hookers: filteredHookers.concat(info)
    });
  };

  updatePoints = bezier => {
    this.setState({
      bezier
    });
  };

  renderHookers = () => {
    const { hookers, width, height } = this.state;

    return hookers.map(hooker => (
      <Shape
        key={hooker.id}
        hooker={hooker}
        width={width}
        height={height}
        list={hookers}
        updateHookers={this.updateHookers}
        updatePoints={this.updatePoints}
      />
    ));
  };

  renderBezier = () => {
    const { bezier } = this.state;

    if (bezier.length === 0) return null;

    const cable = PIXI.Texture.from(
      "https://dev-media.strytegy.com/textures/connector.png"
    );
    cable.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

    return (
      <SimpleRope
        name="bezier"
        texture={cable}
        points={bezier}
        autoUpdate
        // hitArea={new PIXI.Polygon(...bezier)}
        interactive
        buttonMode
        click={ev => {
          console.log("BEZIER CLICK!!!");
        }}
      />
    );
  };

  render() {
    const { width, height } = this.state;

    return (
      <Fragment>
        <Stage
          options={{
            width,
            height,
            resolution: 2,
            autoDensity: true,
            backgroundColor: 0xffffff
          }}
        >
          <Container
            ref={node => {
              this.container = node;
            }}
          >
            {this.renderBezier()}
            {this.renderHookers()}
          </Container>
        </Stage>
        <span
          style={{
            position: "fixed",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "1.5rem"
          }}
        >
          Drag the Circles!
        </span>
      </Fragment>
    );
  }
}

export default App;
