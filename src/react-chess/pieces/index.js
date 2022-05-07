/* eslint-disable id-length */

let React = require('react');
let images = {}
let piecePositionHoc = require('../piecePositionHoc');

function make_piece(id) {
  return function b(props) {
    return Piece(props, id);
  };
}

function Piece(props, id) {
  // let url = "https://chess9b60.s3.amazonaws.com/img/" + id.charAt(0) + "/" + id + ".png";
  // return React.createElement('img', { src: url, style: props, alt: '' + id, width: props.size, height: props.size });

  let path = "./img/" + id.charAt(0) + "/" + id + ".png";
  let myVar =  require(''+path)
  if (typeof myVar === 'string' || myVar instanceof String) {
    return React.createElement('img', { src: require(''+path), style: props, alt: '' + id, width: props.size, height: props.size });
  } else {
    return React.createElement('img', { src: require(''+path).default, style: props, alt: '' + id, width: props.size, height: props.size });
  }
}

module.exports = function(id) {
  if (!(id in images)) {
    images[id] = piecePositionHoc(make_piece(id))
  }
  return images[id];
};