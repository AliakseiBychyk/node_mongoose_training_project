import EventEmitter from 'events';
import http from 'http';
import fs from 'fs';
import path from 'path';

class GetShowCastData extends EventEmitter {
  getData = (id) => {
    const options = {
      hostname: 'api.tvmaze.com',
      path: `/shows/${id}/cast`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    console.log(`${options.hostname}${options.path}`);

    const req = http.request(options, res => {
      let responseBody = '';

      res.setEncoding('UTF-8');

      res.on('data', chunk => {
        responseBody += chunk;
      });

      res.on('end', () => {
        fs.writeFile(path.resolve(__dirname, 'showCast.json'), responseBody, err => {
          if (err) throw err;
          console.log('\n File Downloaded \n');
          this.emit('cast-loaded');
        });
      });
    });

    req.on('error', err => {
      console.log(`problem with request: ${err.message}`);
    });

    req.end();
  };
}

export default GetShowCastData;
