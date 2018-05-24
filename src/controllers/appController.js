import fs from 'fs';
import path from 'path';
import GetShowData from './getShowData';
import GetShowCastData from './getShowCastData';

// import dataSchema from '../models/appModel';

// const Data = mongoose.model('Data', DataSchema);

export const getEmptyRoute = (req, res) => {
  res.send('navigate to /:showID');
};


export const getRequestedData = (req, res) => {
  const showId = req.params.showId;
  const showLoader = new GetShowData();
  const showCastLoader = new GetShowCastData();

  showLoader.getData(showId);

  showLoader.on('show-loaded', () => {

    fs.readFile(path.resolve(__dirname, 'show.json'), 'utf-8', (err, data) => {
      if (err) throw err;

      const parsedShowData = JSON.parse(data);
      const { id: show_id, name: show_name } = parsedShowData;

      showLoader.removeListener('show-loaded', () => {
        console.log('removed');
      });

      showCastLoader.getData(showId);

      showCastLoader.on('cast-loaded', () => {

        fs.readFile(path.resolve(__dirname, 'showCast.json'), 'utf-8', (err, castdata) => {
          if (err) throw err;

          const parsedShowCastData = JSON.parse(castdata);

          const castData = parsedShowCastData.reduce((acc, el) => {
            const { id, name, birthday } = el.person;
            return [...acc, { id, name, birthday }];
          }, []);
          console.log('reduced cast data \n', castData);
          console.log(typeof castData[0].birthday);

          res.json({ show_id, show_name, cast: castData });

          showCastLoader.removeListener('cast-loaded', () => {
            console.log('removed');
          });
        });
      });

    });
  });


};


