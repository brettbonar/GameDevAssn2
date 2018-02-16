(function () {
  class Text extends Game.Graphic {
    constructor(spec) {
      super(spec);
    }

    static draw(context, params) {
      context.font = params.font || "30px Comic Sans MS";
      context.fillStyle = params.fillStyle || "red";
      context.textAlign = params.textAlign || "start";
      context.fillText(params.text, params.x, params.y);
    }

    render(context) {
      Text.draw(context, this);
    }
  }

  Game.Text = Text;
})();
