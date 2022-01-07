const React = require('react')
const PropTypes = require('prop-types')
const Draggable = require('react-draggable')
const defaultLineup = require('./defaultLineup')
let pieceComponents = require('./pieces')
const {fromPieceDecl, charCodeOffset} = require('./decode')

// const ResizeAware = resizeAware.default || resizeAware
const getDefaultLineup = () => defaultLineup.slice()
const noop = () => {
  /* intentional noop */
}

const square = 100 / 8
const squareSize = `${square}%`

const squareStyles = {
  width: squareSize,
  paddingBottom: squareSize,
  float: 'left',
  position: 'relative',
  pointerEvents: 'none'
}

const labelStyles = {fontSize: 'calc(7px + .5vw)', position: 'absolute', userSelect: 'none'}

export class Chess extends React.Component {
  constructor(...args) {
    super(...args)

    this.els = {}
    this.state = {}
    this.setBoardRef = el => (this.els.board = el)
    this.handleDragStart = this.handleDragStart.bind(this)
    this.handleDragStop = this.handleDragStop.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
  }

  getSquareColor(x, y) {
    
    let {lightSquareColor, darkSquareColor} = this.props
    if (this.state.showPromotion) {
      lightSquareColor = this.props.lightGreyedOutColor
      darkSquareColor = this.props.darkGreyedOutColor
    }
    const odd = x % 2

    if (this.props.highlights.length === 2) {
      const square0 = fromPieceDecl(this.props.highlights[0]);
      const square1 = fromPieceDecl(this.props.highlights[1]);
      if ((square0.x === x && square0.y === 7-y) ||
          (square1.x === x && square1.y === 7-y)) {
        lightSquareColor = this.props.lightHighlightColor;
        darkSquareColor = this.props.darkHighlightColor;
      }
    }

    if(this.props.check !== "") {
      let king_in_check = this.props.pieces.filter(p => 
          p.split("@")[0] === (this.props.check + "K")
        )[0];
      const king_square = fromPieceDecl(king_in_check);
      if(king_square.x === x && king_square.y === 7-y) {
        lightSquareColor = this.props.lightCheckColor;
        darkSquareColor = this.props.darkCheckColor;
      }
    }
    
    if (y % 2) {
      return odd ? lightSquareColor : darkSquareColor
    }

    return odd ? darkSquareColor : lightSquareColor
  }

  componentDidMount() {
    const boardSize = this.els.board.clientWidth
    const tileSize = boardSize / 8
    this.setState({boardSize, tileSize})
  }

  // TODO: this was axed by removing react-resize-aware
  // make sure that tileSize isn't getting clobbered
  handleResize(size) {
    const tileSize = size.width / 8
    this.setState({boardSize: size.width, tileSize})
  }

  coordsToPosition(coords) {
    let x = Math.round(coords.x / this.state.tileSize)
    let y = Math.round(coords.y / this.state.tileSize)
    if (!this.props.isWhite) {
      x = 7 - x
      y = 7 - y
    }
    return {
      x,
      y,
      pos: `${String.fromCharCode(charCodeOffset + x)}${8 - y}`
    }
  }

  handleDrag(evt, drag) {
    if(this.props.dots.length !== 0) {
      this.props.onClickPiece(undefined, true);
    }

    if (!this.props.highlightTarget) {
      return
    }

    const {targetTile} = this.state
    const {x, y} = this.coordsToPosition({
      x: drag.node.offsetLeft + drag.x,
      y: drag.node.offsetTop + drag.y
    })

    if (!targetTile || targetTile.x !== x || targetTile.y !== y) {
      this.setState({targetTile: {x, y}})
    }
  }

  handleDragStart(evt, drag) {
    evt.preventDefault()

    const node = drag.node
    node.style.cursor = "grabbing";

    const dragFrom = this.coordsToPosition({x: node.offsetLeft, y: node.offsetTop})
    const draggingPiece = this.findPieceAtPosition(dragFrom.pos)

    this.props.onClickPiece(draggingPiece, false);

    if (this.props.onDragStart(draggingPiece, dragFrom.pos) === false) {
      node.style.cursor = "grab";
      return false
    }

    if (!this.props.allowMoves) {
      return false;
    }

    this.setState({dragFrom, draggingPiece})
    return evt
  }

  handleDragStop(evt, drag) {
    const node = drag.node
    node.style.cursor = "grab";

    const {dragFrom, draggingPiece} = this.state
    const dragTo = this.coordsToPosition({x: node.offsetLeft + drag.x, y: node.offsetTop + drag.y})

    this.setState({dragFrom: null, targetTile: null, draggingPiece: null})
    if (dragFrom.pos !== dragTo.pos) {
      //Are we promoting? Lots of checks since its really annoying if the menu shows up unwanted.
      if (draggingPiece.name.substring(1) === "P" && ((dragTo.y === 0 && this.props.isWhite) || (dragTo.y === 7 && !this.props.isWhite))) {
          //Are we moving from the previous rank?
          if ((dragFrom.y === 1 && this.props.isWhite) || (dragFrom.y === 6 && !this.props.isWhite)) {
            //Render the promotion menu, and save where we are moving to.
            this.setState({promotionArgs : [draggingPiece, dragFrom.pos, dragTo.pos]})
            this.setState({showPromotion : true})
            this.setState({promotionFile : dragTo.x})
            return false
          }
      }
      this.props.onMovePiece(draggingPiece, dragFrom.pos, dragTo.pos, null)
      this.setState({promotionArgs : null})
      this.setState({showPromotion : false})
      this.setState({promotionFile : null})
      return false
    }

    return true
  }

  findPieceAtPosition(pos) {
    for (let i = 0; i < this.props.pieces.length; i++) {
      const piece = this.props.pieces[i]
      if (piece.split('@')[1] === pos) {
        return {notation: piece, name: piece.split('@')[0], index: i, position: pos}
      }
    }

    return null
  }

  renderLabelText(x, y) {
    const isLeftColumn = x === 0
    let isBottomRow 
    if (this.props.isWhite)
      isBottomRow = y === 7
    else
      isBottomRow = y === 0

    if (!this.props.drawLabels || (!isLeftColumn && !isBottomRow)) {
      return null
    }

    let xStyles
    let yStyles
    const c = {color : this.getSquareColor(x,y+17)} //17 is huge hack, the point is that it's big and odd so highlights can't be a problem
    if (this.props.isWhite) {
      xStyles = Object.assign({}, {bottom: '5%', right: '5%'},labelStyles, c)
      yStyles = Object.assign({}, {top: '5%', left: '5%'},labelStyles, c)
    } else {
      xStyles = Object.assign({},{bottom: '5%', left: '5%'},labelStyles, c)
      yStyles = Object.assign({},{top: '5%', right: '5%'},labelStyles, c)
    }


    if (isLeftColumn && isBottomRow) {
        return [
          <span key="blx" style={xStyles}>
            a
          </span>,
          <span key="bly" style={yStyles}>
            1
          </span>
        ]
      } else {
    }

    const label = isLeftColumn ? 8 - y : String.fromCharCode(charCodeOffset + x)
    return <span style={isLeftColumn ? yStyles : xStyles}>{label}</span>
  }

  handlePromotionSelection(piece) {
    return () => {
      //console.log("wanted to promote to " + piece)
      const {promotionArgs} = this.state
      this.props.onMovePiece(promotionArgs[0], promotionArgs[1], promotionArgs[2], piece)
      this.setState({promotionArgs : null})
      this.setState({showPromotion : false})
      //this.setState({chosenPromoter: piece})
    }
  }

  render() {
    const {targetTile, draggingPiece, boardSize} = this.state

    const tiles = []
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (!this.props.isWhite) {
          x = 7 - x
          y = 7 - y
        }

        const isTarget = targetTile && targetTile.x === x && targetTile.y === y
        const background = this.getSquareColor(x, y)
        const boxShadow = isTarget ? 'inset 0px 0px 0px 0.4vmin yellow' : undefined
        const styles = Object.assign({background, boxShadow}, squareStyles)

        tiles.push(
          <div key={`rect-${x}-${y}`} style={styles}>
            {this.renderLabelText(x, y)}
          </div>
        )

        //Undo the hack fix earlier since we're in a loop
        if (!this.props.isWhite) {
          x = 7 - x
          y = 7 - y
        }
      }
    }

    const pieces = this.props.pieces.map((decl, i) => {
      const isMoving = draggingPiece && i === draggingPiece.index
      let {x, y, piece} = fromPieceDecl(decl)
      const Piece = pieceComponents(piece)
      if (!this.props.isWhite) {
        x = 7 - x
        y = 7 - y
      }
      // if this piece is the pawn promoting, don't render it
      if (this.state.showPromotion && decl === this.state.promotionArgs[0].notation)
        return null;
      return (
        <Draggable
          bounds="parent"
          position={{x: 0, y: 0}}
          onStart={this.handleDragStart}
          onDrag={this.handleDrag}
          onStop={this.handleDragStop}
          key={`${piece}-${x}-${y}-${this.props.update}-${this.state.showPromotion}`}>
          <Piece isMoving={isMoving} x={x} y={y} />
        </Draggable>
      )
    })

    const promotion = []
    //const {chosenPromoter} = this.state
    if (this.state.showPromotion) {
      let promotionFile = -1 + (-5 / 12.5)
      if (this.state.promotionFile !== null) {
        promotionFile = this.state.promotionFile
        if (!this.props.isWhite)
         promotionFile = 7 - promotionFile
      }
        
      for (let i = 0; i < this.props.promotablePieces.length; i++) {
        let color = this.props.isWhite ? "W" : "B"
        let piece = color + this.props.promotablePieces[i]
        let Piece = pieceComponents(piece)

        let styles = Object.assign({
          position: 'absolute',
          left: `${12.5 * promotionFile}%`,
          
          //center them
          top: `${i * 12.5}%`,//`${(i + ((8 - this.props.promotablePieces.length) / 2))*12.5}%`,
          background: (promotionFile + i) % 2 === 0 ? this.props.lightSquareColor : this.props.darkSquareColor,
          //boxShadow : piece === chosenPromoter ? 'inset 0px 0px 0px 0.4vmin red' : undefined,
          //size of one square
          width: '12.5%',
          height: '12.5%',

          textAlign: 'center',
          cursor: 'grab',
          zIndex: 1000
        })
        //const styles = Object.assign({background, boxShadow}, squareStyles)
        
        
        //The y=7 comes from piecePositionHoc, which sends 7 to 7 - y. This maps 7 to 0 later, so I'm really just telling it to
        //put the piece on the div.
        promotion.push(<div style={styles} onClick={this.handlePromotionSelection(piece)}>
            <Piece key = {i+''+piece+'-promoter'} x={0} y={7} size = '100%'/>
          </div>)
      }
    }

    const dots = this.props.dots.map(s => {
      let {x, y, piece} = fromPieceDecl(s);
      if (!this.props.isWhite) {
        x = 7 - x
        y = 7 - y
      }
      // following piecePositionHoc as example
      const scale = 12.5; // do not change
      let size = 5; // scale of dot
      let borderRadius = "100%";
      
      let pieceOnSquare = this.props.pieces.filter(p => p.split("@")[1] === s.split("@")[1]).length > 0;

      if (pieceOnSquare) {
        size = 12;
      }

      const dot_style = {
        position: "absolute",

        width:  `${size}%`,
        height: `${size}%`,
        top:  `${((scale-size)/2) + (scale * (7-y))}%`,
        left: `${((scale-size)/2) + (scale * x)}%`,

        background: `${this.props.dotColor}`,
        borderRadius: `${borderRadius}`,
        //zIndex: 500,
        pointerEvents : "none",
        mask: ''
        };
      
      if (pieceOnSquare) {
        dot_style['background'] = `radial-gradient(ellipse at center, #0000 58%, ${this.props.dotColor} 40%)`;
      }
      // console.log(dot_style);
      return (
        <div 
          className="dot"
          key={`dot-${x}-${y}-${piece}`}
          style={dot_style}>
        </div>
      );
    });

    const boardStyles = {position: 'relative', width: '100%', height: boardSize}
    const children = tiles.concat(pieces).concat(promotion).concat(dots)


    return (
      <div
        ref={this.setBoardRef}
        // onlyEvent
        // onResize={this.handleResize}
        style={boardStyles}>
        
        {children}
      </div>
    )
  }
}

Chess.propTypes = {
  // vanilla react-chess
  allowMoves: PropTypes.bool,
  highlightTarget: PropTypes.bool,
  drawLabels: PropTypes.bool,

  // colors
  lightSquareColor: PropTypes.string,
  darkSquareColor: PropTypes.string,

  // callbacks
  onMovePiece: PropTypes.func,
  onDragStart: PropTypes.func,
  onClickPiece: PropTypes.func,

  // piece lists
  pieces: PropTypes.arrayOf(PropTypes.string),
  promotablePieces: PropTypes.arrayOf(PropTypes.string),

  // highlight features
  highlights: PropTypes.arrayOf(PropTypes.string),
  dots: PropTypes.arrayOf(PropTypes.string),

  // game/move properties
  check : PropTypes.string,
  isWhite : PropTypes.bool,

  // util -> force update value
  update : PropTypes.number,
}

Chess.defaultProps = {
  allowMoves: true,
  highlightTarget: true,
  drawLabels: true,

  lightHighlightColor: '#ffb000',
  darkHighlightColor: '#ff9200',
  lightCheckColor: '#ff4020',
  darkCheckColor: '#ff2010',
  lightGreyedOutColor: '#aaaaaa',
  darkGreyedOutColor: '#555555',
  lightSquareColor: '#f0d9b5',
  darkSquareColor: '#b58863',
  dotColor: '#421a',

  onMovePiece: noop,
  onDragStart: noop,
  onClickPiece: noop,

  pieces: getDefaultLineup(),
  promotablePieces: ["Q","N","R","B","M"],

  highlights: [],
  dots: ["Q@h3"],

  check : "",
  isWhite : true,

  update : 0,
}
