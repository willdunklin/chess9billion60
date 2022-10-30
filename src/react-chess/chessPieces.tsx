import React from 'react';
import { piecePositionHoc } from './piecePositionHoc';

import BA from '../assets/img/BA.png';
import BAB from '../assets/img/BAB.png';
import BB from '../assets/img/BB.png';
import BB2 from '../assets/img/BB2.png';
import BB4 from '../assets/img/BB4.png';
import BBC from '../assets/img/BBC.png';
import BBM from '../assets/img/BBM.png';
import BC from '../assets/img/BC.png';
import BCH from '../assets/img/BCH.png';
import BCN from '../assets/img/BCN.png';
import BCNR from '../assets/img/BCNR.png';
import BF from '../assets/img/BF.png';
import BK from '../assets/img/BK.png';
import BM from '../assets/img/BM.png';
import BM2 from '../assets/img/BM2.png';
import BN from '../assets/img/BN.png';
import BNR from '../assets/img/BNR.png';
import BNZ from '../assets/img/BNZ.png';
import BP from '../assets/img/BP.png';
import BQ from '../assets/img/BQ.png';
import BR from '../assets/img/BR.png';
import BR2 from '../assets/img/BR2.png';
import BR4 from '../assets/img/BR4.png';
import BRM from '../assets/img/BRM.png';
import BU from '../assets/img/BU.png';
import BW from '../assets/img/BW.png';
import BZ from '../assets/img/BZ.png';
import BZC from '../assets/img/BZC.png';
import WA from '../assets/img/WA.png';
import WAB from '../assets/img/WAB.png';
import WB from '../assets/img/WB.png';
import WB2 from '../assets/img/WB2.png';
import WB4 from '../assets/img/WB4.png';
import WBC from '../assets/img/WBC.png';
import WBM from '../assets/img/WBM.png';
import WC from '../assets/img/WC.png';
import WCH from '../assets/img/WCH.png';
import WCN from '../assets/img/WCN.png';
import WCNR from '../assets/img/WCNR.png';
import WF from '../assets/img/WF.png';
import WK from '../assets/img/WK.png';
import WM from '../assets/img/WM.png';
import WM2 from '../assets/img/WM2.png';
import WN from '../assets/img/WN.png';
import WNR from '../assets/img/WNR.png';
import WNZ from '../assets/img/WNZ.png';
import WP from '../assets/img/WP.png';
import WQ from '../assets/img/WQ.png';
import WR from '../assets/img/WR.png';
import WR2 from '../assets/img/WR2.png';
import WR4 from '../assets/img/WR4.png';
import WRM from '../assets/img/WRM.png';
import WU from '../assets/img/WU.png';
import WW from '../assets/img/WW.png';
import WZ from '../assets/img/WZ.png';
import WZC from '../assets/img/WZC.png';

const id_2_img: {[key: string]: string} = {
  'BA': BA,
  'BAB': BAB,
  'BB': BB,
  'BB2': BB2,
  'BB4': BB4,
  'BBC': BBC,
  'BBM': BBM,
  'BC': BC,
  'BCH': BCH,
  'BCN': BCN,
  'BCNR': BCNR,
  'BF': BF,
  'BK': BK,
  'BM': BM,
  'BM2': BM2,
  'BN': BN,
  'BNR': BNR,
  'BNZ': BNZ,
  'BP': BP,
  'BQ': BQ,
  'BR': BR,
  'BR2': BR2,
  'BR4': BR4,
  'BRM': BRM,
  'BU': BU,
  'BW': BW,
  'BZ': BZ,
  'BZC': BZC,
  'WA': WA,
  'WAB': WAB,
  'WB': WB,
  'WB2': WB2,
  'WB4': WB4,
  'WBC': WBC,
  'WBM': WBM,
  'WC': WC,
  'WCH': WCH,
  'WCN': WCN,
  'WCNR': WCNR,
  'WF': WF,
  'WK': WK,
  'WM': WM,
  'WM2': WM2,
  'WN': WN,
  'WNR': WNR,
  'WNZ': WNZ,
  'WP': WP,
  'WQ': WQ,
  'WR': WR,
  'WR2': WR2,
  'WR4': WR4,
  'WRM': WRM,
  'WU': WU,
  'WW': WW,
  'WZ': WZ,
  'WZC': WZC,
};

let images: { [key: string]: ((props: any) => JSX.Element) } = {};

function make_piece(id: string) {
  return function b(props: any) {
    return Piece(props, id);
  };
}

function Piece(props: any, id: string): JSX.Element {
  return <img src={id_2_img[id]} style={props} alt={'' + id} width={props.size} height={props.size} />;
}

export const pieceComponents = (id: string) => {
  if (!(id in images)) {
    images[id] = piecePositionHoc(make_piece(id));
  }
  return images[id];
};
