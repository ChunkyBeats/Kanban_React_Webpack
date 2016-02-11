export default {
  get(k) {
    try {
      return JSON.parse(localStorage.getItem(k));
    }
    catch(e) {
      return null;
    }
  },
  set(key,value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
