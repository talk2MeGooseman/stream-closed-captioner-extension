import { isVideoOverlay } from '../video-helpers'

describe('video-helpers', () => {
  it('returns true if video overlay', () => {
    window.history.pushState({}, 'Test Title', '/test.html?anchor=video_overlay&platform=web')
    expect(isVideoOverlay()).toBeTruthy()
  })


  it('returns false if video overlay', () => {
    window.history.pushState({}, 'Test Title', '/test.html?platform=web')
    expect(isVideoOverlay()).not.toBeTruthy()
  })
})
