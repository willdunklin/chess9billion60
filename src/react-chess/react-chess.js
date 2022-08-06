import Cookies from 'js-cookie';

const React = require('react')
const PropTypes = require('prop-types')
const Draggable = require('react-draggable')
const defaultLineup = require('./defaultLineup')
let pieceComponents = require('./pieces')
const {fromPieceDecl, charCodeOffset} = require('./decode')
const { Dot } = require("../components/Dot")
const { Promoter } = require("../components/Promoter")
const { Tile } = require("../components/Tile")

const getDefaultLineup = () => defaultLineup.slice()
const noop = () => {/* intentional noop */}


const labelStyles = {fontSize: 'calc(7px + .5vw)', position: 'absolute', userSelect: 'none'};

export class Chess extends React.Component {
  constructor(...args) {
    super(...args)

    this.state = {}
    this.setBoardRef = el => (this.state.board = el)
    this.handleDragStart = this.handleDragStart.bind(this)
    this.handleDragStop = this.handleDragStop.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.onClickSquare = this.onClickSquare.bind(this)

    window.addEventListener('resize', this.handleResize)
  }

  onClickSquare(x, y) {
    let {clickedFrom, clickedPiece} = this.state
    if (clickedPiece === null || clickedPiece === undefined) {
      clickedFrom = {x, y, pos: `${String.fromCharCode(charCodeOffset + x)}${8 - y}`}
      clickedPiece = this.findPieceAtPosition(clickedFrom.pos)
      if (clickedPiece !== null) {
        //TODO figure out if this is needed or not. I think dot handling should be only in on ClickPiece
        //this.props.onClickPiece(clickedPiece, false);
        if (this.props.onDragStart(clickedPiece, clickedFrom.pos) === false) {
          return false
        }
        if (!this.props.allowMoves) {
          return false;
        }
        this.setState({clickedFrom, clickedPiece})
      }
    } else {
      const clickTo = {x, y, pos: `${String.fromCharCode(charCodeOffset + x)}${8 - y}`}

      this.setState({clickedFrom: null, targetTile: null, clickedPiece: null})
      if (clickedFrom.pos !== clickTo.pos) {
        //Are we promoting? Lots of checks since its really annoying if the menu shows up unwanted.
        if (clickedPiece.name.substring(1) === "P" && ((clickTo.y === 0 && this.props.isWhite) || (clickTo.y === 7 && !this.props.isWhite))) {
            //Are we moving from the previous rank?
            if ((clickedFrom.y === 1 && this.props.isWhite) || (clickedFrom.y === 6 && !this.props.isWhite)) {
              //Are we moving to a nearby file?
              if((clickedFrom.x - clickTo.x) * (clickedFrom.x - clickTo.x) < 2) {
                //Render the promotion menu, and save where we are moving to.
                this.setState({promotionArgs : [clickedPiece, clickedFrom.pos, clickTo.pos]})
                this.setState({showPromotion : true})
                this.setState({promotionFile : clickTo.x})
                return false
              }
            }
        }
        this.props.onMovePiece(clickedPiece, clickedFrom.pos, clickTo.pos, null)
        this.setState({promotionArgs : null})
        this.setState({showPromotion : false})
        this.setState({promotionFile : null})
        return false
      }
      return true
    }
  }

  getSquareColor(x, y) {

    let {lightSquareColor, darkSquareColor} = this.props

    if (this.state.showPromotion) {
      lightSquareColor = this.props.lightGreyedOutColor
      darkSquareColor = this.props.darkGreyedOutColor
    }

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
    
    return (y + x) % 2 ? darkSquareColor : lightSquareColor
  }

  componentDidMount() {
    const boardSize = this.state.board.clientWidth
    const tileSize = boardSize / 8
    this.setState({boardSize, tileSize})
  }

  handleResize() {
    if (this.state.board !== undefined && this.state.board !== null) {
      // TODO: change to using a hook https://stackoverflow.com/questions/43817118/how-to-get-the-width-of-a-react-element
      const boardSize = this.state.board.clientWidth
      const tileSize = boardSize / 8
      this.setState({boardSize, tileSize})
    }
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
    /*if(this.props.dots.length !== 0) {
      this.props.onClickPiece(undefined, true);
    }*/

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

    if (this.props.allowMoves) node.style.cursor = "grabbing";
    else node.style.cursor = "default";

    const dragFrom = this.coordsToPosition({x: node.offsetLeft, y: node.offsetTop})
    const draggingPiece = this.findPieceAtPosition(dragFrom.pos)

    //This if block is here since the onClickPiece (probably) has to happen after onClickSquare, but
    //if we attempt an invalid move I think this gets cut short.
    //To be honest its here because when I did it like this it fixed the bug
    if (this.props.allowMoves) {
      this.onClickSquare(dragFrom.x, dragFrom.y)
    }

    this.props.onClickPiece(draggingPiece, false);

    if (!this.props.allowMoves) {
      return false;
    }

    if (this.props.onDragStart(draggingPiece, dragFrom.pos) === false) {
      node.style.cursor = "grab";
      return false
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
            //Are we moving to a nearby file?
            if((dragFrom.x - dragTo.x) * (dragFrom.x - dragTo.x) < 2) {
              //Render the promotion menu, and save where we are moving to.
              this.setState({promotionArgs : [draggingPiece, dragFrom.pos, dragTo.pos]})
              this.setState({showPromotion : true})
              this.setState({promotionFile : dragTo.x})
              return false
            }
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
      if(this.props.isWhite) {
        return [
          <span key="blx" style={xStyles}>
            a
          </span>,
          <span key="bly" style={yStyles}>
            1
          </span>
        ]
      } else {
        return [
          <span key="blx" style={xStyles}>
            a
          </span>,
          <span key="bly" style={yStyles}>
            8
          </span>
        ]
      }
    }

    const label = isLeftColumn ? 8 - y : String.fromCharCode(charCodeOffset + x)
    return <span style={isLeftColumn ? yStyles : xStyles}>{label}</span>
  }

  handlePromotionSelection(piece) {
    return () => {
      const {promotionArgs} = this.state
      // console.log("wanted to promote to " + piece, promotionArgs)
      this.props.onMovePiece(promotionArgs[0], promotionArgs[1], promotionArgs[2], piece)
      this.setState({promotionArgs : null})
      this.setState({showPromotion : false})
      //this.setState({chosenPromoter: piece})
    }
  }

  render() {
    const { isWhite, pieces, update, promotablePieces, lightSquareColor, darkSquareColor, dots, dotColor, allowMoves } = this.props;
    const { targetTile, draggingPiece, boardSize, showPromotion, promotionArgs } = this.state;

    const tileElems = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        // transform coords for black
        if (!isWhite) {
          x = 7 - x;
          y = 7 - y;
        }

        tileElems.push(
          <Tile 
            key={`${x}-${y}-tile`}
            xpos={x} ypos={y} 
            targetTile={targetTile} 
            background={this.getSquareColor(x, y)} 
            text={this.renderLabelText(x, y)}
            onClick={this.onClickSquare}
          />
        );

        // undo transformation
        if (!isWhite) {
          x = 7 - x;
          y = 7 - y;
        }
      }
    }

    const piecesElems = pieces.map((decl, i) => {
      const isMoving = draggingPiece && i === draggingPiece.index
      let {x, y, piece} = fromPieceDecl(decl)
      const Piece = pieceComponents(piece)
      if (!isWhite) {
        x = 7 - x
        y = 7 - y
      }
      // if this piece is the pawn promoting, don't render it
      if (showPromotion && decl === promotionArgs[0].notation)
        return null;

      return (
        <Draggable
          bounds="parent"
          position={{x: 0, y: 0}}
          onStart={this.handleDragStart}
          onDrag={this.handleDrag}
          onStop={this.handleDragStop}
          key={`${piece}-${x}-${y}-${update}-${showPromotion}`}>
          <Piece isMoving={isMoving} x={x} y={y} cursor ={allowMoves ? "grab": "default"} />
        </Draggable>
      )
    })

    let promotionElems = [];
    if (showPromotion) {
      let promotionFile = -1 + (-5 / 12.5);
      if (this.state.promotionFile !== null) {
        promotionFile = this.state.promotionFile;
        if (!isWhite)
         promotionFile = 7 - promotionFile;
      }

      const color = isWhite ? "W" : "B";
      promotionElems = promotablePieces.map((piece, i) => {
        const Piece = pieceComponents(color + piece);

        return (
          <div onClick={this.handlePromotionSelection(color + piece)}>
            <Promoter 
              piece={piece} Piece={Piece} 
              promotionFile={promotionFile} i={i} 
              lightSquareColor={lightSquareColor} darkSquareColor={darkSquareColor} 
            />
          </div>
        );
      });
    }
    
    const dotElems = dots.map(s => 
      <Dot
        key={`${s}-dot`}
        s={fromPieceDecl(s)} 
        pieces={pieces} 
        isWhite={isWhite} 
        dotColor={dotColor}
      />
    );

    const boardStyles = {position: 'relative', width: '100%', height: boardSize};

    const children = tileElems.concat(piecesElems).concat(promotionElems).concat(dotElems);

    return (
      <div ref={this.setBoardRef} style={boardStyles}>
        {children}
      </div>
    );
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
  lightSquareColor: Cookies.get('lightSquareColor') ?? '#f0d9b5',
  darkSquareColor: Cookies.get('darkSquareColor') ?? '#b58863',
  dotColor: '#421a',

  onMovePiece: noop,
  onDragStart: noop,
  onClickPiece: noop,

  pieces: getDefaultLineup(),
  promotablePieces: ["Q","N","R","B","M"],

  highlights: [],
  dots: [],

  check : "",
  isWhite : true,

  update : 0,
}
