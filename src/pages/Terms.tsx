import { LegalPage } from '../components/LegalPage'
import { terms } from '../content/legal/terms'
export default function Terms() {
  return <LegalPage doc={terms} path="/terms/" />
}
