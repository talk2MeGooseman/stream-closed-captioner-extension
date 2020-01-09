/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { Card, Elevation } from '@blueprintjs/core'
import './ConfigContainer.css'

export default function ConfigContainer() {
  return (
    <Card elevation={Elevation.TWO}>
      <h1 className="">Configuration</h1>
      <strong>
          A companion website is required in order for you to be able to use the
          Speech To Text Closed Captioning.
      </strong>
      <h3>Getting Started is Easy</h3>
      <ol className="bp3-list">
        <li>
            Enable <em>Stream Closed Captioner</em> as a Video Overlay
        </li>
        <li>
            Visit:
          <a
            className="bp3-button bp3-intent-primary site-link"
            target="_blank"
            rel="noopener noreferrer"
            role="button"
            href="https://stream-cc.gooseman.codes"
          >
              https://stream-cc.gooseman.codes
          </a>
        </li>
        <li>
            Login with your Twitch Account.{' '}
          <em>This is needed so Speech to Text works</em>.
        </li>
        <li>
            Visit the <em>Dashboard</em>
        </li>
        <li>
            To start <em>Closed Captioning</em> for your stream, toggle "Closed
            Captioning" <strong>On</strong>.
        </li>
        <li>
            When you're done streaming or want to disable Closed Captioning you can, toggle "Closed
            Captioning" <strong>Off</strong> or close the <em>Dashboard</em>.
        </li>
      </ol>
    </Card>
  )
}
