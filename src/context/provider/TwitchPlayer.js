import React from 'react';
import { TwitchPlayerContext } from '../twitch-player';

export const withTwitchPlayerContext = (Component) => {
  return (props) => (
    <TwitchPlayerContext.Consumer>
      {(playerContext) => {
        return <Component {...props} playerContext={playerContext} />
      }}
    </TwitchPlayerContext.Consumer>
   )
}
