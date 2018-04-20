import React, { Component  } from 'react';
import NavigatorService from './js/lib/navigation.service';
import ROUTES from './js/routes/router';

class App extends Component {
    render(){
        return (<ROUTES 
            ref={navigatorRef => {
                NavigatorService.setContainer(navigatorRef);
              }}
            />);
    }
}

module.exports = App;