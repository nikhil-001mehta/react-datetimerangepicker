import React, { Component } from "react";
import PropTypes from "prop-types";
export default class InsideOutsideClickDetector extends Component {
  node = null;
  constructor(props) {
    super(props);
    this.handleDocumentClick = ::this.handleDocumentClick;
  }
  componentDidMount() {
    document.addEventListener("click", this.handleDocumentClick);
  }
  handleDocumentClick(event) {
    let current = event.target;
    event.preventDefault();
    event.stopPropagation();
    if (event.nativeEvent && event.nativeEvent.stopImmediatePropagation) {
      event.nativeEvent.stopImmediatePropagation();
    }
    if (this.node.compareDocumentPosition) {
      if (
        this.node.compareDocumentPosition(current) &
        window.Node.DOCUMENT_POSITION_CONTAINED_BY
      ) {
        return this.props.clickHandler(true);
      }
    } else if (this.node.contains) {
      if (this.node.contains(current)) {
        return this.props.clickHandler(true);
      }
    } else {
      do {
        if (current === this.node) {
          return this.props.clickHandler(true);
        }
        current = current.parentNode;
      } while (current);
    }
    this.props.clickHandler(false);
  }
  render() {
    return (
      <div
        className="insideOutsideClickHandler-wrapper"
        onClick={this.handleDocumentClick}
        ref={node => {
          this.node = node;
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

InsideOutsideClickDetector.propTypes = {
  children: PropTypes.object.isRequired,
  clickHandler: PropTypes.func.isRequired
};
