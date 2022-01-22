import React, { useState, useRef } from "react";
import * as PIXI from "pixi.js";
import { PixiComponent, Container, useApp, useTick } from "@inlet/react-pixi";
import Bezier from "bezier-js";

// Utils
import { getBezier } from "./math";

const Circle = PixiComponent("Circle", {
  create: () => new PIXI.Graphics(),
  applyProps: (instance, _, props) => {
    const { x, y, radius, fill, stroke } = props;

    instance.clear();
    instance.lineStyle(1, stroke);
    instance.beginFill(fill);
    instance.drawCircle(x, y, radius);
    instance.endFill();
  }
});

const Drag = ({
  app,
  hooker,
  list,
  width,
  height,
  updatePoints,
  updateHookers
}) => {
  const containerRef = useRef();
  const [isMoving, setMove] = useState(false);
  const [pos, setPosition] = useState({ x: 0, y: 0 });

  const updateSegment = (e, eventType) => {
    const pos = e.data.getLocalPosition(e.currentTarget.parent);

    const target = list.find(item => item.id !== hooker.id);

    const targetPosition = {
      x: target.x * width,
      y: target.y * height
    };

    const bezier = getBezier(
      {
        x: pos.x,
        y: pos.y
      },
      targetPosition
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

    updatePoints(segment);
  };

  const handleDragStart = e => {
    setPosition(e.data.getLocalPosition(e.currentTarget.parent));
    setMove(true);
  };

  const handleDragMove = e => {
    if (isMoving) {
      const pos = e.data.getLocalPosition(e.currentTarget.parent);

      containerRef.current.x = pos.x;
      containerRef.current.y = pos.y;

      updateSegment(e, "move");
    }
  };

  const handleDragEnd = e => {
    updateSegment(e, "drop");

    const pos = e.data.getLocalPosition(e.currentTarget.parent);

    updateHookers({
      id: hooker.id,
      x: pos.x / width,
      y: pos.y / height
    });

    setMove(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Container
      ref={containerRef}
      x={hooker.x * width}
      y={hooker.y * height}
      interactive
      buttonMode
      mousedown={handleDragStart}
      mousemove={handleDragMove}
      mouseup={handleDragEnd}
    >
      <Circle x={0} y={0} radius={10} fill={0x8b0000} stroke={0x800080} />
    </Container>
  );
};

const Shape = props => {
  const app = useApp();

  return <Drag app={app} {...props} />;
};

export default Shape;
