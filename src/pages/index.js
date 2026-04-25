// src/pages/index.js
import * as React from 'react';
import { graphql } from 'gatsby';
import { useState } from 'react';
import Layout from '../components/layout';
import DirectoryListing from '../components/DirectoryListing';
import FeaturedSlider from '../components/FeaturedSlider';

const Homepage = ({ data }) => {
  const [activeTab, setActiveTab] = useState('Trucks');
  const [expandedId, setExpandedId] = useState(null);

  // GraphQL provides the data from your JSON files
  const trucksList = data.allTrucksJson.nodes;
  const eventsList = data.allEventsJson.nodes;

  // Filter for the spotlight section based on the active tab
  const featuredItems = activeTab === 'Trucks' 
    ? trucksList.filter(t => t.isUpgraded) 
    : eventsList.filter(e => e.isUpgraded);

  const handleOpenDetails = (item) => {
    console.log("Opening details for:", item.title);
  };

  return (
    // Pass the lists to Layout so the Gmap can render pins
    <Layout 
      activeTab={activeTab} 
      trucks={trucksList} 
      events={eventsList}
    > 
      <FeaturedSlider 
        items={featuredItems} 
        title={activeTab === 'Trucks' ? "Featured Trucks" : "Featured Events"}
        onOpenDetails={handleOpenDetails}
      />

      <div className="container-fluid p-0">
        <div className="row px-3 mt-3">
          <ul className="nav nav-tabs border-1">
            {['Trucks', 'event'].map(tab => (
              <li className="nav-item" key={tab}>
                <button 
                  className={`nav-link border-0 text-capitalize ${activeTab === tab ? 'active fw-bold border-bottom border-primary' : ''}`}
                  onClick={() => { setActiveTab(tab); setExpandedId(null); }}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="row g-0">
          <div className="col-12">
            {(activeTab === 'Trucks' ? trucksList : eventsList).map(item => (
              <DirectoryListing 
                key={item.id} 
                item={item} 
                type={activeTab} 
                isOpen={expandedId === item.id}
                onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

// src/pages/index.js
export const query = graphql`
  query MockDataQuery {
    allTrucksJson {
      nodes {
        id
        title
        slug  # Ensure this is here
        cuisine
        status
        hours
        location
        isUpgraded
      }
    }
    allEventsJson {
      nodes {
        id
        title
        slug  # ADD THIS LINE: If it's missing, links will break
        location
        date
        isUpgraded
      }
    }
  }
`;

export default Homepage;

export function Head() {
  return (
    <>
      <title>Food Truck Alley | Find Local Food Trucks & Events</title>
      <meta name="description" content="Discover the best local food trucks and upcoming foodie events in your area." />
    </>
  )
}
