<template>
  <div class="bg-white mx-auto flex flex-wrap flex-grow w-full">
    <div class="flex w-full shadow-inner bg-gray-200 md:justify-start" style="width: 30%">
      <form class="w-full" id="myForm"><textarea v-model="quickvizmd" @input="getViz" class="shadow-inner w-full h-full pt-2 pl-8 bg-gray-200" id="quickvizmd" name="quickvizmd"></textarea></form>
    </div>
    <div class="flex w-full md:justify-start" style="width: 50%">
      <div class="container mx-auto px-6"><iframe ref="vizPreview" id="vizPreview" frameborder="0" width="100%" height="100%"></iframe></div>
    </div>
    <div class="w-full shadow-inner bg-gray-200 pt-8 pl-2 text-center md:justify-start" style="width: 20%">
      <button class="bg-gray-300 text-gray-800 font-bold mr-2 py-2 px-4 rounded inline-flex items-center hover:bg-gray-400"><svg class="fill-current w-4 h-4 mr-2" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"></path></svg><span>Image  </span></button>
      <button class="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center hover:bg-gray-400"><svg class="fill-current w-4 h-4 mr-2" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 20 20"><path id="Combined-Shape" d="M0,8.00585866 C0,6.89805351 0.897060126,6 2.00585866,6 L11.9941413,6 C13.1019465,6 14,6.89706013 14,8.00585866 L14,17.9941413 C14,19.1019465 13.1029399,20 11.9941413,20 L2.00585866,20 C0.898053512,20 0,19.1029399 0,17.9941413 L0,8.00585866 L0,8.00585866 Z M6,8 L2,8 L2,18 L12,18 L12,14 L15,14 L15,12 L18,12 L18,2 L8,2 L8,5 L6,5 L6,8 L12,8 L12,14 L17.9941413,14 C19.1029399,14 20,13.1019465 20,11.9941413 L20,2.00585866 C20,0.897060126 19.1019465,0 17.9941413,0 L8.00585866,0 C6.89706013,0 6,0.898053512 6,2.00585866 L6,8 Z"></path></svg><span>HTML </span></button>
    </div>
  </div>
</template>

<script>
import fitty from 'fitty';
import html2canvas from 'html2canvas';
export default {
  data () {
    return {
      quickvizmd: '',
      chart: ''
    }
  },
  methods: {
    getBlobURL(code, type) {
      const blob = new Blob([code], { type });
      return URL.createObjectURL(blob);
    },
    getViz(e) {
      this.$http.post('/', {quickvizmd: e.target.value}).then(response => {
        const vizUrl = this.getBlobURL(response.body.chart, 'text/html');
        this.$refs.vizPreview.src = vizUrl;
      }, () => {
        //TODO: SHOW ERROR
      });
    },
    download() {
      var element = this.$refs.mentionDom.children[0];
      html2canvas(element, { scale: 2 }).then((canvas) => {
        var dataURL = canvas.toDataURL();
        var image = new Image();
        image.src = dataURL;
        var win = window.open();
        win.document.write(image.outerHTML);
      });    
    }
  },
  created() {
    this.quickvizmd = this.$parent.quickvizmd;
    this.chart = this.$parent.chart;
  },
  mounted() {
    const vizUrl = this.getBlobURL(this.chart, 'text/html');
    this.$refs.vizPreview.src = vizUrl;
  }
}
</script>