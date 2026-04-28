import * as React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import DirectoryListing from '../components/DirectoryListing';
import FeaturedSlider from '../components/FeaturedSlider';
import { SearchDataProvider, useSearchData } from '../context/SearchData';

// This inner component "tunes in" to the context
const HomepageContent = ({ rawTrucks, rawEvents }) => {
  const { 
    activeTab, 
    setActiveTab, 
    filteredResults 
  } = useSearchData();

  const [expandedId, setExpandedId] = React.useState(null);

  // Keep Featured Slider focused only on the premium partners
  // Note: We use the raw data here so featured trucks stay visible even during search
  const featuredItems = activeTab === 'Trucks' 
    ? rawTrucks.filter(t => t.isUpgraded) 
    : rawEvents.filter(e => e.isUpgraded);

  return (
    <Layout> 
      <FeaturedSlider 
        items={featuredItems} 
        title={activeTab === 'Trucks' ? "Featured Trucks" : "Featured Events"}
      />

      <div className="container-fluid p-0">
        {/* Tab Navigation */}
        <div className="row px-3 mt-3">
          <ul className="nav nav-tabs border-0">
            {['Trucks', 'Events'].map(tab => (
              <li className="nav-item" key={tab}>
                <button 
                  className={`nav-link border-0 text-capitalize ${activeTab === tab ? 'active fw-bold border-bottom border-primary border-3' : 'text-muted'}`}
                  onClick={() => { setActiveTab(tab); setExpandedId(null); }}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Directory List: Uses filteredResults from Context */}
        <div className="row g-0">
          <div className="col-12">
            {filteredResults.length > 0 ? (
              filteredResults.map(item => (
                <DirectoryListing 
                  key={item.id} 
                  item={item} 
                  type={activeTab} 
                  isOpen={expandedId === item.id}
                  onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                />
              ))
            ) : (
              <div className="p-5 text-center text-muted">
                <i className="bi bi-search fs-1 d-block mb-2 opacity-25"></i>
                <p>No results found for your search filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

// The main export wraps everything in the Provider
const Homepage = ({ data }) => {
  return (
    <SearchDataProvider 
      rawTrucks={data.allTrucksJson.nodes} 
      rawEvents={data.allEventsJson.nodes}
    >
      <HomepageContent 
        rawTrucks={data.allTrucksJson.nodes} 
        rawEvents={data.allEventsJson.nodes} 
      />
    </SearchDataProvider>
  );
};

export const query = graphql`
  query MockDataQuery {
    allTrucksJson {
      nodes {
        id
        title
        slug
        cuisine
        status
        hours
        location
        city
        state
        isUpgraded
        description
        lat
        lng
        menu { name, price, diet }
      }
    }
    allEventsJson {
      nodes {
        id
        title
        slug
        location
        date
        isUpgraded
        description
        lat
        lng
      }
    }
  }
`;

export default Homepage;
