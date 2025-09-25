import * as React from 'react'
import { Link } from 'gatsby'

const TSearch = ({ pageTitle, children }) => {
  return (
    <aside>
      <form>
      <div className="input-group mb-3">
        <input type="text" className="form-control fs-6" placeholder="Where's your Favorit Food Truck" aria-label="Search Food Trucks" aria-describedby="tsearch" />
      </div>
      <hr />
      <h3>Filters:</h3>
      <section id="Filters">
        <div className="form-check">
          <input className="form-check-input" type="checkbox" value="Mexican" id="Mexican" />
          <label className="form-check-label" for="Mexican">Mexican</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" value="Asian" id="Asian" />
          <label className="form-check-label" for="Asian">Asian</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" value="Asian" id="Vegan" />
          <label className="form-check-label" for="Vegan">Vegan</label>
        </div>
      </section>
      <hr />
      <h3>Location:</h3>
      <section id="location">
        <select className="form-select" aria-label="Search Location">
          <option selected>Search Location:</option>
          <option value="Nearby">Nearby</option>
          <option value="Along-Path">Along Path</option>
        </select>
      </section>

      <button className="btn btn-outline-secondary my-3" type="button" id="tsearch">Search</button>
      </form>
    </aside>
  )
}

export default TSearch
