const getControlPoint = (origin, target, percentage) => ({
  x: (1 - percentage) * origin.x + percentage * target.x,
  y: (1 - percentage) * origin.y + percentage * target.y
});

export const getBezier = (originPosition, targetPosition) => {
  const cx = (originPosition.x + targetPosition.x) / 2;
  const cy = (originPosition.y + targetPosition.y) / 2;
  const dx = (targetPosition.x - originPosition.x) / 2;
  const dy = (targetPosition.y - originPosition.y) / 2;

  const origin = {
    x: cx - dy,
    y: cy + dx
  };

  const target = {
    x: cx + dy,
    y: cy - dx
  };

  const firstControlPoint = getControlPoint(origin, target, 0.4);
  const sencondControlPoint = getControlPoint(origin, target, 0.6);
  const middlePoint = getControlPoint(origin, target, 0.5);

  return [
    originPosition,
    targetPosition,
    firstControlPoint,
    sencondControlPoint,
    middlePoint
  ];
};
