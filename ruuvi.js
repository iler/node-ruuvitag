const ebs = require('eddystone-beacon-scanner');
const EventEmitter = require('events').EventEmitter;

class RuuviTag extends EventEmitter {

  constructor(data) {
    super();
    this.id = data.id;
  }
}

const ruuvi = module.exports = {
  findTags: () => new Promise((resolve, reject) => {

    const foundTags = [];

    ebs.on('found', data => {
      if (!foundTags.find(tag => tag.id === data.id)) {
        foundTags.push(new RuuviTag(data));
      }
    });

    // listen to "updated" events
    ebs.on('updated', data => {
      const correspondingTag = foundTags.find(tag => tag.id === data.id);
      if (!correspondingTag) {
        return;
      }
      correspondingTag.emit('updated', data);
    });

    setTimeout(() => {
      if (foundTags.length) {
        return resolve(foundTags);
      }
      reject(new Error('No beacons found'));

    }, 2500);

    ebs.startScanning(true);

  }),




};
