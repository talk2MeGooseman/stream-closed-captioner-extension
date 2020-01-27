/* eslint-disable no-console */
/* eslint-disable prefer-rest-params */
export default function logger() {
  window.Twitch.ext.rig.log(arguments[0])
  if (window.location.hostname === 'localhost') {
    console.log(arguments)
  }
}
