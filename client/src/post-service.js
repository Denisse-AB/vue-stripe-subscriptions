/* eslint linebreak-style: ["error", "windows"] */
import axios from 'axios';
// TODO: SET PROXY
const url = 'http://localhost:3000/api/posts';

class PostService {
  static async createCust(email) {
    const res = await axios.post(url, {
      email,
    });
    return res;
  }

  static async createSubs(firstname, lastname, planId, customerId, paymentMethod) {
    const res = await axios.post(`${url}/subs`, {
      firstname, lastname, planId, customerId, paymentMethod,
    });
    return res;
  }
}
export default PostService;
