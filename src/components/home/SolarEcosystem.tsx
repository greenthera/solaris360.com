import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SolarSchematic } from './SolarSchematic'
import { Reveal } from '../ui/Reveal'
import { epcBlocks, epcScope } from '../../content/services'

export function SolarEcosystem() {
  const [selected, setSelected] = useState(1)
  const active = epcBlocks[selected]
  return (
    <section className="ecosystem-section" aria-labelledby="ecosystem-title">
      <div className="container-x">
        <Reveal className="ecosystem-heading">
          <p className="energy-eyebrow">THE SOLARIS360 ECOSYSTEM</p>
          <h2 id="ecosystem-title">One roof.<br /><span>Everything connected.</span></h2>
          <p>From solar panels to the grid. Design, supply, installation and commissioning - every part of your rooftop system, brought together by Solaris360.</p>
        </Reveal>
        <div className="ecosystem-console">
          <div className="ecosystem-console-bar"><span>SYSTEM OVERVIEW / ROOFTOP SOLAR</span><span>SOLARIS360 · EPC</span></div>
          <div className="ecosystem-console-body">
            <div className="ecosystem-radar">
              <div className="radar-coordinate">PV / DC → AC / GRID</div>
              <SolarSchematic orbit />
              <div className="radar-caption"><span className="energy-dot" /> Capture. Convert. Consume. Export.</div>
            </div>
            <div className="ecosystem-detail">
              <p className="energy-eyebrow">EXPLORE YOUR SYSTEM</p>
              <div className="ecosystem-tabs" role="tablist" aria-label="Solar system components">
                {epcBlocks.map((block, index) => (
                  <button type="button" key={block.title} id={`component-tab-${index}`} role="tab" aria-selected={selected === index} aria-controls="component-detail" tabIndex={selected === index ? 0 : -1}
                    onClick={() => setSelected(index)} onKeyDown={(event) => {
                      let next: number
                      if (event.key === 'ArrowRight') next = (selected + 1) % epcBlocks.length
                      else if (event.key === 'ArrowLeft') next = (selected + epcBlocks.length - 1) % epcBlocks.length
                      else if (event.key === 'Home') next = 0
                      else if (event.key === 'End') next = epcBlocks.length - 1
                      else return
                      event.preventDefault()
                      setSelected(next)
                      document.getElementById(`component-tab-${next}`)?.focus()
                    }}>
                    <span>0{index + 1}</span>{block.title}
                  </button>
                ))}
              </div>
              <div id="component-detail" role="tabpanel" tabIndex={0} aria-labelledby={`component-tab-${selected}`} className="ecosystem-active-detail">
                <span className="component-number">0{selected + 1} / COMPONENT</span>
                <h3>{active.title}</h3>
                <p>{active.body}</p>
              </div>
              <Link to="/epc-services/" className="ecosystem-detail-link">Explore the full EPC scope <span>↗</span></Link>
            </div>
          </div>
          <div className="ecosystem-scope">
            {epcScope.map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p></div>)}
          </div>
        </div>
      </div>
    </section>
  )
}
