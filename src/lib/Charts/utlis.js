
import {timeFormat} from 'd3';

const kiloConverter = (value) => {
    let temp = value / 1000
   
    return temp > 1
        ? temp.toFixed(2) + "k"
        : value
}

const dateFormat = timeFormat("%b %d - %I %p");

export {kiloConverter, dateFormat}