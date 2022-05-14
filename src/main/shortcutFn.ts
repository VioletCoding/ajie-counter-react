export default {
  ACTIVE: (fn?: () => void) => {
    console.log('I hava been active');
    if (fn) {
      fn();
    }
  },
};
