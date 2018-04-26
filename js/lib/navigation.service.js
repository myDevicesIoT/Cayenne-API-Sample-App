import { NavigationActions } from 'react-navigation';

let _container; // eslint-disable-line

function navigate(routeName, params) {
  _container.dispatch(
    NavigationActions.navigate({
      type: 'Navigation/NAVIGATE',
      routeName,
      params,
    }),
  );
}

function setContainer(container){
    _container = container;
}

export default {
  navigate,
  setContainer
};