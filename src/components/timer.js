const React = require('react')
const PropTypes = require('prop-types')

const dark = '#222222'
const light = '#DDDDDD'

function msToTime(s) {
  if (s < 0)
    s = 0;

  // Pad to 2 or 3 digits, default is 2
  function pad(n, z) {
      z = z || 2;
      return ('00' + n).slice(-z);
  }

  let ms = s % 1000;
  s = (s - ms) / 1000;
  let secs = s % 60;
  s = (s - secs) / 60;
  let mins = s % 60;
  let hrs = (s - mins) / 60;
  if (hrs > 0)
      return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + (pad(ms, 3)+'')[0];
  else
      return pad(mins) + ':' + pad(secs) + '.' + (pad(ms, 3)+'')[0];
}

export class Timer extends React.Component {

    render() {
        let timerStyles = {
            width: '100px',
            height: '30px',
            lineHeight: '30px',
            textAlign: 'center',
            border: '3px solid black',
            userSelect: 'none',
        }
        if (this.props.white) {
            timerStyles.background = light
            timerStyles.color = dark
        } else {
            timerStyles.background = dark
            timerStyles.color = light
        }
        let timeString = msToTime(this.props.milliseconds)
        //timerStyles.background = dark
        return <div style={timerStyles}>
            {timeString}
        </div>
    }
}

Timer.propTypes = {
    // vanilla react-chess
    white: PropTypes.bool,
    milliseconds: PropTypes.number,
  }

Timer.defaultProps = {
    // vanilla react-chess
    white: true,
    milliseconds: 0,
  }