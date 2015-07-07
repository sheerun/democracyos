import Store from '../store/store';
import request from '../request/request';

class TopicStore extends Store {

  constructor () {
    super();
  }

  name () {
    return 'topic';
  }

  publish (id) {
    let cachedItem = this.items.get(id);
    if (!cachedItem) {
      return Promise.reject(new Error('Cannot publish item not fetched item.'));
    }

    let pub = new Promise((resolve, reject) => {
      request
        .post(`${this.url(id)}/publish`)
        .end((err, res) => {
          if (err || !res.ok) return reject(err);

          let item = this.parse(res.body);
          this.items.set(id, item);

          resolve(item);

          this.busEmit(`update:${id}`, item);
        });
    });

    return pub;
  }
}

const topicStore = new TopicStore();

export default topicStore;