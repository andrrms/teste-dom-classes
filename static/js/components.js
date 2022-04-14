function unCamelCase(string) {
  return string
    .split("")
    .map((char) => {
      if (char === char.toUpperCase()) return `-${char.toLowerCase()}`;
      else return char;
    })
    .join("");
}

class Component {
  /**
   * @constructor
   * @param {keyof HTMLElementTagNameMap} type Tipo do elemento a ser criado
   */
  constructor(type) {
    /**
     * @type {HTMLElement}
     */
    this._element = document.createElement(type);
    /**
     * @typedef CSSComponentTypes
     * @type {{
     *    default: Partial<CSSStyleDeclaration>,
     *    hover: Partial<CSSStyleDeclaration>
     * }}
     * @protected
     */
    this._styles = {
      default: {},
      hover: {},
    };
    /**
     * @type {string}
     * @protected
     */
    this._name = this._generateNameClass();
    this._element.classList.add(this._name);
    /**
     * @type {Array<Component>}
     * @protected
     */
    this._children = [];
    /**
     * @type {Component}
     */
    this._parent = undefined;
  }

  /**
   * @private
   * @returns {string}
   */
  _generateNameClass() {
    const CHARS =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const elementName = this.constructor.name;
    let randomStr = "";

    for (let i = 0; i < 6; i++) {
      randomStr += CHARS[Math.floor(Math.random() * CHARS.length)];
    }

    const finalName = `${elementName}_${randomStr}`;
    return finalName;
  }

  /**
   * @param  {...Component} components Componentes a serem adicionados como filhos deste componente
   * @returns {Component}
   */
  appendChild(...components) {
    components.forEach((component) => {
      component._parent = this;
      this._children.push(component);
    });

    return this;
  }

  /**
   * @returns {string} Conteúdo de texto do elemento
   */
  get text() {
    return this._element.textContent;
  }

  /**
   * @param {string} txt
   */
  setText(txt) {
    this._element.textContent = txt;
    return this;
  }

  /**
   * @param {Partial<CSSStyleDeclaration>} styles
   * @param {keyof CSSComponentTypes} type
   */
  setStyle(styles, type = "default") {
    Object.keys(styles).forEach((declaredStyle) => {
      if (typeof styles[declaredStyle] === "number") {
        this._styles[type][declaredStyle] = `${styles[declaredStyle]}px`;
      } else {
        this._styles[type][declaredStyle] = styles[declaredStyle];
      }
    });

    return this;
  }

  /**
   * @returns {Array<string>}
   */
  get stylesCss() {
    return Object.keys(this._styles).map((type) => {
      return Object.keys(this._styles[type])
        .map(
          (style, i, arr) =>
            `\t${unCamelCase(style)}: ${this._styles[type][style]};${
              i < arr.length ? "\n" : ""
            }`
        )
        .join(" ");
    });
  }

  /**
   * @param  {...string} names Nome da classe
   * @returns {Component}
   */
  addClassName(...names) {
    this._element.classList.add(...names);
    return this;
  }

  /**
   * @param  {...string} names Nome da classe
   * @returns {Component}
   */
  removeClassName(...names) {
    this._element.classList.remove(...names);
    return this;
  }

  get childs() {
    return this._children;
  }

  get name() {
    return this._name;
  }

  element() {
    return this._element;
  }
}

// Não extende a classe Component porque elementos SVG
// precisam de um namespace. Aqui, usamos o método
// document.createElementNS() para criar o elemento.
class SVGIcon {
  /**
   * @param {keyof svgElements} type
   */
  constructor(type) {
    /**
     * Namespace para elementos SVG
     * @type {string}
     * @private
     */
    this.SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    /**
     * @type {SVGElement}
     * @private
     */
    this._element = document.createElementNS(this.SVG_NAMESPACE, "svg");

    this._element.setAttribute("viewBox", "0 0 24 24");

    // Através de ícones descritos no arquivo svgElements.js,
    // definiremos o tipo deste ícone.
    const svgElementData = svgElements[type];
    if (!svgElementData)
      throw new Error(
        "Para criar um ícone SVG, você precisa definir suas propriedades no objeto svgElements"
      );

    svgElementData.properties.split(" ").forEach((property) => {
      const [, propertyName, propertyValue] = property.match(/(.+)="(.+)"/);

      this._element.setAttributeNS(
        this.SVG_NAMESPACE,
        propertyName,
        propertyValue
      );
    });

    this._element.innerHTML = svgElementData.children;
  }

  get element() {
    return this._element;
  }
}

class Button extends Component {
  /**
   * @typedef {"azul"|"branco"} ButtonType
   */
  /**
   * @typedef {{
   *  icon: keyof svgElements
   * }} ButtonOptions
   */
  /**
   * @param {ButtonType} theme Tipo de botão
   * @param {ButtonOptions | undefined} options
   */
  constructor(theme = "azul", options) {
    super("button");

    this.setStyle({
      padding: "4px 8px",
      borderRadius: 4,
      fontSize: 20,
      fontFamily: "sans-serif",
      cursor: "pointer",
    });

    this.setStyle(
      {
        filter: "brightness(125%)",
      },
      "hover"
    );

    switch (theme) {
      case "azul": {
        this.setStyle({
          border: "1px solid #0054db",
          backgroundColor: "#0062ff",
          color: "#fff",
        });
        break;
      }
      case "branco": {
        this.setStyle({
          border: "1px solid #eee",
          backgroundColor: "#eee",
          color: "#000",
        });
        break;
      }
    }

    if (options?.icon) this.setIcon(options.icon);
  }

  /**
   * @private
   * @param {keyof svgElements} type
   */
  setIcon(type) {
    this.appendChild(new SVGIcon(type).element);
    return this;
  }

  /**
   * @param {(ev: MouseEvent) => void} callback Função de callback
   */
  setClickHandler(callback) {
    this._element.addEventListener("click", callback);
    return this;
  }

  delete() {
    this._element.remove();
  }
}

class Title extends Component {
  constructor(text) {
    super("h1");

    this.setStyle({
      fontFamily: "sans-serif",
      fontSize: 30,
      fontWeight: "700",
      textAlign: "center",
    });

    this.setText(text);
  }
}
