import fs from 'fs';
import path from 'path';
import GetData from './getData';

// import dataSchema from '../models/appModel';

// const Data = mongoose.model('Data', DataSchema);

export const getEmptyRoute = (req, res) => {
  res.send('<h3>Navigate to /showID</h3>');
};

export const getRequestedData = (req, res) => {
  const showId = req.params.showId;
  const showLoader = new GetData('shows');
  const showCastLoader = new GetData('cast');

  showLoader.getData(showId);

  showLoader.on('loaded', () => {

    fs.readFile(path.resolve(__dirname, 'shows.json'), 'utf-8', (err, data) => {
      if (err) throw err;

      const parsedShowData = JSON.parse(data);
      const { id, name } = parsedShowData;

      showLoader.removeListener('loaded', () => {
        console.log('removed');
      });

      showCastLoader.getData(showId);

      showCastLoader.on('loaded', () => {

        fs.readFile(path.resolve(__dirname, 'cast.json'), 'utf-8', (err, castdata) => {
          if (err) throw err;

          const parsedShowCastData = JSON.parse(castdata);

          const castData = parsedShowCastData.reduce((acc, el) => {
            const { id, name, birthday } = el.person;
            return [...acc, { id, name, birthday }];
          }, []);

          res.json({ id, name, cast: castData });

          showCastLoader.removeListener('loaded', () => {
            console.log('removed');
          });
        });
      });
    });
  });
};


