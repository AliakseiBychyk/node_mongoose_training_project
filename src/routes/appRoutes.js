import {
  getEmptyRoute,
  getRequestedData,
} from '../controllers/appController';

const routes = app => {
  app.route('/')
    .get(getEmptyRoute);

  app.route('/:showId')
    .get(getRequestedData);
};

export default routes;
