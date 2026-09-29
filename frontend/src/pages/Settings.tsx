import { APP_NAME } from '../config'

export default function Settings() {
  return (
    <section>
      <h1>Settings</h1>
      <h2>About</h2>
      <p>
        {APP_NAME} shows YouTube videos through YouTube’s own player. It’s not made by YouTube or Google.
      </p>
    </section>
  )
}
