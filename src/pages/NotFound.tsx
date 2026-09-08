import { Link } from 'react-router-dom'
import { Seo } from '../components/layout/Seo'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="That page doesn't exist." path="/404/" noindex />
      <section className="relative vg-mesh">
        <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
          <p className="font-mono text-5xl text-orange">404</p>
          <h1 className="mt-4 text-2xl">This page isn’t on the grid</h1>
          <p className="mt-3 max-w-sm text-muted">
            The link may be old. Try the homepage, the EMI calculator, or get in touch.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn btn-primary">
              Home
            </Link>
            <Link to="/emi-calculator/" className="btn btn-ghost">
              EMI calculator
            </Link>
            <Link to="/contact/" className="btn btn-ghost">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
