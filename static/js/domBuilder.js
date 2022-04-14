class Builder {
  /**
   * @protected
   * @type {HTMLElement}
   */
  static root;
  /**
   * @protected
   * @type {Array<string>}
   */
  static classNamesList = [];
  static stylesNode = document.createElement("style");
  /**
   * @param {string} rootNode
   * @param {Component} parentElement
   */
  static buildElements(rootNode, parentElement) {
    this.root = document.getElementById(rootNode);

    if (!this.root)
      throw new Error(
        "Você precisa definir em seu documento HTML um elemento com o id igual ao primeiro parâmetro passado"
      );

    this.root.appendChild(this.stylesNode);

    /* parentElement.childs.forEach((children) => {
      const childrenIsParent = children.childs.length > 0;

      if (childrenIsParent) {}
    }); */

    if (parentElement.childs) {
      this._buildChildNodes(parentElement);
      this.root.appendChild(parentElement.element());
    }

    this._buildNode(parentElement, this.root);
  }

  /**
   * @private
   * @param {Component} parent
   */
  static _buildChildNodes(parent) {
    const nodes = parent.childs;

    if (nodes) {
      nodes.forEach((node) => {
        if (node.childs?.length > 0) {
          this._buildChildNodes(...node.childs);
        } else {
          this._buildNode(node, parent);
        }
      });
    }
  }

  /**
   *
   * @param {HTMLElement | Component} node
   */
  static _buildNode(node, parent) {
    if (node instanceof Component) {
      this._buildComponentStyle(node);

      if (parent instanceof Component) {
        parent?._element.appendChild(node.element());
      } else {
        parent?.appendChild(node.element());
      }
    } else {
      this._buildComponentStyle(parent);

      if (parent instanceof Component) {
        parent?._element.appendChild(node);
      } else {
        parent?.appendChild(node);
      }
    }
  }

  /**
   * @param {Component} component
   */
  static _buildComponentStyle(component) {
    const name = component.name;
    const [defaultStyles, hoverStyles] = component.stylesCss;

    this.stylesNode.textContent += `.${name} {\n${defaultStyles}}\n`;

    if (hoverStyles)
      this.stylesNode.textContent += `.${name}:hover {\n${defaultStyles}}\n`;
  }
}
