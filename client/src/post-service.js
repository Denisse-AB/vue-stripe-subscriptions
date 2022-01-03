import axios from 'axios';

const url = 'http://localhost:3000/api/posts';

class PostService {
  static async createCust(email, fullname) {
    const res = await axios.post(url, {
      email, fullname
    });
    return res;
  }
  static async createSubs(customerId, priceId) {
    const res = await axios.post(`${url}/subs`, {
      customerId, priceId
    });
    return res;
  }
  static async delete(subscriptionId) {
    const res = await axios.post(`${url}/delete`, {
      subscriptionId,
    });
    return res;
  }
}
export default PostService;
