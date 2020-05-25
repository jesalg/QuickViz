import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App.vue'

Vue.use(VueResource);

/*new Vue({
  el: '#app',
  data: {
    mention: {},
    editMode: false
  },
  render (createElement) {
    return createElement(App)
  },
  beforeMount() {
    var defaultMention = {'text': 'When Einstein announced his theory in 1915, he rewrote the rules for space and time that had prevailed for more than 200 years, since the time of Newton, stipulating a static and fixed framework for the universe. Instead, Einstein said, matter and energy distort the geometry of the universe in the way a heavy sleeper causes a mattress to sag, producing the effect we call gravity.',
                  'ref': 'https://www.nytimes.com/2016/02/12/science/ligo-gravitational-waves-black-holes-einstein.html'}
    this.mention = Object.assign(defaultMention, JSON.parse(this.$el.dataset.appJson).mention);
    this.editMode = Object.keys(JSON.parse(this.$el.dataset.appJson).mention).length > 0
  }
})*/