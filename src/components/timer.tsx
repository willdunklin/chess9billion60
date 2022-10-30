import CSS from 'csstype';

const dark = '#222222';
const light = '#DDDDDD';

function msToTime(s: number) {
  if (s < 0)
    s = 0;

  // Pad to 2 or 3 digits, default is 2
  function pad(n: number, z: number = 2) {
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

interface TimerProps {
    white: boolean;
    milliseconds: number;
}

export const Timer = (props: TimerProps) => {
    const timerStyles: CSS.Properties = {
        width: '100px',
        height: '30px',
        lineHeight: '30px',
        textAlign: 'center',
        border: '3px solid black',
        userSelect: 'none',
        background: props.white ? light : dark,
        color: props.white ? dark : light
    };

    return (
        <div style={timerStyles}>
            {msToTime(props.milliseconds)}
        </div>
    );
}
