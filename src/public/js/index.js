import {CountUp} from "./countUp";
const el = document.querySelector( '.counter' )
console.log(el)
// Start counting, do this on DOM ready or with Waypoints.
CountUp( el, 10,20 )
