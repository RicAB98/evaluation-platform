import React from 'react';

import {Navigation} from 'react-minimal-side-navigation';
//import Button from 'react-bootstrap/Icon'
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';

const Sidebar = () => {
    return (       <>
        <Navigation
            // you can use your own router's api to get pathname
            activeItemId="/management/members"
            onSelect={({itemId}) => {
              // maybe push to the route
            }}
            items={[
              {
                title: 'New Evaluation',
                itemId: '/newevaluation',
                // you can use your own custom Icon component as well
                // icon is optional
                //elemBefore: () => <Icon name="inbox" />,
              },
              {
                title: 'Results',
                itemId: '/results',
                //elemBefore: () => <Icon name="users" />,
              },
              {
                title: 'Load Evaluation',
                itemId: '/loadevalution',
                subNav: [
                  {
                    title: 'Teams',
                    itemId: '/management/teams',
                  },
                ],
              },
              {
                title: 'Compare systems',
                itemId: '/comparesystems',
              },
            ]}
          />
      </>);
}
 
export default Sidebar;