'use client'

import Link from 'next/link'
import { Segment, Menu, Message } from 'semantic-ui-react'

export default function NotFound() {
  return (
    <>
      <Segment inverted>
        <Menu inverted secondary style={{ margin: '0 auto', maxWidth: '640px' }}>
          <Menu.Item>
            <img
              width="35"
              height="35"
              alt="Stengt tunnel logo"
              src="/images/stengttunnel-logo.png"
            />
          </Menu.Item>
          <Menu.Item header>
            <h1>Stengt tunnel</h1>
          </Menu.Item>
        </Menu>
      </Segment>
      <div className="App" style={{ margin: '15px auto', maxWidth: '640px' }}>
        <Message negative>
          <Message.Header>404 - Finner ikke siden</Message.Header>
          <p>Siden eller tunnelen du leter etter finnes ikke.</p>
          <Link href="/">Gå tilbake til forsiden</Link>
        </Message>
      </div>
    </>
  )
}
