/* eslint-disable no-console */
/* eslint-disable prefer-rest-params */
export default function logger() {
  window.Twitch.ext.rig.log(arguments[0])
  // eslint-disable-next-line no-empty
  if (window.location.hostname === 'localhost') {
  }
}
