<template>

</template>

<script>
import fitty from 'fitty';
import html2canvas from 'html2canvas';
export default {
  data () {
    return {
      viz: ''
    }
  },
  methods: {
    getViz() {
      
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
      
  },
  mounted() {
      
  }
}
</script>