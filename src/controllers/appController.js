import http from 'http';
import { EventEmitter } from 'events';
import mongoose from 'mongoose';
import DataSchema from '../models/appModel';

const ShowData = mongoose.model('ShowData', DataSchema);

export const getEmptyRoute = (req, res) => {
  res.send('Navigate to /page=:page , e.g. /page=3');
};


export const getRequestedData = (req, res) => {
  const page = req.params.page;
  const startId = 1 + (page - 1) * 10;

  const emitter = new EventEmitter();

  const jsonData = [];

  for (let showId = startId; showId < startId + 10; showId++) {
    getDataWithId(showId, (err, data) => {
      if (err) throw err;
      jsonData.push(data);
      if (jsonData.length === 10) {
        emitter.emit('loaded', jsonData);
      }
    });
  }

  emitter.on('loaded', (jsonData) => {
    res.json(jsonData);
  });
};


const getDataWithId = (showId, cb) => {
  ShowData.find({
    id: showId,
  }, {
    _id: 0,
    __v: 0,
    'cast._id': 0,
  }, (err, data) => {
    if (data.length === 0) {
      getDataFromApi(showId, (err, data) => {
        console.log('from API');
        cb(err, data);
      });
    } else {
      console.log('from DB');
      cb(err, data[0]);
    }
  });
};


const getDataFromApi = (showId, cb) => {
  const options = {
    hostname: 'api.tvmaze.com',
    path: `/shows/${showId}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  const req = http.request(options, res => {
    let responseBody = '';

    res.setEncoding('UTF-8');

    res.on('data', chunk => {
      responseBody += chunk;
    });

    res.on('end', () => {

      getCastFromApi(showId, (err, castData) => {
        if (err) throw err;
        const showFormatted = JSON.parse(responseBody);

        const data = {
          id: showFormatted.id,
          name: showFormatted.name,
          cast: castData,
        };

        let newShow = new ShowData(data);

        newShow.save((err, show) => {
          if (err) return console.error(err);
          cb(err, data);
        });
      });
    });
  });
  req.on('error', err => {
    console.log(`problem with request: ${err.message}`);
  });

  req.end();
};


const getCastFromApi = (showId, cb) => {
  const options = {
    hostname: 'api.tvmaze.com',
    path: `/shows/${showId}/cast`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  const req = http.request(options, res => {
    let responseBody = '';

    res.setEncoding('UTF-8');

    res.on('data', chunk => {
      responseBody += chunk;
    });

    res.on('end', (err) => {
      const castParsed = JSON.parse(responseBody);

      if (castParsed.name) return cb(err, null);

      const castFormatted = castParsed.map(cast => ({
        id: cast.person.id,
        name: cast.person.name,
        birthday: cast.person.birthday,
      }));

      cb(err, castFormatted);
    });
  });

  req.on('error', err => {
    console.log(`problem with request: ${err.message}`);
  });

  req.end();
};
