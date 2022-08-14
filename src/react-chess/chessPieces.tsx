/* eslint-disable id-length */
import React from 'react';

let images: { [key: string]: ((props: any) => JSX.Element) } = {};
const { piecePositionHoc } = require('./piecePositionHoc');

function make_piece(id: string) {
  return function b(props: any) {
    return Piece(props, id);
  };
}

function Piece(props: any, id: string): React.DetailedReactHTMLElement<{
                                            src: any;
                                            style: any;
                                            alt: string;
                                            width: any;
                                            height: any;
                                        }, HTMLElement>
{
  // let url = "https://chess9b60.s3.amazonaws.com/img/" + id.charAt(0) + "/" + id + ".png";
  // return React.createElement('img', { src: url, style: props, alt: '' + id, width: props.size, height: props.size });

  let path = "./img/" + id + ".png";
  let myVar = require(''+path);
  if (typeof myVar === 'string' || myVar instanceof String) {
    return React.createElement('img', { src: require(''+path), style: props, alt: '' + id, width: props.size, height: props.size });
  } else {
    return React.createElement('img', { src: require(''+path).default, style: props, alt: '' + id, width: props.size, height: props.size });
  }
}

export const pieceComponents = (id: string) => {
  if (!(id in images)) {
    images[id] = piecePositionHoc(make_piece(id));
  }
  return images[id];
};
