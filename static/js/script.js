const buttonTitle = new Title("Texto do botão");

const myButton = new Button("azul")
  .appendChild(buttonTitle)
  .setClickHandler((event) => {
    event.preventDefault();
    console.log("Deu certo!");
  });

Builder.buildElements("root", myButton);
