MyGame.graphics = (function () {
  let canvas = document.getElementById("canvas-main");
  let context = canvas.getContext("2d");

  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function Rectangle(spec) {
    let that = {};

    that.updateRotation = function (angle) {
      spec.rotation += angle;
    };

    that.draw = function () {
      context.save();
      context.translate(spec.x + spec.width / 2, spec.y + spec.height / 2);
      context.rotate(spec.rotation);
      context.translate(-(spec.x + spec.width / 2), -(spec.y + spec.height / 2));

      context.fillStyle = spec.fillStyle;
      context.fillRect(spec.x, spec.y, spec.width, spec.height);
      context.strokeStyle = spec.strokeStyle
      context.strokeRect(spec.x, spec.y, spec.width, spec.height);

      context.restore();
    };

    return that;
  }

  function Triangle(spec) {
    let that = {};

    that.updateRotation = function (angle) {
      spec.rotation += angle;
    };

    that.draw = function () {
      context.save();
      context.translate(spec.center.x, spec.center.y);
      context.rotate(spec.rotation);
      context.translate(-spec.center.x, -spec.center.y);

      context.beginPath();
      context.moveTo(spec.pt1.x, spec.pt1.y);
      context.lineTo(spec.pt2.x, spec.pt2.y);
      context.lineTo(spec.pt3.x, spec.pt3.y);
      context.closePath();

      context.fillStyle = spec.fillSTyle;
      context.fill();
      context.strokeStyle = spec.strokeStyle;
      context.stroke();

      context.restore();
    };

    return that;
  }

  function Line(spec) {
    let that = {};

    that.update
  }

  return {
    clear: clear,
    Rectangle: Rectangle,
    Triangle: Triangle
  };
})();
