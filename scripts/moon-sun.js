Hooks.once("ready", () => {
  console.log("Moon Sun Widget: Module loaded!");

  // Get the stored time of day setting
  const isNight = game.settings.get("moon-sun-widget", "timeOfDay") === "night";
  
  // Create the widget
  const widget = document.createElement("div");
  widget.id = "moon-sun-widget";
  widget.innerHTML = isNight ? "🌙" : "☀️";
  widget.style.position = "absolute";
  widget.style.top = "10px";
  widget.style.right = "10px";
  widget.style.fontSize = "32px";
  widget.style.cursor = "pointer";
  widget.style.userSelect = "none";
  widget.style.zIndex = "1000";

  document.body.appendChild(widget);

  // Toggle function for GM
  widget.addEventListener("click", async () => {
    if (!game.user.isGM) return;
    const newState = isNight ? "day" : "night";
    await game.settings.set("moon-sun-widget", "timeOfDay", newState);
    game.socket.emit("module.moon-sun-widget", newState);
    widget.innerHTML = newState === "night" ? "🌙" : "☀️";
  });

  // Sync across players
  game.socket.on("module.moon-sun-widget", (state) => {
    widget.innerHTML = state === "night" ? "🌙" : "☀️";
  });
});

// Register Foundry setting
Hooks.once("init", () => {
  game.settings.register("moon-sun-widget", "timeOfDay", {
    name: "Time of Day",
    scope: "world",
    config: false,
    type: String,
    default: "day"
  });
});
