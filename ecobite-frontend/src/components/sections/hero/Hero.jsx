import Dashboard from './Dashboard'
import copywrittingMkt from '../../../constants/CopywrittingMkt.js'

import './Hero.css'
function Hero() {
  return (
    <section className="hero" aria-label="Presentación principal">
      <div className="hero_content">
        <div className="hero_izquierda">
          <div className="isologotipo">

          </div>
          <div className="hero_copywriting">
            
            <h1>{copywrittingMkt.title}</h1>
            <p>{copywrittingMkt.description}</p>

          </div>
          <nav></nav>
        </div>
        <div className="hero_derecha">
          <Dashboard />
        </div>

      </div>
    </section>
  );
}

export default Hero;