<template>
  <div class="bg-white mx-auto flex flex-wrap flex-grow w-full">
    <div class="flex md:justify-start" style="width: 30%">
      <form class="w-full m-0" id="myForm"><vue-simplemde ref="quickvizmd" v-model="quickvizmd" v-bind:configs=editorConfig @input="getViz" class="shadow-inner w-full h-full bg-gray-200" id="quickvizmd" name="quickvizmd"></vue-simplemde></form>
    </div>
    <div class="flex md:justify-start" style="width: 50%">
      <div class="container mx-auto"><iframe ref="vizPreview" id="vizPreview" frameborder="0" width="100%" height="100%"></iframe></div>
    </div>
    <div class="shadow-inner bg-gray-200 pt-8 pl-2 text-center md:justify-start" style="width: 20%">
      
      <p class="py-8 px-2"><i style="margin-bottom:4px" class="em-svg em-point_left"/>&nbsp;Embed this anywhere you like by copying the HTML or downloading the image</p>
      <div class="inline-flex w-full">
      <button @click="downloadImg" class="bg-gray-300 text-gray-800 font-bold mr-2 py-2 px-4 rounded inline-flex items-center shadow"><svg class="fill-current w-4 h-4 mr-2" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"></path></svg><span>Image  </span></button>
      <button @click="copyHTML" class="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center shadow"><svg class="fill-current w-4 h-4 mr-2" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 20 20"><path id="Combined-Shape" d="M0,8.00585866 C0,6.89805351 0.897060126,6 2.00585866,6 L11.9941413,6 C13.1019465,6 14,6.89706013 14,8.00585866 L14,17.9941413 C14,19.1019465 13.1029399,20 11.9941413,20 L2.00585866,20 C0.898053512,20 0,19.1029399 0,17.9941413 L0,8.00585866 L0,8.00585866 Z M6,8 L2,8 L2,18 L12,18 L12,14 L15,14 L15,12 L18,12 L18,2 L8,2 L8,5 L6,5 L6,8 L12,8 L12,14 L17.9941413,14 C19.1029399,14 20,13.1019465 20,11.9941413 L20,2.00585866 C20,0.897060126 19.1019465,0 17.9941413,0 L8.00585866,0 C6.89706013,0 6,0.898053512 6,2.00585866 L6,8 Z"></path></svg><span>HTML </span></button>
      <button @click="shareLink" aria-label="Coming Soon..." title="Coming Soon..." class="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center shadow opacity-50 cursor-not-allowed"><svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.26 13a2 2 0 0 1 .01-2.01A3 3 0 0 0 9 5H5a3 3 0 0 0 0 6h.08a6.06 6.06 0 0 0 0 2H5A5 5 0 0 1 5 3h4a5 5 0 0 1 .26 10zm1.48-6a2 2 0 0 1-.01 2.01A3 3 0 0 0 11 15h4a3 3 0 0 0 0-6h-.08a6.06 6.06 0 0 0 0-2H15a5 5 0 0 1 0 10h-4a5 5 0 0 1-.26-10z"></path></svg><span>Link </span></button>
      </div>
      <a class="inline-flex items-center mt-12" href="https://www.producthunt.com/posts/quickviz?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-quickviz" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=206360&theme=dark" alt="QuickViz - Create quick visualizations with markdown | Product Hunt Embed" style="width: 250px; height: 54px;" width="250px" height="54px" /></a>
    </div>
  </div>
</template>
<style>
@import url("https://rsms.me/inter/inter.css");
@import url("https://cdn.tailwindcss.com");
@import url("https://afeld.github.io/emoji-css/emoji.css");

html {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
  "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
  "Noto Color Emoji";
}
.gradient {
  background-image: linear-gradient(-225deg, #cbbacc 0%, #2580b3 100%);
}
button:hover,
.gradient2 {
  background-image: linear-gradient(-225deg, #cbbacc 0%, #2580b3 100%);
}
.CodeMirror {
	height: 78vh !important;
}
.cm-header-1, .cm-header-2, .cm-header-3 {
  font-size: inherit !important;
}
</style>
<script>
import fitty from 'fitty';
import html2canvas from 'html2canvas';
import copy from 'copy-to-clipboard';
import Noty from 'noty';
import VueSimplemde from 'vue-simplemde';
import _ from 'lodash';
import 'simplemde/dist/simplemde.min.css';
import 'noty/lib/noty.css';
import 'noty/lib/themes/nest.css';
import VueSocketIO from 'vue-socket.io';
import SocketIO from "socket.io-client"
import Vue from 'vue';

Vue.use(new VueSocketIO({debug: false, connection: SocketIO()}));

export default {
  components: {
    VueSimplemde
  },
  data () {
    return {
      updateCounter: 0,
      quickvizmd: '',
      chart: '',
      editorConfig: {
        hideIcons: ["preview", "side-by-side", "fullscreen", "guide"],
      }
    }
  },
  sockets: {
    quickvizhtml(data) {
      const vizUrl = this.getBlobURL(data.chart, 'text/html');
      this.$refs.vizPreview.src = vizUrl;
    }
  },
  methods: {
    getBlobURL(code, type) {
      const blob = new Blob([code], { type });
      return URL.createObjectURL(blob);
    },
    getViz(e) {
      if (this.updateCounter == 0) {
        this.updateCounter++;
        return;
      }
      this.$socket.emit('quickvizmd', e);
    },
    copyHTML() {
      const element = this.$refs.vizPreview.contentWindow.document;
      const html = new XMLSerializer().serializeToString(element)
      copy(html, {
        debug: true,
        asHtml: true,
      });
      new Noty({text: `Copied HTML ready to be used anywhere <i class="em em-tada"/>`, layout: 'topRight', timeout:3000, theme: 'nest'}).show();
    },
    downloadImg() {
      var element = this.$refs.vizPreview.contentWindow.document.body;
      html2canvas(element, { scale: 2 }).then((canvas) => {
        var dataURL = canvas.toDataURL();
        var image = new Image();
        image.src = dataURL;
        var win = window.open();
        win.document.write(image.outerHTML);   
      });
    },
    shareLink() {
      new Noty({text: `Ability to share links is coming soon! <i class="em em-construction"/>`, layout: 'topRight', timeout:3000, theme: 'nest'}).show();
    }
  },
  created() {
    this.quickvizmd = this.$parent.quickvizmd;
    this.chart = this.$parent.chart;
    this.getViz = _.debounce(this.getViz, 500);
  },
  mounted() {
    const vizUrl = this.getBlobURL(this.chart, 'text/html');
    this.$refs.vizPreview.src = vizUrl;
  }
}
</script>
