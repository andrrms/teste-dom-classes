class ElementManager {
  /**
   * @constructor
   * @param {string | HTMLElement} rootElement
   */
  constructor(rootElement) {
    this.root = rootElement;

    if (typeof rootElement === "string") {
      this.root = document.getElementById(rootElement);
    }

    if (!this.root)
      throw new Error(
        "Você precisa passar um elemento raíz ou uma string de id existente no seu HTML."
      );

    /**
     * @type {Array<string>}
     */
    this.classNamesList = [];
    this.stylesNode = this.root.appendChild(document.createElement("style"));
  }

  /**
   * @private
   * @param {Component} element
   * @returns {string}
   */
  _generateClassName(element) {
    const finalName = element._generateName();

    if (this.classNamesList.find((name) => name === finalName)) {
      return this._generateClassName(element);
    }

    this.classNamesList.push(finalName);
    return finalName;
  }

  /**
   * @param {Component} element
   */
  _parseElementStyles(element) {
    const randomName = this._generateClassName(element);
    const styleString = element.stylesAsString;

    element.addClassName(randomName);
    this.stylesNode.textContent += `.${randomName} {\n${styleString}\n}\n`;
  }

  /**
   * @param {Component} element
   */
  _appendElement(element, root) {
    // Tenho que fazer recursividade aqui para
    // dar append nos filhos dos elementos
    if (!root) {
      this._parseElementStyles(element);
      const appendNode = element.buildElement();
      //this._appendElement(element);
    } else {
      this._parseElementStyles(element);
      this.root.appendChild(element.buildElement());
    }
  }

  /**
   * @param  {...Component} elements
   */
  children(...elements) {
    elements.forEach((element) => {
      if (element instanceof Component) {
        if (element._children.length > 0) {
          element._children.forEach((child) => this._appendElement(child));
        } else {
          this._appendElement(element, true);
        }
      } else {
        throw new Error(
          "Você precisa passar um elemento válido e que extenda a classe Component"
        );
      }
    });
  }
}

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
   * @param {keyof HTMLElementTagNameMap} type
   */
  constructor(type) {
    /**
     * @type {HTMLElement}
     * @private
     */
    this._element = document.createElement(type);
    /**
     * @type {Partial<CSSStyleDeclaration>}
     * @private
     */
    this._styles = {};
    this._name = this._generateName();
    this._children = [];
  }

  _generateName() {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const elementName = this.constructor.name;
    let randomStr = "";

    for (let i = 0; i < 6; i++) {
      randomStr += chars[Math.floor(Math.random() * chars.length)];
    }

    const finalName = `${elementName}_${randomStr}`;
    return finalName;
  }

  /**
   * @param {string | HTMLElement} data
   */
  setContent(data) {
    if (typeof data === "string") {
      this._element.textContent = data;
    } else {
      this._children.push(data);
    }

    return this;
  }

  /**
   * @param {(ev: MouseEvent) => void} callback
   * @returns {Component}
   */
  setClickHandler(callback) {
    this._element.addEventListener("click", callback);
    return this;
  }

  /**
   * @param {Partial<CSSStyleDeclaration>} styles
   */
  setStyle(styles) {
    Object.keys(styles).forEach((declaredStyle) => {
      this._styles[declaredStyle] = styles[declaredStyle];
    });

    return this;
  }

  get stylesAsString() {
    return Object.keys(this._styles)
      .map(
        (style, i, arr) =>
          `\t${unCamelCase(style)}: ${this._styles[style]};${
            i < arr.length - 1 ? "\n" : ""
          }`
      )
      .join(" ");
  }

  addClassName(...names) {
    this._element.classList.add(...names);
    return this;
  }

  removeClassName(...names) {
    this._element.classList.remove(...names);
    return this;
  }

  buildElement() {
    return this._element;
  }
}
