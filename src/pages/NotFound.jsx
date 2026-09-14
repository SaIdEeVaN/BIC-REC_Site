import { Button, EmptyState } from '../components/kit'

export default function NotFound() {
  return (
    <div className="wrap section">
      <EmptyState
        title="Block not found"
        body="This page isn't on the chain. Check the address, or head back to the start."
        action={<Button variant="onInk" to="/">Go to home</Button>}
      />
    </div>
  )
}
