/* eslint-disable id-length */

var React = require('react');
var images = {}
var piecePositionHoc = require('../piecePositionHoc');

function make_piece(id) {
  return function b(props) {
    return Piece(props, id);
  };
}

function Piece(props, id) {
  var path = "./img/" + id.charAt(0) + "/" + id + ".png";
  var myVar =  require(''+path)
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