import Cookies from 'js-cookie';
import React from 'react';
import CSS from 'csstype';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { defaultLineup } from './defaultLineup';
import { pieceComponents } from './chessPieces';
import { fromPieceDecl, charCodeOffset } from './decode';
import { Dot } from "../components/Dot";
import { Arrow } from "../components/Arrow";
import { Promoter } from "../components/Promoter";
import { Tile } from "../components/Tile";

const getDefaultLineup = () => defaultLineup.slice();

const labelStyles: CSS.Properties = {fontSize: 'calc(7px + .5vw)', position: 'absolute', userSelect: 'none'};

export interface PieceType {
  notation: string;
  name: string;
  index: number;
  position: string;
}

interface PiecePos {
  x: number;
  y: number;
  pos: string;
}

interface ChessProps {
  // vanilla react-chess
  allowMoves: boolean;
  highlightTarget: boolean;
  drawLabels: boolean;

  // colors
  lightSquareColor: string;
  darkSquareColor: string;
  lightHighlightColor: string;
  darkHighlightColor: string;
  lightCheckColor: string;
  darkCheckColor: string;
  lightGreyedOutColor: string;
  darkGreyedOutColor: string;
  dotColor: string;

  // callbacks
  onMovePiece: (piece: PieceType, fromSquare: string, toSquare: string, promotion: string | null) => void;
  onDragStart: (piece: PieceType, fromSquare: string) => boolean;
  onClickPiece: (piece: PieceType, clear: boolean) => void;

  // piece lists
  pieces: string[];
  promotablePieces: string[];

  // highlight features
  highlights: string[];
  dots: string[];

  // game/move properties
  check : string;
  isWhite : boolean;

  // util -> force update value
  update : number;
}

interface ChessState {
  clickedFrom: PiecePos | null;
  clickedPiece: PieceType | null;
  targetTile: { x: number; y: number } | null;
  promotionArgs: { piece: PieceType, from: string, to: string } | null;
  showPromotion: boolean;
  promotionFile: number | null;
  boardSize: number;
  tileSize: number;
  dragFrom: PiecePos;
  draggingPiece: PieceType;
  dragging: boolean;
  arrowStart: PiecePos | null;
  arrowEnd: PiecePos | null;
  arrows: { start: PiecePos, end: PiecePos }[];
}

export class Chess extends React.Component<ChessProps, ChessState> {
  static defaultProps = {
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

    onMovePiece: (_p: PieceType, _f: string, _t: string, _r: string | null) => { return },
    onDragStart: (_p: PieceType, _f: string) => { return false },
    onClickPiece: (_p: PieceType, _c: boolean) => { return },

    pieces: getDefaultLineup(),
    promotablePieces: ["Q","N","R","B","M"],

    highlights: [],
    dots: [],

    check : "",
    isWhite : true,

    update : 0,
  };

  boardRef: React.RefObject<HTMLDivElement>;

  constructor(props: ChessProps) {
    super(props);

    this.state = {
      clickedFrom: null,
      clickedPiece: null,
      targetTile: null,
      promotionArgs: null,
      showPromotion: false,
      promotionFile: null,
      boardSize: 0,
      tileSize: 0,
      dragFrom: { x: 0, y: 0, pos: '' },
      draggingPiece: { notation: '', name: '', index: -1, position: '' },
      dragging: false,
      arrowStart: null,
      arrowEnd: null,
      arrows: [],
    };

    this.boardRef = React.createRef<HTMLDivElement>();
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragStop = this.handleDragStop.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.onClickSquare = this.onClickSquare.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.calculateSquare = this.calculateSquare.bind(this);
  }

  calculateSquare = (rect: DOMRect, x: number, y: number) => {
    const xnorm = x - rect.left;
    const ynorm = y - rect.top;
    const board_x = Math.floor(8 * xnorm / rect.width);
    const board_y = Math.floor(8 * ynorm / rect.height);
    return this.coordsToPosition({x: board_x, y: board_y}, false);
  }

  handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!this.boardRef.current)
      return;

    const { arrowStart } = this.state;

    if (arrowStart !== null) {
      const pos = this.calculateSquare(this.boardRef.current.getBoundingClientRect(), e.clientX, e.clientY);
      this.setState({arrowEnd: pos});
    }
  }

  handleMouseUp(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!this.boardRef.current)
      return;

    const { arrowStart, arrowEnd, arrows } = this.state;

    if (e.button === 2 && arrowStart !== null && arrowEnd !== null) {
      const newArrow = { start: arrowStart, end: arrowEnd };
      const newArrows = arrows.filter((a) => {return a.start.pos !== arrowStart.pos || a.end.pos !== arrowEnd.pos});

      if (newArrows.length === arrows.length)
        this.setState({arrows: [...arrows, newArrow]});
      else
        this.setState({arrows: newArrows});

    }
    this.setState({arrowStart: null, arrowEnd: null});
  }

  handleMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!this.boardRef.current)
      return;

    if (e.button === 2) {
      const pos = this.calculateSquare(this.boardRef.current.getBoundingClientRect(), e.clientX, e.clientY);
      this.setState({arrowStart: pos, arrowEnd: pos});
    }
  }

  onClickSquare(x: number, y: number) {
    let {clickedFrom, clickedPiece} = this.state;

    if (Cookies.get('clickMoves') !== 'true')
      return;

    this.handleResize();
    if (clickedPiece === null || clickedPiece === undefined) {
      clickedFrom = {x, y, pos: `${String.fromCharCode(charCodeOffset + x)}${8 - y}`};
      clickedPiece = this.findPieceAtPosition(clickedFrom.pos);
      if (clickedPiece !== null) {
        //TODO figure out if this is needed or not. I think dot handling should be only in on ClickPiece
        //this.props.onClickPiece(clickedPiece, false);
        if (this.props.onDragStart(clickedPiece, clickedFrom.pos) === false) {
          return false;
        }
        if (!this.props.allowMoves) {
          return false;
        }
        this.setState({clickedFrom, clickedPiece});
      }
    } else {
      const clickTo = {x, y, pos: `${String.fromCharCode(charCodeOffset + x)}${8 - y}`};

      // this.setState({targetTile: null});
      this.setState({clickedFrom: null, targetTile: null, clickedPiece: null});
      if (clickedFrom === null || clickedPiece === null || clickedPiece === null) {
        return false;
      }
      if (clickedFrom?.pos !== clickTo.pos) {
        //Are we promoting? Lots of checks since its really annoying if the menu shows up unwanted.
        if (clickedPiece.name.substring(1) === "P" && ((clickTo.y === 0 && this.props.isWhite) || (clickTo.y === 7 && !this.props.isWhite))) {
          //Are we moving from the previous rank?
          if ((clickedFrom.y === 1 && this.props.isWhite) || (clickedFrom.y === 6 && !this.props.isWhite)) {
            //Are we moving to a nearby file?
            if((clickedFrom.x - clickTo.x) * (clickedFrom.x - clickTo.x) < 2) {
              //Render the promotion menu, and save where we are moving to.
              this.setState({promotionArgs : {piece: clickedPiece, from: clickedFrom.pos, to: clickTo.pos}});
              this.setState({showPromotion : true});
              this.setState({promotionFile : clickTo.x});
              return false;
            }
          }
        }
        this.props.onMovePiece(clickedPiece, clickedFrom.pos, clickTo.pos, null);
        this.setState({promotionArgs : null});
        this.setState({showPromotion : false});
        this.setState({promotionFile : null});
        return false;
      }
      return true;
    }
  }

  getSquareColor(x: number, y: number) {

    let {lightSquareColor, darkSquareColor} = this.props;

    if (this.state.showPromotion) {
      lightSquareColor = this.props.lightGreyedOutColor;
      darkSquareColor = this.props.darkGreyedOutColor;
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

    return (y + x) % 2 ? darkSquareColor : lightSquareColor;
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    const boardSize: number = this.boardRef.current?.clientWidth || 100;
    const tileSize = boardSize / 8;
    this.setState({boardSize, tileSize});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    if (this.boardRef !== undefined && this.boardRef !== null) {
      // TODO: change to using a hook https://stackoverflow.com/questions/43817118/how-to-get-the-width-of-a-react-element
      const boardSize: number = this.boardRef.current?.clientWidth || 100;
      const tileSize = boardSize / 8;
      this.setState({boardSize, tileSize});
    }
  }

  coordsToPosition(coords: { x: number; y: number }, tile: boolean = true) {
    let x = tile ? Math.round(coords.x / this.state.tileSize) : coords.x;
    let y = tile ? Math.round(coords.y / this.state.tileSize) : coords.y;
    if (!this.props.isWhite) {
      x = 7 - x;
      y = 7 - y;
    }
    return {
      x,
      y,
      pos: `${String.fromCharCode(charCodeOffset + x)}${8 - y}`
    };
  }

  handleDrag(evt: DraggableEvent, drag: DraggableData): void | false {
    this.handleResize();

    if (!this.props.highlightTarget || !this.state.dragging) {
      return;
    }

    const {targetTile} = this.state;
    const {x, y} = this.coordsToPosition({
      x: drag.node.offsetLeft + drag.x,
      y: drag.node.offsetTop + drag.y
    });

    if (!targetTile || targetTile.x !== x || targetTile.y !== y) {
      this.setState({targetTile: {x, y}});
    }
  }

  handleDragStart(evt: DraggableEvent, drag: DraggableData): void | false {
    evt.preventDefault();

    const node = drag.node;

    this.setState({dragging: true});

    if (this.props.allowMoves) node.style.cursor = "grabbing";
    else node.style.cursor = "default";

    this.handleResize();
    const dragFrom = this.coordsToPosition({x: node.offsetLeft, y: node.offsetTop});
    const draggingPiece = this.findPieceAtPosition(dragFrom.pos);

    if (!draggingPiece) {
      return false;
    }

    //This if block is here since the onClickPiece (probably) has to happen after onClickSquare, but
    //if we attempt an invalid move I think this gets cut short.
    //To be honest its here because when I did it like this it fixed the bug
    if (this.props.allowMoves) {
      this.onClickSquare(dragFrom.x, dragFrom.y);
    }

    this.props.onClickPiece(draggingPiece, false);

    if (!this.props.allowMoves) {
      return false;
    }

    if (this.props.onDragStart(draggingPiece, dragFrom.pos) === false) {
      node.style.cursor = "grab";
      return false;
    }

    this.setState({dragFrom, draggingPiece});
    return;
  }

  handleDragStop(evt: DraggableEvent, drag: DraggableData): void | false {
    const node = drag.node;
    node.style.cursor = "grab";

    const {dragFrom, draggingPiece} = this.state;
    const dragTo = this.coordsToPosition({x: node.offsetLeft + drag.x, y: node.offsetTop + drag.y});

    // this.setState({dragFrom: null, targetTile: null});
    this.setState({targetTile: null, dragging: false});

    if (dragFrom === null || dragTo === null || draggingPiece === null) {
      return false;
    }
    if (dragFrom?.pos !== dragTo?.pos) {
      //Are we promoting? Lots of checks since its really annoying if the menu shows up unwanted.
      if (draggingPiece?.name.substring(1) === "P" && ((dragTo.y === 0 && this.props.isWhite) || (dragTo.y === 7 && !this.props.isWhite))) {
          //Are we moving from the previous rank?
          if ((dragFrom.y === 1 && this.props.isWhite) || (dragFrom.y === 6 && !this.props.isWhite)) {
            //Are we moving to a nearby file?
            if((dragFrom.x - dragTo.x) * (dragFrom.x - dragTo.x) < 2) {
              //Render the promotion menu, and save where we are moving to.
              this.setState({promotionArgs : {piece: draggingPiece, from: dragFrom.pos, to: dragTo.pos}});
              this.setState({showPromotion : true});
              this.setState({promotionFile : dragTo.x});
              return false;
            }
          }
      }
      this.props.onMovePiece(draggingPiece, dragFrom.pos, dragTo.pos, null);
      this.setState({clickedPiece : null, clickedFrom: null});
      this.setState({promotionArgs : null});
      this.setState({showPromotion : false});
      this.setState({promotionFile : null});
      return false;
    }

    return;
  }

  findPieceAtPosition(pos: string): PieceType | null {
    for (let i = 0; i < this.props.pieces.length; i++) {
      const piece = this.props.pieces[i]
      if (piece.split('@')[1] === pos) {
        return {notation: piece, name: piece.split('@')[0], index: i, position: pos};
      }
    }

    return null;
  }

  renderLabelText(x: number, y: number) {
    const isLeftColumn = x === 0;
    let isBottomRow;
    if (this.props.isWhite)
      isBottomRow = y === 7;
    else
      isBottomRow = y === 0;

    if (!this.props.drawLabels || (!isLeftColumn && !isBottomRow)) {
      return <div></div>;
    }

    let xStyles: CSS.Properties = {color : this.getSquareColor(x,y+17), bottom: '5%', ...labelStyles};
    let yStyles: CSS.Properties = {color : this.getSquareColor(x,y+17), top: '5%', ...labelStyles};
    if (this.props.isWhite) {
      xStyles.right = '5%';
      yStyles.left = '5%';
    } else {
      xStyles.left = '5%';
      yStyles.right = '5%';
    }


    if (isLeftColumn && isBottomRow) {
      if(this.props.isWhite) {
        return (
          <>
            <span key="blx" style={xStyles}>
              a
            </span>
            <span key="bly" style={yStyles}>
              1
            </span>
          </>
        );
      } else {
        return (
          <>
            <span key="blx" style={xStyles}>
              a
            </span>
            <span key="bly" style={yStyles}>
              8
            </span>
          </>
        );
      }
    }

    const label = isLeftColumn ? 8 - y : String.fromCharCode(charCodeOffset + x);
    return <span style={isLeftColumn ? yStyles : xStyles}>{label}</span>;
  }

  handlePromotionSelection(piece: string) {
    return () => {
      const {promotionArgs} = this.state;

      if (promotionArgs === null)
        return;

      this.props.onMovePiece(promotionArgs.piece, promotionArgs.from, promotionArgs.to, piece);
      this.setState({promotionArgs : null});
      this.setState({showPromotion : false});
      //this.setState({chosenPromoter: piece})
    };
  }

  render() {
    const { isWhite, pieces, update, promotablePieces, lightSquareColor, darkSquareColor, dots, dotColor, allowMoves } = this.props;
    const { targetTile, draggingPiece, boardSize, showPromotion, promotionArgs, arrows, arrowStart, arrowEnd } = this.state;

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
      const isMoving = draggingPiece && i === draggingPiece.index;
      let {x, y, piece} = fromPieceDecl(decl);
      const Piece = pieceComponents(piece);
      if (!isWhite) {
        x = 7 - x;
        y = 7 - y;
      }
      // if this piece is the pawn promoting, don't render it
      if (showPromotion && decl === promotionArgs?.piece.notation)
        return <div></div>;

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
      );
    });

    let promotionElems: JSX.Element[] = [];
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

    let active_arrow: JSX.Element[] = [];
    if (arrowStart !== null && arrowEnd !== null) {
      active_arrow = [
        <Arrow
            key={`${arrowStart}-${arrowEnd}-arrow-active`}
            pos1={arrowStart}
            pos2={arrowEnd}
            arrowColor={'#15781B'}
            isWhite={isWhite}
          />
      ]
    }

    const arrowElems = arrows.map(a => {
      return (<Arrow
                key={`${a.start.pos}-${a.end.pos}-arrow`}
                pos1={a.start}
                pos2={a.end}
                arrowColor={'#15781B'}
                isWhite={isWhite}
              />);
    });

    const boardStyles: CSS.Properties = {position: 'relative', width: '100%', height: `${boardSize}px`};

    const children = tileElems.concat(piecesElems)
                              .concat(promotionElems)
                              .concat(dotElems)
                              .concat(arrowElems)
                              .concat(active_arrow);

    return (
      <div ref={this.boardRef} style={boardStyles}
           onClick={evt => {this.setState({arrows: []})}}
           onMouseMove={this.handleMouseMove}
           onMouseDown={this.handleMouseDown}
           onMouseUp={this.handleMouseUp}
           onContextMenu={e => e.preventDefault()}
      >
        {children}
      </div>
    );
  }
}
