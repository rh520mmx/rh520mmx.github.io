module.exports = {
  website: {
    assets: './_assets/',
    js: [
      'vue.runtime.js',
      'docComponent.umd.js',
      'featherlight.min.js',
      'document.js'
    ],
    css: [
      'featherlight.min.css',
      'document.css'
    ]
  },
  hooks: {
    finish: function () {

    }
  },
  blocks: {
    crumbs: {
      process: function (block) {
        console.log('block:::', block)
      }
    }
  }
};
