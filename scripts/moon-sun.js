Hooks.on("ready", () => {
  if (game.user.isGM) {
    game.settings.register("moon-sun-widget", "timeOfDay", {
      name: "Time of Day",
      scope: "world",
      config: false,
      type: String,
      default: "day"
    });
  }
  MoonSunWidget.init();
});

class MoonSunWidget {
  static init() {
    const icon = game.settings.get("moon-sun-widget", "timeOfDay") === "night" ? "🌙" : "☀️";
    const widget = $(`<div id='moon-sun-widget' class='draggable'>${icon}</div>`);
    $(document.body).append(widget);
    this.makeDraggable(widget);
    this.addToggleListener(widget);
  }

  static makeDraggable(widget) {
    widget.draggable({ containment: "window" });
  }

  static addToggleListener(widget) {
    widget.click(async () => {
      if (!game.user.isGM) return;
      const current = game.settings.get("moon-sun-widget", "timeOfDay");
      const newState = current === "day" ? "night" : "day";
      await game.settings.set("moon-sun-widget", "timeOfDay", newState);
      game.socket.emit("module.moon-sun-widget", newState);
      this.updateIcon(newState);
    });
  }

  static updateIcon(state) {
    $("#moon-sun-widget").html(state === "night" ? "🌙" : "☀️");
  }
}

game.socket.on("module.moon-sun-widget", (state) => {
  MoonSunWidget.updateIcon(state);
});