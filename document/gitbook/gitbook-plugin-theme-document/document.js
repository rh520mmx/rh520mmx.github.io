require(['gitbook'], function(gitbook) {
  var $document = $(document)
  var $window = $(window)
  /**
   * 重写history相关接口
  */
  var _wr = function(type) {
    var orig = window.history[type]
    return function() {
        var rv = orig.apply(this, arguments)
        var e = new Event(type.toLowerCase())
        e.arguments = arguments
        window.dispatchEvent(e)
        return rv
    }
  }
  window.history.pushState = _wr('pushState')
  window.history.replaceState = _wr('replaceState')
  window.GITBOOK_PAGE_CHANGE = function (evt) {
    gitbook.page.hasChanged(evt)
  }
  /**
   * 处理左侧栏固定定位
  */
  var BookSideBar = {
    init: function () {
      this.bindMember()
      this.bindEvent()
      this.updateSidebarFixed()
    },
    bindMember: function () {
      this.$container = $('.doc-container')
      this.$sidebar = $('.doc-book__sidebar')
      this.$sidebarFixed = $('.doc-book__sidebar-fixed')
    },
    bindEvent: function () {
      $document.on('scroll', $.proxy(this, '_onDocumentScroll'))
      $window.on('resize', $.proxy(this, '_onWindowResize'))
    },
    _onWindowResize: function (evt) {
      this.updateSidebarFixed()
    },
    _onDocumentScroll: function (evt) {
      this.updateSidebarFixed()
    },
    updateSidebarFixed: function () {
      let top = this.$sidebar.offset().top

      if ($document.scrollTop() > top) {
        top = 0
      }
      this.$sidebarFixed.css({
        'top': top
      })
    },
    destroy: function () {
      $document.off('scroll', this._onDocumentScroll)
      $window.off('resize', this._onWindowResize)
    }
  }
  /**
   * 处理文章目录选择
  */
  var BookSummary = {
    init: function () {
      this.bindMember()
      this.bindEvent()
      this.syncSummaryItemData()
    },
    bindMember: function () {
      this.$summarySelect = $('.doc-book-summary__select')
      this.$summaryWrap = $('.doc-book-summary__wrap')
      this.$summaryHidden = $('#hiddenSummaryData')
      this.$summaryItems = $('.doc-book-summary__item', this.$summaryWrap)
      this.$summaryCategoryLinks = $('.doc-book-summary__select-item a')
      this.$currentSummaryItem = this.$summaryItems.filter('.is-active')
    },
    bindEvent: function () {
      this.$summarySelect.on('click', '.doc-book-summary__select-handle', $.proxy(this, '_onSummarySelectHandleClick'))
      this.$summarySelect.on('click', '.doc-book-summary__select-list', $.proxy(this, '_onSummarySelectListClick'))
      this.$summaryWrap.on('click', '.doc-book-summary__handle', $.proxy(this, '_onSummaryHandleClick'))
      $document.on('click', $.proxy(this, '_onDocumentClick'))
    },
    getSummaryScrollTop: function () {
      return this.$summaryWrap ? this.$summaryWrap.scrollTop() : 0
    },
    setCurrentSummaryItem: function (url) {
      var $item = this.$summaryItems.filter('[data-path="'+ url +'"]')
      if ($item.length) {
        this.$currentSummaryItem.removeClass('is-active')
        $item.addClass('is-active')
        this.$currentSummaryItem = $item
        $item.parents('.doc-book-summary__item').addClass('is-open')
        // this.$summaryWrap.scrollTop(this.$summaryWrap.scrollTop() + this.$summaryWrap.offset().top - $item.offset().top)
      }
    },
    setSummaryScrollTop: function (top) {
      this.$summaryWrap && this.$summaryWrap.scrollTop(top)
    },
    _onSummarySelectListClick: function (evt) {
      evt.stopPropagation()
    },
    _onSummarySelectHandleClick: function(evt){
      this.setActiveSummarySelect(!this.$summarySelect.hasClass('is-active'))
      evt.stopPropagation()
    },
    _onDocumentClick: function () {
      this.setActiveSummarySelect(false)
    },
    _onSummaryHandleClick: function (evt) {
      var $target = $(evt.currentTarget)
      var href = $target.attr('href')
      var url = $target.data('url')
      if (href) {
        this.setCurrentSummaryItem($($target).attr('href'))
      } else {
        if (url) {
          window.open(url, '_blank')
        } else {
          this.toggleSummaryItemExapnd($target.closest('.doc-book-summary__item'))
        }
      }
    },
    toggleSummaryItemExapnd: function (item) {
      if (item.hasClass('is-open')) {
        item.removeClass('is-open')
      } else {
        item.addClass('is-open')
      }
    },
    parseSummryItemDataByHtml: function (html) {
      var ms = html.match(/(data-\w+="(.*?)")/ig)
      var rs = {}
      if (ms && ms.length) {
        $.each(ms, function (i, v) {
          var s = v.match(/(data-\w+)="(.+)?"/i)
          if (s) {
            rs[s[1]] = s[2]
          }
        })
      }
      return rs
    },
    syncSummaryItemData: function () {
      var me = this
      var nextHtml = this.$summaryHidden.val()
      var matchItems = nextHtml.match(/doc-book-summary__item(.|\s)*?>/ig)
      $.each(matchItems, function (i, v) {
        var ms = me.parseSummryItemDataByHtml(v)
        if (ms['data-path'] && ms['data-url']) {
          var si = me.$summaryItems.filter('[data-url="'+ ms['data-url'] +'"]')
          if (si && si.length) {
            si.attr('data-url', ms['data-url'])
            si.attr('data-path', ms['data-path'])
            si.find('> .doc-book-summary__handle').attr('href', ms['data-href'])
          }
          var sc = me.$summaryCategoryLinks.filter('[data-url="'+ ms['data-url'] +'"]')
          if (sc && sc.length) {
            sc.attr('data-url', ms['data-url'])
            sc.attr('href', ms['data-href'])
          }
        }
      })
    },
    setActiveSummarySelect: function (isActive) {
      if (isActive) {
        this.$summarySelect.addClass('is-active')
      } else {
        this.$summarySelect.removeClass('is-active')
      }
    },
    destroy: function () {
      $document.off('click', this._onDocumentClick)
      this.$summarySelect && this.$summarySelect.off('click', this._onSummarySelectClick)
      this.$summaryWrap && this.$summaryWrap.off('click', '.doc-book-summary__handle', this._onSummaryHandleClick)
    }
  }
  /**
   * 处理文章面包屑
  */
  var BookCrumb = {
    init: function (opts) {
      this.opts = opts
      this.bindMember()
      this.bindEvent()
      this.renderCrumbHtml()
      this.updateCrumbFixed()
      this.checkAnchorState()
    },
    bindMember: function () {
      this.$crumb = null
      this.$crumbWrap = $('.doc-book__crumb')
      this.$docNavLists = $('#doc-nav__lists')
      this.$docRightNavList = $('#doc-book__rightnav')
      this.$content = $('.doc-book__content')
      this.$anchorItems = null
      this.$anchorHandle = null
    },
    bindEvent: function () {
      this.$crumbWrap.on('click', '.doc-book-link', $.proxy(this, '_onCrumbLinkClick'))
      this.$crumbWrap.on('click', '.doc-book-anchor__item-text', $.proxy(this, '_onCrumbAnchorClick'))
      $document.on('scroll', $.proxy(this, '_onDocumentScroll'))
      $window.on('resize', $.proxy(this, '_onWindowResize'))
    },
    goToPage: function (url) {
      $('.navigation-next').remove()
      $('<a class="navigation-next" href="'+ url +'"></a>').appendTo($('body'))
      gitbook.navigation.goNext()
      $.isFunction(this.opts.onCrumbChange) && this.opts.onCrumbChange({url: url})
    },
    _onCrumbAnchorClick: function (evt) {
      var $target = $(evt.currentTarget)
      var $el = $(document.getElementById($target.attr('href').substr(1)))
      var offset = $el.offset() || {}
      var top = Math.max(offset.top - this.$crumbWrap.outerHeight(), 0)
      $('html, body').animate({scrollTop: top}, 300)
      return false
    },
    _onCrumbLinkClick: function (evt) {
      // this.goToPage($(evt.target).attr('href'))
      // evt.preventDefault()
    },
    _onWindowResize: function () {
      this.updateCrumbFixed()
    },
    _onDocumentScroll: function () {
      this.updateCrumbFixed()
      this.checkAnchorState()
    },
    getCrumbUrl: function ($item) {
      var href = ''
      var $firstChild = $item.find('> .doc-book-summary__submenu > .doc-book-summary__item:first')
      if ($firstChild.length) {
        href = $firstChild.find('> .doc-book-summary__handle').attr('href')
        if (!href) {
          href = this.getCrumbUrl($firstChild)
        }
      }
      return href
    },
    getCrumbData: function () {
      var me = this
      var active = $('.doc-book-summary__item.is-active')
      var result = active.add(active.parents('.doc-book-summary__item')).map(function(){
        var $this = $(this)
        return {
          type: 'link',
          url: me.getCrumbUrl($this),
          text: $this.find('> .doc-book-summary__handle').text()
        }
      }).toArray()
      result.unshift({
        type: 'link',
        url: '/#/devGuide/index',
        text: '开发指南'
      })
      var anchors = this.$content.find('h2').map(function(i, v){
        var $v = $(v)
        return {
          url: $v.attr('id'),
          text: $v.text()
        }
      }).toArray()
      this.$docRightNavList.hide()
      if (anchors.length) {
        this.$docRightNavList.show()
        result.push({
          type: 'anchor',
          text: '本页导航',
          items: anchors
        })
      }
      return result
    },
    checkAnchorState: function () {
      var scrollTop = $document.scrollTop()
      var $activeAnchor = null
      if (!this.$anchorItems) {
        return
      }
      var minusTop = this.$crumbWrap.outerHeight()
      $.each(this.$anchorItems.toArray().reverse(), function(i, v) {
        var $this = $(v)
        var selector = $this.find('> .doc-book-anchor__item-text').attr('href')
        var $el = $(document.getElementById(selector.substr(1)))
        if (!$el.length) {
          return
        }
        var elTop = $el.offset().top - minusTop - 3
        if (elTop <= scrollTop) {
          $activeAnchor = $this
          return false
        }
      })
      this.$anchorItems.removeClass('is-active')
      if ($activeAnchor) {
        $activeAnchor.addClass('is-active')
        this.$anchorHandle.text($activeAnchor.text())
      } else {
        this.$anchorHandle.text('本页导航')
      }
    },
    renderCrumbHtml: function () {
      var html = '<div class="doc-book-crumb">'
      let nav = '<div class="doc-book-anchor__list">'
      $.each(this.getCrumbData(), function (i, v) {
        if (v.type === 'link') {
          html += '<a class="doc-book-crumb__item doc-book-link" href="' + v.url + '">' + v.text + '</a>'
          html += '<span class="doc-book-crumb__line"> > </span>'
        } else if (v.type === 'anchor') {

          nav += '<ul class="doc-book-anchor__list">'
            $.each(v.items, function(ii, vv) {
              nav += '<li class="doc-book-anchor__item " title='+ (ii + 1) +'.'+ vv.text +'>'
              nav += '<a class="doc-book-anchor__item-text" href="#'+ vv.url +'">'+ (ii + 1) +'.'+ vv.text + '</a>'
              nav += '</li>'
            })
          nav += '</ul>'

          html += '<span class="doc-book-crumb__item doc-book-anchor">'
            html += '<span class="doc-book-anchor__handle">'+ v.text +'</span>'
            html += '<ul class="doc-book-anchor__list">'
              $.each(v.items, function(ii, vv) {
                html += '<li class="doc-book-anchor__item">'
                  html += '<a class="doc-book-anchor__item-text" href="#'+ vv.url +'">' + vv.text + '</a>'
                html += '</li>'
              })
            html += '</ul>'
          html += '</span>'
        }
      })
      html += '</div>'

      this.$crumbWrap.html(html)
      this.$docNavLists.html(nav)
      this.$crumb = this.$crumbWrap.find('> .doc-book-crumb')
      this.$anchorItems = $('.doc-book-anchor__item')
      this.$anchorHandle = $('.doc-book-anchor__handle')
    },
    updateCrumbFixed: function () {
      if (!this.$crumb) {
        return
      }
      var maxTop = this.$crumbWrap.offset().top
      if ($document.scrollTop() > maxTop) {
        var rect = this.$crumbWrap[0].getBoundingClientRect()
        this.$crumb.css({
          'top': 0,
          'left': rect.left,
          'width': rect.width,
          'position': 'fixed'
        })
      } else {
        this.$crumb.css({
          'top': '',
          'left': '',
          'width': '',
          'position': ''
        })
      }
    },
    destroy: function () {
      $document.off('scroll', this._onDocumentScroll)
      $window.off('resize', this._onWindowResize)
      this.$crumbWrap && this.$crumbWrap.off('click', '.doc-book-link', this._onCrumbLinkClick)
      this.$crumbWrap && this.$crumbWrap.off('click', '.doc-book-anchor__item-text', this._onCrumbAnchorClick)
    }
  }

  var returnTop = {
    init: function () {
      this.bindMember()
      this.bindEvent()
    },
    bindMember: function () {
      this.$main = $('.doc-book__main')
      this.$wrap = $('<div class="doc-return-top"></div>').appendTo(this.$main)
      this.$btn = $('<span class="doc-return-top__btn">返回顶部</span>').appendTo(this.$wrap)
    },
    bindEvent: function () {
      this.$btn.on('click', $.proxy(this, '_onReturnTopClick'))
      $document.on('scroll', $.proxy(this, '_onDocumentScroll'))
    },
    _onReturnTopClick: function () {
      $('html, body').animate({ scrollTop: 0 }, 300)
    },
    _onDocumentScroll: function () {
      if ($document.scrollTop() > 1800) {
        this.$btn.show()
      } else {
        this.$btn.hide()
      }
    }
  }

  /**
   * 文章内容
  */
  var BookContent = {
    articleComment: null,
    $articleComment: null,
    init: function () {
      $(".doc-book__content img").featherlight({targetAttr:"src"})
      // this.createCommentMount()
      // this.doArticleBrowse()
    },
    createCommentMount: function () {
      var me = this
      var $content = $('.doc-book__content')
      var $mountP = $('<div class="doc-book__comment" style="padding-top: 30px; padding-bottom: 30px;"></div>').appendTo($content)
      var $mountE = $('<div></div>').appendTo($mountP)
      var $vue = new Vue({
        components: {
          'DocArticleComment': window.docComponent.DocArticleComment
        },
        render: function(h) {
          return h('doc-article-comment', {
            props: {
              badMethod: function () {
                return me.doArticleBad()
              },
              goodMethod: function () {
                return me.doArticleGood()
              },
              fetchCauseMethod: function () {
                var def = $.Deferred()
                var feedbackCauses = []
                if (gitbook.state.config.variables) {
                  feedbackCauses = gitbook.state.config.variables.feedbackCauses || []
                }
                def.resolve(feedbackCauses.map(function(v) {
                  return {
                    text: v.text,
                    value: v.text
                  }
                }))
                return def.promise()
              },
              feedbackMethod: function (data) {
                return me.doArticleFeedback(data)
              }
            }
          })
        }
      })
      $vue.$mount($mountE[0])
      this.articleComment = $vue
      this.$articleComment = $mountP
    },
    doArticleFeedback: function (data) {
      return $.ajax({
        url: gitbook.state.config.apiHost + '/article/feedback',
        type: 'post',
        data: $.extend({}, data, {
          url: window.location.href
        })
      })
    },
    doArticleGood: function () {
      return $.ajax({
        url: gitbook.state.config.apiHost + '/article/good',
        type: 'get',
        data: {
          oid: gitbook.state.page.id
        }
      })
    },
    doArticleBad: function () {
      return $.ajax({
        url: gitbook.state.config.apiHost + '/article/bad',
        type: 'get',
        data: {
          oid: gitbook.state.page.id
        }
      })
    },
    doArticleBrowse: function () {
      return $.ajax({
        url: gitbook.state.config.apiHost + '/article/browse',
        type: 'get',
        data: {
          oid: gitbook.state.page.id
        }
      })
    },
    destroy: function () {
      if (this.articleComment && this.articleComment.$destroy) {
        this.articleComment.$destroy()
      }
      if (this.$articleComment) {
        this.$articleComment.remove()
      }
    }
  }

  var BookPage = {
    init: function () {
      this.initParts()
      returnTop.init()
      this.bindEvent()
    },
    initParts: function () {
      var me = this
      var def = $.Deferred()
      clearTimeout(this._timer)
      this._timer = setTimeout(function(){
        BookSideBar.destroy()
        BookSummary.destroy()
        BookCrumb.destroy()
        BookContent.destroy()
        BookSideBar.init()
        BookSummary.init()
        BookContent.init()
        BookCrumb.init({
          onCrumbChange: me._onCrumbChange
        })
        me.scrollToPageTop()
        def.resolve()
      }, 60)
      return def.promise()
    },
    bindEvent: function () {
      window.addEventListener('pushstate', $.proxy(this, '_onPagePopStateChange'))
      window.addEventListener('replacestate', $.proxy(this, '_onPagePopStateChange'))
      // window.addEventListener('popstate', $.proxy(this, '_onPagePopStateChange'))
    },
    scrollToPageTop: function () {
      $('html, body').animate({ scrollTop: 0 }, 300)
    },
    _onCrumbChange: function (evt) {
      BookSummary.setCurrentSummaryItem(evt.url)
    },
    _onPagePopStateChange: function () {
      var summaryScrollTop = BookSummary.getSummaryScrollTop()
      this.initParts().then(function(){
        BookSummary.setSummaryScrollTop(summaryScrollTop)
      })
    }
  }
  BookPage.init()
});
