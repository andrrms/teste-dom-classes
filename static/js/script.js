const orchestrator = new ElementManager("root");

const myHeading = new Component("h1")
  .setStyle({
    fontFamily: "sans-serif",
    fontSize: "30px",
    color: "white",
  })
  .setContent("HELLO, WORLD!!!!!");

const myButton = new Component("button")
  .setStyle({
    backgroundColor: "red",
    width: "550px",
    fontSize: "24px",
    border: "none",
    cursor: "pointer",
  })
  .setClickHandler((event) => {
    event.preventDefault();
    console.log("Componente deu certo!");
  })
  .setContent(myHeading);

orchestrator.children(myButton);
