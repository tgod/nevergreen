import React, {Children, Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import Resizable from '../Resizable'
import {ideal, MIN_FONT_SIZE} from './ScaleText'
import FontMetrics from './FontMetrics'
import _ from 'lodash'
import styles from './scaled-grid.scss'
import {VISUALLY_HIDDEN_ATTRIBUTE} from '../VisuallyHidden'

// These need to match those in the CSS
const TABLET_BREAKPOINT = 768
const DESKTOP_BREAKPOINT = 1440

// px
const MIN_CHILD_HEIGHT = 32
const CHILD_MARGIN = 5

function columns(width) {
  if (width < TABLET_BREAKPOINT) {
    return 1
  } else if (width < DESKTOP_BREAKPOINT) {
    return 2
  } else {
    return 3
  }
}

function numberOfRows(totalNumberOfItems, width) {
  return Math.ceil(totalNumberOfItems / columns(width))
}

function numberOfColumns(totalNumberOfItems, width) {
  return Math.min(columns(width), totalNumberOfItems)
}

function calculateChildWidth(totalNumberOfItems, width) {
  const columns = numberOfColumns(totalNumberOfItems, width)
  return Math.floor((width - (columns * CHILD_MARGIN * 2)) / columns)
}

function calculateChildHeight(totalNumberOfItems, width, height) {
  const rows = numberOfRows(totalNumberOfItems, width)
  const calculated = Math.floor((height - (rows * CHILD_MARGIN * 2)) / rows)
  return Math.max(calculated, MIN_CHILD_HEIGHT)
}

function calculateChildDimensions(listNode, fontMetrics, childrenText) {
  const totalNumberOfItems = childrenText.length
  const width = listNode.offsetWidth
  const height = listNode.offsetHeight

  const childWidth = calculateChildWidth(totalNumberOfItems, width)
  const childHeight = calculateChildHeight(totalNumberOfItems, width, height)

  const heightScale = fontMetrics.height
  const widthScale = fontMetrics.width

  const fontSize = ideal(childrenText, childHeight, childWidth, heightScale, widthScale)

  return {childWidth, childHeight, fontSize}
}

function getVisibleChildren(node) {
  if (node.hasChildNodes()) {
    return _.flatten([...node.childNodes]
      .filter((node) => node.nodeName === '#text' || !node.hasAttribute(VISUALLY_HIDDEN_ATTRIBUTE))
      .map(getVisibleChildren))
  }
  return node
}

function getVisibleText(node) {
  return getVisibleChildren(node).map((n) => n.textContent).join('')
}

class ScaledGrid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      childWidth: 0,
      childHeight: MIN_CHILD_HEIGHT,
      fontSize: MIN_FONT_SIZE
    }
    this.childrenText = []
  }

  calculate = () => {
    this.setState(calculateChildDimensions(this.listNode, this.fontMetrics, this.childrenText))
  }

  getTextContent = (childNode, index) => {
    if (childNode) {
      this.childrenText[index] = getVisibleText(childNode)
    } else {
      _.remove(this.childrenText, (v, i) => i === index)
    }
  }

  componentDidMount() {
    this.calculate()
  }

  componentDidUpdate() {
    const dimensions = calculateChildDimensions(this.listNode, this.fontMetrics, this.childrenText)
    if (!_.isEqual(this.state, dimensions)) {
      this.setState(dimensions)
    }
  }

  render() {
    const style = {
      width: `${this.state.childWidth}px`,
      height: `${this.state.childHeight}px`,
      fontSize: `${this.state.fontSize}px`,
      margin: `${CHILD_MARGIN}px`
    }

    return (
      <Fragment>
        <FontMetrics ref={(node) => this.fontMetrics = node}/>
        <ul className={styles.scaledGrid} ref={(node) => this.listNode = node}>
          {
            Children.map(this.props.children, (child, index) => {
              return (
                <li className={styles.item}
                    ref={(node) => this.getTextContent(node, index)}
                    style={style}>
                  {child}
                </li>
              )
            })
          }
        </ul>
        <Resizable onResize={this.calculate}/>
      </Fragment>
    )
  }
}

ScaledGrid.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element
  ]).isRequired
}

export default ScaledGrid
