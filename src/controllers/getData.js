import EventEmitter from 'events';
import http from 'http';
import fs from 'fs';
import path from 'path';

class GetData extends EventEmitter {
  constructor(type) {
    super();
    this.type = type;
  }
  getData = (id) => {

    const urls = {
      shows: `/shows/${id}`,
      cast: `/shows/${id}/cast`,
    };

    const jsons = {
      shows: 'shows.json',
      cast: 'cast.json',
    };
    console.log(this.type);
    console.log(jsons[this.type]);
    console.log(urls[this.type]);

    const options = {
      hostname: 'api.tvmaze.com',
      path: urls[this.type],
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    console.log(options);

    const req = http.request(options, res => {
      let responseBody = '';

      res.setEncoding('UTF-8');

      res.on('data', chunk => {
        responseBody += chunk;
      });

      res.on('end', () => {
        fs.writeFile(path.resolve(__dirname, jsons[this.type]), responseBody, err => {
          if (err) throw err;

          this.emit('loaded');
        });
      });
    });

    req.on('error', err => {
      console.log(`problem with request: ${err.message}`);
    });

    req.end();
  };
}

export default GetData;
