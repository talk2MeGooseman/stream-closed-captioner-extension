/* eslint-disable import/prefer-default-export */
import 'url-search-params-polyfill';

export function isVideoOverlay() {
  const search = new URLSearchParams(window.location.search);
  const platform = search.get('platform');
  const anchor = search.get('anchor');

  return anchor === 'video_overlay' && platform === 'web';
}
